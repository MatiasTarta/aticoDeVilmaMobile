import { useState } from 'react';
import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';

import { styles } from './Button.styles';

type ButtonVariant = 'primary' | 'ink' | 'icon' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  accessibilityLabel,
  testID,
  style,
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'ink' && styles.ink,
        variant === 'icon' && styles.icon,
        variant === 'ghost' && styles.ghost,
        variant === 'primary' && hovered && !disabled && styles.primaryHover,
        variant === 'ink' && hovered && !disabled && styles.inkHover,
        variant === 'icon' && hovered && !disabled && styles.iconHover,
        variant === 'ghost' && hovered && !disabled && styles.ghostHover,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'primary' && styles.primaryLabel,
          variant === 'ink' && styles.inkLabel,
          variant === 'icon' && styles.iconLabel,
          variant === 'ghost' && styles.ghostLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
