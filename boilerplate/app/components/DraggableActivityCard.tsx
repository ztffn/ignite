import React, { useCallback } from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { Card } from './Card'
import { Icon } from './Icon'
import { useAppTheme } from '../theme/context'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
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
  defaultMode: 'walk' | 'metro' | 'bus' | 'car'
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
      case 'walk': return 'caretRight'
      case 'metro': return 'settings'
      case 'bus': return 'settings'
      case 'car': return 'settings'
      default: return 'caretRight'
    }
  }
  
  // Shared values for animations
  const translateY = useSharedValue(0)
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)
  const shadowOpacity = useSharedValue(0.1)
  const isLongPressed = useSharedValue(false)
  const spacingOffset = useSharedValue(0)

  // Combined gesture: pan that becomes drag after long press
  const combinedGesture = Gesture.Pan()
    .minDistance(0) // Start tracking immediately
    .runOnJS(true) // Force all callbacks to run on JS thread
    .onTouchesDown((event, stateManager) => {
      console.log('[Touch] Down')
    })
    .onStart((event) => {
      console.log('[Pan] Started - checking for drag vs scroll')
    })
    .onUpdate((event) => {
      const isMovingSignificantly = Math.abs(event.translationY) > 5 || Math.abs(event.translationX) > 5
      const isHorizontalScroll = Math.abs(event.translationX) > Math.abs(event.translationY) * 2
      
      // If moving horizontally or quickly, this is likely a scroll - don't interfere
      if (isHorizontalScroll || (isMovingSignificantly && !isLongPressed.value)) {
        return
      }
      
      // If long pressed and moving vertically, handle drag
      if (isLongPressed.value) {
        translateY.value = event.translationY
        
        // Calculate which item we're hovering over
        const dragDistance = event.translationY
        const itemHeight = estimatedItemHeight + spacing.sm
        const delta = Math.round(dragDistance / itemHeight)
        const hoverIndex = Math.max(0, Math.min(index + delta, listLength - 1))
        
        if (onDragUpdate && hoverIndex !== index) {
          onDragUpdate(index, hoverIndex)
        }
        
        opacity.value = interpolate(
          Math.abs(event.translationY),
          [0, DRAG_THRESHOLD],
          [1, 0.9],
          Extrapolate.CLAMP
        )
      }
    })
    .onEnd((event) => {
      if (isLongPressed.value) {
        const shouldReorder = Math.abs(event.translationY) > DRAG_THRESHOLD
        
        if (shouldReorder) {
          // Calculate new index based on drag distance
          const itemHeight = estimatedItemHeight + spacing.sm
          const dragDistance = event.translationY
          const delta = Math.round(dragDistance / itemHeight)
          const unclamped = index + delta
          const newIndex = Math.max(0, Math.min(unclamped, Math.max(0, listLength - 1)))
          
          console.log('[Drag] Reorder from', index, 'to', newIndex, 'dragDistance:', dragDistance)
          
          // Trigger reorder immediately and smoothly settle to natural position
          onDragEnd(index, newIndex)
        }
        
        // Always animate back to normal position and visual state
        translateY.value = withSpring(0, {
          damping: 30,
          stiffness: 500,
        })
        
        // Reset all drag state immediately and completely
        isLongPressed.value = false
        
        // Reset visual state with faster animations (pop back in)
        scale.value = withSpring(1, {
          damping: 25,
          stiffness: 400,
        })
        opacity.value = withSpring(1, {
          damping: 25,
          stiffness: 400,
        })
        shadowOpacity.value = withSpring(0.1, {
          damping: 25,
          stiffness: 400,
        })
      }
    })

  // Long press timer (separate from gesture)
  const longPressTimer = useSharedValue<NodeJS.Timeout | null>(null)
  
  // Manual long press detection
  const startLongPressTimer = useCallback(() => {
    if (longPressTimer.value) {
      clearTimeout(longPressTimer.value)
    }
    longPressTimer.value = setTimeout(() => {
      console.log('[Drag] Long press activated')
      onDragStart(index)
      isLongPressed.value = true
      scale.value = withSpring(1.05)
      shadowOpacity.value = withSpring(0.4)
    }, 500)
  }, [index, onDragStart])

  const cancelLongPressTimer = useCallback(() => {
    if (longPressTimer.value) {
      clearTimeout(longPressTimer.value)
      longPressTimer.value = null
    }
  }, [])

  // Tap gesture for normal press
  const tap = Gesture.Tap()
    .onEnd(() => {
      if (!isLongPressed.value) {
        console.log('[Card] Tap:', activity.title)
        if (onPress) {
          onPress()
        }
      }
    })

  // Combined gesture with manual timer control
  const finalGesture = Gesture.Exclusive(
    combinedGesture
      .onTouchesDown(() => {
        startLongPressTimer()
      })
      .onTouchesMove((event) => {
        const movement = Math.sqrt(event.allTouches[0]?.x ** 2 + event.allTouches[0]?.y ** 2) || 0
        if (movement > 10) {
          cancelLongPressTimer()
        }
      })
      .onTouchesUp(() => {
        cancelLongPressTimer()
      }),
    tap.runOnJS(true) // Make tap also run on JS thread
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
    } else if (typeof draggedOverIndex === 'number' && typeof originalDragIndex === 'number') {
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
    transform: [
      { translateY: translateY.value + spacingOffset.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
    zIndex: (isLongPressed.value || isDragging) ? 1000 : 1,
  }))

  const shadowStyle = useAnimatedStyle(() => ({
    shadowOpacity: shadowOpacity.value,
    shadowRadius: interpolate(shadowOpacity.value, [0.1, 0.4], [4, 12], Extrapolate.CLAMP),
    shadowOffset: { width: 0, height: interpolate(shadowOpacity.value, [0.1, 0.4], [2, 8], Extrapolate.CLAMP) },
    elevation: shadowOpacity.value * 25,
  }))

  const handlePress = useCallback(() => {
    console.log('[Card] pressed:', activity.title)
    if (onPress) {
      onPress()
    }
  }, [onPress, activity.title])

  return (
    <Animated.View style={[animatedStyle, shadowStyle, { marginBottom: spacing.sm }]}>
      <GestureDetector gesture={finalGesture}>
        <Animated.View style={{
          backgroundColor: isDragging ? colors.border : colors.background,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: isDragging ? colors.tint : colors.border,
          padding: spacing.md,
        }}>
          
          {/* Main content row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '600', 
                color: colors.text,
                marginBottom: 4
              }}>
                {activity.time} - {activity.title}
              </Text>
              {activity.location && (
                <Text style={{ 
                  fontSize: 14, 
                  color: colors.textDim
                }}>
                  {activity.location}
                </Text>
              )}
            </View>
            
            {/* Drag handle - shows state */}
            <View style={{ 
              width: 20, 
              height: 20, 
              justifyContent: 'center', 
              alignItems: 'center',
              marginLeft: spacing.sm
            }}>
              {isDragging ? (
                <Text style={{ fontSize: 16 }}>✋</Text>
              ) : (
                <>
                  <View style={{ 
                    width: 3, 
                    height: 3, 
                    backgroundColor: colors.textDim, 
                    borderRadius: 2,
                    marginBottom: 3 
                  }} />
                  <View style={{ 
                    width: 3, 
                    height: 3, 
                    backgroundColor: colors.textDim, 
                    borderRadius: 2,
                    marginBottom: 3 
                  }} />
                  <View style={{ 
                    width: 3, 
                    height: 3, 
                    backgroundColor: colors.textDim, 
                    borderRadius: 2 
                  }} />
                </>
              )}
            </View>
          </View>

          {/* Integrated transport route - attached to bottom of activity */}
          {nextRoute && !isLastActivity && (
            <View style={{
              marginTop: spacing.sm,
              paddingTop: spacing.sm,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs,
                backgroundColor: colors.border,
                borderRadius: 12,
              }}>
                <Icon 
                  icon={getModeIcon(nextRoute.defaultMode)}
                  size={12} 
                  color={colors.textDim}
                />
                <Text style={{ 
                  fontSize: 11, 
                  color: colors.textDim, 
                  marginLeft: spacing.xs,
                  fontWeight: '500'
                }}>
                  {nextRoute.totalTime}
                </Text>
                {nextRoute.totalCost && (
                  <Text style={{ 
                    fontSize: 11, 
                    color: colors.textDim, 
                    marginLeft: spacing.xs 
                  }}>
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
