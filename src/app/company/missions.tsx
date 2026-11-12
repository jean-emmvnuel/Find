import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Spacing } from '@/constants/theme';
import { CompanyMissionCard } from '@/features/company/company-mission-card';
import { useMissions } from '@/features/missions/missions-context';
import { useI18n } from '@/i18n';
import type { MissionStatus } from '@/types/models';

export default function CompanyMissionsScreen() {
  const { t } = useI18n();
  const { missions } = useMissions();
  const [tab, setTab] = useState<MissionStatus>('active');

  const count = (status: MissionStatus) => missions.filter((mission) => mission.status === status).length;
  const shown = missions.filter((mission) => mission.status === tab);

  const empty = {
    active: (
      <EmptyState
        icon="briefcase"
        title={t('missions.none')}
        action={<Button title={t('missions.publish')} variant="ghost" onPress={() => router.push('/mission/new')} />}
      />
    ),
    filled: <EmptyState icon="check" title={t('company.emptyFilled')} />,
    expired: <EmptyState icon="clock" title={t('company.emptyExpired')} />,
  }[tab];

  return (
    <Screen title={t('missions.mine')} withTabBar>
      <Reveal>
        <Button title={t('missions.publish')} icon="plus" onPress={() => router.push('/mission/new')} />
      </Reveal>
      <Reveal index={1}>
        <SegmentedControl
          accessibilityLabel={t('company.tabsLabel')}
          value={tab}
          onChange={setTab}
          options={[
            { value: 'active', label: `${t('company.tab.active')} · ${count('active')}` },
            { value: 'filled', label: `${t('company.tab.filled')} · ${count('filled')}` },
            { value: 'expired', label: `${t('company.tab.expired')} · ${count('expired')}` },
          ]}
        />
      </Reveal>
      {shown.length === 0 ? (
        empty
      ) : (
        <View style={styles.list}>
          {shown.map((mission, index) => (
            // La clé inclut l'onglet : changer d'onglet rejoue l'apparition de la liste.
            <Reveal key={`${tab}-${mission.id}`} index={index}>
              <CompanyMissionCard mission={mission} />
            </Reveal>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.three,
  },
});
