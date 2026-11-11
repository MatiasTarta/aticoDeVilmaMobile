import { StyleSheet } from 'react-native';

import { colors, fonts, radii, spacing } from '@/theme/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.amber,
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.paperEdge,
    borderRadius: radii.xs,
    padding: spacing.xl - 4,
    gap: spacing.md,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  serial: {
    color: colors.inkMuted,
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1.6,
  },
  stamp: {
    borderWidth: 1.5,
    borderRadius: radii.xs,
    paddingHorizontal: 6,
    paddingVertical: 3,
    transform: [{ rotate: '-2deg' }],
  },
  stampText: {
    fontFamily: fonts.mono,
    fontSize: 8.5,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  rule: {
    height: 1,
    backgroundColor: 'rgba(43, 33, 25, 0.16)',
  },
  message: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 23,
    lineHeight: 29,
    letterSpacing: -0.3,
  },
  help: {
    color: colors.inkMuted,
    fontSize: 13.5,
    lineHeight: 20,
    marginTop: -4,
  },
  action: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
});
