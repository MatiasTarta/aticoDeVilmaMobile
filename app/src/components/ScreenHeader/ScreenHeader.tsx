import type { ReactNode } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button/Button';
import { spacing } from '@/theme/theme';

import { styles } from './ScreenHeader.styles';

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
