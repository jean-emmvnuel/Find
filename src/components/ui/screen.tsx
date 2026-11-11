import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { BottomTabInset, cardSurface, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenProps = {
  title?: string;
  children: ReactNode;
  /** Réserve la place de la barre d'onglets en bas. */
  withTabBar?: boolean;
  scroll?: boolean;
  /** Affiche un bouton retour ; son libellé est lu par les lecteurs d'écran. */
  backLabel?: string;
  /** Action placée à droite du bouton retour (favori, etc.). */
  headerAction?: ReactNode;
  /** Barre fixe en bas de l'écran, pour l'action principale. */
  footer?: ReactNode;
};

/** Gabarit commun à tous les écrans : zones sûres, clavier, largeur max, en-tête. */
export function Screen({
  title,
  children,
  withTabBar = false,
  scroll = true,
  backLabel,
  headerAction,
  footer,
}: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const padding = {
    paddingTop: insets.top + Spacing.four,
    paddingBottom: footer
      ? Spacing.four
      : insets.bottom + Spacing.four + (withTabBar ? BottomTabInset : 0),
    paddingLeft: insets.left + Spacing.four,
    paddingRight: insets.right + Spacing.four,
  };

  const content = (
    <View style={styles.content}>
      {backLabel ? (
        <View style={styles.header}>
          <PressableScale
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            accessibilityRole="button"
            accessibilityLabel={backLabel}
            style={[styles.roundButton, cardSurface(theme)]}>
            <Icon name="back" size={24} />
          </PressableScale>
          {headerAction}
        </View>
      ) : null}
      {title ? (
        <ThemedText type="title" accessibilityRole="header">
          {title}
        </ThemedText>
      ) : null}
      {children}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.fill, { backgroundColor: theme.background }]}>
      {scroll ? (
        <ScrollView
          style={styles.fill}
          contentContainerStyle={[styles.center, padding]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        <View style={[styles.fill, styles.center, padding]}>{content}</View>
      )}
      {footer ? (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: theme.background,
              borderTopColor: theme.border,
              paddingBottom: insets.bottom + Spacing.three,
              paddingLeft: insets.left + Spacing.four,
              paddingRight: insets.right + Spacing.four,
            },
          ]}>
          <View style={styles.footerContent}>{footer}</View>
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

export const roundButtonStyle = { width: 44, height: 44, borderRadius: 22 } as const;

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  roundButton: {
    ...roundButtonStyle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerContent: {
    width: '100%',
    maxWidth: MaxContentWidth,
  },
});
