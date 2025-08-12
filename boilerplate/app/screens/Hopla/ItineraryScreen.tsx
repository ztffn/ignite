import React, { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { Screen } from '../../components/Screen'
import { Card } from '../../components/Card'
import { Icon } from '../../components/Icon'
import { useAppTheme } from '../../theme/context'
import { useSafeAreaInsetsStyle } from '../../utils/useSafeAreaInsetsStyle'
import { useTripStore } from '../../store/TripStore'

interface Activity {
  id: string
  time: string
  title: string
  type: 'restaurant' | 'attraction' | 'transport' | 'hotel' | 'note' | 'shopping' | 'wine' | 'nature' | 'entertainment' | 'coffee' | 'medical' | 'culture' | 'social' | 'museum'
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

interface TravelRoute {
  id: string
  fromActivityId: string
  toActivityId: string
  defaultMode: 'walk' | 'metro' | 'bus' | 'car'
  totalTime: string
  totalDistance: string
  totalCost?: string
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
    id: '1',
    date: 'Day 1 – Amsterdam',
    city: 'Amsterdam',
    activities: [
      { 
        id: 'a1', 
        time: '09:30', 
        title: 'Hotel Check-in', 
        type: 'hotel', 
        location: 'Lloyd Hotel & Cultural Embassy',
        tags: ['Accommodation', 'Rest'],
        emoji: '🏨',
        description: 'Unique cultural hotel in Amsterdam\'s Eastern Docklands with artistic rooms.',
        rating: 4.1,
        price: '€150/night'
      },
      { 
        id: 'a2', 
        time: '10:30', 
        title: 'Anne Frank House', 
        type: 'attraction', 
        location: 'Prinsengracht 263-267',
        tags: ['History', 'Culture'],
        hasDocument: true,
        emoji: '📖',
        description: 'Moving museum in the actual house where Anne Frank wrote her famous diary during WWII.',
        rating: 4.5,
        price: '€16'
      },
      { 
        id: 'a3', 
        time: '12:30', 
        title: 'Café de Reiger', 
        type: 'restaurant', 
        location: 'Nieuwe Leliestraat 34',
        tags: ['Dutch', 'Local'],
        emoji: '🍻',
        description: 'Traditional Amsterdam brown café serving hearty Dutch classics and great local beer.',
        rating: 4.3,
        price: '€€'
      },
      { 
        id: 'a4', 
        time: '14:30', 
        title: 'Vondelpark Stroll', 
        type: 'nature', 
        location: 'Vondelpark',
        tags: ['Nature', 'Walking', 'Outdoors'],
        emoji: '🌳',
        description: 'Amsterdam\'s most popular park - perfect for a relaxing walk and people watching.',
        rating: 4.4,
        price: 'Free'
      }
    ],
    routes: [
      {
        id: 'r1-1',
        fromActivityId: 'a1',
        toActivityId: 'a2',
        defaultMode: 'walk',
        totalTime: '12 min',
        totalDistance: '850m'
      },
      {
        id: 'r1-2',
        fromActivityId: 'a2',
        toActivityId: 'a3',
        defaultMode: 'metro',
        totalTime: '15 min',
        totalDistance: '2.3km',
        totalCost: '€3.20'
      }
    ]
  }
]

export const ItineraryScreen = ({ navigation }: any) => {
  const { selectedTrip } = useTripStore()
  const { colors, spacing } = useAppTheme()
  const topContainerInsets = useSafeAreaInsetsStyle(['top'])
  const [selectedDay, setSelectedDay] = useState('1')
  const [layoutDensity, setLayoutDensity] = useState<'condensed' | 'normal' | 'expanded'>('normal')
  const [expandedRoutes, setExpandedRoutes] = useState<Set<string>>(new Set())

  const toggleRoute = useCallback((routeId: string) => {
    setExpandedRoutes(prev => {
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
    return day.routes.find(route => route.fromActivityId === activityId)
  }, [])

  const renderActivityCard = useCallback(({ item: activity, index }: { item: Activity; index: number }) => {
    const day = mockItinerary.find(d => d.activities.some(a => a.id === activity.id))
    if (!day) return null

    const route = getRouteForActivity(day, activity.id)
    const isLastActivity = index === day.activities.length - 1

    return (
      <View key={activity.id}>
        {/* Activity Card */}
        <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.sm }}>
          <View style={{ padding: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                    {activity.time}
                  </Text>
                  <Text style={{ fontSize: 20, marginLeft: spacing.xs }}>
                    {activity.emoji}
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginLeft: spacing.xs }}>
                    {activity.title}
                  </Text>
                </View>
                
                {activity.location && (
                  <Text style={{ fontSize: 14, color: colors.textDim, marginBottom: spacing.xs }}>
                    📍 {activity.location}
                  </Text>
                )}
                
                {activity.description && (
                  <Text style={{ fontSize: 14, color: colors.text, marginBottom: spacing.xs }}>
                    {activity.description}
                  </Text>
                )}
                
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  {activity.rating && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon icon="heart" size={14} color={colors.tint} />
                      <Text style={{ fontSize: 12, color: colors.textDim, marginLeft: 4 }}>
                        {activity.rating}
                      </Text>
                    </View>
                  )}
                  
                  {activity.price && (
                    <Text style={{ fontSize: 12, color: colors.textDim }}>
                      💰 {activity.price}
                    </Text>
                  )}
                </View>
                
                {activity.tags && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.xs }}>
                    {activity.tags.map((tag, tagIndex) => (
                      <View
                        key={tagIndex}
                        style={{
                          backgroundColor: colors.border,
                          paddingHorizontal: spacing.xs,
                          paddingVertical: 2,
                          borderRadius: 4,
                          marginRight: spacing.xs,
                          marginBottom: spacing.xs
                        }}
                      >
                        <Text style={{ fontSize: 10, color: colors.textDim }}>
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              
              <TouchableOpacity style={{ padding: spacing.xs }}>
                <Icon icon="more" size={16} color={colors.textDim} />
              </TouchableOpacity>
            </View>
          </View>
        </Card>
        
        {/* Travel Route (if not last activity) */}
        {!isLastActivity && route && layoutDensity !== 'condensed' && (
          <View style={{ marginHorizontal: spacing.md, marginBottom: spacing.sm }}>
            <TouchableOpacity
              onPress={() => toggleRoute(route.id)}
              style={{
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: spacing.sm,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Icon 
                  icon={route.defaultMode === 'walk' ? 'pin' : 'settings'} 
                  size={16} 
                  color={colors.textDim} 
                />
                <Text style={{ fontSize: 14, color: colors.textDim, marginLeft: spacing.xs }}>
                  {route.totalTime} • {route.totalDistance}
                </Text>
                {route.totalCost && (
                  <Text style={{ fontSize: 14, color: colors.textDim, marginLeft: spacing.sm }}>
                    {route.totalCost}
                  </Text>
                )}
              </View>
              
              <Icon 
                icon={expandedRoutes.has(route.id) ? 'caretUp' : 'caretDown'} 
                size={16} 
                color={colors.textDim} 
              />
            </TouchableOpacity>
            
            {expandedRoutes.has(route.id) && (
              <View style={{ 
                backgroundColor: colors.background, 
                marginTop: spacing.xs,
                padding: spacing.sm,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border
              }}>
                <Text style={{ fontSize: 12, color: colors.textDim }}>
                  Route details would go here...
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    )
  }, [colors, spacing, layoutDensity, expandedRoutes, toggleRoute, getRouteForActivity])

  if (!selectedTrip) {
    return (
      <Screen preset="fixed" contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
          No Trip Selected
        </Text>
        <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 }}>
          Select a trip to view the itinerary
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Welcome')}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: colors.tint,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
            Choose a Trip
          </Text>
        </TouchableOpacity>
      </Screen>
    )
  }

  const currentDay = mockItinerary.find(d => d.id === selectedDay)
  if (!currentDay) return null

  return (
    <Screen preset="fixed" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[topContainerInsets, { backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <View style={{ padding: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: spacing.xs }}>
              <Icon icon="caretLeft" size={20} color={colors.text} />
            </TouchableOpacity>
            
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
                {selectedTrip.title}
              </Text>
              <Text style={{ fontSize: 14, color: colors.textDim }}>
                {currentDay.date}
              </Text>
            </View>
            
            <TouchableOpacity style={{ padding: spacing.xs }}>
              <Icon icon="settings" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          {/* Day Navigation Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: spacing.xs }}>
              {mockItinerary.map((day, index) => (
                <TouchableOpacity
                  key={day.id}
                  onPress={() => setSelectedDay(day.id)}
                  style={{
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                    borderRadius: 8,
                    backgroundColor: selectedDay === day.id ? colors.tint : colors.border,
                  }}
                >
                  <Text style={{ 
                    fontSize: 12, 
                    fontWeight: '600', 
                    color: selectedDay === day.id ? '#ffffff' : colors.text 
                  }}>
                    Day {index + 1}
                  </Text>
                  <Text style={{ 
                    fontSize: 10, 
                    color: selectedDay === day.id ? '#ffffff' : colors.textDim,
                    textAlign: 'center'
                  }}>
                    {day.city}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <FlashList
          data={currentDay.activities}
          renderItem={renderActivityCard}
          estimatedItemSize={120}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: spacing.md }}
        />
      </View>
    </Screen>
  )
}
