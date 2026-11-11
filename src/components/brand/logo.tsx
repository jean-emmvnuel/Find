import { Image, type ImageStyle } from 'expo-image';
import type { StyleProp } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

const LOGO_RATIO = 996 / 510;

type LogoProps = {
  /** Largeur en points ; la hauteur suit le ratio du logo. */
  width?: number;
  variant?: 'full' | 'symbol';
  style?: StyleProp<ImageStyle>;
};

/** Logo officiel Find. Les sources vectorielles sont dans `assets/brand/`. */
export function Logo({ width = 220, variant = 'full', style }: LogoProps) {
  const scheme = useColorScheme();

  if (variant === 'symbol') {
    return (
      <Image
        source={require('@/assets/images/symbol.png')}
        style={[{ width, height: width }, style]}
        contentFit="contain"
        accessibilityLabel="Find"
      />
    );
  }

  return (
    <Image
      source={
        scheme === 'dark'
          ? require('@/assets/images/logo-dark.png')
          : require('@/assets/images/logo.png')
      }
      style={[{ width, height: width / LOGO_RATIO }, style]}
      contentFit="contain"
      accessibilityLabel="Find"
    />
  );
}
