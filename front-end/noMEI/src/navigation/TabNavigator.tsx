/**
 * @file src/navigation/TabNavigator.tsx
 * @description Bottom Tab Navigator principal do noMEI (5 abas).
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomTabBar } from './CustomTabBar';
import {
  HomeScreen,
  DisputasScreen,
  DocumentosScreen,
  AlertasScreen,
  PerfilScreen,
} from '../screens';
import type { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function TabNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Disputas" component={DisputasScreen} />
      <Tab.Screen name="Documentos" component={DocumentosScreen} />
      <Tab.Screen name="Alertas" component={AlertasScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
