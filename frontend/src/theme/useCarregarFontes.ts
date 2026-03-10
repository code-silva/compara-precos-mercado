// src/hooks/useCarregarFontes.ts
import { 
  useFonts, 
  Inter_400Regular, 
  Inter_700Bold, 
  Inter_900Black 
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

export function useCarregarFontes() {
  const [fontesCarregadas, erro] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Bold': Inter_700Bold,
    'Inter-Black': Inter_900Black,
  });

  useEffect(() => {
    async function preparar() {
      if (fontesCarregadas || erro) {
        // Esconde a splash screen quando as fontes carregarem ou der erro
        await SplashScreen.hideAsync();
      }
    }
    preparar();
  }, [fontesCarregadas, erro]);

  return { fontesCarregadas, erro };
}