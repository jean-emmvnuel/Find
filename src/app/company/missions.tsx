import { router } from 'expo-router';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { MissionCard } from '@/features/missions/mission-card';
import { useMissions } from '@/features/missions/missions-context';
import { useI18n } from '@/i18n';

export default function CompanyMissionsScreen() {
  const { t } = useI18n();
  const { missions } = useMissions();

  return (
    <Screen title={t('missions.mine')} withTabBar>
      <Reveal>
        <Button title={t('missions.publish')} icon="plus" onPress={() => router.push('/mission/new')} />
      </Reveal>
      {missions.length === 0 ? <EmptyState icon="briefcase" title={t('missions.none')} /> : null}
      {missions.map((mission, index) => (
        <Reveal key={mission.id} index={index + 1}>
          <MissionCard mission={mission} audience="company" />
        </Reveal>
      ))}
    </Screen>
  );
}
