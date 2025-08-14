import React, { memo, useEffect } from 'react'
import { Text, TextProps } from 'react-native'
import Animated, { useSharedValue, withTiming, useAnimatedProps } from 'react-native-reanimated'

type Props = TextProps & { text: string }

const AnimatedRNText = Animated.createAnimatedComponent(Text)

function AnimatedText({ text, ...rest }: Props) {
  const value = useSharedValue(text)

  useEffect(() => {
    // animate to new text by quickly updating value; in production you could crossfade
    value.value = text
  }, [text, value])

  // Simple fallback: render current text; we can enhance to crossfade later
  return <AnimatedRNText {...rest}>{text}</AnimatedRNText>
}

export default memo(AnimatedText)


