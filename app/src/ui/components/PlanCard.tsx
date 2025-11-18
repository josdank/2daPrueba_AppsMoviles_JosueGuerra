import React from 'react';
import { Card, Text, Button } from 'react-native-paper';
import { Image } from 'expo-image';
export default function PlanCard({ plan, onPress, actionLabel, onAction }: any) {
  return (
    <Card style={{ marginVertical: 8, backgroundColor: '#16171D' }} onPress={onPress}>
      {plan.imagen_url && (
        <Image source={{ uri: plan.imagen_url }} style={{ width: '100%', height: 160 }} contentFit="cover"/>
      )}
      <Card.Content>
        <Text variant="titleMedium">{plan.nombre_comercial}</Text>
        <Text variant="bodyMedium">${plan.precio}/mes</Text>
        <Text variant="bodySmall">{plan.segmento}</Text>
      </Card.Content>
      {actionLabel && (
        <Card.Actions><Button onPress={onAction}>{actionLabel}</Button></Card.Actions>
      )}
    </Card>
  );
}
