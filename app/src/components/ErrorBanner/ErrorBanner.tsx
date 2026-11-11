import { Text, View } from 'react-native';

import { styles } from './ErrorBanner.styles';

interface ErrorBannerProps {
  message: string;
}

/** Aviso de error del servidor al pie del formulario. */
export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <View style={styles.banner} accessibilityLiveRegion="polite">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
