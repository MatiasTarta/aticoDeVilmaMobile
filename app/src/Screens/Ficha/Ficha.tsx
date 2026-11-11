import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

import { getInstrumento } from '@/api/instrumentos';
import { Button } from '@/components/Button/Button';
import { Screen } from '@/components/Screen/Screen';
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader';
import { StateView } from '@/components/StateView/StateView';
import { Tag } from '@/components/Tag/Tag';
import { useVolver } from '@/hooks/useVolver';
import type { Instrumento } from '@/types/instrumento';
import {
  getCategoriaColor,
  resolveImagen,
  serial,
  tipoSonidoLegible,
} from '@/utils/presentacion';

import { styles } from './Ficha.styles';

export default function Ficha() {
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
