import {
  ActivityIndicator,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Button } from '@/components/Button/Button';
import { colors } from '@/theme/theme';

import { styles } from './StateView.styles';

type StateVariant = 'loading' | 'error' | 'empty';

interface StateAction {
  label: string;
  onPress: () => void;
}

interface StateViewProps {
  variant: StateVariant;
  message?: string;
  action?: StateAction;
  stampLabel?: string;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_MESSAGES: Record<StateVariant, string> = {
  loading: 'Cargando…',
  error: 'No se pudo conectar al servidor.',
  empty: 'No hay instrumentos.',
};

export function StateView({ variant, message, action, stampLabel, style }: StateViewProps) {
  if (variant === 'loading') {
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size="large" color={colors.amber} />
        <Text style={styles.loadingText}>{message ?? DEFAULT_MESSAGES.loading}</Text>
      </View>
    );
  }

  const isError = variant === 'error';
  const stampColor = isError ? colors.dangerInk : colors.inkMuted;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.card}>
        <View style={styles.cardHead}>
          <Text style={styles.serial}>N.º —</Text>
          <View style={[styles.stamp, { borderColor: stampColor }]}>
            <Text style={[styles.stampText, { color: stampColor }]}>
              {stampLabel ?? (isError ? 'Error de conexión' : 'Catálogo vacío')}
            </Text>
          </View>
        </View>

        <View style={styles.rule} />

        <Text style={styles.message}>{message ?? DEFAULT_MESSAGES[variant]}</Text>

        {isError ? (
          <Text style={styles.help}>
            Revisá que el servidor esté encendido y volvé a intentar.
          </Text>
        ) : null}

        {action ? (
          <Button
            variant="ink"
            label={action.label}
            onPress={action.onPress}
            style={styles.action}
          />
        ) : null}
      </View>
    </View>
  );
}
