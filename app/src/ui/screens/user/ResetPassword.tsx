// src/ui/screens/user/ResetPassword.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { AuthRepository } from '../../../infrastructure/supabase/repositories/AuthRepository';

export default function ResetPassword({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleReset() {
    try {
      setError('');
      setMessage('');
      await AuthRepository.resetPassword(email);
      setMessage('Revisa tu email para restablecer tu contraseña');
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Button icon="arrow-left" mode="text" onPress={() => navigation.goBack()} style={{ alignSelf: 'flex-start', marginBottom: 8 }}>Volver</Button>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>Restablecer Contraseña</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ marginBottom: 12 }}
      />
      <Button mode="contained" onPress={handleReset} style={{ marginBottom: 12 }}>
        Enviar Enlace
      </Button>
      {error && <HelperText type="error" visible={!!error}>{error}</HelperText>}
      {message && <Text style={{ color: '#48C9B0', marginTop: 12 }}>{message}</Text>}
    </View>
  );
}
