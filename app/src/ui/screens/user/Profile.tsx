// src/ui/screens/user/Profile.tsx
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text, Button, Avatar } from 'react-native-paper';
import { AuthRepository } from '../../../infrastructure/supabase/repositories/AuthRepository';

export default function Profile({ navigation }: any) {
  const [profile, setProfile] = useState<any>(null);

  async function load() {
    try {
      const prof = await AuthRepository.getProfile();
      setProfile(prof);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function logout() {
    try {
      await AuthRepository.logout();
      navigation.reset({ index: 0, routes: [{ name: 'Catalog' }] });
    } catch (e) {
      console.error(e);
    }
  }

  if (!profile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>Mi Perfil</Text>
      <Avatar.Image size={64} source={{ uri: `https://ui-avatars.com/api/?name=${profile.nombre || profile.email}` }} style={{ marginBottom: 16 }} />
      <Text variant="bodyLarge">Email: {profile.email}</Text>
      <Text variant="bodyLarge" style={{ marginTop: 8 }}>Nombre: {profile.nombre || 'No definido'}</Text>
      <Text variant="bodyLarge" style={{ marginTop: 8 }}>Rol: {profile.rol}</Text>
      <Button mode="contained" onPress={logout} style={{ marginTop: 24 }}>
        Cerrar Sesión
      </Button>
    </View>
  );
}
