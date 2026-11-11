import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

import { crearInstrumento } from '@/api/instrumentos';
import { Button } from '@/components/Button/Button';
import {
  CategoryPicker,
  type OpcionCategoria,
} from '@/components/CategoryPicker/CategoryPicker';
import { ErrorBanner } from '@/components/ErrorBanner/ErrorBanner';
import { FormField } from '@/components/FormField/FormField';
import { Screen } from '@/components/Screen/Screen';
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader';
import { useVolver } from '@/hooks/useVolver';
import type { Categoria } from '@/types/instrumento';

import { styles } from './Alta.styles';

const CATEGORIAS: OpcionCategoria[] = [
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

export default function Alta() {
  const router = useRouter();
  const volver = useVolver('/cuadriculada');

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

            <FormField
              label="Nombre"
              required
              value={nombre}
              onChangeText={(valor) => {
                setNombre(valor);
                if (errores.nombre) setErrores((prev) => ({ ...prev, nombre: undefined }));
              }}
              placeholder="Piano vertical"
              autoCapitalize="words"
              maxLength={80}
              testID="crear-nombre"
              error={errores.nombre}
            />

            <FormField
              label="Tipo de sonido"
              required
              value={tipoSonido}
              onChangeText={(valor) => {
                setTipoSonido(valor);
                if (errores.tipoSonido) {
                  setErrores((prev) => ({ ...prev, tipoSonido: undefined }));
                }
              }}
              placeholder="acústico, rock, jazz…"
              maxLength={40}
              testID="crear-tipoSonido"
              error={errores.tipoSonido}
            />

            <CategoryPicker
              label="Categoría"
              opciones={CATEGORIAS}
              seleccionada={categoria}
              onSeleccionar={(valor) => {
                setCategoria(valor);
                if (errores.categoria) {
                  setErrores((prev) => ({ ...prev, categoria: undefined }));
                }
              }}
              error={errores.categoria}
              testIDPrefix="crear-categoria"
            />

            <FormField
              label="Escala"
              value={escala}
              onChangeText={setEscala}
              placeholder="ninguna"
              maxLength={40}
              testID="crear-escala"
            />

            {errorServidor ? <ErrorBanner message={errorServidor} /> : null}

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
