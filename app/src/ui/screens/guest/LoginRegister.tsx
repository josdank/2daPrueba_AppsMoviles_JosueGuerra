// src/ui/screens/guest/LoginRegister.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { AuthRepository } from '../../../infrastructure/supabase/repositories/AuthRepository';

export default function LoginRegister({ navigation }: any) {
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [loading, setLoading] = useState(false);
  const [preferredRole, setPreferredRole] = useState<'usuario_registrado' | 'asesor_comercial' | null>(null);
  const { control, handleSubmit, formState: { errors }, getValues } = useForm({ defaultValues: { email: '', password: '', nombre: '' } });

  const submitWithRole = async (role: 'usuario_registrado' | 'asesor_comercial') => {
    const values = getValues();
    try {
      setLoading(true);
      if (mode === 'register') {
        await AuthRepository.register(values.email, values.password, values.nombre, role);
      } else {
        await AuthRepository.login(values.email, values.password);
        // after login, verify role matches the requested one
        const profile = await AuthRepository.getProfile();
        if (role && profile?.rol && profile.rol !== role) {
          throw new Error('El rol de la cuenta no coincide con la opción seleccionada');
        }
      }

      // small delay to let auth state propagate
      await new Promise(resolve => setTimeout(resolve, 800));
      // navigation handled by useAuthRole in AppNavigator
    } catch (e: any) {
      console.error('Auth error:', e?.message ?? e);
      try { alert(e?.message ?? 'Error de autenticación'); } catch (err) { }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: any) => {
    if (preferredRole) {
      await submitWithRole(preferredRole);
      return;
    }
    await submitWithRole('usuario_registrado');
  };

  return (
    <View style={{ padding: 16 }}>
      <Text variant="titleLarge">Tigo Conecta</Text>
      <SegmentedButtons value={mode} onValueChange={(v) => { setMode(v as any); setPreferredRole(null); }} buttons={[{ value: 'login', label: 'Ingresar' }, { value: 'register', label: 'Registrarse' }]} />
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

      {mode === 'login' ? (
        <>
          <Button mode="contained" buttonColor="#2E86DE" onPress={() => submitWithRole('usuario_registrado')} loading={loading} disabled={loading} style={{ marginTop: 16 }}>
            Ingresar como Usuario
          </Button>
          <Button mode="contained" buttonColor="#27AE60" onPress={() => submitWithRole('asesor_comercial')} loading={loading} disabled={loading} style={{ marginTop: 12 }}>
            Ingresar como Asesor
          </Button>
        </>
      ) : (
        <>
          <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={loading} disabled={loading} style={{ marginTop: 16 }}>
            Crear cuenta (Usuario)
          </Button>
          <Button mode="contained" buttonColor="#27AE60" onPress={() => { setPreferredRole('asesor_comercial'); handleSubmit(onSubmit)(); }} loading={loading} disabled={loading} style={{ marginTop: 12 }}>
            Crear cuenta (Asesor)
          </Button>
        </>
      )}

      <Button onPress={() => navigation.navigate('ResetPassword')} style={{ marginTop: 12 }}>¿Olvidaste tu contraseña?</Button>
    </View>
  );
}
