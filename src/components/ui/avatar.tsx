import { StyleSheet, Text, View } from 'react-native';

import { Font } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type AvatarProps = {
  name: string;
  size?: number;
  /** `circle` pour une personne, `square` pour une entreprise (emplacement du logo). */
  shape?: 'circle' | 'square';
};

const TONES = ['primary', 'accent', 'success'] as const;

/** Pastille aux initiales, en attendant les photos de profil et logos d'entreprise. */
export function Avatar({ name, size = 44, shape = 'circle' }: AvatarProps) {
  const theme = useTheme();
  const tone = TONES[name.length % TONES.length];
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: shape === 'circle' ? size / 2 : size * 0.28,
          backgroundColor: theme[`${tone}Soft`],
        },
      ]}>
      <Text style={[styles.initials, { fontSize: size * 0.36, color: theme.text }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: Font.extrabold,
  },
});
