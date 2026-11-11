import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import type { Mission } from '@/types/models';

import { formatPay } from './format';

export function MissionCard({ mission }: { mission: Mission }) {
  const theme = useTheme();
  const { t } = useI18n();

  return (
    <Link href={{ pathname: '/mission/[id]', params: { id: mission.id } }} asChild>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.8 : 1 },
        ]}>
        <View style={styles.header}>
          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.company}>
            {mission.company}
          </ThemedText>
          {mission.companyVerified ? <Badge label={t('common.verified')} tone="success" /> : null}
        </View>
        <ThemedText style={styles.title}>{mission.title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {mission.location} · {mission.duration}
        </ThemedText>
        <ThemedText type="smallBold" themeColor="accent">
          {formatPay(mission, t)}
        </ThemedText>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: Radius.large,
    gap: Spacing.one,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  company: {
    flexShrink: 1,
  },
  title: {
    fontWeight: 700,
  },
});
