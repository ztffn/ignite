import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LandingScreen, TripsScreen, ItineraryScreen, TaskPlannerItineraryScreen, MapScreen, DocumentVaultScreen } from '../screens/Hopla';

const Tab = createBottomTabNavigator();

export const HoplaNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen 
        name="Landing" 
        component={LandingScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Trips" 
        component={TripsScreen}
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>✈️</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Itinerary" 
        component={ItineraryScreen}
        options={{
          title: 'Plan',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>📅</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={TaskPlannerItineraryScreen}
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🗺️</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Documents" 
        component={DocumentVaultScreen}
        options={{
          title: 'Vault',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>📁</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
