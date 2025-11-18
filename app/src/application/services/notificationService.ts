// src/application/services/notificationService.ts
import { registerForPush } from '../../infrastructure/notifications/Notifications';

export async function initializeNotifications() {
  try {
    const token = await registerForPush();
    return token;
  } catch (e) {
    console.error('Error initializing notifications:', e);
    return null;
  }
}
