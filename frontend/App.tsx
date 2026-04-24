import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomNavbar } from './src/components/BottomNavbar';
import * as SplashScreen from 'expo-splash-screen';

// Hooks e Telas
import { useCarregarFontes } from './src/theme/useCarregarFontes';
import { StoreProductsScreen } from './src/screens/StoreProductsScreen'; // Importe a nova tela
// Se você decidir manter o nome original da tela de busca:
// import { SearchResults } from './src/screens/SearchResults';

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { fontesCarregadas } = useCarregarFontes();

  if (!fontesCarregadas) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer onReady={() => SplashScreen.hideAsync()}>
        <Stack.Navigator
          id="root_stack"
          initialRouteName="MainTabs" 
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right', // Slide costuma ser melhor para telas de "detalhe"
          }}
        >
          {/* 1. As Abas (Home, Mercados, Lista) */}
          <Stack.Screen name="MainTabs" component={BottomNavbar} />

  
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}