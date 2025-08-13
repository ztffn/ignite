import React, { useCallback, useEffect, useState } from "react"
import { View, Text, TouchableOpacity, Pressable } from "react-native"
import ReorderableList, {
  ReorderableListReorderEvent,
  reorderItems,
  useReorderableDrag,
} from "react-native-reorderable-list"

import { useSafeAreaInsetsStyle } from "../../utils/useSafeAreaInsetsStyle"
import { useAppTheme } from "../../theme/context"
import { useTripStore } from "../../store/RootStore"

interface Activity {
  id: string
  time: string
  title: string
  type: string
  location?: string
  tags?: string[]
  emoji: string
  description?: string
  rating?: number
  price?: string
}

interface TravelRoute {
  id: string
  fromActivityId: string
  toActivityId: string
  defaultMode: "walk" | "metro" | "bus" | "car"
  totalTime: string
  totalDistance: string
  totalCost?: string
  steps: any[]
  offline?: boolean
}

interface Day {
  id: string
  date: string
  city: string
  activities: Activity[]
  routes: TravelRoute[]
}

// Mock data for testing
const mockItinerary: Day[] = [
  {
    id: "1",
    date: "2024-12-09",
    city: "Amsterdam",
    activities: [
      {
        id: "1",
        time: "09:30",
        title: "Hotel Check-in",
        type: "accommodation",
        location: "Lloyd Hotel & Cultural Embassy",
        emoji: "🏨",
      },
      {
        id: "2",
        time: "10:30",
        title: "Anne Frank House",
        type: "culture",
        location: "Prinsengracht 263-267",
        emoji: "🏛️",
      },
      {
        id: "3",
        time: "12:00",
        title: "Lunch at Foodhallen",
        type: "food",
        location: "Bellamyplein 51",
        emoji: "🍽️",
      },
      {
        id: "4",
        time: "14:00",
        title: "Van Gogh Museum",
        type: "culture",
        location: "Museumplein 6",
        emoji: "🎨",
      },
      {
        id: "5",
        time: "16:00",
        title: "Canal Cruise",
        type: "activity",
        location: "Various departure points",
        emoji: "🚢",
      },
    ],
    routes: [],
  },
]

// Draggable item component
const DraggableItem: React.FC<{ item: Activity; colors: any; spacing: any }> = ({ item, colors, spacing }) => {
  const drag = useReorderableDrag()

  return (
    <Pressable
      style={{
        backgroundColor: colors.background,
        marginHorizontal: spacing.md,
        marginBottom: spacing.sm,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
        minHeight: 80,
      }}
      onLongPress={drag}
    >
      <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text }}>
        {item.time} - {item.title}
      </Text>
      {item.location && (
        <Text style={{ fontSize: 14, color: colors.textDim, marginTop: 4 }}>
          {item.location}
        </Text>
      )}
      <Text style={{ fontSize: 20, marginTop: 8 }}>{item.emoji}</Text>
    </Pressable>
  )
}

export const ItineraryScreen = ({ _navigation }: any) => {
  const { theme } = useAppTheme()
  const { colors, spacing } = theme
  const topContainerInsets = useSafeAreaInsetsStyle(["top"])
  const [selectedDay, setSelectedDay] = useState("1")
  const [itineraryData, setItineraryData] = useState<Day[]>(mockItinerary)

  // Ensure selectedDay always matches available data
  useEffect(() => {
    if (itineraryData.length > 0) {
      setSelectedDay(itineraryData[0].id)
      const first = itineraryData[0]
      console.log("[Itinerary] init selectedDay", first.id, "activities:", first.activities.length)
    }
  }, [itineraryData])

  const handleReorder = useCallback(({ from, to }: ReorderableListReorderEvent) => {
    console.log("[Itinerary] reorder", from, "->", to)
    
    setItineraryData((prevData) => {
      const newData = [...prevData]
      const currentDay = newData.find((d) => d.id === selectedDay)

      if (currentDay) {
        const newActivities = reorderItems(currentDay.activities, from, to)
        currentDay.activities = newActivities

        console.log(
          "[Itinerary] Reordered:",
          newActivities.map((a) => `${a.time} ${a.title}`),
        )
      }

      return newData
    })
  }, [selectedDay])

  const currentDay = itineraryData.find((d) => d.id === selectedDay)

  if (!currentDay) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No day selected</Text>
      </View>
    )
  }

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }, topContainerInsets]}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View>
          <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text }}>
            Tokyo
          </Text>
          <Text style={{ fontSize: 16, color: colors.textDim, marginTop: 4 }}>
            Day 1 - Amsterdam
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Date and Location */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
        }}
      >
        <View>
          <Text style={{ fontSize: 20, fontWeight: "600", color: colors.text }}>
            Monday <Text style={{ color: colors.textDim }}>Dec 9</Text>
          </Text>
          <Text style={{ color: colors.textDim, marginTop: 6 }}>{currentDay.city}</Text>
        </View>
        <TouchableOpacity>
          <Text style={{ color: colors.tint, fontSize: 16 }}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Reorderable List */}
      <View style={{ flex: 1 }}>
        <ReorderableList
          data={currentDay.activities}
          onReorder={handleReorder}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <DraggableItem item={item} colors={colors} spacing={spacing} />
          )}
        />
      </View>
    </View>
  )
}
