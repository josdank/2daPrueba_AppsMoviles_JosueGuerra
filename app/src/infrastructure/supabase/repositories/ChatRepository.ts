import { supabase } from '../client';
import type { ChatMessage } from '../../../domain/entities/Plan';

export const ChatRepository = {
  async listMessages(contratacionId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('mensajes_chat')
      .select('*')
      .eq('contratacion_id', contratacionId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async send(contratacionId: string, contenido: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No auth');
    const { data, error } = await supabase
      .from('mensajes_chat')
      .insert({ contratacion_id: contratacionId, sender_id: user.id, contenido })
      .select()
      .single();
    if (error) throw error;
    return data as ChatMessage;
  },

  subscribe(contratacionId: string, onMessage: (msg: ChatMessage) => void) {
    return supabase
      .channel(`chat:${contratacionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'mensajes_chat',
        filter: `contratacion_id=eq.${contratacionId}`
      }, (payload) => onMessage(payload.new as ChatMessage))
      .subscribe();
  }
};
