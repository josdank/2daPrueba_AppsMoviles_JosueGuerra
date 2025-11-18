
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
  onOpenRequests?: () => void; // para asesor: solicitudes/contrataciones pendientes
};

export default function UserHeaderRight({
  role = 'usuario_registrado',
  navigation,
  unreadChats = 0,
  onOpenProfile,
  onOpenChat,
  onOpenRequests,
}: Props) {
  const [menuVisible, setMenuVisible] = useState(false);

  const openProfile = () => {
    setMenuVisible(false);
    if (onOpenProfile) return onOpenProfile();
    navigation?.navigate(role === 'asesor_comercial' ? 'Perfil asesor' : 'UserProfile');
  };

  const openChat = () => {
    setMenuVisible(false);
    if (onOpenChat) return onOpenChat();
    navigation?.navigate(role === 'asesor_comercial' ? 'Conversasiones' : 'Chat');
  };

  const openRequests = () => {
    setMenuVisible(false);
    if (onOpenRequests) return onOpenRequests();
    navigation?.navigate('Contrataciones Pendientes');
  };

  return (
    <View style={styles.row}>
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

      {/* Avatar + Menu */}
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Avatar.Image
            size={36}
            source={{ uri: 'https://www.gravatar.com/avatar/?d=mp' }}
            style={styles.avatar}
            onTouchEnd={() => setMenuVisible(true)}
            accessibilityLabel="Abrir menú de usuario"
          />
        }
      >
        <Menu.Item onPress={openProfile} title={role === 'asesor_comercial' ? 'Perfil Asesor' : 'Mi Perfil'} />
        <Menu.Item onPress={openChat} title="Chats" />
        {role === 'asesor_comercial' && <Menu.Item onPress={openRequests} title="Solicitudes" />}
        <Menu.Item onPress={() => { setMenuVisible(false); navigation?.navigate('Settings'); }} title="Ajustes" />
      </Menu>
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
