import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TextFieldProps = TextInputProps & { label?: string };

export function TextField({ label, style, ...rest }: TextFieldProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      {label ? <ThemedText type="smallBold">{label}</ThemedText> : null}
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border },
          style,
        ]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.two,
  },
  input: {
    minHeight: 52,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.medium,
    borderWidth: 1,
    fontSize: 16,
  },
});
