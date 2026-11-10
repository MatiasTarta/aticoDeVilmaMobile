import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { colors, fonts, radii, spacing } from '@/constants/theme';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'No encontrado' }} />
      <Screen contentStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.head}>
            <Text style={styles.serial}>N.º —</Text>
            <View style={styles.stamp}>
              <Text style={styles.stampText}>Extraviada</Text>
            </View>
          </View>

          <View style={styles.frame}>
            <Text style={styles.frameMark}>?</Text>
            <Text style={styles.frameCaption}>Sin imagen</Text>
          </View>

          <Text style={styles.title} accessibilityRole="header">
            Esta pantalla no existe.
          </Text>
          <Text style={styles.body}>
            La ficha que buscás no está en el catálogo del ático.
          </Text>

          <Button
            variant="ink"
            label="Volver al inicio"
            onPress={() => router.replace('/')}
            style={styles.action}
          />
        </View>

        <Text style={styles.footnote}>Ático de Vilma · Catálogo</Text>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.paperEdge,
    borderRadius: radii.xs,
    padding: spacing.xl - 4,
    gap: spacing.md,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  serial: {
    color: colors.inkMuted,
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.6,
  },
  stamp: {
    borderWidth: 1.5,
    borderColor: colors.dangerInk,
    borderRadius: radii.xs,
    paddingHorizontal: 6,
    paddingVertical: 3,
    transform: [{ rotate: '-2deg' }],
  },
  stampText: {
    color: colors.dangerInk,
    fontFamily: fonts.mono,
    fontSize: 8.5,
    lineHeight: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  frame: {
    aspectRatio: 16 / 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(43, 33, 25, 0.3)',
    borderRadius: radii.xs,
    backgroundColor: 'rgba(43, 33, 25, 0.04)',
  },
  frameMark: {
    color: 'rgba(43, 33, 25, 0.3)',
    fontFamily: fonts.display,
    fontSize: 40,
    lineHeight: 46,
  },
  frameCaption: {
    position: 'absolute',
    right: 10,
    bottom: 8,
    color: 'rgba(43, 33, 25, 0.4)',
    fontFamily: fonts.mono,
    fontSize: 8,
    lineHeight: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 31,
    letterSpacing: -0.4,
  },
  body: {
    color: colors.inkMuted,
    fontSize: 14.5,
    lineHeight: 21,
    marginTop: -4,
  },
  action: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  footnote: {
    marginTop: spacing.xl,
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 8.5,
    lineHeight: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
