import { SymbolView, type AndroidSymbol, type SFSymbol } from 'expo-symbols';
import type { ColorValue } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

/** SF Symbols sur iOS, Material Symbols sur Android et le web. */
const ICONS = {
  search: { ios: 'magnifyingglass', md: 'search' },
  bell: { ios: 'bell.fill', md: 'notifications' },
  bookmark: { ios: 'bookmark', md: 'bookmark_add' },
  bookmarkFilled: { ios: 'bookmark.fill', md: 'bookmark_added' },
  location: { ios: 'mappin.and.ellipse', md: 'location_on' },
  clock: { ios: 'clock', md: 'schedule' },
  calendar: { ios: 'calendar', md: 'calendar_today' },
  chevronRight: { ios: 'chevron.right', md: 'chevron_right' },
  back: { ios: 'chevron.left', md: 'arrow_back' },
  check: { ios: 'checkmark', md: 'check' },
  verified: { ios: 'checkmark.seal.fill', md: 'verified' },
  send: { ios: 'paperplane.fill', md: 'send' },
  eye: { ios: 'eye', md: 'visibility' },
  eyeOff: { ios: 'eye.slash', md: 'visibility_off' },
  person: { ios: 'person.fill', md: 'person' },
  school: { ios: 'graduationcap.fill', md: 'school' },
  building: { ios: 'building.2.fill', md: 'business' },
  briefcase: { ios: 'briefcase.fill', md: 'work' },
  wallet: { ios: 'creditcard.fill', md: 'account_balance_wallet' },
  globe: { ios: 'globe', md: 'language' },
  logout: { ios: 'rectangle.portrait.and.arrow.right', md: 'logout' },
  plus: { ios: 'plus', md: 'add' },
  document: { ios: 'doc.text.fill', md: 'description' },
  people: { ios: 'person.2.fill', md: 'group' },
  chat: { ios: 'bubble.left.and.bubble.right.fill', md: 'chat' },
  star: { ios: 'star.fill', md: 'star' },
  cart: { ios: 'cart.fill', md: 'shopping_cart' },
  party: { ios: 'party.popper.fill', md: 'celebration' },
  keyboard: { ios: 'keyboard', md: 'keyboard' },
  grid: { ios: 'square.grid.2x2.fill', md: 'apps' },
} as const satisfies Record<string, { ios: SFSymbol; md: AndroidSymbol }>;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  /** 16 (dans le texte), 20 (par défaut) ou 24 (action seule). */
  size?: 16 | 20 | 24 | 32;
  color?: ColorValue;
};

/** Icône décorative : le libellé voisin porte le sens pour les lecteurs d'écran. */
export function Icon({ name, size = 20, color }: IconProps) {
  const theme = useTheme();
  const { ios, md } = ICONS[name];

  return (
    <SymbolView
      name={{ ios, android: md, web: md }}
      size={size}
      tintColor={color ?? theme.text}
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}
