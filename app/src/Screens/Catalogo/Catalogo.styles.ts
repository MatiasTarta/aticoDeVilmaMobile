import { StyleSheet } from 'react-native';

import { GRID_GAP, GRID_PADDING } from '@/theme/layout';
import { colors, fonts, spacing } from '@/theme/theme';

export const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    padding: GRID_PADDING,
    paddingBottom: spacing.xxl,
  },
  gridRow: {
    gap: GRID_GAP,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
    paddingHorizontal: 2,
  },
  summaryText: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontSize: 9.5,
    lineHeight: 13,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  summaryRule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
});
