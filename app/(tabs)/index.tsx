import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from '@/components/ui/Button'
import { Screen } from '@/components/ui/Screen'
import { colors, spacing } from '@/constants/theme'
import { useResponsive } from '@/hooks/useResponsive'

export default function Home() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { titleFontSize } = useResponsive()

  const handleStart = useCallback(() => {
    router.push('/cuadriculada')
  }, [router])

  return (
    <Screen contentStyle={styles.container}>
      <View style={styles.glow} />

      <View style={styles.content}>
        <Text style={styles.eyebrow}>✦ colección de instrumentos ✦</Text>
        <Text
          style={[
            styles.title,
            { fontSize: titleFontSize, lineHeight: titleFontSize * 1.05 },
          ]}
        >
          El Ático{'\n'}de Vilma
        </Text>
        <Text style={styles.sub}>
          Un lugar donde cada instrumento{'\n'}guarda su propia historia
        </Text>
        <Button
          label="Ver Instrumentos  →"
          onPress={handleStart}
          style={{ marginTop: spacing.md }}
        />
      </View>

      <Text style={[styles.footer, { bottom: spacing.xl + insets.bottom }]}>
        Est. 2025 · Laboratorio de Interfaces
      </Text>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(78,205,196,0.06)',
    top: '20%',
    alignSelf: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 18,
    maxWidth: 720,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.teal,
    opacity: 0.8,
    textAlign: 'center',
  },
  title: {
    color: colors.cream,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sub: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.muted,
    lineHeight: 26,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    fontSize: 11,
    letterSpacing: 2,
    color: colors.muted,
    opacity: 0.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
})
