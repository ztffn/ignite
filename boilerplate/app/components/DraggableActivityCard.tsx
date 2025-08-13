import React, { useCallback } from "react"
import { View, Text, TouchableOpacity, Dimensions } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from "react-native-reanimated"

import { Card } from "./Card"
import { Icon } from "./Icon"
import { useAppTheme } from "../theme/context"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const DRAG_THRESHOLD = 50

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

  // Pan is manual; it activates only after long press succeeds
  const pan = Gesture.Pan()
    .manualActivation(true)
    .onTouchesMove((_, state) => {
      if (isLongPressed.value) state.activate()
    })
    .onUpdate((event) => {
      if (!isLongPressed.value) return

      translateY.value = event.translationY

      if (!hasDragged.value && Math.abs(event.translationY) > 1) {
        hasDragged.value = true
      }

      const dragDistance = event.translationY
      const itemHeight = estimatedItemHeight + spacing.sm
      const delta = Math.round(dragDistance / itemHeight)
      const hoverIndex = Math.max(0, Math.min(index + delta, listLength - 1))

      if (onDragUpdate && hoverIndex !== index) {
        runOnJS(onDragUpdate)(index, hoverIndex)
      }

      opacity.value = interpolate(
        Math.abs(event.translationY),
        [0, DRAG_THRESHOLD],
        [1, 0.9],
        Extrapolate.CLAMP,
      )
    })
    .onEnd((event) => {
      if (!isLongPressed.value) return

      const itemHeight = estimatedItemHeight + spacing.sm
      const dragDistance = event.translationY
      const delta = Math.round(dragDistance / itemHeight)
      const unclamped = index + delta
      const newIndex = Math.max(0, Math.min(unclamped, Math.max(0, listLength - 1)))

      runOnJS(onDragEnd)(index, newIndex)

      translateY.value = withSpring(0, {
        damping: 30,
        stiffness: 500,
      })

      isLongPressed.value = false
      hasDragged.value = false
      scale.value = withSpring(1, { damping: 25, stiffness: 400 })
      opacity.value = withSpring(1, { damping: 25, stiffness: 400 })
      shadowOpacity.value = withSpring(0.1, { damping: 25, stiffness: 400 })
    })
    .onFinalize(() => {
      // Safety reset in case of interruption
      if (isLongPressed.value) {
        isLongPressed.value = false
        hasDragged.value = false
        translateY.value = withSpring(0)
        scale.value = withSpring(1)
        opacity.value = withSpring(1)
        shadowOpacity.value = withSpring(0.1)
      }
    })
    .shouldCancelWhenOutside(false)

  // Long press arms the drag and disables list scroll via parent onDragStart
  const longPress = Gesture.LongPress()
    .minDuration(500)
    .maxDistance(10)
    .onStart(() => {
      isLongPressed.value = true
      scale.value = withSpring(1.05)
      shadowOpacity.value = withSpring(0.4)
      runOnJS(onDragStart)(index)
    })
    .onFinalize(() => {
      // If long-press ended without pan dragging, reset and inform parent
      if (isLongPressed.value && !hasDragged.value) {
        isLongPressed.value = false
        translateY.value = withSpring(0)
        scale.value = withSpring(1)
        opacity.value = withSpring(1)
        shadowOpacity.value = withSpring(0.1)
        runOnJS(onDragEnd)(index, index)
      }
    })
    .shouldCancelWhenOutside(false)

  // Tap gesture for normal press
  const tap = Gesture.Tap().onEnd(() => {
    if (!isLongPressed.value && onPress) runOnJS(onPress)()
  })

  // Compose: let native scroll win if movement starts; otherwise allow tap or long-press→pan
  const finalGesture = Gesture.Race(
    Gesture.Native(),
    Gesture.Exclusive(tap, Gesture.Simultaneous(longPress, pan)),
  )

  // Cleanup effect to ensure no stuck states
  React.useEffect(() => {
    if (!isDragging && draggedOverIndex === null && originalDragIndex === null) {
      // Force reset all values when not dragging
      translateY.value = 0
      spacingOffset.value = 0
      scale.value = 1
      opacity.value = 1
      shadowOpacity.value = 0.1
      isLongPressed.value = false
    }
  }, [isDragging, draggedOverIndex, originalDragIndex])

  // React to draggedOverIndex changes to create proper swap animations
  React.useEffect(() => {
    if (isDragging) {
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

      spacingOffset.value = withSpring(shouldMove ? moveDistance : 0, {
        damping: shouldMove ? 25 : 35, // Faster return to normal
        stiffness: shouldMove ? 400 : 600,
      })
    } else {
      // No drag happening, reset quickly
      spacingOffset.value = withSpring(0, {
        damping: 35,
        stiffness: 600,
      })
    }
  }, [draggedOverIndex, originalDragIndex, index, isDragging, estimatedItemHeight, spacing.sm])

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value + spacingOffset.value }, { scale: scale.value }],
    opacity: opacity.value,
    zIndex: isLongPressed.value || isDragging ? 1000 : 1,
  }))

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
      <GestureDetector gesture={finalGesture}>
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
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
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

            {/* Drag handle - shows state */}
            <View
              style={{
                width: 20,
                height: 20,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: spacing.sm,
              }}
            >
              {isDragging ? (
                <Text style={{ fontSize: 16 }}>✋</Text>
              ) : (
                <>
                  <View
                    style={{
                      width: 3,
                      height: 3,
                      backgroundColor: colors.textDim,
                      borderRadius: 2,
                      marginBottom: 3,
                    }}
                  />
                  <View
                    style={{
                      width: 3,
                      height: 3,
                      backgroundColor: colors.textDim,
                      borderRadius: 2,
                      marginBottom: 3,
                    }}
                  />
                  <View
                    style={{
                      width: 3,
                      height: 3,
                      backgroundColor: colors.textDim,
                      borderRadius: 2,
                    }}
                  />
                </>
              )}
            </View>
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
      </GestureDetector>
    </Animated.View>
  )
}
