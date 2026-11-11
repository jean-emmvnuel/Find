import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Font, Fonts, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'display'
    | 'title'
    | 'subtitle'
    | 'heading'
    | 'default'
    | 'bodyBold'
    | 'small'
    | 'smallBold'
    | 'caption'
    | 'link'
    | 'linkPrimary'
    | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return <Text style={[{ color: theme[themeColor ?? 'text'] }, styles[type], style]} {...rest} />;
}

// L'interlettrage se resserre quand le corps grandit, et s'ouvre en petit corps.
const styles = StyleSheet.create({
  display: {
    fontSize: 34,
    lineHeight: 40,
    fontFamily: Font.extrabold,
    letterSpacing: -0.6,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: Font.extrabold,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 24,
    lineHeight: 30,
    fontFamily: Font.bold,
    letterSpacing: -0.3,
  },
  heading: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: Font.bold,
    letterSpacing: -0.1,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Font.regular,
  },
  bodyBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Font.bold,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Font.medium,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Font.bold,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: Font.semibold,
    letterSpacing: 0.2,
  },
  link: {
    fontFamily: Font.medium,
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    fontFamily: Font.medium,
    lineHeight: 30,
    fontSize: 14,
    color: '#2A5BEA',
  },
  code: {
    fontFamily: Fonts?.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});
