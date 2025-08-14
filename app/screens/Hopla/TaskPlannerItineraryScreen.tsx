import React from 'react'
import { View, Text } from 'react-native'
import Animated, { useAnimatedRef } from 'react-native-reanimated'
import Sortable from 'react-native-sortables'

export const TaskPlannerItineraryScreen = () => {
  const scrollRef = useAnimatedRef<any>()
  return (
    <Animated.ScrollView ref={scrollRef} style={{ flex: 1 }}>
      <View style={{ padding: 24 }}>
        <Text>Task Planner Placeholder</Text>
      </View>
    </Animated.ScrollView>
  )
}


