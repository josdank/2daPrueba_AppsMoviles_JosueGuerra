// src/ui/screens/user/MyContracts.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { ContractsRepository } from '../../../infrastructure/supabase/repositories/ContractsRepository';
import { supabase } from '../../../infrastructure/supabase/client';

export default function MyContracts({ navigation }: any) {
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    try {
      const data = await ContractsRepository.listMine();
      setItems(data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();
    const sub = supabase.channel('contracts:mine')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contrataciones' }, () => load())
      .subscribe();
    return () => { sub.unsubscribe(); };
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Card style={{ marginVertical: 8 }}>
            <Card.Content>
              <Text variant="titleMedium">{item.planes_moviles?.nombre_comercial ?? 'Plan'}</Text>
              <Text variant="bodySmall">Estado: {item.estado}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate('Chat', { contratacionId: item.id })}>Chat</Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}
