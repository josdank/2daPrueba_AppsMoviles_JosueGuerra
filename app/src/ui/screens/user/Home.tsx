// src/ui/screens/user/Home.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Searchbar, SegmentedButtons } from 'react-native-paper';
import { PlansRepository } from '../../../infrastructure/supabase/repositories/PlansRepository';
import PlanCard from '../../components/PlanCard';
import { subscribePlans } from '../../../application/usecases/plans/subscribePlans';

export default function Home({ navigation }: any) {
  const [plans, setPlans] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [segment, setSegment] = useState<string>('Todos');

  async function load() { setPlans(await PlansRepository.listActive()); }
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
      <Text variant="titleLarge">Catálogo de Planes</Text>
      <Searchbar placeholder="Buscar plan..." value={query} onChangeText={setQuery} style={{ marginVertical: 12 }}/>
      <SegmentedButtons
        value={segment} onValueChange={setSegment}
        buttons={[{ value: 'Todos', label: 'Todos' }, { value: 'Básico', label: 'Básico' }, { value: 'Medio', label: 'Medio' }, { value: 'Premium', label: 'Premium' }]}
      />
      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <PlanCard
            plan={item}
            onPress={() => navigation.navigate('PlanDetail', { plan: item, mode: 'user' })}
            actionLabel="Contratar"
            onAction={() => navigation.navigate('PlanDetail', { plan: item, mode: 'user' })}
          />
        )}
      />
    </View>
  );
}
