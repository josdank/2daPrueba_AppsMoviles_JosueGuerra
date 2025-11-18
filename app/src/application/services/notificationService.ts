import { registerForPush } from '../../infrastructure/notifications/Notifications';

export async function initializeNotifications() {
  try {
    const token = await registerForPush();
    if (token) {
      console.log('Push notifications initialized successfully');
      return token;
    }
  } catch (e) {
    console.error('Error initializing notifications:', e);

    return null;
  }
}
