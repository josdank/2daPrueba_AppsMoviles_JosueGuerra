// src/ui/screens/guest/LoginRegister.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { AuthRepository } from '../../../infrastructure/supabase/repositories/AuthRepository';

export default function LoginRegister({ navigation }: any) {
  const [mode, setMode] = useState<'login'|'register'>('login');
  const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: { email: '', password: '', nombre: '' } });

  const onSubmit = async (values: any) => {
    try {
      if (mode === 'register') { await AuthRepository.register(values.email, values.password, values.nombre); }
      else { await AuthRepository.login(values.email, values.password); }
      navigation.reset({ index: 0, routes: [{ name: 'Home' }]});
    } catch (e: any) { console.log(e.message); }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text variant="titleLarge">Tigo Conecta</Text>
      <SegmentedButtons value={mode} onValueChange={setMode} buttons={[{ value: 'login', label: 'Ingresar' }, { value: 'register', label: 'Registrarse' }]} />
      <Controller name="email" control={control} rules={{ required: true }} render={({ field: { onChange, value } }) => (
        <>
          <TextInput label="Email" value={value} onChangeText={onChange} keyboardType="email-address" style={{ marginTop: 12 }} />
          <HelperText type="error" visible={!!errors.email}>Email inválido</HelperText>
        </>
      )}/>
      {mode === 'register' && (
        <Controller name="nombre" control={control} render={({ field: { onChange, value } }) => (
          <TextInput label="Nombre" value={value} onChangeText={onChange} style={{ marginTop: 12 }} />
        )}/>
      )}
      <Controller name="password" control={control} rules={{ required: true, minLength: 6 }} render={({ field: { onChange, value } }) => (
        <>
          <TextInput label="Contraseña" value={value} onChangeText={onChange} secureTextEntry style={{ marginTop: 12 }} />
          <HelperText type="error" visible={!!errors.password}>Mínimo 6 caracteres</HelperText>
        </>
      )}/>
      <Button mode="contained" onPress={handleSubmit(onSubmit)} style={{ marginTop: 16 }}>
        {mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
      </Button>
      <Button onPress={() => navigation.navigate('ResetPassword')}>¿Olvidaste tu contraseña?</Button>
    </View>
  );
}
