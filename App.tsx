// App.tsx
import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './app/src/ui/navigation/AppNavigator';
import { theme } from './app/src/ui/theme';
import { initializeNotifications } from './app/src/application/services/notificationService';

export default function App() {
  useEffect(() => {
    initializeNotifications();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
  );
}
