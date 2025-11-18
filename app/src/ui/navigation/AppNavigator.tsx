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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {role === 'guest' && (
          <>
            <Stack.Screen name="Catalog" component={Catalog}/>
            <Stack.Screen name="PlanDetail" component={PlanDetail}/>
            <Stack.Screen name="LoginRegister" component={LoginRegister}/>
          </>
        )}
        {role === 'usuario_registrado' && (
          <>
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="PlanDetail" component={PlanDetail}/>
            <Stack.Screen name="MyContracts" component={MyContracts}/>
            <Stack.Screen name="Chat" component={Chat}/>
            <Stack.Screen name="UserProfile" component={UserProfile}/>
            <Stack.Screen name="ResetPassword" component={ResetPassword}/>
          </>
        )}
        {role === 'asesor_comercial' && (
          <>
            <Stack.Screen name="Dashboard" component={Dashboard}/>
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
