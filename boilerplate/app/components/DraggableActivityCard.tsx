import React, { useCallback } from "react"
import { View, TouchableOpacity } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from "react-native-reanimated"

import { Icon } from "./Icon"
import { Text } from "./Text"
import { useAppTheme } from "../theme/context"

const DRAG_THRESHOLD = 50

// Enhanced drag handle with better visual feedback
const DragHandle: React.FC<{ isActive: boolean; color: string }> = ({ isActive, color }) => {
  const handleContainerStyle = {
    width: 28, // Slightly larger for better touch target
    height: 36,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    borderRadius: 8,
    backgroundColor: isActive ? `${color}10` : "transparent", // Subtle background when active
    borderWidth: isActive ? 1 : 0,
    borderColor: isActive ? `${color}30` : "transparent",
  }

  const dotsContainerStyle = {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    width: 18,
    height: 22,
  }

  const dotStyle = (marginRight?: number, marginBottom?: number) => ({
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: color,
    marginRight: marginRight || 0,
    marginBottom: marginBottom || 0,
    opacity: isActive ? 1 : 0.5, // More contrast when active
  })

  return (
    <View style={handleContainerStyle}>
      <View style={dotsContainerStyle}>
        {/* Top row */}
        <View style={dotStyle(4, 4)} />
        <View style={dotStyle(0, 4)} />
        {/* Middle row */}
        <View style={dotStyle(4, 4)} />
        <View style={dotStyle(0, 4)} />
        {/* Bottom row */}
        <View style={dotStyle(4, 0)} />
        <View style={dotStyle(0, 0)} />
      </View>
    </View>
  )
}

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

interface DraggableActivityCardProps {
  activity: Activity
  index: number
  onDragStart: (index: number) => void
  onDragEnd: (fromIndex: number, toIndex: number) => void
  onDragUpdate?: (dragIndex: number, hoverIndex: number) => void
  isDragging: boolean
  onPress?: () => void
  listLength: number
  estimatedItemHeight?: number
  nextRoute?: TravelRoute | null
  isLastActivity?: boolean
}

export const DraggableActivityCard: React.FC<DraggableActivityCardProps> = ({
  activity,
  index,
  onDragStart,
  onDragEnd,
  onDragUpdate,
  isDragging,
  onPress,
  listLength,
  estimatedItemHeight = 112,
  nextRoute,
  isLastActivity = false,
}) => {
  const { theme } = useAppTheme()
  const { colors, spacing } = theme

  // Helper function to get transport mode icon
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "walk":
        return "caretRight"
      case "metro":
        return "settings"
      case "bus":
        return "settings"
      case "car":
        return "settings"
      default:
        return "caretRight"
    }
  }

  // Shared values for animations
  const translateY = useSharedValue(0)
  const scale = useSharedValue(1)
  const shadowOpacity = useSharedValue(0.1)
  const isLongPressed = useSharedValue(false)
  const hasDragged = useSharedValue(false)

  // Pan gesture - only activates after long press succeeds
  const pan = Gesture.Pan()
    .manualActivation(true)
    .onTouchesMove((_, state) => {
      if (isLongPressed.value && isDragging) {
        state.activate()
      }
    })
    .onUpdate((event) => {
      if (!isLongPressed.value || !isDragging) {
        return // Only process if long-pressed AND dragging
      }

      translateY.value = event.translationY

      if (!hasDragged.value && Math.abs(event.translationY) > 1) {
        hasDragged.value = true
      }

      const dragDistance = event.translationY
      const itemHeight = estimatedItemHeight + spacing.sm
      const delta = Math.round(dragDistance / itemHeight)

      // Calculate hover index with better threshold logic
      let hoverIndex: number
      if (Math.abs(dragDistance) < itemHeight * 0.25) {
        // If very close to original position, stay at original
        hoverIndex = index
      } else {
        // Otherwise calculate based on drag distance
        hoverIndex = Math.max(0, Math.min(index + delta, listLength - 1))
      }

      if (onDragUpdate && hoverIndex !== index) {
        runOnJS(onDragUpdate)(index, hoverIndex)
      }
    })
    .onEnd((event) => {
      if (!isLongPressed.value || !isDragging) {
        return
      }

      const itemHeight = estimatedItemHeight + spacing.sm
      const dragDistance = event.translationY
      const delta = Math.round(dragDistance / itemHeight)
      const unclamped = index + delta
      const newIndex = Math.max(0, Math.min(unclamped, Math.max(0, listLength - 1)))

      console.log(`[Card ${index}] 🎯 DROP: ${index} → ${newIndex}`)
      runOnJS(onDragEnd)(index, newIndex)
    })
    .shouldCancelWhenOutside(false)

  // Long press arms the drag and disables list scroll via parent onDragStart
  const longPress = Gesture.LongPress()
    .minDuration(500)
    .maxDistance(5)
    .onStart(() => {
      console.log(`[Card ${index}] 🚀 DRAG START`)
      isLongPressed.value = true

      // Enhanced lift effect - more pronounced than before
      scale.value = withSpring(1.08, {
        damping: 20,
        stiffness: 300,
        mass: 0.8,
      })

      shadowOpacity.value = withSpring(0.6, {
        damping: 20,
        stiffness: 300,
      })

      runOnJS(onDragStart)(index)
    })
    .shouldCancelWhenOutside(false)

  // Handle gesture: long-press arms the drag, then pan handles movement
  const handleGesture = Gesture.Simultaneous(longPress, pan)

  // Cleanup effect to ensure no stuck states
  React.useEffect(() => {
    // If parent says we're not dragging, immediately reset everything
    if (!isDragging) {
      console.log(`[Card ${index}] 🔄 RESET - Parent says not dragging`)
      isLongPressed.value = false
      hasDragged.value = false
      translateY.value = 0
      scale.value = 1
      shadowOpacity.value = 0.1
    }
  }, [isDragging]) // Only depend on parent's isDragging state

  // Debug transparency issues - only log when values are unexpected
  React.useEffect(() => {
    // Only check when dragging starts/stops, not continuously
    if (isDragging) {
      console.log(`[Card ${index}] 🔍 DRAGGING - will check for transparency issues`)
    }
  }, [isDragging]) // Only depend on isDragging boolean, not shared values

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      Math.abs(translateY.value),
      [0, DRAG_THRESHOLD],
      [0, 2],
      Extrapolate.CLAMP,
    )

    return {
      transform: [
        { translateY: translateY.value }, // This makes other elements move!
        { scale: scale.value },
        { rotate: `${rotation}deg` },
      ],
      zIndex: isLongPressed.value || isDragging ? 1000 : 1,
    }
  })

  const shadowStyle = useAnimatedStyle(() => ({
    shadowOpacity: shadowOpacity.value,
    shadowRadius: interpolate(shadowOpacity.value, [0.1, 0.4], [4, 12], Extrapolate.CLAMP),
    shadowOffset: {
      width: 0,
      height: interpolate(shadowOpacity.value, [0.1, 0.4], [2, 8], Extrapolate.CLAMP),
    },
    elevation: shadowOpacity.value * 25,
  }))

  const handlePress = useCallback(() => {
    console.log("[Card] pressed:", activity.title)
    if (onPress) {
      onPress()
    }
  }, [onPress, activity.title])

  return (
    <Animated.View style={[animatedStyle, shadowStyle, { marginBottom: spacing.sm }]}> 
      <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
        <Animated.View
          style={{
            backgroundColor: isDragging ? colors.border : colors.background,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: isDragging ? colors.tint : colors.border,
            padding: spacing.md,
          }}
        >
          {/* Main content row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: colors.text,
                  marginBottom: 4,
                }}
              >
                {activity.time} - {activity.title}
              </Text>
              {activity.location && (
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textDim,
                  }}
                >
                  {activity.location}
                </Text>
              )}
            </View>

            {/* Drag handle - only this triggers long-press */}
            <GestureDetector gesture={handleGesture}>
              <View style={{ marginLeft: spacing.sm }}>
                <DragHandle 
                  isActive={isDragging} 
                  color={colors.textDim} 
                />
              </View>
            </GestureDetector>
          </View>

          {/* Integrated transport route - attached to bottom of activity */}
          {nextRoute && !isLastActivity && (
            <View
              style={{
                marginTop: spacing.sm,
                paddingTop: spacing.sm,
                borderTopWidth: 1,
                borderTopColor: colors.border,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  backgroundColor: colors.border,
                  borderRadius: 12,
                }}
              >
                <Icon icon={getModeIcon(nextRoute.defaultMode)} size={12} color={colors.textDim} />
                <Text
                  style={{
                    fontSize: 11,
                    color: colors.textDim,
                    marginLeft: spacing.xs,
                    fontWeight: "500",
                  }}
                >
                  {nextRoute.totalTime}
                </Text>
                {nextRoute.totalCost && (
                  <Text
                    style={{
                      fontSize: 11,
                      color: colors.textDim,
                      marginLeft: spacing.xs,
                    }}
                  >
                    • {nextRoute.totalCost}
                  </Text>
                )}
              </View>
            </View>
          )}
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    )
  }
