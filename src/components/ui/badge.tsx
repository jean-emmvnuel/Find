import { StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { Font, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type Tone = 'primary' | 'accent' | 'success' | 'warning' | 'danger';

type BadgeProps = {
  label: string;
  tone?: Tone;
  icon?: IconName;
};

/** Étiquette d'état : le libellé porte le sens, la couleur ne fait que l'appuyer. */
export function Badge({ label, tone = 'primary', icon }: BadgeProps) {
  const theme = useTheme();
  // L'orange de la marque est trop clair pour du texte : on écrit par-dessus en marine.
  const color = tone === 'accent' ? theme.text : theme[tone];

  return (
    <View style={[styles.badge, { backgroundColor: theme[`${tone}Soft`] }]}>
      {icon ? <Icon name={icon} size={16} color={color} /> : null}
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.one,
    paddingHorizontal: 10,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: Font.bold,
  },
});
