import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomNavbar } from "./src/components/BottomNavbar";
import * as SplashScreen from "expo-splash-screen";

// Hooks and Screens
import { useLoadFonts } from "./src/hooks/useLoadFonts";

// Prevent the splash screen from hiding automatically while fonts load
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const { fontsLoaded } = useLoadFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer onReady={() => SplashScreen.hideAsync()}>
        <Stack.Navigator
          id="rootStack"
          initialRouteName="MainTabs"
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="MainTabs" component={BottomNavbar} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
