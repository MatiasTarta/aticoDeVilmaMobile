import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { colors, spacing, typography } from '@/constants/theme';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'No encontrado' }} />
      <Screen contentStyle={styles.container}>
        <Text style={styles.title}>Esta pantalla no existe.</Text>
        <Button
          label="Volver al inicio"
          onPress={() => router.replace('/')}
          style={{ marginTop: spacing.lg }}
        />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '400',
    color: colors.text,
    textAlign: 'center',
  },
});
