import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cardSurface, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type StatStripProps = {
  items: { label: string; value: number }[];
  accessibilityLabel: string;
};

/** Bandeau de chiffres clés : une seule carte, des colonnes séparées par un filet. */
export function StatStrip({ items, accessibilityLabel }: StatStripProps) {
  const theme = useTheme();

  return (
    <View style={[styles.strip, cardSurface(theme)]} accessibilityLabel={accessibilityLabel}>
      {items.map((item, index) => (
        <View
          key={item.label}
          style={[styles.item, index > 0 && { borderLeftWidth: 1, borderLeftColor: theme.border }]}>
          <ThemedText type="subtitle" themeColor="primary">
            {item.value}
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.label}>
            {item.label}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    paddingVertical: Spacing.three,
    borderRadius: Radius.large,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.half,
    paddingHorizontal: Spacing.one,
  },
  label: {
    textAlign: 'center',
  },
});
