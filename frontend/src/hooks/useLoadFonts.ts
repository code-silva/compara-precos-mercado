import {
  Inter_400Regular,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

export function useLoadFonts() {
  const [fontsLoaded, error] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Bold": Inter_700Bold,
    "Inter-Black": Inter_900Black,
  });

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded || error) {
        // Hide the splash screen when fonts are loaded or if an error occurs
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded, error]);

  return { fontsLoaded, error };
}
