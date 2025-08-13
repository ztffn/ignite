import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Icon } from './Icon'
import { useAppTheme } from '../theme/context'

interface RouteStep {
  id: string
  mode: 'walk' | 'metro' | 'bus' | 'car'
  description: string
  duration: string
}

interface TravelRoute {
  id: string
  fromActivityId: string
  toActivityId: string
  defaultMode: 'walk' | 'metro' | 'bus' | 'car'
  totalTime: string
  totalDistance: string
  totalCost?: string
  steps: RouteStep[]
  offline?: boolean
}

interface TravelRouteChunkProps {
  route: TravelRoute
  fromPlace: string
  toPlace: string
  expanded: boolean
  onToggle: () => void
}

export const TravelRouteChunk: React.FC<TravelRouteChunkProps> = ({
  route,
  fromPlace,
  toPlace,
  expanded,
  onToggle,
}) => {
  const { theme } = useAppTheme()
  const { colors, spacing } = theme

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'walk':
        return 'pin'
      case 'metro':
        return 'settings'
      case 'bus':
        return 'settings'
      case 'car':
        return 'settings'
      default:
        return 'settings'
    }
  }

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'walk':
        return '#4CAF50'
      case 'metro':
        return '#2196F3'
      case 'bus':
        return '#FF9800'
      case 'car':
        return '#9C27B0'
      default:
        return colors.textDim
    }
  }

  return (
    <View style={{ marginBottom: spacing.sm, alignItems: 'center' }}>
      {/* Travel route indicator - simple vertical line with transport info */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        backgroundColor: colors.border,
        borderRadius: 16,
        marginVertical: spacing.xs,
      }}>
        <Icon 
          icon={getModeIcon(route.defaultMode)}
          size={14} 
          color={getModeColor(route.defaultMode)}
        />
        <Text style={{ 
          fontSize: 12, 
          color: colors.textDim, 
          marginLeft: spacing.xs,
          fontWeight: '500'
        }}>
          {route.totalTime}
        </Text>
        {route.totalCost && (
          <Text style={{ 
            fontSize: 12, 
            color: colors.textDim, 
            marginLeft: spacing.xs 
          }}>
            • {route.totalCost}
          </Text>
        )}
      </View>
      
      {/* Optional expanded details */}
      {expanded && (
        <View style={{ 
          backgroundColor: colors.background, 
          marginTop: spacing.xs,
          padding: spacing.sm,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.border,
          width: '90%',
        }}>
          {route.steps.map((step, index) => (
            <View key={step.id} style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginBottom: index < route.steps.length - 1 ? spacing.xs : 0 
            }}>
              <Icon 
                icon={getModeIcon(step.mode)}
                size={12} 
                color={getModeColor(step.mode)}
              />
              <Text style={{ fontSize: 12, color: colors.text, marginLeft: spacing.xs, flex: 1 }}>
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
