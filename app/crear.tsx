import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useVolverAlCatalogo } from '@/hooks/useVolverAlCatalogo';
import { crearInstrumento } from '@/services/instrumentos';
import type { Categoria } from '@/types/instrumento';

const CATEGORIAS: { valor: Categoria; etiqueta: string }[] = [
  { valor: 'teclado', etiqueta: 'Teclado' },
  { valor: 'percusion', etiqueta: 'Percusión' },
  { valor: 'cuerda', etiqueta: 'Cuerda' },
  { valor: 'viento', etiqueta: 'Viento' },
  { valor: 'electronico', etiqueta: 'Electrónico' },
];

interface Errores {
  nombre?: string;
  tipoSonido?: string;
  categoria?: string;
}

export default function Crear() {
  const router = useRouter();
  const volver = useVolverAlCatalogo();

  const [nombre, setNombre] = useState('');
  const [tipoSonido, setTipoSonido] = useState('');
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [escala, setEscala] = useState('');
  const [errores, setErrores] = useState<Errores>({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleGuardar = async () => {
    const nombreLimpio = nombre.trim();
    const tipoLimpio = tipoSonido.trim();
    const nuevosErrores: Errores = {};

    if (!nombreLimpio) nuevosErrores.nombre = 'Escribí un nombre.';
    if (!tipoLimpio) nuevosErrores.tipoSonido = 'Escribí un tipo de sonido.';
    if (!categoria) nuevosErrores.categoria = 'Elegí una categoría.';

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0 || !categoria) {
      return;
    }

    const categoriaFinal = categoria;
    setEnviando(true);
    setErrorServidor('');
    try {
      const creado = await crearInstrumento({
        nombre: nombreLimpio,
        tipoSonido: tipoLimpio,
        categoria: categoriaFinal,
        escala: escala.trim() || undefined,
      });
      router.replace(`/instrumento/${creado.id}` as any);
    } catch (err) {
      setErrorServidor(
        err instanceof Error ? err.message : 'No se pudo crear el instrumento.',
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Screen
      header={<ScreenHeader title="Nueva ficha" backLabel="← Catálogo" onBack={volver} />}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.eyebrow}>Ingreso al catálogo</Text>
            <Text style={styles.title}>Nueva ficha</Text>
            <Text style={styles.note}>
              La imagen se asigna al catálogo; por ahora se usa el placeholder.
            </Text>

            <View style={styles.rule} />

            <View style={styles.field}>
              <Text style={styles.label}>Nombre *</Text>
              <TextInput
                value={nombre}
                onChangeText={(valor) => {
                  setNombre(valor);
                  if (errores.nombre) setErrores((prev) => ({ ...prev, nombre: undefined }));
                }}
                style={styles.input}
                placeholder="Piano vertical"
                placeholderTextColor={colors.muted}
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={80}
                testID="crear-nombre"
              />
              {errores.nombre ? (
                <Text style={styles.error} accessibilityLiveRegion="polite">
                  {errores.nombre}
                </Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Tipo de sonido *</Text>
              <TextInput
                value={tipoSonido}
                onChangeText={(valor) => {
                  setTipoSonido(valor);
                  if (errores.tipoSonido) {
                    setErrores((prev) => ({ ...prev, tipoSonido: undefined }));
                  }
                }}
                style={styles.input}
                placeholder="acústico, rock, jazz…"
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={40}
                testID="crear-tipoSonido"
              />
              {errores.tipoSonido ? (
                <Text style={styles.error} accessibilityLiveRegion="polite">
                  {errores.tipoSonido}
                </Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Categoría *</Text>
              <View style={styles.chips}>
                {CATEGORIAS.map(({ valor, etiqueta }) => {
                  const activo = categoria === valor;
                  return (
                    <Pressable
                      key={valor}
                      onPress={() => {
                        setCategoria(valor);
                        if (errores.categoria) {
                          setErrores((prev) => ({ ...prev, categoria: undefined }));
                        }
                      }}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: activo }}
                      accessibilityLabel={`Categoría ${etiqueta}`}
                      testID={`crear-categoria-${valor}`}
                      style={({ pressed }) => [
                        styles.chip,
                        activo && styles.chipActivo,
                        pressed && styles.chipPresionado,
                      ]}
                    >
                      <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>
                        {etiqueta}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {errores.categoria ? (
                <Text style={styles.error} accessibilityLiveRegion="polite">
                  {errores.categoria}
                </Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Escala</Text>
              <TextInput
                value={escala}
                onChangeText={setEscala}
                style={styles.input}
                placeholder="ninguna"
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={40}
                testID="crear-escala"
              />
            </View>

            {errorServidor ? (
              <View style={styles.banner} accessibilityLiveRegion="polite">
                <Text style={styles.bannerTexto}>{errorServidor}</Text>
              </View>
            ) : null}

            <Button
              label={enviando ? 'Guardando…' : 'Guardar ficha'}
              onPress={handleGuardar}
              disabled={enviando}
              testID="crear-guardar"
              style={styles.enviar}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.paperEdge,
    borderRadius: radii.xs,
    padding: 20,
    gap: spacing.lg,
  },
  eyebrow: {
    color: colors.inkMuted,
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: -spacing.sm,
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 31,
    letterSpacing: -0.4,
  },
  note: {
    marginTop: -spacing.sm,
    color: colors.inkMuted,
    fontSize: 12.5,
    lineHeight: 18,
  },
  rule: {
    height: 1,
    backgroundColor: 'rgba(43, 33, 25, 0.16)',
  },
  field: {
    gap: 6,
  },
  label: {
    color: colors.inkMuted,
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 13,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.paperEdge,
    borderRadius: radii.sm,
    backgroundColor: '#f7f0e4',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.paperEdge,
    borderRadius: radii.xs,
    paddingHorizontal: spacing.md,
  },
  chipActivo: {
    borderColor: colors.ink,
    backgroundColor: colors.ink,
  },
  chipPresionado: {
    opacity: 0.85,
  },
  chipTexto: {
    color: colors.inkMuted,
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  chipTextoActivo: {
    color: colors.paper,
  },
  error: {
    color: colors.dangerInk,
    fontSize: 12.5,
    lineHeight: 18,
  },
  banner: {
    borderWidth: 1,
    borderColor: colors.dangerInk,
    backgroundColor: '#f3e2d9',
    borderRadius: radii.xs,
    padding: spacing.md,
  },
  bannerTexto: {
    color: colors.dangerInk,
    fontSize: 13,
    lineHeight: 19,
  },
  enviar: {
    alignSelf: 'flex-start',
  },
});
