import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';

// Hooks e Telas
import { useCarregarFontes } from './src/theme/useCarregarFontes';
import HomeScreen from './src/screens/Home/HomeScreen'; 

// Cria o navegador de pilhas
const Stack = createNativeStackNavigator();

// Mantém a Splash Screen até as fontes carregarem
SplashScreen.preventAutoHideAsync();

export default function App() {
  const { fontesCarregadas } = useCarregarFontes();

  // Enquanto as fontes carregam, não renderiza nada (Splash Screen fica ativa)
  if (!fontesCarregadas) {
    return null;
  }

  return (
    <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator 
        id="root_stack"
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        
        <Stack.Screen name="Home" component={HomeScreen} />
      
        
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}