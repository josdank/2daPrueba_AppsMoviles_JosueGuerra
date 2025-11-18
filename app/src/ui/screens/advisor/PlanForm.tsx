// src/ui/screens/advisor/PlanForm.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, IconButton, Divider } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { PlansRepository } from '../../../infrastructure/supabase/repositories/PlansRepository';
import { uploadPlanImage } from '../../../application/usecases/storage/uploadPlanImage';

type FormValues = {
  nombre_comercial: string;
  precio: string;
  segmento?: string;
  publico_objetivo?: string;
  datos_moviles?: string;
  minutos_voz?: string;
  sms?: string;
  velocidad_4g?: string;
  velocidad_5g?: string;
  redes_sociales?: string;
  whatsapp?: string;
  llamadas_internacionales?: string;
  imagen_url?: string;
};

export default function PlanForm({ navigation, route }: any) {
  const { plan: planToEdit } = route?.params || {};
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(planToEdit?.imagen_url || null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: planToEdit || {
      nombre_comercial: '',
      precio: '',
      segmento: '',
      publico_objetivo: '',
      datos_moviles: '',
      minutos_voz: '',
      sms: '',
      velocidad_4g: '',
      velocidad_5g: '',
      redes_sociales: '',
      whatsapp: '',
      llamadas_internacionales: '',
      imagen_url: '',
    },
  });

  useEffect(() => {
    if (planToEdit) {
      Object.keys(planToEdit).forEach((key) => {
        // @ts-ignore
        setValue(key, planToEdit[key]);
      });
      setImageUri(planToEdit.imagen_url || null);
    }
  }, [planToEdit, setValue]);

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Se requiere permiso para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Se requiere permiso para usar la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  }

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      // Subir imagen si hay una nueva seleccionada
      let uploadedImageUrl: string | null = planToEdit?.imagen_url || null;
      const changedImage = imageUri && imageUri !== planToEdit?.imagen_url;

      if (changedImage) {
        uploadedImageUrl = await uploadPlanImage(values.nombre_comercial, imageUri!);
      }

      const precioNum = parseFloat(values.precio || '0');
      if (Number.isNaN(precioNum)) {
        throw new Error('El precio no es un número válido');
      }

      const payload = {
        nombre_comercial: values.nombre_comercial.trim(),
        precio: precioNum,
        segmento: values.segmento || null,
        publico_objetivo: values.publico_objetivo || null,
        datos_moviles: values.datos_moviles || null,
        minutos_voz: values.minutos_voz || null,
        sms: values.sms || null,
        velocidad_4g: values.velocidad_4g || null,
        velocidad_5g: values.velocidad_5g || null,
        redes_sociales: values.redes_sociales || null,
        whatsapp: values.whatsapp || null,
        llamadas_internacionales: values.llamadas_internacionales || null,
        imagen_url: uploadedImageUrl,
        activo: true,
        roaming: 'No incluido', // automático
      };


      navigation.goBack();
    } catch (e: any) {
      console.error('Error al guardar el plan:', e?.message || e);
      alert(e?.message || 'Ocurrió un error al guardar el plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {/* Información general */}
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>Información general</Text>
      <Controller
        name="nombre_comercial"
        control={control}
        rules={{ required: 'Nombre requerido' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Nombre Comercial"
            value={value}
            onChangeText={onChange}
            error={!!errors.nombre_comercial}
            style={{ marginBottom: 12 }}
          />
        )}
      />
      <Controller
        name="precio"
        control={control}
        rules={{ required: 'Precio requerido' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Precio"
            value={value}
            onChangeText={onChange}
            keyboardType="decimal-pad"
            error={!!errors.precio}
            style={{ marginBottom: 12 }}
          />
        )}
      />
      <Controller
        name="segmento"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput label="Segmento" value={value ?? ''} onChangeText={onChange} style={{ marginBottom: 12 }} />
        )}
      />
      <Divider style={{ marginVertical: 12 }} />

      {/* Conectividad y datos */}
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>Conectividad y datos</Text>
      <Controller
        name="publico_objetivo"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Público Objetivo"
            value={value ?? ''}
            onChangeText={onChange}
            multiline
            style={{ marginBottom: 12 }}
          />
        )}
      />
      <Controller
        name="datos_moviles"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Datos Móviles"
            value={value ?? ''}
            onChangeText={onChange}
            multiline
            style={{ marginBottom: 12 }}
          />
        )}
      />
      <Controller
        name="velocidad_4g"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput label="Velocidad 4G" value={value ?? ''} onChangeText={onChange} style={{ marginBottom: 12 }} />
        )}
      />
      <Controller
        name="velocidad_5g"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput label="Velocidad 5G" value={value ?? ''} onChangeText={onChange} style={{ marginBottom: 12 }} />
        )}
      />

      <Divider style={{ marginVertical: 12 }} />

      {/* Voz y mensajes */}
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>Voz y mensajes</Text>
      <Controller
        name="minutos_voz"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput label="Minutos de Voz" value={value ?? ''} onChangeText={onChange} style={{ marginBottom: 12 }} />
        )}
      />
      <Controller
        name="sms"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput label="SMS" value={value ?? ''} onChangeText={onChange} style={{ marginBottom: 12 }} />
        )}
      />

      <Divider style={{ marginVertical: 12 }} />

      {/* Extras y beneficios */}
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>Extras y beneficios</Text>
      <Controller
        name="redes_sociales"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Redes Sociales"
            value={value ?? ''}
            onChangeText={onChange}
            multiline
            style={{ marginBottom: 12 }}
          />
        )}
      />
      <Controller
        name="whatsapp"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput label="WhatsApp" value={value ?? ''} onChangeText={onChange} style={{ marginBottom: 12 }} />
        )}
      />
      <Controller
        name="llamadas_internacionales"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Llamadas Internacionales"
            value={value ?? ''}
            onChangeText={onChange}
            style={{ marginBottom: 12 }}
          />
        )}
      />

      <Divider style={{ marginVertical: 12 }} />

      {/* Imagen del plan */}
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>Imagen del plan</Text>
      <View style={{ marginBottom: 12 }}>
        <TouchableOpacity
          onPress={imageUri ? pickImage : takePhoto}
          style={{
            borderWidth: 1,
            borderColor: '#000000ff',
            borderStyle: 'dashed',
            padding: 20,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            height: 150,
          }}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{ width: '100%', height: '100%', borderRadius: 8 }}
              contentFit="cover"
            />
          ) : (
            <IconButton icon="camera" size={40} />
          )}
        </TouchableOpacity>

        {imageUri ? (
          <>
            <Button onPress={pickImage} mode="outlined" style={{ marginTop: 8 }}>
              Cambiar Foto
            </Button>
            <Button onPress={() => setImageUri(null)} mode="text" compact style={{ marginTop: 4 }}>
              Eliminar Imagen
            </Button>
          </>
        ) : (
          <Button onPress={takePhoto} mode="outlined" style={{ marginTop: 8 }}>
            Añadir Foto
          </Button>
        )}
      </View>

      {/* Acciones */}
      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={loading}
        style={{ marginTop: 16, marginBottom: 12 }}
      >
        {planToEdit ? 'Actualizar' : 'Crear'}
      </Button>
      <Button onPress={() => navigation.goBack()}>Cancelar</Button>
    </ScrollView>
  );
}
