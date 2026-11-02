import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { radii } from '@/constants/theme';

interface TagProps {
  label: string;
  color: string;
  style?: StyleProp<ViewStyle>;
}

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
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
