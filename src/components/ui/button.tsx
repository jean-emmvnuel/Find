import { ActivityIndicator, StyleSheet, Text, View, type PressableProps } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Font, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'success';
  icon?: IconName;
  /** Affiche un indicateur et bloque les nouveaux appuis pendant l'envoi. */
  loading?: boolean;
};

export function Button({ title, variant = 'primary', icon, loading, disabled, ...rest }: ButtonProps) {
  const theme = useTheme();

  const background = {
    primary: theme.primary,
    secondary: theme.backgroundSelected,
    ghost: 'transparent',
    success: theme.successSoft,
  }[variant];
  const color = {
    primary: theme.onPrimary,
    secondary: theme.text,
    ghost: theme.primary,
    success: theme.success,
  }[variant];

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      disabled={disabled || loading}
      style={[styles.button, { backgroundColor: background }, disabled && styles.disabled]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <View style={styles.content}>
          {icon ? <Icon name={icon} size={20} color={color} /> : null}
          <Text style={[styles.label, { color }]}>{title}</Text>
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Radius.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  label: {
    fontSize: 16,
    fontFamily: Font.bold,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.45,
  },
});
