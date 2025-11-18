// src/application/services/notificationService.ts
import { registerForPush } from '../../infrastructure/notifications/Notifications';

export async function initializeNotifications() {
  try {
    const token = await registerForPush();
    if (token) {
      console.log('Push notifications initialized successfully');
      return token;
    }
    console.warn('Push notifications not available or denied');
    return null;
  } catch (e) {
    console.error('Error initializing notifications:', e);
    // No lanzar el error para que la app continue funcionando
    return null;
  }
}
