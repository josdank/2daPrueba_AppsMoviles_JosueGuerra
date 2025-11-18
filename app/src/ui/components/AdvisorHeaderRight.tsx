// src/ui/components/AdvisorHeaderRight.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IconButton, Badge, Avatar } from 'react-native-paper';
import { useNavigation, useIsFocused, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ContractsRepository } from '../../infrastructure/supabase/repositories/ContractsRepository';

type AdvisorTabParamList = {
  Panel_de_Asesor: undefined;
  'Contrataciones Pendientes': undefined;
  Conversaciones: undefined;
  'Perfil asesor': undefined;
};

type RootStackParamList = {
  AdvisorTabs: undefined;
  UserTabs: undefined;
  Catalog: undefined;
  Detalle: { plan: any; mode: string };
  LoginRegister: undefined;
};

type AdvisorHeaderRightNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<AdvisorTabParamList, 'Panel_de_Asesor'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function AdvisorHeaderRight() {
  const navigation = useNavigation<AdvisorHeaderRightNavigationProp>();
  const isFocused = useIsFocused();
  const [pendingContractsCount, setPendingContractsCount] = useState(0);
  const [currentAssigned, setCurrentAssigned] = useState<any | null>(null);

  // Tab history refs (similar behavior to UserHeaderRight)
  const previousTabRef = useRef<string | null>(null);
  const currentTabRef = useRef<string | null>(null);
  const parentNavRef = useRef<any>(null);

  useEffect(() => {
    if (isFocused) {
      fetchPendingData();
    }
  }, [isFocused]);

  useEffect(() => {
    const parent = navigation.getParent?.();
    if (!parent) return;

    parentNavRef.current = parent;

    try {
      const state = parent.getState?.();
      const index = state?.index ?? -1;
      const routes = state?.routes ?? [];
      currentTabRef.current = routes?.[index]?.name ?? null;
    } catch {
      currentTabRef.current = null;
    }

    const onStateChange = () => {
      try {
        const state = parent.getState?.();
        const index = state?.index ?? -1;
        const routes = state?.routes ?? [];
        const newTab = routes?.[index]?.name ?? null;

        if (newTab && currentTabRef.current && newTab !== currentTabRef.current) {
          previousTabRef.current = currentTabRef.current;
        }
        currentTabRef.current = newTab;
      } catch {
        // ignore
      }
    };

    const unsub = parent.addListener?.('state', onStateChange) ?? null;
    onStateChange();

    return () => {
      if (unsub) unsub();
      parentNavRef.current = null;
    };
  }, [navigation]);

  async function fetchPendingData() {
    try {
      const pending = await ContractsRepository.listPending();
      setPendingContractsCount((pending ?? []).length);
      // opcional: calcular currentAssigned si tu data lo permite
      setCurrentAssigned(null);
    } catch (error) {
      console.error('Error fetching pending contracts for advisor header:', error);
    }
  }

  const handlePendingPress = () => {
    navigation.navigate('Contrataciones Pendientes');
  };

  const handleConversationsPress = () => {
    navigation.navigate('Conversaciones');
  };

  const handleGoToPreviousTab = () => {
    try {
      const prev = previousTabRef.current;
      if (prev) {
        navigation.navigate(prev as any);
        return;
      }

      if (navigation.canGoBack && navigation.canGoBack()) {
        navigation.goBack();
        return;
      }

      // fallback to AdvisorTabs root
      navigation.navigate('AdvisorTabs');
    } catch (err) {
      console.warn('Error navigating to previous tab (advisor):', err);
    }
  };

  const openProfile = () => {
    navigation.navigate('Perfil asesor');
  };

  return (
    <View style={{ flexDirection: 'row', marginRight: 10, alignItems: 'center' }}>
      {/* Back button */}
      <TouchableOpacity onPress={handleGoToPreviousTab} style={{ marginLeft: 6, marginRight: 10 }}>
        <IconButton icon="arrow-left" iconColor="#fff" size={22} />
      </TouchableOpacity>

      {/* Pending contracts (bell-like) */}
      <TouchableOpacity onPress={handlePendingPress} style={{ position: 'relative', marginRight: 12 }}>
        <IconButton icon="clipboard-list" iconColor="#fff" size={24} />
        {pendingContractsCount > 0 && (
          <Badge style={{ position: 'absolute', top: 6, right: 6, backgroundColor: '#FF4D4F' }}>
            {pendingContractsCount}
          </Badge>
        )}
      </TouchableOpacity>

      {/* Conversations */}
      <TouchableOpacity onPress={handleConversationsPress} style={{ position: 'relative', marginRight: 6 }}>
        <IconButton icon="chat" iconColor="#fff" size={24} />
        {/* badge optional: if you compute unread count, render here */}
      </TouchableOpacity>

  
    </View>
  );
}
