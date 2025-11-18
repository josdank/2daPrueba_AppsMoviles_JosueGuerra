// src/ui/screens/guest/PlanDetail.tsx
import React from 'react';
import { View, Modal, Pressable, ScrollView } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
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
    navigation.goBack();
    navigation.navigate('Chat', { contratacionId: data.id });
  }

  return (
    <Modal visible={true} transparent animationType="fade" onRequestClose={() => navigation.goBack()}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => navigation.goBack()}>
        <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={(e) => e.stopPropagation()}>
          <View style={{ backgroundColor: '#1e1e1e', borderRadius: 12, width: '85%', maxHeight: '85%', overflow: 'hidden' }}>
            {/* Header con botón cerrar */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' }}>
              <Text variant="titleLarge" style={{ color: '#fff' }}>Detalles del Plan</Text>
              <IconButton icon="close" size={24} onPress={() => navigation.goBack()} iconColor="#fff" />
            </View>

            {/* Contenido scrollable */}
            <ScrollView style={{ padding: 16 }}>
              {plan.imagen_url && <Image source={{ uri: plan.imagen_url }} style={{ width: '100%', height: 180, borderRadius: 8, marginBottom: 16 }} contentFit="cover" />}
              <Text variant="headlineSmall" style={{ color: '#fff', marginBottom: 8 }}>{plan.nombre_comercial}</Text>
              <Text variant="titleMedium" style={{ color: '#2E86DE', marginBottom: 12, fontWeight: 'bold' }}>${plan.precio}/mes</Text>
              <Text variant="bodyMedium" style={{ color: '#aaa', marginBottom: 16 }}>{plan.segmento}</Text>
              
              <Text variant="labelMedium" style={{ color: '#2E86DE', marginTop: 12 }}>CARACTERÍSTICAS:</Text>
              <Text variant="bodySmall" style={{ color: '#ddd', marginVertical: 4 }}>📊 Datos: {plan.datos_moviles}</Text>
              <Text variant="bodySmall" style={{ color: '#ddd', marginVertical: 4 }}>☎️ Minutos: {plan.minutos_voz}</Text>
              <Text variant="bodySmall" style={{ color: '#ddd', marginVertical: 4 }}>💬 SMS: {plan.sms}</Text>
              <Text variant="bodySmall" style={{ color: '#ddd', marginVertical: 4 }}>🌐 Redes: {plan.redes_sociales}</Text>
              <Text variant="bodySmall" style={{ color: '#ddd', marginVertical: 4 }}>💚 WhatsApp: {plan.whatsapp}</Text>
              <Text variant="bodySmall" style={{ color: '#ddd', marginVertical: 4 }}>🌍 Roaming: {plan.roaming}</Text>
              
              {/* Botones de acción */}
              <View style={{ marginTop: 24, gap: 8 }}>
                {canContract && <Button mode="contained" onPress={contratar} style={{ backgroundColor: '#2E86DE' }}>Contratar Ahora</Button>}
                <Button mode="outlined" onPress={() => navigation.goBack()}>Cerrar</Button>
              </View>
            </ScrollView>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
