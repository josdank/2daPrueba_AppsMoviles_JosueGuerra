// App.tsx
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { LogBox } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppNavigator from './app/src/ui/navigation/AppNavigator';
import { theme } from './app/src/ui/theme';
import { initializeNotifications } from './app/src/application/services/notificationService';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);


const errorHandler = (error: Error, isFatal: boolean) => {
  console.error('Global Error:', error);
  if (isFatal) {
    console.error('Fatal Error - App may crash:', error);
  }
};

try {
  (global as any).ErrorUtils?.setGlobalHandler(errorHandler);
} catch (e) {

  console.warn('ErrorUtils no disponible:', e);
}

export default function App() {
  useEffect(() => {

    const initNotifications = async () => {
      try {
        await initializeNotifications();
      } catch (error) {
        console.warn('Error initializing notifications:', error);
        
      }
    };

    initNotifications();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <LinearGradient
        colors={['#0E0E12', '#16171D']}
        style={{ flex: 1 }}
      >
        <AppNavigator />
      </LinearGradient>
    </PaperProvider>
  );
}
