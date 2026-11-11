import { StyleSheet } from 'react-native';

import { MAX_CONTENT_WIDTH } from '@/theme/layout';
import { colors, fonts, spacing } from '@/theme/theme';

export const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 2,
    borderTopColor: colors.amberSoft,
    paddingBottom: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
  },
  row: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    minHeight: 42,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  side: {
    minWidth: 80,
    flexShrink: 0,
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    color: colors.cream,
    fontFamily: fonts.mono,
    fontSize: 13,
    letterSpacing: 3,
    lineHeight: 18,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
