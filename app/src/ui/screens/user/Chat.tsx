// src/ui/screens/user/Chat.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import ChatBubble from '../../components/ChatBubble';
import { ChatRepository } from '../../../infrastructure/supabase/repositories/ChatRepository';
import { AuthRepository } from '../../../infrastructure/supabase/repositories/AuthRepository';
import { supabase } from '../../../infrastructure/supabase/client';
import { subscribeTyping, emitTyping } from '../../../application/usecases/chat/typing';

export default function Chat({ route, navigation }: any) {
  const contratacionId = route?.params?.contratacionId;
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contratacionId) {
      setError('Falta identificador de contratación. Vuelve atrás e intenta de nuevo.');
      setLoading(false);
      return;
    }

    let sub: any = null;
    let typingSub: any = null;
    let cancelled = false;

    const fetchUserAndMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id ?? null);
      } catch (e) {
        console.error('Error getting auth user', e);
        setCurrentUserId(null);
      }

      try {
        const initialMessages = await ChatRepository.listMessages(contratacionId);
        if (cancelled) return;
        setMessages(initialMessages);
        // si no hay mensajes, delegar el saludo automático (no pasar advisorId desde cliente)
        if (initialMessages.length === 0) {
          // Opción segura: no crear mensaje en nombre del asesor desde el cliente.
          // Si necesitas que lo haga el asesor, usa una Edge Function / backend.
          // Aquí evitamos insertar con advisorId para no violar RLS.
        }
      } catch (e) {
        console.error('Error fetching messages:', e);
        setError('No se pudieron cargar los mensajes.');
      } finally {
        if (!cancelled) setLoading(false);
      }

      try {
        sub = ChatRepository.subscribe(contratacionId, (msg) => {
          setMessages(prev => [...prev, msg]);
        });
      } catch (e) {
        console.warn('Subscribe failed:', e);
      }

      try {
        typingSub = ChatRepository.subscribeTyping(contratacionId, (p) => {
          if (p.senderId && p.senderId === currentUserId) return;
          setTyping(!!p.isTyping);
        });
      } catch (e) {
        console.warn('Typing subscribe failed:', e);
      }
    };

    fetchUserAndMessages();

    return () => {
      cancelled = true;
      try { sub?.unsubscribe?.(); } catch {}
      try { typingSub?.unsubscribe?.(); } catch {}
    };
  }, [contratacionId, currentUserId]);

  async function sendMessage() {
    if (!contratacionId) {
      console.warn('sendMessage aborted: missing contratacionId');
      return;
    }
    if (!input.trim()) return;
    try {
      // ChatRepository.send ya debería validar ids; llamar solo si contratacionId existe
      await ChatRepository.send(contratacionId, input);
      setInput('');
      await ChatRepository.emitTyping(contratacionId, false);
    } catch (e) {
      console.error('Error sending message:', e);
      setError('No se pudo enviar el mensaje.');
    }
  }

  if (loading) return <View style={{ flex: 1, padding: 16 }}><Text>Cargando chat…</Text></View>;

  if (error) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
        <Text style={{ marginBottom: 12, color: 'red' }}>{error}</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>Volver</Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <ChatBubble message={item.contenido} isMine={item.sender_id === currentUserId} />
        )}
        style={{ flex: 1, marginBottom: 12 }}
      />
      {typing && <Text style={{ marginVertical: 6, color: '#9aa' }}>Asesor está escribiendo…</Text>}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <TextInput
          value={input}
          onChangeText={(t) => {
            setInput(t);
            // emitir solo si tenemos contratacionId
            if (contratacionId) {
              ChatRepository.emitTyping(contratacionId, !!t).catch(e => console.warn('emitTyping failed', e));
            }
          }}
          placeholder="Escribe un mensaje..."
          style={{ flex: 1 }}
        />
        <Button mode="contained" onPress={sendMessage}>Enviar</Button>
      </View>
    </View>
  );
}
