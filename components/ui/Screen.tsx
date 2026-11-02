import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/constants/theme';

const DEFAULT_MAX_WIDTH = 1100;

interface ScreenProps {
  children: ReactNode;
  header?: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  maxWidth?: number;
}

export function Screen({
  children,
  header,
  style,
  contentStyle,
  maxWidth = DEFAULT_MAX_WIDTH,
}: ScreenProps) {
  return (
    <View style={[styles.root, style]}>
      {header}
      <View style={[styles.content, { maxWidth }, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
});
