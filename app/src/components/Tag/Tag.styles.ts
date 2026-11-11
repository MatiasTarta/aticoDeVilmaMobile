import { StyleSheet } from 'react-native';

import { fonts, radii } from '@/theme/theme';

export const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderRadius: radii.xs,
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: 'transparent',
    transform: [{ rotate: '-2deg' }],
  },
  text: {
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
