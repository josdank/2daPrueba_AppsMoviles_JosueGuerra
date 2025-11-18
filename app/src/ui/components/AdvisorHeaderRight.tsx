// src/ui/components/UserHeaderRight.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Menu, Avatar, Badge } from 'react-native-paper';

type Role = 'usuario_registrado' | 'asesor_comercial';

type Props = {
  role?: Role;
  navigation?: any;
  unreadChats?: number;
  onOpenProfile?: () => void;
  onOpenChat?: () => void;
  onOpenRequests?: () => void;
  onBack?: () => void; // opcional: handler personalizado para el botón atrás
  backFallbackRoute?: string; // opcional: ruta fallback si no hay stack para goBack
};

export default function UserHeaderRight({
  role = 'usuario_registrado',
  navigation,
  unreadChats = 0,
  onOpenProfile,
  onOpenChat,
  onOpenRequests,
  onBack,
  backFallbackRoute,
}: Props) {
  const [menuVisible, setMenuVisible] = useState(false);

  const defaultFallback = role === 'asesor_comercial' ? 'AdvisorTabs' : 'UserTabs';
  const fallbackRoute = backFallbackRoute ?? defaultFallback;

  const handleBack = () => {
    // si consume un handler personalizado, ejecutarlo
    if (typeof onBack === 'function') {
      return onBack();
    }

    try {
      if (navigation?.canGoBack && navigation.canGoBack()) {
        navigation.goBack();
      } else if (navigation?.navigate) {
        navigation.navigate(fallbackRoute);
      }
    } catch {
      try { navigation?.navigate?.(fallbackRoute); } catch (_) { /* ignore */ }
    }
  };

  const openProfile = () => {
    setMenuVisible(false);
    if (onOpenProfile) return onOpenProfile();
    navigation?.navigate(role === 'asesor_comercial' ? 'Perfil asesor' : 'UserProfile');
  };

  const openChat = () => {
    setMenuVisible(false);
    if (onOpenChat) return onOpenChat();
    // si tu Chat está en rutas anidadas, invoca el parent navigator si es necesario desde el caller
    navigation?.navigate(role === 'asesor_comercial' ? 'Conversasiones' : 'Chat');
  };

  const openRequests = () => {
    setMenuVisible(false);
    if (onOpenRequests) return onOpenRequests();
    navigation?.navigate('Contrataciones Pendientes');
  };

  return (
    <View style={styles.row}>
      {/* Botón de regreso */}
      <IconButton
        icon="arrow-left"
        size={22}
        onPress={handleBack}
        accessibilityLabel="Regresar"
      />

      {/* Icono Chat con badge */}
      <View>
        <IconButton
          icon="chat"
          size={22}
          onPress={openChat}
          accessibilityLabel="Abrir chats"
        />
        {unreadChats > 0 && <Badge style={styles.badge}>{unreadChats}</Badge>}
      </View>

      {/* Si es asesor, botón extra para Solicitudes */}
      {role === 'asesor_comercial' && (
        <IconButton
          icon="file-document-outline"
          size={22}
          onPress={openRequests}
          accessibilityLabel="Ver solicitudes"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  avatar: { marginHorizontal: 4, backgroundColor: '#ddd' },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#d32f2f',
    color: '#fff',
  },
});
