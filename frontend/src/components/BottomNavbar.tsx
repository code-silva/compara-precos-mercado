import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { HomeScreen } from "../screens/HomeScreen";
import { SupermarketsScreen } from "../screens/SupermarketsScreen";
import { MyListScreen } from "../screens/MyListScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SearchResults } from "../screens/SearchResultsScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StoreProductsScreen } from "../screens/StoreProductsScreen";

const routeSettings: any = {
  Home: {
    label: "INÍCIO",
    icon: "home",
    background: "rgba(16, 185, 129, 0.25)",
    color: "rgb(46, 177, 185)",
  },
  Supermarkets: {
    label: "MERCADOS",
    icon: "shopping-bag",
    background: "rgba(46, 177, 185, 0.25)",
    color: "rgb(46, 177, 185)",
  },
  MyList: {
    label: "MINHA LISTA",
    icon: "list",
    background: "rgba(46, 177, 185, 0.25)",
    color: "rgb(46, 177, 185)",
  },
};

const inactiveColor = "#44475C";
const Tab = createBottomTabNavigator();

function CustomTabButton(props: any) {
  const { route, children, onPress, isFocused } = props;
  const settings = routeSettings[route.name];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabButtonContainer}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.pill,
          isFocused && { backgroundColor: settings?.background },
        ]}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="SearchResults" component={SearchResults} />
      <HomeStack.Screen name="StoreProducts" component={StoreProductsScreen} />
    </HomeStack.Navigator>
  );
}

const SupermarketStack = createNativeStackNavigator();

function SupermarketStackScreen() {
  return (
    <SupermarketStack.Navigator screenOptions={{ headerShown: false }}>
      <SupermarketStack.Screen
        name="SupermarketsList"
        component={SupermarketsScreen}
      />
      <SupermarketStack.Screen
        name="StoreProducts"
        component={StoreProductsScreen}
      />
    </SupermarketStack.Navigator>
  );
}

export function BottomNavbar() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      id="bottom_tabs"
      screenOptions={({ route, navigation }) => {
        const state = navigation.getState();
        const isFocused = state?.routes[state.index]?.name === route.name;

        return {
          headerShown: false,
          tabBarInactiveTintColor: inactiveColor,
          tabBarActiveTintColor: routeSettings[route.name]?.color,

          tabBarStyle: {
            ...styles.tabBar,
            height: 65 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          },

          tabBarButton: (props) => (
            <CustomTabButton {...props} route={route} isFocused={isFocused} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
        };
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: "INÍCIO",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={25} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Supermarkets"
        component={SupermarketStackScreen}
        options={{
          tabBarLabel: "MERCADOS",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="storefront-outline"
              size={25}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="MyList"
        component={MyListScreen}
        options={{
          tabBarLabel: "MINHA LISTA",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="checklist" size={25} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    backgroundColor: "#FFF",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  tabButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  pill: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 85,
    height: 50,
  },
});
