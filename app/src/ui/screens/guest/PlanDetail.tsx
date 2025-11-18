// src/ui/screens/guest/PlanDetail.tsx
import React, { useEffect, useState } from 'react';
import { View, Modal, Pressable, ScrollView } from 'react-native';
import { Text, Button, IconButton, ActivityIndicator } from 'react-native-paper';
import { Image } from 'expo-image';
import { ContractsRepository } from '../../../infrastructure/supabase/repositories/ContractsRepository';
import { AuthRepository } from '../../../infrastructure/supabase/repositories/AuthRepository';
import { sendMessage } from '../../../application/usecases/chat/sendMessage';

function safeGoBack(navigation: any, fallback = 'Catalog') {
  try {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate?.(fallback);
    }
  } catch {
    try { navigation.navigate?.(fallback); } catch (_) { /* ignore */ }
  }
}

export default function PlanDetail({ route, navigation }: any) {
  const params = route?.params ?? {};
  const [plan, setPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const mode = params?.mode ?? 'guest';
  const canContract = mode === 'user';
  const isAdvisor = mode === 'advisor';

  useEffect(() => {
    async function init() {
      setLoading(true);

      if (params?.plan) {
        setPlan(params.plan);
        setLoading(false);
        return;
      }

      const maybeId = params?.planId ?? params?.id ?? null;
      if (maybeId) {
        try {
          setPlan(null); 
        } catch (err) {
          console.error('Error fetching plan by id:', err);
          setPlan(null);
        } finally {
          setLoading(false);
          return;
        }
      }

      setPlan(null);
      setLoading(false);
    }

    init();
  }, [route?.params]);

  async function solicitarPlan() {
    try {
      if (!plan?.id) {
        console.warn('Solicitar plan abortado: plan inválido', plan);
        return;
      }

      const prof = await AuthRepository.getProfile();
      if (!prof) {
        navigation.navigate('LoginRegister');
        return;
      }

      const contract = await ContractsRepository.create(plan.id);
      if (!contract) {
        console.warn('No se pudo crear la contratación');
        return;
      }

      const messageContent = `Quiero contratar este plan: ${plan.nombre_comercial}, necesito más ayuda por favor.`;
      await sendMessage(contract.id, messageContent);

      navigation.replace?.('Chat', { contratacionId: contract.id }) ??
        navigation.navigate('Chat', { contratacionId: contract.id });
    } catch (err) {
      console.error('Error en solicitarPlan:', err);
    }
  }

  async function handleEditPlan() {
    if (!plan) return;
    navigation.navigate('PlanForm', { planToEdit: plan });
  }

  async function handleDeletePlan() {
    if (!plan?.id) return;
    console.log('Deleting plan:', plan.id);
    safeGoBack(navigation, 'Catalog');
  }

  // Render normal cuando sí hay plan
  const imageUrl = plan?.imagen_url ?? null;
  const name = plan?.nombre_comercial ?? 'Sin nombre';
  const priceText = typeof plan?.precio !== 'undefined' ? `$${plan.precio}/mes` : '—';
  const segment = plan?.segmento ?? '';

  return (
    <Modal visible transparent animationType="fade" onRequestClose={() => safeGoBack(navigation, 'Catalog')}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => safeGoBack(navigation, 'Catalog')}>
        <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={(e) => e.stopPropagation()}>
          <View style={{ backgroundColor: '#1e1e1e', borderRadius: 12, width: '85%', maxHeight: '85%', overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' }}>
              <Text variant="titleLarge" style={{ color: '#fff' }}>Detalles del Plan</Text>
              <IconButton icon="close" size={24} onPress={() => safeGoBack(navigation, 'Catalog')} iconColor="#fff" />
            </View>

            <ScrollView style={{ padding: 16 }}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={{ width: '100%', height: 180, borderRadius: 8, marginBottom: 16 }} contentFit="cover" />
              ) : (
                <View style={{ width: '100%', height: 180, borderRadius: 8, marginBottom: 16, backgroundColor: '#222' }} />
              )}

              <Text variant="headlineSmall" style={{ color: '#fff', marginBottom: 8 }}>{name}</Text>
              <Text variant="titleMedium" style={{ color: '#2E86DE', marginBottom: 12, fontWeight: 'bold' }}>{priceText}</Text>
              <Text variant="bodyMedium" style={{ color: '#aaa', marginBottom: 16 }}>{segment}</Text>

              <Text variant="labelMedium" style={{ color: '#2E86DE', marginTop: 12 }}>CARACTERÍSTICAS:</Text>
              <Text variant="bodySmall" style={{ color: '#ddd', marginVertical: 4 }}>📊 Datos: {plan?.datos_moviles ?? '—'}</Text>
              <Text variant="bodySmall" style={{ color: '#ddd', marginVertical: 4 }}>☎️ Minutos: {plan?.minutos_voz ?? '—'}</Text>
              <Text variant="bodySmall" style={{ color: '#ddd', marginVertical: 4 }}>💬 SMS: {plan?.sms ?? '—'}</Text>
              <Text variant="bodySmall" style={{ color: '#ddd', marginVertical: 4 }}>🌐 Redes: {plan?.redes_sociales ?? '—'}</Text>
              <Text variant="bodySmall" style={{ color: '#ddd', marginVertical: 4 }}>💚 WhatsApp: {plan?.whatsapp ?? '—'}</Text>
              <Text variant="bodySmall" style={{ color: '#ddd', marginVertical: 4 }}>🌍 Roaming: {plan?.roaming ?? '—'}</Text>

              <View style={{ marginTop: 24, gap: 8 }}>
                {canContract && (
                  <Button mode="contained" onPress={solicitarPlan} style={{ backgroundColor: '#2E86DE', borderRadius: 8, marginBottom: 8 }}>
                    Solicitar Plan
                  </Button>
                )}

                {isAdvisor && (
                  <>
                    <Button mode="contained" onPress={handleEditPlan} style={{ backgroundColor: '#48C9B0', borderRadius: 8, marginBottom: 8 }}>
                      Editar Plan
                    </Button>
                    <Button mode="outlined" onPress={handleDeletePlan} style={{ borderColor: '#FF4D4F', borderWidth: 1, borderRadius: 8, marginBottom: 8 }} labelStyle={{ color: '#FF4D4F' }}>
                      Eliminar Plan
                    </Button>
                  </>
                )}

                <Button mode="outlined" onPress={() => safeGoBack(navigation, 'Catalog')}>Cerrar</Button>
              </View>
            </ScrollView>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
