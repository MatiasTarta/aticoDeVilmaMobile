import { memo } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';

import { Tag } from '@/components/ui/Tag';
import { colors, getCategoriaColor, radii, spacing } from '@/constants/theme';
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

interface InstrumentoCardProps {
  instrumento: Instrumento;
  onPress: (id: number) => void;
  width: number;
}

function InstrumentoCardComponent({ instrumento, onPress, width }: InstrumentoCardProps) {
  return (
    <Pressable
      onPress={() => onPress(instrumento.id)}
      accessibilityRole="button"
      accessibilityLabel={instrumento.nombre}
      style={[styles.card, { width }]}
    >
      <View style={styles.imageWrap}>
        <Image
          source={resolveImagen(instrumento.imagen)}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardNombre} numberOfLines={2}>
          {instrumento.nombre}
        </Text>

        <View style={styles.cardTags}>
          <Tag
            label={instrumento.categoria}
            color={getCategoriaColor(instrumento.categoria)}
          />
          <Text style={styles.tagTipo}>{instrumento.tipoSonido}</Text>
        </View>
      </View>
    </Pressable>
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
    prev.width === next.width,
);

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    overflow: 'hidden',
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.imageBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    padding: 10,
    gap: 6,
  },
  cardNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 18,
  },
  cardTags: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagTipo: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});
