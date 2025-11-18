// src/ui/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthRole } from './guards';
import { Splash, Catalog, PlanDetail, LoginRegister } from '../screens/guest';
import { Home, MyContracts, Chat, ResetPassword } from '../screens/user';
import UserProfile from '../screens/user/Profile';
import { Dashboard, PlanForm, PendingContracts, Conversations, AdvisorProfile } from '../screens/advisor';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { role, loading } = useAuthRole();
  if (loading) return <Splash />;
  
  return (
    <NavigationContainer
      onReady={() => {
        // Dar tiempo para que la navegación se estabilice
      }}
    >
      {/* Activamos headerShown:true para que aparezca el botón de retroceso */}
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {role === 'guest' && (
          <>
            <Stack.Screen name="Catalog" component={Catalog}/>
            <Stack.Screen name="Detalle" component={PlanDetail}/>
            <Stack.Screen name="LoginRegister" component={LoginRegister}/>
          </>
        )}
        {role === 'usuario_registrado' && (
          <>
            <Stack.Screen 
              name="Home" 
              component={Home}
              options={{ animation: 'none' }}
            />
            <Stack.Screen name="Detallw" component={PlanDetail}/>
            <Stack.Screen name="MyContracts" component={MyContracts}/>
            <Stack.Screen name="Chat" component={Chat}/>
            <Stack.Screen name="UserProfile" component={UserProfile}/>
            <Stack.Screen name="ResetPassword" component={ResetPassword}/>
          </>
        )}
        {role === 'asesor_comercial' && (
          <>
            <Stack.Screen 
              name="Dashboard" 
              component={Dashboard}
              options={{ animation: 'none' }}
            />
            <Stack.Screen name="PlanForm" component={PlanForm}/>
            <Stack.Screen name="PendingContracts" component={PendingContracts}/>
            <Stack.Screen name="Conversations" component={Conversations}/>
            <Stack.Screen name="AdvisorProfile" component={AdvisorProfile}/>
            <Stack.Screen name="ResetPassword" component={ResetPassword}/>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
