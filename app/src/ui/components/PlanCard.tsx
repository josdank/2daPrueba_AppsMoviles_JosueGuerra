import React from 'react';
import { Card, Text, Button, IconButton } from 'react-native-paper';
import { Image } from 'expo-image';
import { View, StyleSheet } from 'react-native';

type Role = 'usuario_registrado' | 'asesor_comercial' | 'guest';

type Props = {
  plan: any;
  role?: Role;
  onPress?: () => void; // abrir detalle genérico
  onBack?: () => void;
  // handlers explícitos para acciones comunes
  onViewDetails?: () => void;
  onChatWithAdvisor?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  // legacy props kept for compatibility (if passed, they take precedence)
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

export default function PlanCard({
  plan,
  role = 'guest',
  onPress,
  onBack,
  onViewDetails,
  onChatWithAdvisor,
  onEdit,
  onDelete,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: Props) {
  const isAdvisor = role === 'asesor_comercial';
  const isUser = role === 'usuario_registrado';

  // resolution for the "Ver Detalles" action (priority: explicit onViewDetails -> onPress)
  const handleViewDetails = () => {
    if (typeof onViewDetails === 'function') return onViewDetails();
    if (typeof onPress === 'function') return onPress();
  };

  // resolution for primary/secondary legacy props (if provided they override)
  const renderPrimary = () => {
    if (primaryLabel && onPrimary) {
      return (
        <Button
          mode="contained"
          onPress={onPrimary}
          style={[styles.actionBtn, styles.primaryBtn]}
          labelStyle={styles.buttonLabel}
          icon="chat"
        >
          {primaryLabel}
        </Button>
      );
    }

    // default user primary action: Chat with advisor
    if (isUser) {
      return (
        <Button
          mode="contained"
          onPress={onChatWithAdvisor}
          style={[styles.actionBtn, styles.primaryBtn]}
          labelStyle={styles.buttonLabel}
          icon="chat"
        >
          Chat con Asesor
        </Button>
      );
    }

    // advisor doesn't render a "primary" contained chat button by default
    return null;
  };

  const renderSecondary = () => {
    if (secondaryLabel && onSecondary) {
      return (
        <Button
          mode="outlined"
          onPress={onSecondary}
          style={[styles.actionBtn, styles.secondaryBtn]}
          labelStyle={styles.buttonLabel}
          icon="eye"
        >
          {secondaryLabel}
        </Button>
      );
    }

    // default secondary: Ver Detalles
    return (
      <Button
        mode="outlined"
        onPress={handleViewDetails}
        style={[styles.actionBtn, styles.secondaryBtn]}
        labelStyle={styles.buttonLabel}
        icon="eye"
      >
        Ver Detalles
      </Button>
    );
  };

  const renderAdvisorExtras = () => {
    if (!isAdvisor) return null;
    return (
      <>
        <Button
          mode="contained"
          onPress={onEdit}
          style={[styles.actionBtn, styles.editBtn]}
          labelStyle={styles.buttonLabel}
          icon="pencil"
        >
          Editar
        </Button>
        <Button
          mode="outlined"
          onPress={onDelete}
          style={[styles.actionBtn, styles.deleteBtn]}
          labelStyle={[styles.buttonLabel, { color: '#FF4D4F' }]}
          icon="trash-can-outline"
        >
          Eliminar
        </Button>
      </>
    );
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      {plan?.imagen_url ? (
        <Image source={{ uri: plan.imagen_url }} style={styles.image} contentFit="cover" />
      ) : (
        <View style={styles.fallbackImage} />
      )}

      <Card.Content style={styles.content}>
        <Text variant="titleMedium" style={styles.title}>
          {plan?.nombre_comercial}
        </Text>
        <View style={styles.row}>
          <Text variant="bodyLarge" style={styles.price}>
            ${plan?.precio}
          </Text>
          <Text variant="bodySmall" style={styles.segment}>
            {plan?.segmento}
          </Text>
        </View>
        <Text variant="bodySmall" numberOfLines={2} style={styles.desc}>
          {plan?.descripcion_corta ?? ''}
        </Text>
      </Card.Content>

      {(primaryLabel || secondaryLabel || onBack || isUser || isAdvisor) && (
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
            {/* Secondary (Ver Detalles o custom) */}
            {renderSecondary()}

            {/* User primary (Chat) or legacy primary */}
            {renderPrimary()}

            {/* Advisor extras: Editar / Eliminar */}
            {renderAdvisorExtras()}
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
  editBtn: {
    marginLeft: 8,
    backgroundColor: '#48C9B0',
  },
  deleteBtn: {
    marginLeft: 8,
    borderColor: '#FF4D4F',
    borderWidth: 1,
  },
  buttonLabel: {
    fontSize: 14,
  },
});
