// src/ui/screens/advisor/PlanForm.tsx
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { PlansRepository } from '../../../infrastructure/supabase/repositories/PlansRepository';

export default function PlanForm({ navigation, route }: any) {
  const { plan } = route?.params || {};
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: plan || {
      nombre_comercial: '',
      precio: '',
      segmento: '',
      datos_moviles: '',
      minutos_voz: '',
      sms: '',
      velocidad_4g: '',
      redes_sociales: '',
      whatsapp: '',
      roaming: ''
    }
  });

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        precio: parseFloat(values.precio || 0),
        activo: true
      };
      if (plan?.id) {
        await PlansRepository.update(plan.id, payload);
      } else {
        await PlansRepository.create(payload);
      }
      navigation.goBack();
    } catch (e: any) {
      console.error('Error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Button icon="arrow-left" mode="text" onPress={() => navigation.goBack()} style={{ alignSelf: 'flex-start', marginBottom: 8 }}>Volver</Button>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>
        {plan ? 'Editar Plan' : 'Crear Nuevo Plan'}
      </Text>

      <Controller
        name="nombre_comercial"
        control={control}
        rules={{ required: 'Nombre requerido' }}
        render={({ field: { onChange, value } }) => (
          <TextInput label="Nombre Comercial" value={value} onChangeText={onChange} style={{ marginBottom: 12 }} />
        )}
      />
      <Controller
        name="precio"
        control={control}
        rules={{ required: 'Precio requerido' }}
        render={({ field: { onChange, value } }) => (
          <TextInput label="Precio" value={value} onChangeText={onChange} keyboardType="decimal-pad" style={{ marginBottom: 12 }} />
        )}
      />
      <Controller
        name="segmento"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput label="Segmento" value={value} onChangeText={onChange} style={{ marginBottom: 12 }} />
        )}
      />
      <Controller
        name="datos_moviles"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput label="Datos Móviles" value={value} onChangeText={onChange} multiline style={{ marginBottom: 12 }} />
        )}
      />
      <Controller
        name="minutos_voz"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput label="Minutos de Voz" value={value} onChangeText={onChange} style={{ marginBottom: 12 }} />
        )}
      />
      <Controller
        name="sms"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput label="SMS" value={value} onChangeText={onChange} style={{ marginBottom: 12 }} />
        )}
      />
      <Controller
        name="velocidad_4g"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput label="Velocidad 4G" value={value} onChangeText={onChange} style={{ marginBottom: 12 }} />
        )}
      />
      <Controller
        name="redes_sociales"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput label="Redes Sociales" value={value} onChangeText={onChange} multiline style={{ marginBottom: 12 }} />
        )}
      />
      <Controller
        name="whatsapp"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput label="WhatsApp" value={value} onChangeText={onChange} style={{ marginBottom: 12 }} />
        )}
      />
      <Controller
        name="roaming"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput label="Roaming" value={value} onChangeText={onChange} style={{ marginBottom: 12 }} />
        )}
      />

      <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={loading} disabled={loading} style={{ marginTop: 16, marginBottom: 12 }}>
        {plan ? 'Actualizar' : 'Crear'}
      </Button>
      <Button onPress={() => navigation.goBack()}>Cancelar</Button>
    </ScrollView>
  );
}
