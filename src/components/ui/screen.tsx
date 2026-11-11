import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenProps = {
  title?: string;
  children: ReactNode;
  /** Réserve la place de la barre d'onglets en bas. */
  withTabBar?: boolean;
  scroll?: boolean;
};

/** Gabarit commun à tous les écrans : zones sûres, largeur max (web), titre. */
export function Screen({ title, children, withTabBar = false, scroll = true }: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // Sur le web, la barre d'onglets flotte en haut de page.
  const webTabBar = withTabBar && Platform.OS === 'web' ? Spacing.six : 0;

  const padding = {
    paddingTop: insets.top + Spacing.four + webTabBar,
    paddingBottom: insets.bottom + Spacing.four + (withTabBar ? BottomTabInset : 0),
    paddingLeft: insets.left + Spacing.four,
    paddingRight: insets.right + Spacing.four,
  };

  const content = (
    <View style={styles.content}>
      {title ? <ThemedText type="subtitle">{title}</ThemedText> : null}
      {children}
    </View>
  );

  if (!scroll) {
    return (
      <View style={[styles.fill, styles.center, padding, { backgroundColor: theme.background }]}>
        {content}
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.fill, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.center, padding]}
      keyboardShouldPersistTaps="handled">
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
});
