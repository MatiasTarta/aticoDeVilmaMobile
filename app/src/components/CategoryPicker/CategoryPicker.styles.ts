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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.paperEdge,
    borderRadius: radii.xs,
    paddingHorizontal: spacing.md,
  },
  chipActivo: {
    borderColor: colors.ink,
    backgroundColor: colors.ink,
  },
  chipPresionado: {
    opacity: 0.85,
  },
  chipTexto: {
    color: colors.inkMuted,
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  chipTextoActivo: {
    color: colors.paper,
  },
  error: {
    color: colors.dangerInk,
    fontSize: 12.5,
    lineHeight: 18,
  },
});
