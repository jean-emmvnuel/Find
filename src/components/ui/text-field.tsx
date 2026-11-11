import { useState, type ReactNode } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Durations } from '@/constants/motion';
import { noNativeFocusRing } from '@/components/ui/web-styles';
import { Font, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TextFieldProps = TextInputProps & {
  label?: string;
  icon?: IconName;
  /** Message affiché sous le champ ; il passe aussi le contour en rouge. */
  error?: string;
  trailing?: ReactNode;
};

export function TextField({ label, icon, error, trailing, style, onFocus, onBlur, ...rest }: TextFieldProps) {
  const theme = useTheme();
  const focus = useSharedValue(0);

  const frameStyle = useAnimatedStyle(() => ({
    borderColor: error
      ? theme.danger
      : interpolateColor(focus.value, [0, 1], [theme.border, theme.primary]),
  }));

  return (
    <View style={styles.wrapper}>
      {label ? <ThemedText type="smallBold">{label}</ThemedText> : null}
      <Animated.View style={[styles.frame, { backgroundColor: theme.backgroundElement }, frameStyle]}>
        {icon ? <Icon name={icon} color={theme.textSecondary} /> : null}
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={theme.textSecondary}
          selectionColor={theme.primary}
          style={[styles.input, { color: theme.text }, style]}
          onFocus={(event) => {
            focus.set(withTiming(1, { duration: Durations.fast }));
            onFocus?.(event);
          }}
          onBlur={(event) => {
            focus.set(withTiming(0, { duration: Durations.fast }));
            onBlur?.(event);
          }}
          {...rest}
        />
        {trailing}
      </Animated.View>
      {error ? (
        <ThemedText type="small" themeColor="danger" accessibilityLiveRegion="polite">
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

type PasswordFieldProps = Omit<TextFieldProps, 'secureTextEntry' | 'trailing'> & {
  showLabel: string;
  hideLabel: string;
};

/** Champ mot de passe avec bascule afficher / masquer. */
export function PasswordField({ showLabel, hideLabel, ...rest }: PasswordFieldProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoComplete="password"
      trailing={
        <PressableScale
          onPress={() => setVisible(!visible)}
          accessibilityRole="button"
          accessibilityLabel={visible ? hideLabel : showLabel}
          hitSlop={12}
          style={styles.trailing}>
          <Icon name={visible ? 'eyeOff' : 'eye'} color={theme.textSecondary} />
        </PressableScale>
      }
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.two,
  },
  frame: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: 54,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.medium,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    fontFamily: Font.medium,
    fontSize: 16,
    ...noNativeFocusRing,
  },
  trailing: {
    padding: Spacing.one,
  },
});
