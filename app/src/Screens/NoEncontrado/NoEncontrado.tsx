import { Stack, useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button/Button';
import { Screen } from '@/components/Screen/Screen';

import { styles } from './NoEncontrado.styles';

export default function NoEncontrado() {
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
