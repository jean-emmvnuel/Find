import { StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { cardSurface, Font, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const SECTOR_ICONS: Record<string, IconName> = {
  Événementiel: 'party',
  Distribution: 'cart',
  Bureautique: 'keyboard',
};

const TONES = ['primary', 'accent', 'success'] as const;

type CategoryTileProps = {
  label: string;
  /** Rang dans la liste : fait alterner les teintes des pastilles d'icône. */
  index: number;
  selected: boolean;
  onPress: () => void;
  /** Tuile « Toutes » : icône de grille au lieu de l'icône du secteur. */
  all?: boolean;
};

/** Tuile de catégorie : filtre la liste d'un seul appui. */
export function CategoryTile({ label, index, selected, onPress, all = false }: CategoryTileProps) {
  const theme = useTheme();
  const tone = TONES[index % TONES.length];
  const icon = all ? 'grid' : (SECTOR_ICONS[label] ?? 'briefcase');

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      scaleTo={0.95}
      onPress={onPress}
      style={[
        styles.tile,
        selected ? { backgroundColor: theme.text, borderColor: theme.text, borderWidth: 1 } : cardSurface(theme),
      ]}>
      <View
        style={[
          styles.icon,
          { backgroundColor: selected ? 'rgba(128, 150, 255, 0.28)' : theme[`${tone}Soft`] },
        ]}>
        <Icon
          name={icon}
          size={24}
          color={selected ? theme.backgroundElement : tone === 'accent' ? theme.text : theme[tone]}
        />
      </View>
      <Text
        numberOfLines={1}
        style={[styles.label, { color: selected ? theme.backgroundElement : theme.text }]}>
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 104,
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.large,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: Font.bold,
    fontSize: 12,
    lineHeight: 16,
  },
});
