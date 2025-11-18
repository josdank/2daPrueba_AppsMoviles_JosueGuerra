// src/ui/components/BottomBar.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  navigation: any;
  role?: 'usuario_registrado' | 'asesor_comercial' | null;
};

export default function BottomBar({ navigation, role }: Props) {
  const insets = useSafeAreaInsets();

  const goTo = (screen: string, params?: any) => {
    if (!navigation) return;
    navigation.navigate(screen, params);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Para usuario_registrado: Catálogo | Chat(reemplazado) | UserProfile
          Para asesor_comercial: Panel de Asesor | Contrataciones Pendientes | Conversasiones | Perfil asesor */}

      <TouchableOpacity
        style={styles.item}
        onPress={() => goTo(role === 'asesor_comercial' ? 'Panel de Asesor' : 'Catálogo')}
        accessibilityRole="button"
        accessibilityLabel={role === 'asesor_comercial' ? 'Ir al panel de asesor' : 'Ir al catálogo'}
      >
        <IconButton icon="package-variant" size={22} />
        <Text style={styles.label}>Planes</Text>
      </TouchableOpacity>

      {role === 'asesor_comercial' && (
        <TouchableOpacity
          style={styles.item}
          onPress={() => goTo('Contrataciones Pendientes')}
          accessibilityRole="button"
          accessibilityLabel="Ver contrataciones pendientes"
        >
          <IconButton icon="file-document-outline" size={22} />
          <Text style={styles.label}>Solicitudes</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          
          try {
            navigation.navigate('AdvisorTabs' as any, { screen: 'Panel de Asesor' });
            return;
          } catch (_) {
          }


          try {
            navigation.navigate('Panel de Asesor' as any);
            return;
          } catch (err) {

          }

          try {
            navigation.navigate('Dashboard' as any);
            return;
          } catch (err) {
            console.error('No se pudo navegar al Panel de Asesor por ninguna ruta conocida', err);
          }
        }}
        accessibilityRole="button"
        accessibilityLabel={role === 'asesor_comercial' ? 'Ir al panel de asesor' : 'Ir al Dashboard'}
      >
        <IconButton icon="plus" size={26} />
        <Text style={styles.label}>Más</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.item} onPress={() => goTo(role === 'asesor_comercial' ? 'Perfil asesor' : 'UserProfile')} 
      accessibilityRole="button" 
      accessibilityLabel={role === 'asesor_comercial' ? 'Ir al perfil de asesor' : 'Ir al perfil de usuario'} > 
      <IconButton icon="account-circle" size={22} /> 
      <Text style={styles.label}>Perfil</Text> </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    fontSize: 11,
    marginTop: -6,
    color: '#333'
  }
});
