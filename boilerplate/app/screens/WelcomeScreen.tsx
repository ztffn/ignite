import { FC } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle, ScrollView } from "react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TripCard } from "@/components/TripCard"
import { useAuth } from "@/context/AuthContext"
import { isRTL } from "@/i18n"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import type { ThemedStyle } from "@/theme/types"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import { useHeader } from "@/utils/useHeader"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { useTripStore } from "@/store"

const welcomeLogo = require("@assets/images/logo.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = function WelcomeScreen(props) {
  const { themed, theme } = useAppTheme()
  const { navigation } = props
  const { logout } = useAuth()
  const $topContainerInsets = useSafeAreaInsetsStyle(["top"])
  const { selectTrip } = useTripStore()

  // Mock trip data for demonstration
  const mockTrips = [
    {
      id: '1',
      title: 'Paris',
      subtitle: 'City of love',
      imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop',
    },
    {
      id: '2',
      title: 'Tokyo',
      subtitle: 'Where tradition meets future',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
    },
    {
      id: '3',
      title: 'New York',
      subtitle: 'The city that never sleeps',
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
    },
    {
      id: '4',
      title: 'Barcelona',
      subtitle: 'Art, architecture & Mediterranean charm',
      imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop',
    },
    {
      id: '5',
      title: 'Bali',
      subtitle: 'Island paradise & spiritual retreat',
      imageUrl: 'https://images.unsplash.com/photo-1537953773345-d172ccf13b24?w=800&h=600&fit=crop',
    },
  ]

  function goNext() {
    navigation.navigate("Demo", { screen: "DemoShowroom", params: {} })
  }

  const handleTripPress = (tripId: string) => {
    console.log('Trip selected:', tripId)
    
    // Find the selected trip from mock data
    const selectedTrip = mockTrips.find(trip => trip.id === tripId)
    if (selectedTrip) {
      // Convert mock trip to proper Trip format and select it
      const tripData = {
        id: selectedTrip.id,
        title: selectedTrip.title,
        subtitle: selectedTrip.subtitle,
        startDate: '2024-01-15',
        endDate: '2024-01-22',
        currentDay: 3,
        currentCityId: 'paris',
        cities: [
          {
            id: 'paris',
            name: 'Paris',
            startDay: 1,
            endDay: 7,
            country: 'France',
            timezone: 'Europe/Paris'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Select the trip in the store
      selectTrip(tripData)
    }
    
    // Navigate to the trip home page (DemoShowroomScreen)
    navigation.navigate("Demo", { screen: "DemoShowroom", params: {} })
  }

  useHeader(
    {
      rightTx: "common:logOut",
      onRightPress: logout,
    },
    [logout],
  )

  return (
    <Screen preset="scroll" contentContainerStyle={$styles.flex1}>
      <View style={themed([$topContainer, $topContainerInsets])}>
        <Image style={themed($welcomeLogo)} source={welcomeLogo} resizeMode="contain" />
        <Text
          testID="welcome-heading"
          style={themed($welcomeHeading)}
          tx="welcomeScreen:readyForLaunch"
          preset="heading"
        />
        <Text tx="welcomeScreen:exciting" preset="subheading" />
      </View>

      <View style={themed($bottomContainer)}>
        <Text style={themed($sectionTitle)}>Choose Your Adventure</Text>
        <Text style={themed($sectionSubtitle)}>
          Select a destination to start planning your trip
        </Text>
        
        {mockTrips.map((trip) => (
          <TripCard
            key={trip.id}
            title={trip.title}
            subtitle={trip.subtitle}
            imageUrl={trip.imageUrl}
            onPress={() => handleTripPress(trip.id)}
          />
        ))}

        <Button
          testID="next-screen-button"
          preset="reversed"
          tx="welcomeScreen:letsGo"
          onPress={goNext}
          style={{ marginTop: 20 }}
        />
      </View>
    </Screen>
  )
}

const $topContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "30%",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
  alignItems: "center",
})

const $bottomContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "70%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg,
})

const $welcomeLogo: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  height: 88,
  width: "100%",
  marginBottom: spacing.lg,
})

const $welcomeHeading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
  textAlign: "center",
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: 24,
  fontWeight: "bold",
  color: colors.palette.neutral900,
  marginBottom: spacing.xs,
  textAlign: "center",
})

const $sectionSubtitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: 16,
  color: colors.palette.neutral600,
  marginBottom: spacing.lg,
  textAlign: "center",
})
