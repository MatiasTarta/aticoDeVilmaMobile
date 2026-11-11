import { StyleSheet } from 'react-native';

import { GRID_GAP } from '@/theme/layout';
import { colors, fonts, radii, spacing } from '@/theme/theme';

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: GRID_GAP,
  },
  card: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.paperEdge,
    borderRadius: radii.xs,
    padding: 10,
  },
  cardHover: {
    backgroundColor: '#f5eddf',
    borderColor: colors.amber,
  },
  cardPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.985 }],
  },
  serialRow: {
    minHeight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginBottom: spacing.sm,
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
    marginTop: 10,
    minHeight: 44,
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 19,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  metaRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(43, 33, 25, 0.14)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  meta: {
    flexShrink: 1,
    color: colors.inkMuted,
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
