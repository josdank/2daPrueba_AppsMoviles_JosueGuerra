// infrastructure/supabase/repositories/ChatRepository.ts
import { supabase } from '../client';
import type { ChatMessage } from '../../../domain/entities/Plan';

function isValidUuid(v: unknown) {
  return typeof v === 'string' && v.length === 36 && /^[0-9a-fA-F-]{36}$/.test(v);
}

export const ChatRepository = {
  async listMessages(contratacionId: string): Promise<ChatMessage[]> {
    if (!contratacionId) throw new Error('ChatRepository.listMessages: contratacionId is required');
    const { data, error } = await supabase
      .from('mensajes_chat')
      .select('*')
      .eq('contratacion_id', contratacionId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []) as ChatMessage[];
  },

  async send(contratacionId: string, contenido: string, senderId?: string) {
    // Validaciones tempranas
    if (!contratacionId) throw new Error('ChatRepository.send: contratacionId is required');
    if (contratacionId === 'undefined') throw new Error('ChatRepository.send: contratacionId is "undefined"');

    // Determinar sender id (si no se pasa explicitamente, usar auth user)
    let userId = senderId;
    if (!userId) {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!user?.id) throw new Error('ChatRepository.send: no authenticated user available');
      userId = user.id;
    }

    if (!userId) throw new Error('ChatRepository.send: sender id is missing');
    if (userId === 'undefined') throw new Error('ChatRepository.send: sender id is "undefined"');

    // Opcional: validar formato de UUID para evitar 22P02
    if (!isValidUuid(contratacionId)) {
      throw new Error(`ChatRepository.send: contratacionId is not a valid UUID: "${contratacionId}"`);
    }
    if (!isValidUuid(userId)) {
      throw new Error(`ChatRepository.send: senderId is not a valid UUID: "${userId}"`);
    }

    // Log debug (temporal): descomenta si necesitas trazar valores en desarrollo
    // console.debug('ChatRepository.send -> contratacionId:', contratacionId, 'senderId:', userId, 'contenido length:', contenido?.length);

    const { data, error } = await supabase
      .from('mensajes_chat')
      .insert({ contratacion_id: contratacionId, sender_id: userId, contenido })
      .select()
      .single();

    if (error) {
      // añadir contexto al error para facilitar debug
      (error as any).context = { contratacionId, senderId: userId, contenidoPreview: String(contenido).slice(0, 80) };
      throw error;
    }
    return data as ChatMessage;
  },

  subscribe(contratacionId: string, onMessage: (msg: ChatMessage) => void) {
    if (!contratacionId) throw new Error('ChatRepository.subscribe: contratacionId is required');
    const channel = supabase
      .channel(`chat:${contratacionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensajes_chat',
          filter: `contratacion_id=eq.${contratacionId}`,
        },
        (payload) => onMessage(payload.new as ChatMessage)
      )
      .subscribe();
    return channel;
  },

  subscribeTyping(
    contratacionId: string,
    onTyping: (payload: { senderId?: string; isTyping: boolean }) => void
  ) {
    if (!contratacionId) throw new Error('ChatRepository.subscribeTyping: contratacionId is required');
    const channel = supabase
      .channel(`chat:${contratacionId}`)
      .on('broadcast', { event: 'typing' }, (msg) => {
        try {
          const payload = msg.payload as any;
          onTyping({ senderId: payload?.senderId, isTyping: !!payload?.isTyping });
        } catch {
          // ignore
        }
      })
      .subscribe();
    return channel;
  },

  async emitTyping(contratacionId: string, isTyping: boolean, explicitSenderId?: string) {
    if (!contratacionId) throw new Error('ChatRepository.emitTyping: contratacionId is required');
    let senderId = explicitSenderId ?? null;
    try {
      if (!senderId) {
        const { data: { user } } = await supabase.auth.getUser();
        senderId = user?.id ?? null;
      }
    } catch {
      senderId = explicitSenderId ?? null;
    }
    // enviar broadcast (no toca DB ni RLS)
    await supabase.channel(`chat:${contratacionId}`).send({
      type: 'broadcast',
      event: 'typing',
      payload: { senderId, isTyping },
    });
  },
};
