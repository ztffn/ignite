import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"

import type { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { DemoCommunityScreen } from "../screens/DemoCommunityScreen"
import { DemoDebugScreen } from "../screens/DemoDebugScreen"
import { DemoPodcastListScreen } from "../screens/DemoPodcastListScreen"
import { DemoShowroomScreen } from "../screens/DemoShowroomScreen/DemoShowroomScreen"
import { useAppTheme } from "../theme/context"

export type DemoTabParamList = {
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  DemoCommunity: undefined
  DemoPodcastList: undefined
  DemoDebug: undefined
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
        component={DemoShowroomScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <HomeIcon color={focused ? colors.tint : colors.tintInactive} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="DemoCommunity"
        component={DemoCommunityScreen}
        options={{
          tabBarLabel: "Itinerary",
          tabBarIcon: ({ focused }) => (
            <CalendarIcon color={focused ? colors.tint : colors.tintInactive} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="DemoPodcastList"
        component={DemoPodcastListScreen}
        options={{
          tabBarAccessibilityLabel: "Map",
          tabBarLabel: "Map",
          tabBarIcon: ({ focused }) => (
            <MapPinIcon color={focused ? colors.tint : colors.tintInactive} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="DemoDebug"
        component={DemoDebugScreen}
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ focused }) => (
            <CompassIcon color={focused ? colors.tint : colors.tintInactive} size={20} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

// Custom icon components to match the design
interface IconProps {
  color: string
  size: number
}

const HomeIcon: React.FC<IconProps> = ({ color, size }) => (
  <svg width={size} height={size} fill={color} viewBox="0 0 24 24">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
)

const CalendarIcon: React.FC<IconProps> = ({ color, size }) => (
  <svg width={size} height={size} fill={color} viewBox="0 0 24 24">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
  </svg>
)

const MapPinIcon: React.FC<IconProps> = ({ color, size }) => (
  <svg width={size} height={size} fill={color} viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)

const CompassIcon: React.FC<IconProps> = ({ color, size }) => (
  <svg width={size} height={size} fill={color} viewBox="0 0 24 24">
    <path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z" />
  </svg>
)
