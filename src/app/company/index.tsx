import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { StatStrip } from '@/components/ui/stat-strip';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/session-context';
import { CandidateRow } from '@/features/company/candidate-row';
import { CompanyMissionCard } from '@/features/company/company-mission-card';
import { PublishHero } from '@/features/company/publish-hero';
import { useMissions } from '@/features/missions/missions-context';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';

export default function CompanyDashboardScreen() {
  const theme = useTheme();
  const { t } = useI18n();
  const { session } = useSession();
  const { missions, candidates, getMission } = useMissions();
  const name = session?.displayName ?? '';

  const active = missions.filter((mission) => mission.status === 'active');
  // Les plus récentes d'abord : on répond vite à qui vient de postuler.
  const toReview = candidates
    .filter((candidate) => candidate.status === 'new')
    .sort((a, b) => a.appliedDaysAgo - b.appliedDaysAgo);

  const stats = [
    { label: t('dashboard.activeMissions'), value: active.length },
    { label: t('company.newCandidates'), value: toReview.length },
    { label: t('company.hired'), value: candidates.filter((c) => c.status === 'hired').length },
  ];

  return (
    <Screen withTabBar>
      <Reveal style={styles.header}>
        <View style={styles.grow}>
          <ThemedText type="title" accessibilityRole="header" numberOfLines={1}>
            {name}
          </ThemedText>
          <View style={styles.inline}>
            {session?.verified ? <Icon name="verified" size={16} color={theme.success} /> : null}
            <ThemedText type="small" themeColor="textSecondary">
              {t('company.subtitle')}
            </ThemedText>
          </View>
        </View>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t('home.openProfile')}
          onPress={() => router.navigate('/company/profile')}>
          <Avatar name={name} size={48} shape="square" />
        </PressableScale>
      </Reveal>

      <Reveal index={1}>
        <PublishHero />
      </Reveal>

      <Reveal index={2}>
        <StatStrip items={stats} accessibilityLabel={t('dashboard.overview')} />
      </Reveal>

      <Reveal index={3} style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="heading">{t('company.toReview')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {toReview.length}
          </ThemedText>
        </View>
        {toReview.length === 0 ? (
          <EmptyState icon="people" title={t('company.toReviewEmpty')} hint={t('company.toReviewHint')} />
        ) : null}
      </Reveal>
      {toReview.slice(0, 3).map((candidate, index) => (
        <Reveal key={candidate.id} index={index + 4}>
          <CandidateRow candidate={candidate} missionTitle={getMission(candidate.missionId)?.title} />
        </Reveal>
      ))}

      <Reveal index={7} style={[styles.section, styles.sectionHeader]}>
        <ThemedText type="heading">{t('missions.mine')}</ThemedText>
        <Button
          title={t('common.seeAll')}
          variant="ghost"
          onPress={() => router.navigate('/company/missions')}
        />
      </Reveal>
      {active.length === 0 ? <EmptyState icon="briefcase" title={t('missions.none')} /> : null}
      {active.slice(0, 2).map((mission, index) => (
        <Reveal key={mission.id} index={index + 8}>
          <CompanyMissionCard mission={mission} />
        </Reveal>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  grow: {
    flex: 1,
    gap: Spacing.half,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  section: {
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
