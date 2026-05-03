/**
 * @file src/navigation/RootNavigator.tsx
 * @description Navegador raiz do noMEI (NativeStack).
 *
 * Estrutura:
 *   RootStack
 *   ├── Onboarding        ← Tela inicial (sem tabs, sem header nativo)
 *   ├── ProfileSetup      ← Configuração de perfil Gov.br (sem tabs)
 *   ├── MainTabs          ← TabNavigator (5 abas)
 *   └── DetalhesLicitacao ← Detalhe de edital (slide_from_right, sem tabs)
 *
 * Para testar sem passar pelo Onboarding, altere initialRouteName para 'MainTabs'.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { ConfiguracaoPerfilScreen } from '../screens/ConfiguracaoPerfilScreen';
import { DetalhesLicitacaoScreen } from '../screens/DetalhesLicitacaoScreen';
import { TabNavigator } from './TabNavigator';
import type { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{ headerShown: false }}
    >
      {/* ── Auth Flow ─────────────────────────────────────────── */}
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="ProfileSetup"
        component={ConfiguracaoPerfilScreen}
        options={{ animation: 'slide_from_right' }}
      />

      {/* ── Main App ──────────────────────────────────────────── */}
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ animation: 'fade' }}
      />

      {/* ── Deep Screens (sem tab bar) ────────────────────────── */}
      <Stack.Screen
        name="DetalhesLicitacao"
        component={DetalhesLicitacaoScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}
