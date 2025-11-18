// src/ui/screens/advisor/Conversations.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { ContractsRepository } from '../../../infrastructure/supabase/repositories/ContractsRepository';

export default function Conversations({ navigation }: any) {
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    try {
      const data = await ContractsRepository.listPending();
      setItems(data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 12 }}>Mis Conversaciones</Text>
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
