import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';

import { InstrumentoCard } from '@/components/instrumentos/InstrumentoCard';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StateView } from '@/components/ui/StateView';
import { GRID_GAP, GRID_PADDING } from '@/lib/layout';
import { colors, fonts, spacing } from '@/lib/theme';
import { useResponsive } from '@/lib/useResponsive';
import { useVolver } from '@/lib/useVolver';
import { getInstrumentos } from '@/lib/api';
import type { Instrumento } from '@/types/instrumento';

function summaryLabel(total: number): string {
  return total === 1 ? '1 pieza' : `${total} piezas`;
}

export default function Cuadriculada() {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const { columns, cardWidth } = useResponsive();
  const volver = useVolver('/');

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

  useFocusEffect(
    useCallback(() => {
      cargarInstrumentos();
    }, [cargarInstrumentos]),
  );

  const handlePress = useCallback((id: number) => {
    router.push(`/instrumento/${id}` as any);
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: Instrumento; index: number }) => (
      <InstrumentoCard
        instrumento={item}
        onPress={handlePress}
        width={cardWidth}
        index={index}
      />
    ),
    [handlePress, cardWidth],
  );

  const keyExtractor = useCallback((item: Instrumento) => String(item.id), []);

  return (
    <Screen
      header={
        <ScreenHeader
          title="Instrumentos"
          onBack={volver}
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
        <StateView
          variant="error"
          message={error}
          action={{ label: 'Reintentar', onPress: cargarInstrumentos }}
        />
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
          ListHeaderComponent={
            instrumentos.length > 0 ? (
              <View style={styles.summary}>
                <Text style={styles.summaryText}>{summaryLabel(instrumentos.length)}</Text>
                <View style={styles.summaryRule} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <StateView
              variant="empty"
              action={{ label: 'Crear ficha', onPress: () => router.push('/crear') }}
            />
          }
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
    flexGrow: 1,
    padding: GRID_PADDING,
    paddingBottom: spacing.xxl,
  },
  gridRow: {
    gap: GRID_GAP,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
    paddingHorizontal: 2,
  },
  summaryText: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontSize: 9.5,
    lineHeight: 13,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  summaryRule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
});
