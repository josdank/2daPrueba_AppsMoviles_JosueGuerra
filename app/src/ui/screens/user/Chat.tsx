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
  const { contratacionId } = route.params || {};
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  async function fetchAndSetMessages() {
    try {
      const data = await ChatRepository.listMessages(contratacionId);
      setMessages(data);
      return data; // Return messages for initial check
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);
      } catch (e) {
        console.error(e);
      }

      const initialMessages = await fetchAndSetMessages();
      if (initialMessages.length === 0) {
        // If no messages, send the automatic greeting from the advisor
        const advisorId = await AuthRepository.getAdvisorId();
        if (advisorId) {
          await ChatRepository.send(contratacionId, 'Hola en que te podemos ayudar.', advisorId);
        }
      }
    };
    
    fetchUserAndMessages();

    const sub = ChatRepository.subscribe(contratacionId, (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    const typingSub = subscribeTyping(contratacionId, (p) => setTyping(!!p.isTyping));
    return () => {
      sub.unsubscribe();
      typingSub.unsubscribe();
    };
  }, [contratacionId]);

  async function sendMessage() {
    if (!input.trim()) return;
    try {
      await ChatRepository.send(contratacionId, input);
      setInput('');
      await emitTyping(contratacionId, false);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 }}>
      </View>
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
            emitTyping(contratacionId, !!t);
          }}
          placeholder="Escribe un mensaje..."
          style={{ flex: 1 }}
        />
        <Button mode="contained" onPress={sendMessage}>Enviar</Button>
      </View>
    </View>
  );
}
