import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomNavbar } from './src/components/BottomNavbar'; // Importação já presente
import * as SplashScreen from 'expo-splash-screen';

// Hooks e Telas
import { useCarregarFontes } from './src/theme/useCarregarFontes';
// Removida a importação direta da HomeScreen aqui, pois ela agora é gerenciada pelo BottomNavbar
import { SearchResults } from './src/screens/SearchResults';

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { fontesCarregadas } = useCarregarFontes();

  if (!fontesCarregadas) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          id="root_stack"
          // 1. Alterado para iniciar pelas abas (MainTabs) em vez de apenas uma tela
          initialRouteName="MainTabs" 
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
        >
          {/* 2. Esta tela agora carrega o conjunto de 3 abas (Início, Mercados, Lista) */}
          <Stack.Screen name="MainTabs" component={BottomNavbar} />

          
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}