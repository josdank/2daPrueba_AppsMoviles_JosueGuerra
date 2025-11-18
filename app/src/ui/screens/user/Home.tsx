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

  async function load() { 
    try{ 
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
  // pegar en Home.tsx (encima del componente)
function navigateToDetalleRobust(navigation: any, plan: any) {
  const target = 'Detalle';
  const params = { plan, mode: 'guest' };

  // intento directo seguro
  try {
    navigation.navigate(target, params);
    return;
  } catch (e) { /* continue to parents */ }

  // recorrer ancestros buscando routeNames que incluyan target
  let nav: any = navigation;
  while (nav) {
    try {
      const state = nav.getState?.();
      const names = state?.routeNames || state?.routes?.map((r: any) => r.name) || [];
      if (Array.isArray(names) && names.includes(target)) {
        nav.navigate(target, params);
        return;
      }
    } catch (err) { /* ignorar y subir */ }
    nav = nav.getParent?.();
  }

  // intento de navegación anidada hacia un navigator padre (intenta 2 niveles arriba)
  const firstParent = navigation.getParent?.();
  const secondParent = firstParent?.getParent?.();
  try {
    if (firstParent) {
      firstParent.navigate(target, params);
      return;
    }
  } catch (err) {}
  try {
    if (secondParent) {
      secondParent.navigate(target, params);
      return;
    }
  } catch (err) {}

  // último recurso: loguear estado para debugging
  console.warn(`No se encontró navigator que maneje '${target}'. Revisa registro de pantallas.`);
  console.log('Navigation state (home):', JSON.stringify(navigation.getState?.(), null, 2));
}


  return (
    <View style={{ flex: 1, padding: 16 }}>
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
            onPress={() => navigateToDetalleRobust(navigation, item)}          // tocar toda la tarjeta
            primaryLabel="Chat con Asesor"
            onPrimary={() => navigation.navigate('Chat', { planId: item.id })}
            secondaryLabel="Ver Detalles"
            onSecondary={() => navigateToDetalleRobust(navigation, item)}      // botón ver detalles
          />

        )}
      />
    </View>
  );
}
