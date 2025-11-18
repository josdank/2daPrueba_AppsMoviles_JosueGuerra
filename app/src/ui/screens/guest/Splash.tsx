// src/ui/screens/guest/Splash.tsx
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

export default function Splash({ navigation }: any) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'Catalog' }] });
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient colors={['#0E0E12', '#16171D']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="displayLarge" style={{ color: '#48C9B0', fontWeight: 'bold' }}>
        Tigo Conecta
      </Text>
      <Text variant="bodyLarge" style={{ color: '#E7E7EA', marginTop: 12 }}>
        Conectando personas...
      </Text>
    </LinearGradient>
  );
}
