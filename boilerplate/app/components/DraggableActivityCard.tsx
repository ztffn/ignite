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
  draggedOverIndex?: number | null
  originalDragIndex?: number | null
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
  draggedOverIndex,
  originalDragIndex,
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
  const opacity = useSharedValue(1)
  const shadowOpacity = useSharedValue(0.1)
  const isLongPressed = useSharedValue(false)
  const spacingOffset = useSharedValue(0)
  const hasDragged = useSharedValue(false)

  // Pan gesture - only activates after long press succeeds
  const pan = Gesture.Pan()
    .manualActivation(true)
    .onTouchesMove((_, state) => {
      if (isLongPressed.value && isDragging) {
        console.log(`[Card ${index}] Activating pan gesture - long press active and parent says dragging`)
        state.activate()
      }
    })
    .onUpdate((event) => {
      if (!isLongPressed.value || !isDragging) {
        console.log(`[Card ${index}] Pan update blocked:`, {
          isLongPressed: isLongPressed.value,
          isDragging,
          translationY: event.translationY,
        })
        return // Only process if long-pressed AND dragging
      }

      console.log(`[Card ${index}] Pan update:`, {
        translationY: event.translationY,
        hasDragged: hasDragged.value,
      })

      translateY.value = event.translationY

      if (!hasDragged.value && Math.abs(event.translationY) > 1) {
        hasDragged.value = true
        console.log(`[Card ${index}] Marked as dragged`)
      }

      const dragDistance = event.translationY
      const itemHeight = estimatedItemHeight + spacing.sm
      const delta = Math.round(dragDistance / itemHeight)
      const hoverIndex = Math.max(0, Math.min(index + delta, listLength - 1))

      if (onDragUpdate && hoverIndex !== index) {
        console.log(`[Card ${index}] Calling onDragUpdate:`, { from: index, to: hoverIndex })
        runOnJS(onDragUpdate)(index, hoverIndex)
      }

      // Add subtle rotation for "picked up" feel
      const rotation = interpolate(
        Math.abs(event.translationY),
        [0, DRAG_THRESHOLD],
        [0, 2],
        Extrapolate.CLAMP,
      )
      // Note: We'll need to add rotation to the animated style
    })
    .onEnd((event) => {
      console.log(`[Card ${index}] Pan end:`, {
        isLongPressed: isLongPressed.value,
        isDragging,
        translationY: event.translationY,
        hasDragged: hasDragged.value,
      })
      
      if (!isLongPressed.value || !isDragging) {
        console.log(`[Card ${index}] Pan end blocked - not in valid drag state`)
        return
      }

      const itemHeight = estimatedItemHeight + spacing.sm
      const dragDistance = event.translationY
      const delta = Math.round(dragDistance / itemHeight)
      const unclamped = index + delta
      const newIndex = Math.max(0, Math.min(unclamped, Math.max(0, listLength - 1)))

      console.log(`[Card ${index}] Drag end calculation:`, {
        dragDistance,
        delta,
        unclamped,
        newIndex,
        itemHeight,
      })

      runOnJS(onDragEnd)(index, newIndex)

      // Don't reset state here - let the parent's isDragging change trigger the cleanup effect
      console.log(`[Card ${index}] Drag end complete - waiting for parent state change`)
    })
    .shouldCancelWhenOutside(false)

  // Long press arms the drag and disables list scroll via parent onDragStart
  const longPress = Gesture.LongPress()
    .minDuration(500)
    .maxDistance(5)
    .onStart(() => {
      console.log(`[Card ${index}] Long press started`)
      isLongPressed.value = true
      
      // Enhanced lift effect - more pronounced than before
      scale.value = withSpring(1.08, { 
        damping: 20, 
        stiffness: 300,
        mass: 0.8,
      })
      
      shadowOpacity.value = withSpring(0.6, { 
        damping: 20, 
        stiffness: 300 
      })
      
      console.log(`[Card ${index}] Calling onDragStart`)
      runOnJS(onDragStart)(index)
    })
    .shouldCancelWhenOutside(false)

  // Handle gesture: long-press arms the drag, then pan handles movement
  const handleGesture = Gesture.Simultaneous(longPress, pan)

  // Cleanup effect to ensure no stuck states
  React.useEffect(() => {
    console.log(`[Card ${index}] Cleanup effect:`, {
      isDragging,
      isLongPressed: isLongPressed.value,
      hasDragged: hasDragged.value,
      translateY: translateY.value,
      scale: scale.value,
      opacity: opacity.value,
    })
    
    // If parent says we're not dragging, immediately reset everything
    if (!isDragging) {
      console.log(`[Card ${index}] Parent says not dragging - resetting all values`)
      isLongPressed.value = false
      hasDragged.value = false
      translateY.value = 0
      spacingOffset.value = 0
      scale.value = 1
      opacity.value = 1
      shadowOpacity.value = 0.1
    }
  }, [isDragging]) // Only depend on parent's isDragging state

  // React to draggedOverIndex changes to create proper swap animations
  React.useEffect(() => {
    console.log(`[Card ${index}] Spacing effect:`, {
      isDragging,
      isLongPressed: isLongPressed.value,
      draggedOverIndex,
      originalDragIndex,
      myIndex: index,
      spacingOffset: spacingOffset.value,
    })
    
    if (isDragging && isLongPressed.value) {
      console.log(`[Card ${index}] This is the dragging item - no spacing offset`)
      // If this is the dragging item, don't apply spacing offset
      spacingOffset.value = withSpring(0)
    } else if (typeof draggedOverIndex === "number" && typeof originalDragIndex === "number") {
      const hoverIndex = draggedOverIndex
      const startIndex = originalDragIndex
      const myIndex = index

      // Determine if this item should move and in which direction
      let shouldMove = false
      let moveDistance = 0

      if (hoverIndex > startIndex) {
        // Dragging downward - items between start and hover move up
        if (myIndex > startIndex && myIndex <= hoverIndex) {
          shouldMove = true
          moveDistance = -(estimatedItemHeight + spacing.sm) // Move up
        }
      } else if (hoverIndex < startIndex) {
        // Dragging upward - items between hover and start move down
        if (myIndex >= hoverIndex && myIndex < startIndex) {
          shouldMove = true
          moveDistance = estimatedItemHeight + spacing.sm // Move down
        }
      }

      console.log(`[Card ${index}] Spacing calculation:`, {
        hoverIndex,
        startIndex,
        myIndex,
        shouldMove,
        moveDistance,
      })

      spacingOffset.value = withSpring(shouldMove ? moveDistance : 0, {
        damping: shouldMove ? 25 : 35, // Faster return to normal
        stiffness: shouldMove ? 400 : 600,
      })
    } else {
      console.log(`[Card ${index}] No drag happening - resetting spacing`)
      // No drag happening, reset quickly
      spacingOffset.value = withSpring(0, {
        damping: 35,
        stiffness: 600,
      })
    }
  }, [draggedOverIndex, originalDragIndex, index, isDragging, estimatedItemHeight, spacing.sm])

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      Math.abs(translateY.value),
      [0, DRAG_THRESHOLD],
      [0, 2],
      Extrapolate.CLAMP,
    )

    // Debug logging for transform values
    if (isLongPressed.value || isDragging) {
      console.log(`[Card ${index}] Animated style update:`, {
        translateY: translateY.value,
        spacingOffset: spacingOffset.value,
        totalTranslateY: translateY.value + spacingOffset.value,
        scale: scale.value,
        rotation,
        isLongPressed: isLongPressed.value,
        isDragging,
      })
    }

    return {
      transform: [
        { translateY: translateY.value + spacingOffset.value }, // This makes other elements move!
        { scale: scale.value },
        { rotate: `${rotation}deg` },
      ],
      // opacity: opacity.value, // Removed to keep card fully opaque
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
                  isActive={isLongPressed.value || isDragging} 
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
