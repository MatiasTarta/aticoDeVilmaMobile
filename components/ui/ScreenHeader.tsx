import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MAX_CONTENT_WIDTH } from '@/lib/layout';
import { colors, fonts, spacing } from '@/lib/theme';

import { Button } from './Button';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  backLabel?: string;
  rightAction?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ScreenHeader({
  title,
  onBack,
  backLabel = '← Inicio',
  rightAction,
  style,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingTop: insets.top + spacing.sm }, style]}>
      <View style={styles.row}>
        <View style={styles.side}>
          {onBack ? (
            <Button variant="ghost" label={backLabel} onPress={onBack} />
          ) : null}
        </View>

        <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
          {title}
        </Text>

        <View style={[styles.side, styles.sideRight]}>{rightAction}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
