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
    textSecondary: '#55608A',
    background: '#F4F6FB',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E4EAF8',
    border: '#E1E6F2',
    primary: '#2A5BEA',
    onPrimary: '#FFFFFF',
    primarySoft: '#E8EEFD',
    accent: '#F58A07',
    onAccent: '#0E1B5B',
    accentSoft: '#FEF0DC',
    success: '#15803D',
    successSoft: '#DCF5E4',
    warning: '#B45309',
    warningSoft: '#FDEFD3',
    danger: '#C81E1E',
    dangerSoft: '#FCE4E4',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#B4BCDD',
    background: '#080E2E',
    backgroundElement: '#121B48',
    backgroundSelected: '#22307A',
    border: '#263270',
    primary: '#5B93F8',
    onPrimary: '#06103A',
    primarySoft: '#1B2A6B',
    accent: '#FBA91A',
    onAccent: '#0E1B5B',
    accentSoft: '#3D2C0E',
    success: '#4ADE80',
    successSoft: '#10391F',
    warning: '#FBBF24',
    warningSoft: '#3D2C0E',
    danger: '#F98A8A',
    dangerSoft: '#451A1A',
  },
} as const;

/** Couleurs du splash : identiques au splash natif déclaré dans app.json. */
export const SplashBackground = { light: '#FFFFFF', dark: '#0A1238' } as const;

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

/** Hauteur réservée en bas des écrans pour la barre d'onglets. */
export const BottomTabInset = Platform.select({ ios: 50, android: 80, web: 72 }) ?? 0;
export const MaxContentWidth = 800;

/** Plus Jakarta Sans : une famille par graisse, chargée dans le layout racine. */
export const Font = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

/** Élévation unique des cartes : une ombre douce et large, teintée du bleu marine. */
export const Shadows = {
  card: { boxShadow: '0 1px 2px rgba(14, 27, 91, 0.05), 0 8px 24px rgba(14, 27, 91, 0.07)' },
  raised: { boxShadow: '0 2px 4px rgba(14, 27, 91, 0.08), 0 16px 36px rgba(14, 27, 91, 0.14)' },
} as const;

/** Surface d'une carte : blanche et légèrement élevée au-dessus du fond teinté. */
export function cardSurface(theme: { backgroundElement: string; border: string }) {
  return {
    backgroundColor: theme.backgroundElement,
    borderWidth: 1,
    borderColor: theme.border,
    ...Shadows.card,
  } as const;
}
