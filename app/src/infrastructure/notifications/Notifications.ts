// src/infrastructure/notifications/Notifications.ts
import * as Notifications from 'expo-notifications';
import { supabase } from '../supabase/client';
import { Platform } from 'react-native';

// Configurar el comportamiento por defecto de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPush() {
  try {
    // Solo para Android, configurar permisos
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const settings = await Notifications.getPermissionsAsync();
    let status = settings.status;

    if (status !== 'granted') {
      const req = await Notifications.requestPermissionsAsync();
      status = req.status;
    }

    if (status !== 'granted') {
      console.warn('No notification permissions granted');
      return null;
    }

    // Obtener el token de push
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    // Guardar el token en la base de datos del usuario
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          await supabase
            .from('perfiles')
            .update({ push_token: token })
            .eq('id', user.id);
        } catch (updateErr) {
          console.warn('Error updating push token:', updateErr);
        }
      }
    } catch (err) {
      console.warn('Error registering push token:', err);
    }

    return token;
  } catch (error) {
    console.error('Error in registerForPush:', error);
    return null;
  }
}
