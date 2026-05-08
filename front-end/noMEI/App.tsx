
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { RootNavigator } from './src/navigation';
import { ProfileProvider } from './src/context/ProfileContext';

export default function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ProfileProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <StatusBar style="light" backgroundColor="#1A2B5E" />
        </ProfileProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
