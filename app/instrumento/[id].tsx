import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  resolveImagen,
  serial,
  tipoSonidoLegible,
} from '@/components/instrumentos/presentacion';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StateView } from '@/components/ui/StateView';
import { Tag } from '@/components/ui/Tag';
import { colors, fonts, getCategoriaColor, radii, spacing } from '@/constants/theme';
import { useVolver } from '@/hooks/useVolver';
import { getInstrumento } from '@/services/instrumentos';
import type { Instrumento } from '@/types/instrumento';

export default function InstrumentoDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const volver = useVolver('/cuadriculada');
  const [instrumento, setInstrumento] = useState<Instrumento | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const idNum = Number(id);
  const idValido = Number.isInteger(idNum) && idNum > 0;

  const cargar = useCallback(async () => {
    if (!idValido) {
      setInstrumento(null);
      setCargando(false);
      return;
    }

    setCargando(true);
    setError('');
    try {
      setInstrumento(await getInstrumento(idNum));
    } catch {
      setError('No se pudo cargar el instrumento.');
    } finally {
      setCargando(false);
    }
  }, [idNum, idValido]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <Screen
      header={<ScreenHeader title="Ficha" backLabel="← Catálogo" onBack={volver} />}
    >
      {cargando ? (
        <StateView variant="loading" />
      ) : error ? (
        <StateView
          variant="error"
          message={error}
          action={{ label: 'Reintentar', onPress: cargar }}
        />
      ) : !instrumento ? (
        <StateView
          variant="empty"
          stampLabel="Sin registro"
          message="No encontramos ese instrumento."
          action={{ label: 'Volver al catálogo', onPress: volver }}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.card}>
            <View style={styles.serialRow}>
              <Text style={styles.serial}>{serial(instrumento.id)}</Text>
              <Tag
                label={instrumento.categoria}
                color={getCategoriaColor(instrumento.categoria)}
              />
            </View>

            <View style={styles.imageFrame}>
              <Image
                source={resolveImagen(instrumento.imagen)}
                style={styles.image}
                resizeMode="cover"
                accessible={false}
              />
            </View>

            <Text style={styles.nombre}>{instrumento.nombre}</Text>

            <View style={styles.rule} />

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Tipo de sonido</Text>
              <Text style={styles.metaValue}>{tipoSonidoLegible(instrumento.tipoSonido)}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Escala</Text>
              <Text style={styles.metaValue}>{instrumento.escala}</Text>
            </View>

            <Button
              variant="ink"
              label="Volver al catálogo"
              onPress={volver}
              style={styles.action}
            />
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
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
    gap: spacing.md,
  },
  serialRow: {
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
    letterSpacing: 1.4,
  },
  imageFrame: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: colors.imageBg,
    borderWidth: 1,
    borderColor: 'rgba(43, 33, 25, 0.18)',
    borderRadius: radii.xs,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  nombre: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 31,
    letterSpacing: -0.4,
  },
  rule: {
    height: 1,
    backgroundColor: 'rgba(43, 33, 25, 0.16)',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  metaLabel: {
    color: colors.inkMuted,
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 13,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  metaValue: {
    flexShrink: 1,
    color: colors.ink,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'right',
  },
  action: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
});
