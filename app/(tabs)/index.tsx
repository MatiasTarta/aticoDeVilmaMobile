import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from '@/components/ui/Button'
import { Screen } from '@/components/ui/Screen'
import { colors, fonts, spacing } from '@/lib/theme'
import { useResponsive } from '@/lib/useResponsive'

const FONDO = require('../../assets/images/attico-fondo.jpg')

function HomeBackdrop() {
  return (
    <>
      <Image source={FONDO} style={styles.backdropImage} resizeMode="cover" accessible={false} />
      <View style={styles.backdropWash} />
      <View style={styles.beam} />
      <View style={styles.beamEdge} />
    </>
  )
}

export default function Home() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { titleFontSize, width } = useResponsive()

  const handleStart = useCallback(() => {
    router.push('/cuadriculada')
  }, [router])

  return (
    <Screen backdrop={<HomeBackdrop />} contentStyle={styles.container}>
      {width >= 900 ? <View style={styles.frame} pointerEvents="none" /> : null}

      <View style={[styles.topMeta, { top: insets.top + spacing.lg }]}>
        <Text style={styles.meta}>N.º 001</Text>
        <Text style={styles.meta}>Ático · Est. 2025</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.eyebrowRow}>
          <View style={styles.rule} />
          <Text style={styles.eyebrow}>Colección de instrumentos</Text>
          <View style={styles.rule} />
        </View>

        <Text
          style={[
            styles.title,
            {
              fontSize: titleFontSize,
              lineHeight: titleFontSize * 0.97,
              letterSpacing: -titleFontSize * 0.02,
            },
          ]}
        >
          El Ático{'\n'}de Vilma
        </Text>

        <Text style={styles.sub}>
          Un lugar donde cada instrumento{'\n'}guarda su propia historia
        </Text>

        <Button
          label="Ver instrumentos →"
          onPress={handleStart}
          style={styles.cta}
        />
      </View>

      <Text style={[styles.footer, { bottom: insets.bottom + spacing.xl }]}>
        Est. 2025 · Laboratorio de Interfaces
      </Text>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 72,
  },
  backdropImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.42,
  },
  backdropWash: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(11, 9, 8, 0.6)',
  },
  beam: {
    position: 'absolute',
    top: '-25%',
    left: '26%',
    width: '34%',
    height: '150%',
    backgroundColor: 'rgba(217, 160, 91, 0.05)',
    transform: [{ rotate: '-18deg' }],
  },
  beamEdge: {
    position: 'absolute',
    top: '-25%',
    left: '59%',
    width: 1,
    height: '150%',
    backgroundColor: 'rgba(217, 160, 91, 0.10)',
    transform: [{ rotate: '-18deg' }],
  },
  frame: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    left: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(239, 230, 214, 0.12)',
  },
  topMeta: {
    position: 'absolute',
    left: 28,
    right: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  meta: {
    color: 'rgba(239, 230, 214, 0.55)',
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  content: {
    alignItems: 'center',
    maxWidth: 760,
    gap: spacing.lg,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rule: {
    width: 26,
    height: 1,
    backgroundColor: 'rgba(217, 160, 91, 0.55)',
  },
  eyebrow: {
    color: colors.amber,
    fontFamily: fonts.mono,
    fontSize: 9.5,
    lineHeight: 14,
    letterSpacing: 2.4,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.cream,
    fontFamily: fonts.display,
    textAlign: 'center',
  },
  sub: {
    maxWidth: 520,
    color: '#c9b9a3',
    fontFamily: fonts.displayItalic,
    fontSize: 18,
    lineHeight: 27,
    textAlign: 'center',
  },
  cta: {
    marginTop: spacing.sm,
  },
  footer: {
    position: 'absolute',
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 8.5,
    lineHeight: 12,
    letterSpacing: 1.4,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
})
