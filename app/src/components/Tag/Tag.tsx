import { Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { styles } from './Tag.styles';

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
