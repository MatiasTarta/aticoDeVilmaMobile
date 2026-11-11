import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { MAX_CONTENT_WIDTH } from '@/theme/layout';

import { styles } from './Screen.styles';

interface ScreenProps {
  children: ReactNode;
  header?: ReactNode;
  /** Fondo decorativo full-bleed (haz de luz, fotografía, textura). */
  backdrop?: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  maxWidth?: number;
}

export function Screen({
  children,
  header,
  backdrop,
  style,
  contentStyle,
  maxWidth = MAX_CONTENT_WIDTH,
}: ScreenProps) {
  return (
    <View style={[styles.root, style]}>
      {backdrop ? (
        <View
          style={styles.backdrop}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {backdrop}
        </View>
      ) : null}
      {header}
      <View style={[styles.content, { maxWidth }, contentStyle]}>{children}</View>
    </View>
  );
}
