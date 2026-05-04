/**
 * @file App.tsx
 * @description Componente raiz do app noMEI.
 *
 * Responsabilidades:
 *  1. GestureHandlerRootView  — habilita gestos do React Navigation
 *  2. SafeAreaProvider        — fornece insets de safe area para Header e TabBar
 *  3. NavigationContainer     — provedor de contexto do React Navigation
 *  4. RootNavigator           — define o stack de rotas da aplicação
 *  5. StatusBar               — configura a barra de status com a identidade visual noMEI
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { RootNavigator } from './src/navigation';

export default function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <StatusBar style="light" backgroundColor="#1A2B5E" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
