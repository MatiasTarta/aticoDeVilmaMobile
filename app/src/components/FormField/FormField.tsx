import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/theme/theme';

import { styles } from './FormField.styles';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (valor: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: boolean;
  maxLength?: number;
  testID: string;
}

/** Campo de texto con etiqueta y error asociado, usado en el alta de fichas. */
export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  required = false,
  autoCapitalize = 'none',
  autoCorrect = false,
  maxLength,
  testID,
}: FormFieldProps) {
  const errorId = `${testID}-error`;
  const baseLabel = `${label}${required ? ' (obligatorio)' : ''}`;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {required ? ' *' : ''}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        maxLength={maxLength}
        testID={testID}
        accessibilityLabel={error ? `${baseLabel}. ${error}` : baseLabel}
        aria-describedby={error ? errorId : undefined}
      />
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
