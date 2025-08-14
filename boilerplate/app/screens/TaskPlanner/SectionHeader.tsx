import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { spacing } from '../../theme/spacing'
import { useAppTheme } from '../../theme/context'

interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  const { theme } = useAppTheme()
  const { colors } = theme
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.line} />
        <Text style={[styles.text, { color: colors.text }]}>{title}</Text>
        <View style={styles.line} />
      </View>
    </View>
  );
}

export default memo(SectionHeader);

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xs,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.xs
  },
  line: {
    backgroundColor: '#ddd',
    flex: 1,
    height: 1
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: spacing.sm
  }
});
