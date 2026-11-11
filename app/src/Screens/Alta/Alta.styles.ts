import { StyleSheet } from 'react-native';

import { colors, fonts, radii, spacing } from '@/theme/theme';

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
    gap: spacing.lg,
  },
  eyebrow: {
    color: colors.inkMuted,
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: -spacing.sm,
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 31,
    letterSpacing: -0.4,
  },
  note: {
    marginTop: -spacing.sm,
    color: colors.inkMuted,
    fontSize: 12.5,
    lineHeight: 18,
  },
  rule: {
    height: 1,
    backgroundColor: 'rgba(43, 33, 25, 0.16)',
  },
  enviar: {
    alignSelf: 'flex-start',
  },
});
