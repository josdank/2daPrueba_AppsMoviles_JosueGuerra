// src/ui/screens/advisor/Conversations.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import BottomBar from '../../components/BottomBar';
import { Text, Button, Card } from 'react-native-paper';
import { ContractsRepository } from '../../../infrastructure/supabase/repositories/ContractsRepository';

export default function Conversations({ navigation }: any) {
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    try {
      const data = await ContractsRepository.listPending();
      // Filter to show only active conversations (excluding rejected)
      const activeConversations = data.filter((item: any) => item.estado !== 'rechazado');
      setItems(activeConversations);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Card style={{ marginVertical: 8 }}>
            <Card.Content>
              <Text variant="titleMedium">{item.perfiles?.email}</Text>
              <Text variant="bodySmall">Plan: {item.planes_moviles?.nombre_comercial}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate('Chat', { contratacionId: item.id })}>Abrir Chat</Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}
