import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type EmptyStateProps = {
  icon: IconName;
  title: string;
  hint?: string;
  /** Action qui sort l'utilisateur de l'état vide. */
  action?: ReactNode;
};

export function EmptyState({ icon, title, hint, action }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.bubble, { backgroundColor: theme.primarySoft }]}>
        <Icon name={icon} size={32} color={theme.primary} />
      </View>
      <ThemedText type="heading" style={styles.center}>
        {title}
      </ThemedText>
      {hint ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          {hint}
        </ThemedText>
      ) : null}
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
  },
  bubble: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  center: {
    textAlign: 'center',
    maxWidth: 320,
  },
});
