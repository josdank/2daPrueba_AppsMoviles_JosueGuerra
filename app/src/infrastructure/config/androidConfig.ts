export const androidConfig = {
  minSdkVersion: 24,
  targetSdkVersion: 34,
  permissions: [
    'android.permission.POST_NOTIFICATIONS',
    'android.permission.ACCESS_FINE_LOCATION',
    'android.permission.INTERNET',
    'android.permission.READ_EXTERNAL_STORAGE',
    'android.permission.WRITE_EXTERNAL_STORAGE',
  ],
  notificationChannels: {
    default: {
      id: 'default',
      name: 'Default Notifications',
      importance: 4, 
      vibration: true,
      sound: true,
    },
    messages: {
      id: 'messages',
      name: 'Chat Messages',
      importance: 4,
      vibration: true,
      sound: true,
    },
  },
};
