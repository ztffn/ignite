import React, { useState, useCallback, useEffect } from "react"
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { FlashList } from "@shopify/flash-list"

import { Card } from "../../components/Card"
import { DraggableActivityCard } from "../../components/DraggableActivityCard"
import { Icon } from "../../components/Icon"
import { Screen } from "../../components/Screen"
import { TravelRouteChunk } from "../../components/TravelRouteChunk"
import { useTripStore } from "../../store/RootStore"
import { useAppTheme } from "../../theme/context"
import { useSafeAreaInsetsStyle } from "../../utils/useSafeAreaInsetsStyle"

interface Activity {
  id: string
  time: string
  title: string
  type:
    | "restaurant"
    | "attraction"
    | "transport"
    | "hotel"
    | "note"
    | "shopping"
    | "wine"
    | "nature"
    | "entertainment"
    | "coffee"
    | "medical"
    | "culture"
    | "social"
    | "museum"
  location?: string
  tags?: string[]
  hasDocument?: boolean
  emoji: string
  description?: string
  rating?: number
  phone?: string
  website?: string
  price?: string
  notes?: string
  backgroundImage?: string
}

interface RouteStep {
  id: string
  mode: "walk" | "metro" | "bus" | "car"
  description: string
  duration: string
}

interface TravelRoute {
  id: string
  fromActivityId: string
  toActivityId: string
  defaultMode: "walk" | "metro" | "bus" | "car"
  totalTime: string
  totalDistance: string
  totalCost?: string
  steps: RouteStep[]
  offline?: boolean
}

interface Day {
  id: string
  date: string
  city: string
  activities: Activity[]
  routes: TravelRoute[]
}

// Mock data based on the React mockup
const mockItinerary: Day[] = [
  {
    id: "1",
    date: "Day 1 – Amsterdam",
    city: "Amsterdam",
    activities: [
      {
        id: "a1",
        time: "09:30",
        title: "Hotel Check-in",
        type: "hotel",
        location: "Lloyd Hotel & Cultural Embassy",
        tags: ["Accommodation", "Rest"],
        emoji: "🏨",
        description: "Unique cultural hotel in Amsterdam's Eastern Docklands with artistic rooms.",
        rating: 4.1,
        price: "€150/night",
      },
      {
        id: "a2",
        time: "10:30",
        title: "Anne Frank House",
        type: "attraction",
        location: "Prinsengracht 263-267",
        tags: ["History", "Culture"],
        hasDocument: true,
        emoji: "📖",
        description:
          "Moving museum in the actual house where Anne Frank wrote her famous diary during WWII.",
        rating: 4.5,
        price: "€16",
      },
      {
        id: "a3",
        time: "12:30",
        title: "Café de Reiger",
        type: "restaurant",
        location: "Nieuwe Leliestraat 34",
        tags: ["Dutch", "Local"],
        emoji: "🍻",
        description:
          "Traditional Amsterdam brown café serving hearty Dutch classics and great local beer.",
        rating: 4.3,
        price: "€€",
      },
      {
        id: "a4",
        time: "14:30",
        title: "Vondelpark Stroll",
        type: "nature",
        location: "Vondelpark",
        tags: ["Nature", "Walking", "Outdoors"],
        emoji: "🌳",
        description:
          "Amsterdam's most popular park - perfect for a relaxing walk and people watching.",
        rating: 4.4,
        price: "Free",
      },
      {
        id: "a5",
        time: "16:00",
        title: "Travel Buddy Meetup",
        type: "social",
        location: "Café Central",
        tags: ["Social", "Meeting", "Friends"],
        emoji: "👥",
        description: "Connect with fellow travelers and locals at this weekly social meetup.",
        rating: 4.2,
        price: "Free",
      },
      {
        id: "a6",
        time: "17:30",
        title: "Travel Notes Review",
        type: "note",
        location: "Hotel Room",
        tags: ["Planning", "Notes"],
        emoji: "📝",
        description: "Review today's experiences and plan tomorrow's activities.",
        rating: 0,
        price: "Free",
      },
      {
        id: "a7",
        time: "19:00",
        title: "Restaurant Greetje",
        type: "restaurant",
        location: "Peperstraat 23",
        tags: ["Fine Dining", "Modern Dutch"],
        emoji: "🍽️",
        description:
          "Innovative restaurant serving modern interpretations of traditional Dutch cuisine.",
        rating: 4.6,
        price: "€€€€",
      },
    ],
    routes: [
      {
        id: "r1-1",
        fromActivityId: "a1",
        toActivityId: "a2",
        defaultMode: "walk",
        totalTime: "12 min",
        totalDistance: "850m",
        steps: [
          {
            id: "r1-1s1",
            mode: "walk",
            description: "Walk south on Prinsengracht",
            duration: "5 min",
          },
          {
            id: "r1-1s2",
            mode: "walk",
            description: "Turn right on Leliegracht",
            duration: "3 min",
          },
          {
            id: "r1-1s3",
            mode: "walk",
            description: "Continue to Nieuwe Leliestraat",
            duration: "4 min",
          },
        ],
      },
      {
        id: "r1-2",
        fromActivityId: "a2",
        toActivityId: "a3",
        defaultMode: "metro",
        totalTime: "15 min",
        totalDistance: "2.3km",
        totalCost: "€3.20",
        steps: [
          {
            id: "r1-2s1",
            mode: "walk",
            description: "Walk to Nieuwmarkt Metro Station",
            duration: "4 min",
          },
          {
            id: "r1-2s2",
            mode: "metro",
            description: "Metro 51, 53, 54 to Centraal Station",
            duration: "8 min",
          },
          {
            id: "r1-2s3",
            mode: "walk",
            description: "Walk to canal cruise departure point",
            duration: "3 min",
          },
        ],
      },
      {
        id: "r1-3",
        fromActivityId: "a3",
        toActivityId: "a4",
        defaultMode: "walk",
        totalTime: "5 min",
        totalDistance: "400m",
        steps: [
          {
            id: "r1-3s1",
            mode: "walk",
            description: "Walk into Jordaan district",
            duration: "5 min",
          },
        ],
      },
      {
        id: "r1-4",
        fromActivityId: "a4",
        toActivityId: "a5",
        defaultMode: "bus",
        totalTime: "18 min",
        totalDistance: "3.1km",
        totalCost: "€3.20",
        steps: [
          {
            id: "r1-4s1",
            mode: "walk",
            description: "Walk to Marnixstraat bus stop",
            duration: "3 min",
          },
          { id: "r1-4s2", mode: "bus", description: "Bus 18 towards Centrum", duration: "12 min" },
          { id: "r1-4s3", mode: "walk", description: "Walk to Peperstraat", duration: "3 min" },
        ],
      },
      {
        id: "r1-5",
        fromActivityId: "a5",
        toActivityId: "a6",
        defaultMode: "walk",
        totalTime: "6 min",
        totalDistance: "450m",
        steps: [
          { id: "r1-5s1", mode: "walk", description: "Walk back to hotel area", duration: "6 min" },
        ],
      },
      {
        id: "r1-6",
        fromActivityId: "a6",
        toActivityId: "a7",
        defaultMode: "walk",
        totalTime: "10 min",
        totalDistance: "700m",
        steps: [
          {
            id: "r1-6s1",
            mode: "walk",
            description: "Walk to Restaurant Greetje",
            duration: "10 min",
          },
        ],
      },
    ],
  },
]

export const ItineraryScreen = ({ navigation }: any) => {
  const { selectedTrip } = useTripStore()
  const { theme } = useAppTheme()
  const { colors, spacing } = theme
  const topContainerInsets = useSafeAreaInsetsStyle(["top"])
  const [selectedDay, setSelectedDay] = useState("1")
  const [layoutDensity, setLayoutDensity] = useState<"condensed" | "normal" | "expanded">("normal")
  const [expandedRoutes, setExpandedRoutes] = useState<Set<string>>(new Set())
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null)
  const [originalDragIndex, setOriginalDragIndex] = useState<number | null>(null)
  const [itineraryData, setItineraryData] = useState<Day[]>(mockItinerary)
  const debugShowPlainRows = false

  // Ensure selectedDay always matches available data
  useEffect(() => {
    if (itineraryData.length > 0) {
      setSelectedDay(itineraryData[0].id)
      const first = itineraryData[0]
      console.log("[Itinerary] init selectedDay", first.id, "activities:", first.activities.length)
    }
  }, [itineraryData])

  // Log when selectedDay changes and what we are rendering
  useEffect(() => {
    const day = itineraryData.find((d) => d.id === selectedDay)
    console.log(
      "[Itinerary] selectedDay change →",
      selectedDay,
      "day exists?",
      !!day,
      "count:",
      day?.activities.length,
    )
  }, [selectedDay, itineraryData])

  const toggleRoute = useCallback((routeId: string) => {
    setExpandedRoutes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(routeId)) {
        newSet.delete(routeId)
      } else {
        newSet.add(routeId)
      }
      return newSet
    })
  }, [])

  const getRouteForActivity = useCallback((day: Day, activityId: string) => {
    return day.routes.find((route) => route.fromActivityId === activityId)
  }, [])

  // Drag and drop handlers
  const handleDragStart = useCallback((index: number) => {
    console.log("[Itinerary] drag start", index)
    setDraggingIndex(index)
    setOriginalDragIndex(index)
    setDraggedOverIndex(null)
  }, [])

  const handleDragUpdate = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      // Only update if the hover position actually changed and we're actively dragging
      if (hoverIndex !== draggedOverIndex && draggingIndex !== null) {
        console.log("[Itinerary] drag update over", hoverIndex, "from", dragIndex)
        setDraggedOverIndex(hoverIndex)
      }
    },
    [draggedOverIndex, draggingIndex],
  )

  const handleDragEnd = useCallback(
    (fromIndex: number, toIndex: number) => {
      console.log("[Itinerary] drag end", fromIndex, "->", toIndex)

      // Reset drag states immediately to stop animations
      setDraggingIndex(null)
      setDraggedOverIndex(null)
      setOriginalDragIndex(null)

      if (fromIndex === toIndex) {
        return
      }

      setItineraryData((prevData) => {
        const newData = [...prevData]
        const currentDay = newData.find((d) => d.id === selectedDay)

        if (currentDay) {
          const newActivities = [...currentDay.activities]
          const [movedActivity] = newActivities.splice(fromIndex, 1)
          newActivities.splice(toIndex, 0, movedActivity)

          console.log(
            "[Itinerary] Reordered:",
            newActivities.map((a) => `${a.time} ${a.title}`),
          )

          // Update routes to match new order
          const newRoutes = recalculateRoutes(newActivities)

          currentDay.activities = newActivities
          currentDay.routes = newRoutes
        }

        return newData
      })
    },
    [selectedDay],
  )

  // Recalculate routes between activities after reordering
  const recalculateRoutes = useCallback((activities: Activity[]): TravelRoute[] => {
    const newRoutes: TravelRoute[] = []

    for (let i = 0; i < activities.length - 1; i++) {
      const fromActivity = activities[i]
      const toActivity = activities[i + 1]

      // Create a simple route (in real app, this would call a routing API)
      const route: TravelRoute = {
        id: `r-${fromActivity.id}-${toActivity.id}`,
        fromActivityId: fromActivity.id,
        toActivityId: toActivity.id,
        defaultMode: "walk",
        totalTime: "10 min",
        totalDistance: "500m",
        steps: [
          {
            id: `step-${fromActivity.id}-${toActivity.id}`,
            mode: "walk",
            description: `Walk from ${fromActivity.title} to ${toActivity.title}`,
            duration: "10 min",
          },
        ],
      }

      newRoutes.push(route)
    }

    return newRoutes
  }, [])

  // Render item for FlashList
  const renderItem = useCallback(
    ({ item, index }: { item: Activity; index: number }) => {
      const currentDay = itineraryData.find((d) => d.id === selectedDay)
      if (!currentDay) return null

      const route = getRouteForActivity(currentDay, item.id)
      const isLastActivity = index === currentDay.activities.length - 1

      return (
        <View key={item.id}>
          <DraggableActivityCard
            activity={item}
            index={index}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            isDragging={draggingIndex === index}
            listLength={currentDay.activities.length}
            estimatedItemHeight={112}
            onPress={() => {}}
          />
          {!isLastActivity && route && layoutDensity !== "condensed" && (
            <TravelRouteChunk
              route={route}
              fromPlace={item.title}
              toPlace={currentDay.activities[index + 1]?.title || "Next stop"}
              expanded={expandedRoutes.has(route.id)}
              onToggle={() => toggleRoute(route.id)}
            />
          )}
        </View>
      )
    },
    [
      itineraryData,
      selectedDay,
      layoutDensity,
      expandedRoutes,
      draggingIndex,
      handleDragStart,
      handleDragEnd,
      getRouteForActivity,
      toggleRoute,
    ],
  )

  if (!selectedTrip) {
    return (
      <Screen
        preset="fixed"
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>No Trip Selected</Text>
        <Text style={{ fontSize: 16, color: "#666", textAlign: "center", marginBottom: 30 }}>
          Select a trip to view the itinerary
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Welcome")}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: colors.tint,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600" }}>Choose a Trip</Text>
        </TouchableOpacity>
      </Screen>
    )
  }

  const currentDay = itineraryData.find((d) => d.id === selectedDay)
  if (!currentDay) return null

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={[
          topContainerInsets,
          {
            backgroundColor: colors.background,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={{ padding: spacing.md }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: spacing.sm,
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: spacing.xs }}>
              <Icon icon="caretLeft" size={20} color={colors.text} />
            </TouchableOpacity>

            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text }}>
                {selectedTrip.title}
              </Text>
              <Text style={{ fontSize: 14, color: colors.textDim }}>{currentDay.date}</Text>
            </View>

            <TouchableOpacity style={{ padding: spacing.xs }}>
              <Icon icon="settings" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Day header */}
      <View
        style={{
          paddingHorizontal: spacing.md,
          paddingTop: spacing.md,
          paddingBottom: spacing.sm,
          backgroundColor: colors.background,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View>
            <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text }}>
              Monday <Text style={{ color: colors.textDim }}>Dec 9</Text>
            </Text>
            <Text style={{ color: colors.textDim, marginTop: 6 }}>{currentDay.city}</Text>
          </View>
          <TouchableOpacity>
            <Text style={{ color: colors.tint, fontSize: 16 }}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={draggingIndex === null}
        >
          {currentDay.activities.map((item, index) => {
            console.log("[Itinerary] render item", index, item.id, item.title)
            const route = getRouteForActivity(currentDay, item.id)
            const isLastActivity = index === currentDay.activities.length - 1
            return (
              <View key={item.id}>
                {debugShowPlainRows ? (
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: "red",
                      backgroundColor: "white",
                      padding: spacing.md,
                      borderRadius: 8,
                      height: 80,
                    }}
                  >
                    <Text style={{ color: "black", fontWeight: "600", fontSize: 16 }}>
                      {item.time} - {item.title}
                    </Text>
                    {item.location ? (
                      <Text style={{ color: "gray", marginTop: 4 }}>{item.location}</Text>
                    ) : null}
                  </View>
                ) : (
                  <DraggableActivityCard
                    activity={item}
                    index={index}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragUpdate={handleDragUpdate}
                    isDragging={draggingIndex === index}
                    draggedOverIndex={draggedOverIndex}
                    originalDragIndex={originalDragIndex}
                    listLength={currentDay.activities.length}
                    estimatedItemHeight={112}
                    nextRoute={route}
                    isLastActivity={isLastActivity}
                    onPress={() => {}}
                  />
                )}
              </View>
            )
          })}
        </ScrollView>
      </View>
    </View>
  )
}
