import { StyleSheet } from 'react-native';

import { colors, fonts, radii, spacing } from '@/theme/theme';

export const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    color: colors.inkMuted,
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 13,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.paperEdge,
    borderRadius: radii.sm,
    backgroundColor: '#f7f0e4',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
  },
  error: {
    color: colors.dangerInk,
    fontSize: 12.5,
    lineHeight: 18,
  },
});
