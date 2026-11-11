import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type BadgeProps = {
  label: string;
  tone?: Extract<ThemeColor, 'primary' | 'accent' | 'success' | 'warning' | 'danger'>;
};

export function Badge({ label, tone = 'primary' }: BadgeProps) {
  const theme = useTheme();
  const color = theme[tone];

  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
  },
});
