// src/ui/screens/advisor/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import BottomBar from '../../components/BottomBar';
import { Text, Button, Card } from 'react-native-paper';
import { StyleSheet } from 'react-native';
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
      
      <Card style={{ marginBottom: 16 }}>
        <Card.Content>
          <Text variant="headlineSmall">Planes Activos</Text>
          <Text variant="displayMedium">{stats.active}</Text>
        </Card.Content>
      </Card>
      <Card style={styles.greenCard}>
        <Card.Content>
          <Text variant="titleLarge" style={{ color: '#fff' }}>Gestión de Planes</Text>
        </Card.Content>
      </Card>

      <Button mode="contained" onPress={() => navigation.navigate('PlanForm')} style={styles.createBtn}>
        + PlanForm
      </Button>
      
      <Button mode="outlined" onPress={() => navigation.navigate('Contrataciones Pendientes')}>
        Ver Contrataciones Pendientes
      </Button>
    </View>
  );
}
const styles = StyleSheet.create({
  greenCard: {
    backgroundColor: '#10ac84',
    borderRadius: 12,
    marginVertical: 12,
    padding: 8,
    elevation: 3,
  },
  createBtn: {
    borderRadius: 10,
    color: '#ffffff',
    paddingVertical: 10,
    backgroundColor: '#2563EB', // azul vibrante
    marginBottom: 12,
  },
});