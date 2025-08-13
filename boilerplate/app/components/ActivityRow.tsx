import { memo } from "react"
import { View, TouchableOpacity } from "react-native"
import { Card } from "./Card"
import { Text } from "./Text"
import { Icon, IconTypes } from "./Icon"
import { useAppTheme } from "../theme/context"

export type ActivityType =
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

export interface ActivityRowProps {
  time: string
  type: ActivityType
  title: string
  subtitle?: string
  hasDocument?: boolean
  onPress?: () => void
}

const typeToIcon: Record<ActivityType, IconTypes> = {
  restaurant: "restaurant",
  attraction: "compass",
  transport: "train",
  hotel: "hotel",
  note: "note",
  shopping: "shopping",
  wine: "restaurant",
  nature: "nature",
  entertainment: "entertainment",
  coffee: "coffee",
  medical: "medical",
  culture: "culture",
  social: "social",
  museum: "museum",
}

export const ActivityRow = memo((props: ActivityRowProps) => {
  const { theme } = useAppTheme()
  const { colors, spacing } = theme

  const { time, type, title, subtitle, hasDocument, onPress } = props

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={{ flexDirection: "row", paddingVertical: spacing.md }}>
        <View style={{ width: 64, paddingTop: 2 }}>
          <Text style={{ color: colors.textDim }}>{time}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon icon={typeToIcon[type]} size={18} color={colors.tint} />
            <Text style={{ marginLeft: spacing.sm, fontWeight: "600" }}>{title}</Text>
            {hasDocument ? (
              <Icon icon="document" size={14} color={colors.textDim} style={{ marginLeft: spacing.xs }} />
            ) : null}
          </View>
          {subtitle ? (
            <Text style={{ color: colors.textDim, marginTop: 4 }}>{subtitle}</Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  )
})


