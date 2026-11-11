import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function Button({ title, variant = 'primary', disabled, ...rest }: ButtonProps) {
  const theme = useTheme();

  const background = {
    primary: theme.primary,
    secondary: theme.backgroundElement,
    ghost: 'transparent',
  }[variant];
  const color = variant === 'primary' ? theme.onPrimary : variant === 'ghost' ? theme.primary : theme.text;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: background, opacity: disabled ? 0.5 : pressed ? 0.8 : 1 },
      ]}
      {...rest}>
      <Text style={[styles.label, { color }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 700,
  },
});
