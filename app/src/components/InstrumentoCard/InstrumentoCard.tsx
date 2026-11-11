import { memo, useEffect, useRef, useState } from 'react';
import { Animated, Image, Platform, Pressable, Text, View } from 'react-native';

import { Tag } from '@/components/Tag/Tag';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Instrumento } from '@/types/instrumento';
import {
  getCategoriaColor,
  resolveImagen,
  serial,
  tipoSonidoLegible,
} from '@/utils/presentacion';

import { styles } from './InstrumentoCard.styles';

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
