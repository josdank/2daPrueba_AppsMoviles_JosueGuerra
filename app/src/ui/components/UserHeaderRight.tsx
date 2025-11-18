import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IconButton, Badge } from 'react-native-paper';
import { useNavigation, useIsFocused, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ContractsRepository } from '../../infrastructure/supabase/repositories/ContractsRepository';
import { AuthRepository } from '../../infrastructure/supabase/repositories/AuthRepository';

type UserTabParamList = {
  Catálogo: undefined;
  MyContracts: { filter?: string; activePlanId?: string };
  Chat: undefined;
  UserProfile: undefined;
};

type RootStackParamList = {
  UserTabs: undefined;
  AdvisorTabs: undefined;
  Catalog: undefined;
  Detalle: { plan: any; mode: string };
  LoginRegister: undefined;
};

type UserHeaderRightNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<UserTabParamList, 'Catálogo'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function UserHeaderRight() {
  const navigation = useNavigation<UserHeaderRightNavigationProp>();
  const isFocused = useIsFocused();
  const [pendingContractsCount, setPendingContractsCount] = useState(0);
  const [activePlan, setActivePlan] = useState<any>(null);

  // Ref para historial simple de pestañas
  const previousTabRef = useRef<string | null>(null);
  const currentTabRef = useRef<string | null>(null);
  const parentNavRef = useRef<any>(null);

  useEffect(() => {
    if (isFocused) {
      fetchContractData();
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

  async function fetchContractData() {
    try {
      const contracts = await ContractsRepository.listMine();
      const pending = contracts.filter(c => c.estado === 'pendiente');
      const active = contracts.find(c => c.estado === 'aprobado');

      setPendingContractsCount(pending.length);
      setActivePlan(active);
    } catch (error) {
      console.error('Error fetching contract data:', error);
    }
  }

  const handleBellPress = () => {
    navigation.navigate('MyContracts', { filter: 'pending' });
  };

  const handleContractCounterPress = () => {
    if (activePlan) {
      navigation.navigate('MyContracts', { activePlanId: activePlan.id });
    } else {
      console.log('No active plan');
    }
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

      console.log('No previous tab recorded and cannot go back');
    } catch (err) {
      console.warn('Error navigating to previous tab:', err);
    }
  };

  return (
    <View style={{ flexDirection: 'row', marginRight: 10, alignItems: 'center' }}>
      {/* BOTÓN AL INICIO */}
      <TouchableOpacity onPress={handleGoToPreviousTab} style={{ marginLeft: 6, marginRight: 10 }}>
        <IconButton
          icon="arrow-left"
          iconColor="#fff"
          size={22}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleBellPress} style={{ position: 'relative', marginRight: 15 }}>
        <IconButton
          icon="bell"
          iconColor="#fff"
          size={24}
        />
        {pendingContractsCount > 0 && (
          <Badge style={{ position: 'absolute', top: 5, right: 5, backgroundColor: '#FF4D4F' }}>
            {pendingContractsCount}
          </Badge>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleContractCounterPress} style={{ position: 'relative' }}>
        <IconButton
          icon="file-document-multiple"
          iconColor="#fff"
          size={24}
        />
        {activePlan && (
          <Badge style={{ position: 'absolute', top: 5, right: -5, backgroundColor: '#2E86DE' }}>
            1
          </Badge>
        )}
      </TouchableOpacity>
    </View>
  );
}
