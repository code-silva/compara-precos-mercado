import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { HomeScreen } from '../screens/HomeScreen';
import { SuperMarketsScreen } from '../screens/SupermarketsScreen';
import { MyListScreen } from '../screens/MyListScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchResults } from '../screens/SearchResults'; 

const routeSettings: any = {
  Home: {
    label: 'INÍCIO',
    icon: 'home',
    bg: 'rgba(16, 185, 129, 0.25)',
    color: 'rgb(16, 185, 129)'
  },
  Supermarkets: {
    label: 'MERCADOS',
    icon: 'shopping-bag',
    bg: 'rgba(46, 177, 185, 0.25)',
    color: 'rgb(46, 177, 185)'
  },
  MyList: {
    label: 'MINHA LISTA',
    icon: 'list',
    bg: 'rgba(109, 45, 255, 0.25)',
    color: 'rgb(109, 45, 255)'
  },
};

const INACTIVE_COLOR = "#44475C";
const Tab = createBottomTabNavigator();

function CustomTabButton(props: any) {
  const { route, children, onPress, isFocused } = props;
  const settings = routeSettings[route.name];

  return (
    <TouchableOpacity onPress={onPress} style={styles.tabButtonContainer} activeOpacity={0.8}>
      <View style={[ styles.pill, isFocused && { backgroundColor: settings?.bg}]}>
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
    </HomeStack.Navigator>
  );
}

export function BottomNavbar() {
  return (
    // O NavigationContainer saiu daqui para não conflitar com o do App.tsx
    <Tab.Navigator
      id="bottom_tabs"
      screenOptions={({ route, navigation }) => {
        const state = navigation.getState();
        const isFocused = state?.routes[state.index]?.name === route.name;

        return {
          headerShown: false,
          tabBarInactiveTintColor: INACTIVE_COLOR,
          tabBarActiveTintColor: routeSettings[route.name]?.color,
          tabBarStyle: styles.tabBar,
          tabBarButton: (props) => (
            <CustomTabButton {...props} route={route} isFocused={isFocused} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          },
        };
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen} // Agora a Home é um stack para permitir navegação interna
        options={{
          tabBarLabel: "INÍCIO",
          tabBarIcon: ({ color }) => <Feather name="home" size={25} color={color} />
        }}
      />

      <Tab.Screen
        name="Supermarkets"
        component={SuperMarketsScreen}
        options={{
          tabBarLabel: "MERCADOS",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="storefront-outline" size={25} color={color} />
        }}
      />

      <Tab.Screen
        name="MyList"
        component={MyListScreen}
        options={{
          tabBarLabel: "MINHA LISTA",
          tabBarIcon: ({ color }) => <MaterialIcons name="checklist" size={25} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    borderTopWidth: 0,
    backgroundColor: '#FFF',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  tabButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
    height: 60,
  }
});