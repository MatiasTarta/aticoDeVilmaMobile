import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { Image, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from '@/components/Button/Button'
import { Screen } from '@/components/Screen/Screen'
import { useResponsive } from '@/hooks/useResponsive'
import { BREAKPOINTS } from '@/theme/layout'
import { spacing } from '@/theme/theme'

import { styles } from './Inicio.styles'

const FONDO = require('../../../assets/images/attico-fondo.jpg')

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

export default function Inicio() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { titleFontSize, width } = useResponsive()

  const handleStart = useCallback(() => {
    router.push('/cuadriculada')
  }, [router])

  return (
    <Screen backdrop={<HomeBackdrop />} contentStyle={styles.container}>
      {width >= BREAKPOINTS.desktop ? <View style={styles.frame} pointerEvents="none" /> : null}

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
