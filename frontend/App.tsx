import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';

// Hooks e Telas
import { useCarregarFontes } from './src/theme/useCarregarFontes';
import { BottomNavbar } from './src/components/BottomNavbar';


// Option to hide the phone's native navigation bar
NavigationBar.setBehaviorAsync('overlay-swipe');
NavigationBar.setVisibilityAsync('hidden');

// Mantém a Splash Screen até as fontes carregarem
SplashScreen.preventAutoHideAsync();

export default function App() {
  const { fontesCarregadas } = useCarregarFontes();

  if (!fontesCarregadas) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}} edges={['top']}>
        <BottomNavbar></BottomNavbar>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
