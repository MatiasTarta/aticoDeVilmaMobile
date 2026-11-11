import { StyleSheet } from 'react-native';

import { colors, fonts, radii } from '@/theme/theme';

export const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  primary: {
    backgroundColor: colors.amber,
    borderWidth: 1,
    borderColor: colors.amber,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(43, 33, 25, 0.35)',
    borderRadius: radii.sm,
    paddingVertical: 13,
    paddingHorizontal: 22,
  },
  primaryHover: {
    backgroundColor: '#e2ad6d',
  },
  ink: {
    backgroundColor: colors.ink,
    borderWidth: 1,
    borderColor: colors.ink,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: radii.sm,
    paddingVertical: 13,
    paddingHorizontal: 22,
  },
  inkHover: {
    backgroundColor: '#3a2d22',
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.amber,
    backgroundColor: 'transparent',
  },
  iconHover: {
    backgroundColor: colors.amberSoft,
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 2,
    minHeight: 40,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    color: colors.text,
  },
  primaryLabel: {
    color: colors.ink,
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 1.6,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  inkLabel: {
    color: colors.paper,
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 1.6,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  iconLabel: {
    color: colors.amber,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '400',
  },
  ghostLabel: {
    color: colors.amber,
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.2,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  ghostHover: {
    opacity: 0.75,
  },
});
