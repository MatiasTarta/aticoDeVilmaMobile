import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '@/theme/theme';

export const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderColor: colors.dangerInk,
    backgroundColor: '#f3e2d9',
    borderRadius: radii.xs,
    padding: spacing.md,
  },
  text: {
    color: colors.dangerInk,
    fontSize: 13,
    lineHeight: 19,
  },
});
