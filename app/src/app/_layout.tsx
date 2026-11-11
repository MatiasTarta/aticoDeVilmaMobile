import { Fraunces_400Regular_Italic } from '@expo-google-fonts/fraunces/400Regular_Italic'
import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces/600SemiBold'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useRef } from 'react'
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'

import { colors, fonts } from '@/theme/theme'

if (__DEV__) {
  console.log('[arranque] Bundle evaluado')
}

export default function RootLayout() {
  const renderLogged = useRef(false)

  if (__DEV__ && !renderLogged.current) {
    console.log('[arranque] RootLayout render')
    renderLogged.current = true
  }

  const [loaded, error] = useFonts({
    [fonts.mono]: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    [fonts.displayItalic]: Fraunces_400Regular_Italic,
    [fonts.display]: Fraunces_600SemiBold,
  })

  // Las fuentes son una mejora visual: nunca bloquean el arranque ni el splash.
  useEffect(() => {
    if (loaded) {
      console.log('[arranque] Fuentes cargadas')
    }
  }, [loaded])

  useEffect(() => {
    if (error) {
      console.warn('[arranque] No se pudieron cargar las fuentes; se usan las del sistema:', error)
    }
  }, [error])

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  )
}
