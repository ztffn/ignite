import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import { Icon } from "../components/Icon"
import {
  LandingScreen,
  TripsScreen,
  ItineraryScreen,
  MapScreen,
  DocumentVaultScreen,
} from "../screens/Hopla"

const Tab = createBottomTabNavigator()

export const HoplaNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
      }}
    >
      <Tab.Screen
        name="Landing"
        component={LandingScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon icon="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Trips"
        component={TripsScreen}
        options={{
          title: "Trips",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon icon="settings" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Itinerary"
        component={ItineraryScreen}
        options={{
          title: "Plan",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon icon="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: "Map",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon icon="mapPin" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentVaultScreen}
        options={{
          title: "Vault",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon icon="document" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
