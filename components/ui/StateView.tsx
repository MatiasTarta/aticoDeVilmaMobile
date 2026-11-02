import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors } from '@/constants/theme';

type StateVariant = 'loading' | 'error' | 'empty';

interface StateViewProps {
  variant: StateVariant;
  message?: string;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_MESSAGES: Record<StateVariant, string> = {
  loading: 'Cargando…',
  error: 'No se pudo conectar al servidor.',
  empty: 'No hay instrumentos.',
};

export function StateView({ variant, message, style }: StateViewProps) {
  return (
    <View style={[styles.container, style]}>
      {variant === 'loading' && <ActivityIndicator size="large" color={colors.teal} />}
      <Text
        style={[
          styles.text,
          variant === 'loading' && styles.loadingText,
          variant === 'error' && styles.errorText,
          variant === 'empty' && styles.emptyText,
        ]}
      >
        {message ?? DEFAULT_MESSAGES[variant]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  text: {
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  loadingText: {
    color: colors.teal,
    fontSize: 14,
    fontStyle: 'normal',
    marginTop: 10,
  },
  errorText: {
    color: colors.danger,
  },
  emptyText: {
    color: colors.textMuted,
  },
});
