import React from 'react';
import { Card, Text, Button, IconButton } from 'react-native-paper';
import { Image } from 'expo-image';
import { View, StyleSheet } from 'react-native';

type Props = {
  plan: any;
  onPress?: () => void;
  onBack?: () => void; 
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

export default function PlanCard({
  plan,
  onPress,
  onBack,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: Props) {
  return (
    <Card style={styles.card} onPress={onPress}>
      {plan.imagen_url ? (
        <Image source={{ uri: plan.imagen_url }} style={styles.image} contentFit="cover" />
      ) : (
        <View style={styles.fallbackImage} />
      )}

      <Card.Content style={styles.content}>
        <Text variant="titleMedium" style={styles.title}>
          {plan.nombre_comercial}
        </Text>
        <View style={styles.row}>
          <Text variant="bodyLarge" style={styles.price}>
            ${plan.precio}
          </Text>
          <Text variant="bodySmall" style={styles.segment}>
            {plan.segmento}
          </Text>
        </View>
        <Text variant="bodySmall" numberOfLines={2} style={styles.desc}>
          {plan.descripcion_corta || ''}
        </Text>
      </Card.Content>

      {(primaryLabel || secondaryLabel || onBack) && (
        <Card.Actions style={styles.actions}>
          {/* Botón de retroceso al inicio */}
          {onBack && (
            <IconButton
              icon="arrow-left"
              accessibilityLabel="Volver"
              size={22}
              iconColor="#000"
              onPress={onBack}
              style={styles.backBtn}
            />
          )}

          <View style={styles.actionsRight}>
            {secondaryLabel && onSecondary && (
              <Button
                mode="outlined"
                onPress={onSecondary}
                style={[styles.actionBtn, styles.secondaryBtn]}
                labelStyle={styles.buttonLabel}
                icon="eye"
              >
                {secondaryLabel}
              </Button>
            )}

            {primaryLabel && onPrimary && (
              <Button
                mode="contained"
                onPress={onPrimary}
                style={[styles.actionBtn, styles.primaryBtn]}
                labelStyle={styles.buttonLabel}
                icon="chat"
              >
                {primaryLabel}
              </Button>
            )}
          </View>
        </Card.Actions>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    borderRadius: 12,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    elevation: 4,
  },
  image: { width: '100%', height: 150 },
  fallbackImage: { width: '100%', height: 150, backgroundColor: '#eee' },
  content: { paddingVertical: 12 },
  title: { marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontWeight: '700' },
  segment: { fontSize: 12, color: '#000000ff' },
  desc: { marginTop: 6, color: '#000000ff' },
  actions: {
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    flexDirection: 'row',
  },
  backBtn: {
    margin: 0,
    marginLeft: 4,
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  actionsRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionBtn: {
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 40,
    minWidth: 100,
  },
  primaryBtn: {
    marginLeft: 8,
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
  },
  buttonLabel: {
    fontSize: 14,
  },
});
