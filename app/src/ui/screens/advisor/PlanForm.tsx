// src/ui/screens/advisor/PendingContracts.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { ContractsRepository } from '../../../infrastructure/supabase/repositories/ContractsRepository';

export default function PendingContracts() {
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    try {
      const data = await ContractsRepository.listPending();
      setItems(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleApprove(id: string) {
    try {
      await ContractsRepository.updateEstado(id, 'aprobado');
      load();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleReject(id: string) {
    try {
      await ContractsRepository.updateEstado(id, 'rechazado');
      load();
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 12 }}>Contrataciones Pendientes</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Card style={{ marginVertical: 8 }}>
            <Card.Content>
              <Text variant="titleMedium">{item.planes_moviles?.nombre_comercial ?? 'Plan'}</Text>
              <Text variant="bodySmall">Usuario: {item.perfiles?.email}</Text>
              <Text variant="bodySmall">Estado: {item.estado}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => handleApprove(item.id)}>Aprobar</Button>
              <Button onPress={() => handleReject(item.id)}>Rechazar</Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}
