import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Badge, type Tone } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { cardSurface, Radius, Spacing } from '@/constants/theme';
import { formatPay } from '@/features/missions/format';
import { useMissions } from '@/features/missions/missions-context';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import type { ApplicationStatus } from '@/types/models';

const STATUS_TONE: Record<ApplicationStatus, Tone> = {
  pending: 'warning',
  accepted: 'success',
  refused: 'danger',
  ongoing: 'primary',
  done: 'primary',
};

const FINISHED: ApplicationStatus[] = ['refused', 'done'];

type Filter = 'inProgress' | 'finished';

export default function StudentApplicationsScreen() {
  const theme = useTheme();
  const { t, locale } = useI18n();
  const { applications, getMission } = useMissions();
  const [filter, setFilter] = useState<Filter>('inProgress');

  const visible = applications.filter(
    (application) => FINISHED.includes(application.status) === (filter === 'finished'),
  );
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'long' });

  return (
    <Screen title={t('applications.title')} withTabBar>
      <Reveal>
        <SegmentedControl
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'inProgress', label: t('applications.inProgress') },
            { value: 'finished', label: t('applications.finished') },
          ]}
        />
      </Reveal>

      {visible.length === 0 ? (
        <EmptyState
          icon="briefcase"
          title={t('applications.empty')}
          action={
            <Button
              title={t('applications.browse')}
              variant="ghost"
              onPress={() => router.navigate('/student')}
            />
          }
        />
      ) : null}

      {visible.map((application, index) => {
        const mission = getMission(application.missionId);
        if (!mission) return null;
        return (
          <Reveal key={`${filter}-${application.id}`} index={index + 1}>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={`${mission.title}, ${t(`status.${application.status}`)}`}
              onPress={() => router.push({ pathname: '/mission/[id]', params: { id: mission.id } })}
              style={[styles.card, cardSurface(theme)]}>
              <View style={styles.header}>
                <Avatar name={mission.company} shape="square" />
                <View style={styles.headerText}>
                  <ThemedText type="bodyBold" numberOfLines={2}>
                    {mission.title}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {mission.company}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.footer}>
                <Badge label={t(`status.${application.status}`)} tone={STATUS_TONE[application.status]} />
                <ThemedText type="small" themeColor="textSecondary">
                  {t('applications.appliedOn', { date: formatDate(application.appliedAt) })}
                </ThemedText>
              </View>
              <ThemedText type="smallBold">{formatPay(mission, t)}</ThemedText>
            </PressableScale>
          </Reveal>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: Radius.large,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  headerText: {
    flex: 1,
    gap: Spacing.half,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
});
