// src/ui/screens/guest/Catalog.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Searchbar, SegmentedButtons, Button } from 'react-native-paper';
import { PlansRepository } from '../../../infrastructure/supabase/repositories/PlansRepository';
import PlanCard from '../../components/PlanCard';
import { subscribePlans } from '../../../application/usecases/plans/subscribePlans';

export default function Catalog({ navigation }: any) {
  const [plans, setPlans] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [segment, setSegment] = useState<string>('Todos');

  async function load() {
    try {
      setPlans(await PlansRepository.listActive());
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();
    const sub = subscribePlans(load);
    return () => { sub.unsubscribe(); };
  }, []);

  const filtered = plans.filter(p =>
    (!query || p.nombre_comercial.toLowerCase().includes(query.toLowerCase())) &&
    (segment === 'Todos' || (p.segmento || '').toLowerCase().includes(segment.toLowerCase()))
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Searchbar placeholder="Buscar plan..." value={query} onChangeText={setQuery} style={{ marginVertical: 12 }}/>
      <SegmentedButtons
        value={segment} onValueChange={setSegment}
        buttons={[
          { value: 'Todos', label: 'Todos' },
          { value: 'Básico', label: 'Básico' },
          { value: 'Medio', label: 'Medio' },
          { value: 'Premium', label: 'Premium' }
        ]}
        style={{ marginBottom: 12 }}
      />
      <Button mode="contained" onPress={() => navigation.navigate('LoginRegister')} style={{ marginBottom: 12 }}>
        Ingresar / Registrarse
      </Button>
      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <PlanCard
            plan={item}
            onPress={() => navigation.navigate('Detalle', { plan: item, mode: 'guest' })}
            secondaryLabel="Ver Detalles"
            onSecondary={() => navigation.navigate('Detalle', { plan: item, mode: 'guest' })}
          />
        )}
      />
    </View>
  );
}
