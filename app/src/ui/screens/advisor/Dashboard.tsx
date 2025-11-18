// src/ui/screens/advisor/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { PlansRepository } from '../../../infrastructure/supabase/repositories/PlansRepository';

export default function Dashboard({ navigation }: any) {
  const [stats, setStats] = useState({ total: 0, active: 0 });

  async function loadStats() {
    try {
      const planes = await PlansRepository.listAll();
      setStats({
        total: planes.length,
        active: planes.filter(p => p.activo).length
      });
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="displaySmall" style={{ marginBottom: 24 }}>Dashboard</Text>
      
      <Card style={{ marginBottom: 16 }}>
        <Card.Content>
          <Text variant="headlineSmall">Planes Activos</Text>
          <Text variant="displayMedium">{stats.active}</Text>
        </Card.Content>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Card.Content>
          <Text variant="headlineSmall">Planes Totales</Text>
          <Text variant="displayMedium">{stats.total}</Text>
        </Card.Content>
      </Card>

      <Button mode="contained" onPress={() => navigation.navigate('PlanForm')} style={{ marginBottom: 12 }}>
        Crear Nuevo Plan
      </Button>
      
      <Button mode="outlined" onPress={() => navigation.navigate('PendingContracts')}>
        Ver Contrataciones Pendientes
      </Button>
    </View>
  );
}
