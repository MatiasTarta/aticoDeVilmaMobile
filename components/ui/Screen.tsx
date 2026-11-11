import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { MAX_CONTENT_WIDTH } from '@/lib/layout';
import { colors } from '@/lib/theme';

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
          pointerEvents="none"
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
});
