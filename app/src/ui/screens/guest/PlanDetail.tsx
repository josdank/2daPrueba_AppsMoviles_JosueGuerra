// src/ui/screens/guest/PlanDetail.tsx
import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Image } from 'expo-image';
import { ContractsRepository } from '../../../infrastructure/supabase/repositories/ContractsRepository';
import { AuthRepository } from '../../../infrastructure/supabase/repositories/AuthRepository';

export default function PlanDetail({ route, navigation }: any) {
  const { plan, mode } = route.params || {};
  const canContract = mode === 'user';

  async function contratar() {
    const prof = await AuthRepository.getProfile();
    if (!prof) return navigation.navigate('LoginRegister');
    const data = await ContractsRepository.create(plan.id);
    navigation.navigate('Chat', { contratacionId: data.id });
  }

  return (
    <View style={{ padding: 16 }}>
      {plan.imagen_url && <Image source={{ uri: plan.imagen_url }} style={{ width: '100%', height: 200 }} contentFit="cover" />}
      <Text variant="headlineSmall">{plan.nombre_comercial}</Text>
      <Text variant="titleMedium">${plan.precio}/mes</Text>
      <Text variant="bodyMedium">{plan.segmento}</Text>
      <Text variant="bodySmall">Datos: {plan.datos_moviles}</Text>
      <Text variant="bodySmall">Minutos: {plan.minutos_voz}</Text>
      <Text variant="bodySmall">SMS: {plan.sms}</Text>
      <Text variant="bodySmall">Redes: {plan.redes_sociales}</Text>
      <Text variant="bodySmall">WhatsApp: {plan.whatsapp}</Text>
      <Text variant="bodySmall">Roaming: {plan.roaming}</Text>
      {canContract && <Button mode="contained" onPress={contratar} style={{ marginTop: 16 }}>Contratar</Button>}
    </View>
  );
}
