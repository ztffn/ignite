import {
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

export type IconTypes = keyof typeof iconRegistry

export const iconRegistry = {
  back: "arrow-back",
  bell: "notifications",
  caretLeft: "chevron-back",
  caretRight: "chevron-forward",
  caretUp: "chevron-up",
  caretDown: "chevron-down",
  check: "checkmark",
  clap: "hand-left",
  community: "people",
  components: "grid",
  debug: "bug",
  github: "logo-github",
  heart: "heart",
  hidden: "eye-off",
  ladybug: "bug",
  lock: "lock-closed",
  menu: "menu",
  more: "ellipsis-horizontal",
  pin: "location",
  podcast: "mic",
  settings: "settings",
  slack: "chatbubbles",
  view: "eye",
  x: "close",
  // New icons for bottom navigation
  home: "home",
  calendar: "calendar",
  mapPin: "location",
  compass: "compass",
  // Activity type icons
  hotel: "bed",
  restaurant: "restaurant",
  nature: "leaf",
  social: "people",
  museum: "school",
  culture: "library",
  entertainment: "musical-notes",
  coffee: "cafe",
  medical: "medkit",
  shopping: "cart",
  note: "document-text",
  document: "document-text",
  // Transport mode icons
  walk: "walk",
  metro: "subway",
  bus: "bus",
  car: "car",
  train: "train",
  time: "time",
}

interface IconProps extends TouchableOpacityProps {
  /**
   * The name of the icon
   */
  icon: IconTypes

  /**
   * An optional tint color for the icon
   */
  color?: string

  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  size?: number

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps["onPress"]
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Icon.md)
 */
export function Icon(props: IconProps) {
  const {
    icon,
    color,
    size,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  const isPressable = !!WrapperProps.onPress
  const Wrapper: React.ComponentType<TouchableOpacityProps> = WrapperProps?.onPress
    ? TouchableOpacity
    : View

  return (
    <Wrapper
      accessibilityRole={isPressable ? "imagebutton" : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
      <Ionicons
        name={iconRegistry[icon] as any}
        size={size}
        color={color}
        style={$imageStyleOverride}
      />
    </Wrapper>
  )
}
