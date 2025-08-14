import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { useAnimatedReaction, useSharedValue } from 'react-native-reanimated';

import { Text } from 'react-native'
import { useAppTheme } from '../../theme/context'
import { spacing } from '../../theme/spacing'

import { SectionHeader } from './SectionHeader';
import { minutesToTime } from './utils';

type PlannedTasksHeaderProps = {
  totalDurations: SharedValue<Record<string, number>>;
  startTimeMinutes: number;
};

function PlannedTasksHeader({
  startTimeMinutes,
  totalDurations
}: PlannedTasksHeaderProps) {
  const animatedText = useSharedValue('Planned Tasks');
  const { theme } = useAppTheme()
  const { colors } = theme

  useAnimatedReaction(
    () => totalDurations.value,
    durations => {
      const keys = Object.keys(durations);
      const lastKey = keys[keys.length - 1];
      const totalDuration = lastKey && durations[lastKey];

      if (!totalDuration) {
        animatedText.value = 'No planned tasks';
      } else {
        const endTimeMinutes = startTimeMinutes + totalDuration;
        animatedText.value = `${minutesToTime(startTimeMinutes)} - ${minutesToTime(endTimeMinutes)}`;
      }
    }
  );

  return (
    <View>
      <SectionHeader title='Planned Tasks' />
      <Text style={{ color: colors.text, marginBottom: spacing.lg, marginHorizontal: spacing.sm, textAlign: 'center' }}>
        {animatedText.value}
      </Text>
    </View>
  );
}

export default memo(PlannedTasksHeader);

const styles = StyleSheet.create({});
