import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { StatStrip } from '@/components/ui/stat-strip';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/session-context';
import { MissionCard } from '@/features/missions/mission-card';
import { useMissions } from '@/features/missions/missions-context';
import { useI18n } from '@/i18n';

export default function CompanyDashboardScreen() {
  const { t } = useI18n();
  const { session } = useSession();
  const { missions } = useMissions();

  const stats = [
    {
      label: t('dashboard.activeMissions'),
      value: missions.filter((mission) => mission.status === 'active').length,
    },
    {
      label: t('dashboard.applications'),
      value: missions.reduce((sum, mission) => sum + mission.applicants, 0),
    },
    {
      label: t('dashboard.filled'),
      value: missions.filter((mission) => mission.status === 'filled').length,
    },
  ];

  return (
    <Screen withTabBar>
      <Reveal>
        <ThemedText type="small" themeColor="textSecondary">
          {t('dashboard.greeting', { name: session?.displayName ?? '' })}
        </ThemedText>
        <ThemedText type="title" accessibilityRole="header">
          {t('dashboard.overview')}
        </ThemedText>
      </Reveal>

      <Reveal index={1}>
        <StatStrip items={stats} accessibilityLabel={t('dashboard.overview')} />
      </Reveal>

      <Reveal index={2}>
        <Button title={t('missions.publish')} icon="plus" onPress={() => router.push('/mission/new')} />
      </Reveal>

      <Reveal index={3} style={styles.sectionHeader}>
        <ThemedText type="heading">{t('dashboard.recent')}</ThemedText>
        <Button
          title={t('common.seeAll')}
          variant="ghost"
          onPress={() => router.navigate('/company/missions')}
        />
      </Reveal>

      {missions.length === 0 ? <EmptyState icon="briefcase" title={t('missions.none')} /> : null}
      {missions.slice(0, 2).map((mission, index) => (
        <Reveal key={mission.id} index={index + 4}>
          <MissionCard mission={mission} audience="company" />
        </Reveal>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
  },
});
