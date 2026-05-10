import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomNavbar } from "./src/components/BottomNavbar";

// Hooks and Screens
import { useLoadFonts } from "./src/hooks/useLoadFonts";

// Prevent the splash screen from hiding automatically while fonts load
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const { fontsLoaded } = useLoadFonts();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [triedToGetLocation, setTriedToGetLocation] = useState(false);

  // Obtaining user's location
  useEffect(() => {
    async function getLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        setLocation(currentLocation);
      }

      setTriedToGetLocation(true);
    }

    getLocation();
  }, []);

  if (!fontsLoaded || !triedToGetLocation) {
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
          <Stack.Screen name="MainTabs">
            {() => <BottomNavbar location={location} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
