import { Platform, type TextStyle } from 'react-native';

/**
 * Sur le web, retire le contour de focus natif d'un champ de saisie quand son
 * cadre affiche déjà le focus (bordure colorée). Sans effet sur iOS et Android.
 */
export const noNativeFocusRing: TextStyle =
  Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : {};
