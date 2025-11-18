// src/ui/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthRole } from './guards';
import { Splash, Catalog, PlanDetail, LoginRegister } from '../screens/guest';
import { Home, MyContracts, Chat, ResetPassword } from '../screens/user';
import UserProfile from '../screens/user/Profile';
import { Dashboard, PlanForm, PendingContracts, Conversations, AdvisorProfile } from '../screens/advisor';
import BottomBar from '../components/BottomBar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import UserHeaderRight from '../components/UserHeaderRight';
import AdvisorHeaderRight from '../components/AdvisorHeaderRight';

/* Tabs (sin cambios en contenido) */
function UserTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <BottomBar {...props} role="usuario_registrado" />}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#000000ff' },
        headerTintColor: '#fff',
        headerRight: () => <UserHeaderRight />,
      }}
    >
      <Tab.Screen name="Catálogo" component={Home} />
      <Tab.Screen name="Mis_Contrataciones" component={MyContracts} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="UserProfile" component={UserProfile} />
    </Tab.Navigator>
  );
}

function AdvisorTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <BottomBar {...props} role="asesor_comercial" />}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#0E0E12' },
        headerTintColor: '#fff',
        headerRight: () => <AdvisorHeaderRight />,
      }}
    >
      <Tab.Screen name="Panel de Asesor" component={Dashboard} />
      <Tab.Screen name="Contrataciones Pendientes" component={PendingContracts} />
      <Tab.Screen name="Conversasiones" component={Conversations} />
      <Tab.Screen name="Perfil asesor" component={AdvisorProfile} />
    </Tab.Navigator>
  );
}

/* Stacks por role */
function GuestStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }} initialRouteName="Catalog">
      <Stack.Screen name="Catalog" component={Catalog} options={{ title: 'Catálogo' }} />
      <Stack.Screen name="LoginRegister" component={LoginRegister} options={{ title: 'Ingresar' }} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ title: 'Restablecer contraseña' }} />
      <Stack.Screen name="Detalle" component={PlanDetail} options={{ title: 'Detalle' }} />
    </Stack.Navigator>
  );
}

function UserStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }} initialRouteName="UserTabs">
      <Stack.Screen name="UserTabs" component={UserTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Detalle" component={PlanDetail} options={{ title: 'Detalle' }} />
      <Stack.Screen name="Catalog" component={Catalog} options={{ title: 'Catálogo' }} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ title: 'Restablecer contraseña' }} />
    </Stack.Navigator>
  );
}

function AdvisorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }} initialRouteName="AdvisorTabs">
      <Stack.Screen name="AdvisorTabs" component={AdvisorTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="PlanForm" component={PlanForm} options={{ title: 'Crear nuevo Plan' }} />
      <Stack.Screen name="Detalle" component={PlanDetail} options={{ title: 'Detalle' }} />
      <Stack.Screen name="Catalog" component={Catalog} options={{ title: 'Catálogo' }} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ title: 'Restablecer contraseña' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { role, loading } = useAuthRole();
  if (loading) return <Splash />;

  // Forzar remount del NavigationContainer cuando role cambie para limpiar la pila previa
  return (
    <NavigationContainer key={role}>
      {role === 'guest' && <GuestStack />}
      {role === 'usuario_registrado' && <UserStack />}
      {role === 'asesor_comercial' && <AdvisorStack />}
    </NavigationContainer>
  );
}
