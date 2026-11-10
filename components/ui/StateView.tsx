import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, fonts, radii, spacing } from '@/constants/theme';

import { Button } from './Button';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.amber,
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.paperEdge,
    borderRadius: radii.xs,
    padding: spacing.xl - 4,
    gap: spacing.md,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  serial: {
    color: colors.inkMuted,
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1.6,
  },
  stamp: {
    borderWidth: 1.5,
    borderRadius: radii.xs,
    paddingHorizontal: 6,
    paddingVertical: 3,
    transform: [{ rotate: '-2deg' }],
  },
  stampText: {
    fontFamily: fonts.mono,
    fontSize: 8.5,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  rule: {
    height: 1,
    backgroundColor: 'rgba(43, 33, 25, 0.16)',
  },
  message: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 23,
    lineHeight: 29,
    letterSpacing: -0.3,
  },
  help: {
    color: colors.inkMuted,
    fontSize: 13.5,
    lineHeight: 20,
    marginTop: -4,
  },
  action: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
});
