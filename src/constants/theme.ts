/**
 * Design tokens de Find, dérivés de la charte (logo) :
 * bleu marine du mot « Fin », bleu de la loupe, orange du « ! ».
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Brand = {
  navy: '#0E1B5B',
  blue: '#2A5BEA',
  sky: '#22A7F7',
  orange: '#F58A07',
} as const;

export const Colors = {
  light: {
    text: '#0E1B5B',
    textSecondary: '#5B6485',
    background: '#FFFFFF',
    backgroundElement: '#F2F5FC',
    backgroundSelected: '#E1E8F9',
    border: '#D9DFEF',
    primary: '#2A5BEA',
    onPrimary: '#FFFFFF',
    accent: '#F58A07',
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#A9B2D3',
    background: '#0A1238',
    backgroundElement: '#141E4D',
    backgroundSelected: '#1F2C68',
    border: '#2A3775',
    primary: '#4C8DF6',
    onPrimary: '#FFFFFF',
    accent: '#FBA91A',
    success: '#4ADE80',
    warning: '#FBBF24',
    danger: '#F87171',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 8,
  medium: 14,
  large: 22,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
