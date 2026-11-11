import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { MissionCard } from '@/features/missions/mission-card';
import { useI18n } from '@/i18n';
import { listMissions } from '@/services/missions';

export default function CompanyMissionsScreen() {
  const { t } = useI18n();

  return (
    <Screen title={t('missions.mine')} withTabBar>
      {/* Le formulaire de publication reste à construire. */}
      <Button title={t('missions.publish')} disabled />
      {listMissions().map((mission) => (
        <MissionCard key={mission.id} mission={mission} />
      ))}
    </Screen>
  );
}
