import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"

import type { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { Icon } from "../components/Icon"
import { DashboardScreen } from "../screens/Hopla/DashboardScreen"
import { DocumentVaultScreen } from "../screens/Hopla/DocumentVaultScreen"
import { ExploreScreen } from "../screens/Hopla/ExploreScreen"
import { ItineraryScreen } from "../screens/Hopla/ItineraryScreen"
import { MapScreen } from "../screens/Hopla/MapScreen"
import { useAppTheme } from "../theme/context"

export type DemoTabParamList = {
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  DemoCommunity: undefined
  DemoPodcastList: undefined
  DemoDebug: undefined
  DemoVault: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type DemoTabScreenProps<T extends keyof DemoTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DemoTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<DemoTabParamList>()

export function DemoNavigator() {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tintInactive,
      }}
    >
      <Tab.Screen
        name="DemoShowroom"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon icon="home" color={focused ? colors.tint : colors.tintInactive} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="DemoCommunity"
        component={ItineraryScreen}
        options={{
          tabBarLabel: "Itinerary",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon icon="calendar" color={focused ? colors.tint : colors.tintInactive} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="DemoPodcastList"
        component={MapScreen}
        options={{
          tabBarAccessibilityLabel: "Map",
          tabBarLabel: "Map",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon icon="mapPin" color={focused ? colors.tint : colors.tintInactive} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="DemoDebug"
        component={ExploreScreen}
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ focused }) => (
            <Icon icon="compass" color={focused ? colors.tint : colors.tintInactive} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="DemoVault"
        component={DocumentVaultScreen}
        options={{
          tabBarLabel: "Vault",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon icon="settings" color={focused ? colors.tint : colors.tintInactive} size={20} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
