import { useRouter } from 'expo-router'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'

const { width } = Dimensions.get('window')

export default function Home() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <View style={styles.glow} />

      <View style={styles.content}>
        <Text style={styles.eyebrow}>✦ colección de instrumentos ✦</Text>
        <Text style={styles.title}>El Ático{'\n'}de Vilma</Text>
        <Text style={styles.sub}>
          Un lugar donde cada instrumento{'\n'}guarda su propia historia
        </Text>
        <Pressable
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          onPress={() => router.push('/cuadriculada')}
        >
          <Text style={styles.btnText}>Ver Instrumentos  →</Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>Est. 2025 · Laboratorio de Interfaces</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
    padding: 32,
  },
  glow: {
    position: 'absolute',
    width: 300, height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(78,205,196,0.06)',
    top: '20%',
    alignSelf: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 18,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#4ecdc4',
    opacity: 0.8,
  },
  title: {
    fontSize: width * 0.18,
    lineHeight: width * 0.19,
    color: '#e8e0d5',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sub: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#7a7068',
    lineHeight: 26,
    textAlign: 'center',
  },
  btn: {
    marginTop: 12,
    backgroundColor: '#4ecdc4',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 100,
  },
  btnPressed: {
    opacity: 0.8,
  },
  btnText: {
    color: '#0a0a0a',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    fontSize: 11,
    letterSpacing: 2,
    color: '#7a7068',
    opacity: 0.5,
    textTransform: 'uppercase',
  },
})
