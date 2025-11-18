// App.tsx
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { LogBox } from 'react-native';
import AppNavigator from './app/src/ui/navigation/AppNavigator';
import { theme } from './app/src/ui/theme';
import { initializeNotifications } from './app/src/application/services/notificationService';

// Suprimir warnings no críticos
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);

// Capturar errores globales
const errorHandler = (error: Error, isFatal: boolean) => {
  console.error('Global Error:', error);
  if (isFatal) {
    console.error('Fatal Error - App may crash:', error);
  }
};

// Ejecutar solamente si es una aplicación React Native
try {
  (global as any).ErrorUtils?.setGlobalHandler(errorHandler);
} catch (e) {
  // ErrorUtils podría no estar disponible en todos los ambientes
  console.warn('ErrorUtils no disponible:', e);
}

export default function App() {
  useEffect(() => {
    // Inicializar notificaciones con manejo de errores
    const initNotifications = async () => {
      try {
        await initializeNotifications();
      } catch (error) {
        console.warn('Error initializing notifications:', error);
        // No lanazar error - la app debe continuar sin notificaciones
      }
    };

    initNotifications();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
  );
}
