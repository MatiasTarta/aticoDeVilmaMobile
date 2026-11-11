import { Pressable, Text, View } from 'react-native';

import type { Categoria } from '@/types/instrumento';

import { styles } from './CategoryPicker.styles';

export interface OpcionCategoria {
  valor: Categoria;
  etiqueta: string;
}

interface CategoryPickerProps {
  label: string;
  opciones: OpcionCategoria[];
  seleccionada: Categoria | null;
  onSeleccionar: (valor: Categoria) => void;
  error?: string;
  testIDPrefix: string;
}

/** Selector de categoría en formato de sellos, con validación asociada. */
export function CategoryPicker({
  label,
  opciones,
  seleccionada,
  onSeleccionar,
  error,
  testIDPrefix,
}: CategoryPickerProps) {
  const errorId = `${testIDPrefix}-error`;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label} *</Text>

      <View
        style={styles.chips}
        accessibilityRole="radiogroup"
        accessibilityLabel={`${label} (obligatoria)`}
        aria-describedby={error ? errorId : undefined}
      >
        {opciones.map(({ valor, etiqueta }) => {
          const activo = seleccionada === valor;

          return (
            <Pressable
              key={valor}
              onPress={() => onSeleccionar(valor)}
              accessibilityRole="radio"
              accessibilityState={{ selected: activo }}
              accessibilityLabel={`Categoría ${etiqueta}`}
              testID={`${testIDPrefix}-${valor}`}
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

      {error ? (
        <Text
          nativeID={errorId}
          style={styles.error}
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
