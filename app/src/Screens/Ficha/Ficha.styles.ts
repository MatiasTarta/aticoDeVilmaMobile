import { StyleSheet } from 'react-native';

import { colors, fonts, radii, spacing } from '@/theme/theme';

export const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.paperEdge,
    borderRadius: radii.xs,
    padding: 20,
    gap: spacing.md,
  },
  serialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  serial: {
    color: colors.inkMuted,
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.4,
  },
  imageFrame: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: colors.imageBg,
    borderWidth: 1,
    borderColor: 'rgba(43, 33, 25, 0.18)',
    borderRadius: radii.xs,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  nombre: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 31,
    letterSpacing: -0.4,
  },
  rule: {
    height: 1,
    backgroundColor: 'rgba(43, 33, 25, 0.16)',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  metaLabel: {
    color: colors.inkMuted,
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 13,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  metaValue: {
    flexShrink: 1,
    color: colors.ink,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'right',
  },
  action: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
});
