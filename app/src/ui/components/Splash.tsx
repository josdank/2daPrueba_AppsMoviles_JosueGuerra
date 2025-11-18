import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

export default function Splash() {
  return (
    <LinearGradient colors={['#0E0E12', '#16171D']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="displayLarge" style={{ color: '#48C9B0', fontWeight: 'bold' }}>
        Tigo Conecta
      </Text>
      <Text variant="bodyLarge" style={{ color: '#E7E7EA', marginTop: 12 }}>
        Cargando...
      </Text>
    </LinearGradient>
  );
}
