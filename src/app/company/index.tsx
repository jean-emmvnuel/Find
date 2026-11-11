import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Screen } from '@/components/ui/screen';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n, type TranslationKey } from '@/i18n';
import { listMissions } from '@/services/missions';

export default function CompanyDashboardScreen() {
  const theme = useTheme();
  const { t } = useI18n();
  const missions = listMissions();

  const stats: { label: TranslationKey; value: number }[] = [
    { label: 'dashboard.activeMissions', value: missions.filter((m) => m.status === 'active').length },
    { label: 'dashboard.applications', value: missions.reduce((sum, m) => sum + m.applicants, 0) },
    { label: 'dashboard.filled', value: missions.filter((m) => m.status === 'filled').length },
  ];

  return (
    <Screen title={t('tabs.dashboard')} withTabBar>
      <View style={styles.grid}>
        {stats.map((stat) => (
          <View key={stat.label} style={[styles.stat, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="subtitle" themeColor="primary">
              {stat.value}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {t(stat.label)}
            </ThemedText>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  stat: {
    flexGrow: 1,
    flexBasis: 140,
    padding: Spacing.three,
    borderRadius: Radius.large,
  },
});
