import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { fonts, radii } from '@/lib/theme';

interface TagProps {
  label: string;
  color: string;
  style?: StyleProp<ViewStyle>;
}

/** Sello de categoría estampado sobre la ficha de papel. */
export function Tag({ label, color, style }: TagProps) {
  return (
    <View style={[styles.tag, { borderColor: color }, style]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
