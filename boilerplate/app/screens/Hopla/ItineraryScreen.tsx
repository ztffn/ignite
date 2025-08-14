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
  backgroundImage?: string
  hasDocument?: boolean
  phone?: string
  website?: string
  notes?: string
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

// Mock data for testing - matching the mockup exactly
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
        backgroundImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=400&fit=crop"
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
        description: "Moving museum in the actual house where Anne Frank wrote her famous diary during WWII.",
        rating: 4.5,
        phone: "+31 20 556 7105",
        website: "annefrank.org",
        price: "€16",
        notes: "Book online in advance - tickets sell out quickly. Allow 1.5 hours.",
        backgroundImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop"
      },
      {
        id: "a3",
        time: "12:30",
        title: "Café de Reiger",
        type: "restaurant",
        location: "Nieuwe Leliestraat 34",
        tags: ["Dutch", "Local"],
        emoji: "🍻",
        description: "Traditional Amsterdam brown café serving hearty Dutch classics and great local beer.",
        rating: 4.3,
        price: "€€",
        backgroundImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=400&fit=crop"
      },
      {
        id: "a4",
        time: "14:30",
        title: "Vondelpark Stroll",
        type: "nature",
        location: "Vondelpark",
        tags: ["Nature", "Walking", "Outdoors"],
        emoji: "🌳",
        description: "Amsterdam's most popular park - perfect for a relaxing walk and people watching.",
        rating: 4.4,
        price: "Free",
        backgroundImage: "https://images.unsplash.com/photo-1523043737299-8ebe6b4a6520?w=800&h=400&fit=crop"
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
        backgroundImage: "https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=800&h=400&fit=crop"
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
        backgroundImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop"
      },
      {
        id: "a7",
        time: "19:00",
        title: "Restaurant Greetje",
        type: "restaurant",
        location: "Peperstraat 23",
        tags: ["Fine Dining", "Modern Dutch"],
        emoji: "🍽️",
        description: "Innovative restaurant serving modern interpretations of traditional Dutch cuisine.",
        rating: 4.6,
        price: "€€€€",
        backgroundImage: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=400&fit=crop"
      }
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
          { id: "r1-1s1", mode: "walk", description: "Walk south on Prinsengracht", duration: "5 min" },
          { id: "r1-1s2", mode: "walk", description: "Turn right on Leliegracht", duration: "3 min" },
          { id: "r1-1s3", mode: "walk", description: "Continue to Nieuwe Leliestraat", duration: "4 min" }
        ]
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
          { id: "r1-2s1", mode: "walk", description: "Walk to Nieuwmarkt Metro Station", duration: "4 min" },
          { id: "r1-2s2", mode: "metro", description: "Metro 51, 53, 54 to Centraal Station", duration: "8 min" },
          { id: "r1-2s3", mode: "walk", description: "Walk to canal cruise departure point", duration: "3 min" }
        ]
      },
      {
        id: "r1-3",
        fromActivityId: "a3",
        toActivityId: "a4",
        defaultMode: "walk",
        totalTime: "5 min",
        totalDistance: "400m",
        steps: [
          { id: "r1-3s1", mode: "walk", description: "Walk into Jordaan district", duration: "5 min" }
        ]
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
          { id: "r1-4s1", mode: "walk", description: "Walk to Marnixstraat bus stop", duration: "3 min" },
          { id: "r1-4s2", mode: "bus", description: "Bus 18 towards Centrum", duration: "12 min" },
          { id: "r1-4s3", mode: "walk", description: "Walk to Peperstraat", duration: "3 min" }
        ]
      },
      {
        id: "r1-5",
        fromActivityId: "a5",
        toActivityId: "a6",
        defaultMode: "walk",
        totalTime: "6 min",
        totalDistance: "450m",
        steps: [
          { id: "r1-5s1", mode: "walk", description: "Walk back to hotel area", duration: "6 min" }
        ]
      },
      {
        id: "r1-6",
        fromActivityId: "a6",
        toActivityId: "a7",
        defaultMode: "walk",
        totalTime: "10 min",
        totalDistance: "700m",
        steps: [
          { id: "r1-6s1", mode: "walk", description: "Walk to Restaurant Greetje", duration: "10 min" }
        ]
      }
    ]
  }
]

// Transportation chunk component showing travel between activities
const TravelChunk: React.FC<{ 
  route: TravelRoute; 
  fromPlace: string; 
  toPlace: string; 
  colors: any; 
  spacing: any;
  expanded: boolean;
  onToggle: () => void;
}> = ({ route, fromPlace, toPlace, colors, spacing, expanded, onToggle }) => {
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "walk": return "🚶"
      case "metro": return "🚇"
      case "bus": return "🚌"
      case "car": return "🚗"
      default: return "🚶"
    }
  }

  return (
    <View
      style={{
        backgroundColor: colors.border + "20",
        marginHorizontal: spacing.md,
        marginBottom: spacing.sm,
        borderRadius: 12,
        padding: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {/* Main route info */}
      <Pressable onPress={onToggle} style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: colors.textDim, marginRight: spacing.sm }}>
          {getModeIcon(route.defaultMode)} to {toPlace}
        </Text>
        <View style={{ marginLeft: "auto", flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 12, color: colors.textDim, marginRight: spacing.xs }}>
            ⏱️ {route.totalTime}
          </Text>
          {route.totalCost && (
            <Text style={{ fontSize: 12, color: colors.textDim, marginLeft: spacing.xs }}>
              • {route.totalCost}
            </Text>
          )}
          <Text style={{ fontSize: 16, color: colors.textDim, marginLeft: spacing.sm }}>
            {expanded ? "▲" : "▼"}
          </Text>
        </View>
      </Pressable>

      {/* Expanded route steps */}
      {expanded && (
        <View style={{ marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border }}>
          {route.steps.map((step, index) => (
            <View key={step.id} style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.xs }}>
              <Text style={{ fontSize: 12, color: colors.textDim, marginRight: spacing.sm }}>
                {getModeIcon(step.mode)}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textDim, flex: 1 }}>
                {step.description}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textDim }}>
                {step.duration}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

// Draggable activity card component matching the mockup style
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
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        {/* Time and Emoji */}
        <View style={{ marginRight: spacing.sm, alignItems: "center" }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 4 }}>
            {item.time}
          </Text>
          <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
        </View>
        
        {/* Content */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text, marginBottom: 4 }}>
            {item.title}
          </Text>
          {item.location && (
            <Text style={{ fontSize: 14, color: colors.textDim }}>
              {item.location}
            </Text>
          )}
          {item.tags && item.tags.length > 0 && (
            <View style={{ flexDirection: "row", marginTop: 4, flexWrap: "wrap" }}>
              {item.tags.slice(0, 2).map((tag, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: colors.border,
                    paddingHorizontal: spacing.xs,
                    paddingVertical: 2,
                    borderRadius: 8,
                    marginRight: spacing.xs,
                    marginBottom: spacing.xs,
                  }}
                >
                  <Text style={{ fontSize: 11, color: colors.textDim }}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Document indicator */}
        {item.hasDocument && (
          <View style={{ marginLeft: spacing.sm }}>
            <View
              style={{
                width: 24,
                height: 24,
                backgroundColor: colors.tint + "20",
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 12, color: colors.tint }}>📄</Text>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  )
}

export const ItineraryScreen = ({ _navigation }: any) => {
  const { theme } = useAppTheme()
  const { colors, spacing } = theme
  const topContainerInsets = useSafeAreaInsetsStyle(["top"])
  const [selectedDay, setSelectedDay] = useState("1")
  const [itineraryData, setItineraryData] = useState<Day[]>(mockItinerary)
  const [expandedRoutes, setExpandedRoutes] = useState<Set<string>>(new Set())

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
          renderItem={({ item, index }) => {
            const route = getRouteForActivity(currentDay, item.id)
            const isLastActivity = index === currentDay.activities.length - 1
            
            return (
              <View>
                {/* Activity Card */}
                <DraggableItem item={item} colors={colors} spacing={spacing} />
                
                {/* Transportation Chunk (if not last activity and route exists) */}
                {!isLastActivity && route && (
                  <TravelChunk
                    route={route}
                    fromPlace={item.title}
                    toPlace={currentDay.activities[index + 1]?.title || "Next stop"}
                    colors={colors}
                    spacing={spacing}
                    expanded={expandedRoutes.has(route.id)}
                    onToggle={() => toggleRoute(route.id)}
                  />
                )}
              </View>
            )
          }}
        />
      </View>
    </View>
  )
}
