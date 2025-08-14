import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { memo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  interpolateColor,
  LinearTransition,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import Sortable, { useItemContext } from 'react-native-sortables';

import { useAppTheme } from '../../theme/context'
import { spacing } from '../../theme/spacing'

import { SEPARATOR } from './constants';
import type { Task } from './types';
import { minutesToTime } from './utils';

function formatDuration(duration: number) {
  'worklet';
  return `Duration: ${minutesToTime(duration)}`;
}

type TaskCardProps = Task & {
  startTimeMinutes: number;
  totalDurations: SharedValue<Record<string, number>>;
};

function TaskCard({
  duration,
  icon,
  startTimeMinutes,
  title,
  totalDurations
}: TaskCardProps) {
  const { itemKey, keyToIndex } = useItemContext();
  const { theme } = useAppTheme()
  const { colors } = theme

  const selectedAnimationProgress = useDerivedValue(() => {
    const itemIndex = keyToIndex.value[itemKey] ?? 0;
    const separatorIndex = keyToIndex.value[SEPARATOR] ?? 0;
    return withTiming(itemIndex < separatorIndex ? 1 : 0);
  });
  const isSelected = useDerivedValue(() =>
    Math.round(selectedAnimationProgress.value)
  );
  const animatedText = useSharedValue(formatDuration(duration));

  useAnimatedReaction(
    () => ({
      progress: selectedAnimationProgress.value,
      totalDuration: totalDurations.value[itemKey]
    }),
    ({ progress, totalDuration }) => {
      if (progress === 1 && totalDuration) {
        const startTime = startTimeMinutes + totalDuration - duration;
        animatedText.value = minutesToTime(startTime);
      } else if (progress === 0) {
        animatedText.value = formatDuration(duration);
      }
    },
    [totalDurations, itemKey, duration, startTimeMinutes]
  );

  const animatedCardStyle = useAnimatedStyle(() => ({
    ...(isSelected.value
      ? {
          justifyContent: 'flex-start',
          marginLeft: 60,
          minHeight: 1.5 * duration
        }
      : {
          justifyContent: 'center',
          marginLeft: 0,
          minHeight: 'auto'
        })
  }));

  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isSelected.value ? 1 : 1)
  }));

  const animatedSubtitleStyle = useAnimatedStyle(() =>
    isSelected.value
      ? {
          left: -110,
          position: 'absolute',
          top: -10
        }
      : {
          left: 0,
          position: 'relative',
          top: 0
        }
  );

  return (
    <Animated.View
      layout={LinearTransition}
      style={[styles.card, animatedCardStyle]}>
      <View style={styles.contentContainer}>
        <View style={styles.content}>
          <Text>{icon}</Text>
          <View style={{ flexShrink: 1 }}>
            <Animated.Text
              layout={LinearTransition}
              numberOfLines={1}
              style={[styles.title, animatedTitleStyle]}>
              {title}
            </Animated.Text>
            <Animated.Text
              layout={LinearTransition}
              style={[styles.subtitle, animatedSubtitleStyle]}
            >
              {animatedText.value}
            </Animated.Text>
          </View>
        </View>
        <Animated.View layout={LinearTransition}>
          <Sortable.Handle>
            <FontAwesome5 color='#d1d1d1' name='grip-horizontal' size={16} />
          </Sortable.Handle>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

export default memo(TaskCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
    gap: spacing.md
  },
  contentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between'
  },
  subtitle: {
    fontSize: 12,
    // Set to something large to prevent text clipping when text in the
    // animated text input changes
    width: Dimensions.get('window').width
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
    overflow: 'hidden'
  }
});
