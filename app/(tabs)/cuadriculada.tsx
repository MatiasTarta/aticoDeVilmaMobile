import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet } from 'react-native';

import { InstrumentoCard } from '@/components/instrumentos/InstrumentoCard';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StateView } from '@/components/ui/StateView';
import { GRID_GAP, GRID_PADDING, useResponsive } from '@/hooks/useResponsive';
import { getInstrumentos } from '@/services/instrumentos';
import type { Instrumento } from '@/types/instrumento';

export default function Cuadriculada() {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const { columns, cardWidth } = useResponsive();

  const cargarInstrumentos = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      setInstrumentos(await getInstrumentos());
    } catch {
      setError('No se pudo conectar al servidor.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarInstrumentos();
  }, [cargarInstrumentos]);

  const handlePress = useCallback((id: number) => {
    router.push(`/instrumento/${id}` as any);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Instrumento }) => (
      <InstrumentoCard instrumento={item} onPress={handlePress} width={cardWidth} />
    ),
    [handlePress, cardWidth],
  );

  const keyExtractor = useCallback((item: Instrumento) => String(item.id), []);

  return (
    <Screen
      header={
        <ScreenHeader
          title="Instrumentos"
          onBack={() => router.back()}
          rightAction={
            <Button
              variant="icon"
              label="＋"
              onPress={() => router.push('/crear' as any)}
              accessibilityLabel="Crear instrumento"
            />
          }
        />
      }
    >
      {error ? (
        <StateView variant="error" message={error} />
      ) : cargando && instrumentos.length === 0 ? (
        <StateView variant="loading" />
      ) : (
        <FlatList
          data={instrumentos}
          key={columns}
          numColumns={columns}
          extraData={cardWidth}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.gridRow}
          ListEmptyComponent={<StateView variant="empty" />}
          removeClippedSubviews={Platform.OS !== 'web'}
          initialNumToRender={6}
          maxToRenderPerBatch={8}
          windowSize={7}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: GRID_PADDING,
  },
  gridRow: {
    gap: GRID_GAP,
  },
});
