import { memo, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';

import { Tag } from '@/components/ui/Tag';
import { colors, fonts, getCategoriaColor, radii, spacing } from '@/constants/theme';
import { GRID_GAP } from '@/hooks/useResponsive';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Instrumento } from '@/types/instrumento';

const IMAGENES_LOCALES: Record<string, ImageSourcePropType> = {
  'piano.png': require('../../assets/images/piano.png'),
  'bateria.png': require('../../assets/images/bateria.png'),
  'pianoPsicodelico.png': require('../../assets/images/pianoPsicodelico.png'),
  'placeholder.png': require('../../assets/images/placeholder.png'),
};

function resolveImagen(imagen: string): ImageSourcePropType {
  const archivo = imagen.split('/').pop() ?? '';
  return IMAGENES_LOCALES[archivo] ?? IMAGENES_LOCALES['placeholder.png'];
}

function serial(id: number): string {
  return `N.º ${String(id).padStart(3, '0')}`;
}

const TIPOS_ACENTUADOS: Record<string, string> = {
  acustico: 'acústico',
  psicodelico: 'psicodélico',
  electronico: 'electrónico',
  percusion: 'percusión',
};

function tipoSonidoLegible(tipo: string): string {
  const key = tipo
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  return TIPOS_ACENTUADOS[key] ?? tipo;
}

interface InstrumentoCardProps {
  instrumento: Instrumento;
  onPress: (id: number) => void;
  width: number;
  index?: number;
}

function InstrumentoCardComponent({
  instrumento,
  onPress,
  width,
  index = 0,
}: InstrumentoCardProps) {
  const reducedMotion = useReducedMotion();
  const entrance = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      entrance.stopAnimation();
      entrance.setValue(1);
      return;
    }

    entrance.setValue(0);
    const animation = Animated.timing(entrance, {
      toValue: 1,
      duration: 340,
      delay: Math.min(index, 8) * 45,
      useNativeDriver: Platform.OS !== 'web',
    });
    animation.start();

    return () => animation.stop();
  }, [entrance, index, reducedMotion]);

  const translateY = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  const tinta = getCategoriaColor(instrumento.categoria);

  return (
    <Animated.View
      style={[styles.wrapper, { opacity: entrance, transform: [{ translateY }] }]}
    >
      <Pressable
        onPress={() => onPress(instrumento.id)}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        accessibilityRole="button"
        accessibilityLabel={`${instrumento.nombre}, ${instrumento.categoria}`}
        style={({ pressed }) => [
          styles.card,
          { width },
          hovered && styles.cardHover,
          pressed && styles.cardPressed,
        ]}
      >
        <View style={styles.serialRow}>
          <Text style={styles.serial}>{serial(instrumento.id)}</Text>
          <Tag label={instrumento.categoria} color={tinta} />
        </View>

        <View style={styles.imageFrame}>
          <Image
            source={resolveImagen(instrumento.imagen)}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.nombre} numberOfLines={2}>
          {instrumento.nombre}
        </Text>

        <View style={styles.metaRow}>
          <View style={[styles.dot, { backgroundColor: tinta }]} />
          <Text style={styles.meta} numberOfLines={1}>
            {tipoSonidoLegible(instrumento.tipoSonido)}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export const InstrumentoCard = memo(
  InstrumentoCardComponent,
  (prev, next) =>
    prev.instrumento.id === next.instrumento.id &&
    prev.instrumento.nombre === next.instrumento.nombre &&
    prev.instrumento.tipoSonido === next.instrumento.tipoSonido &&
    prev.instrumento.categoria === next.instrumento.categoria &&
    prev.instrumento.imagen === next.instrumento.imagen &&
    prev.onPress === next.onPress &&
    prev.width === next.width &&
    prev.index === next.index,
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: GRID_GAP,
  },
  card: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.paperEdge,
    borderRadius: radii.xs,
    padding: 10,
  },
  cardHover: {
    backgroundColor: '#f5eddf',
    borderColor: colors.amber,
  },
  cardPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.985 }],
  },
  serialRow: {
    minHeight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginBottom: spacing.sm,
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
    marginTop: 10,
    minHeight: 44,
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 19,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  metaRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(43, 33, 25, 0.14)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  meta: {
    flexShrink: 1,
    color: colors.inkMuted,
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
