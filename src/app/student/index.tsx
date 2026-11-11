import { useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { MissionCard } from '@/features/missions/mission-card';
import { useI18n } from '@/i18n';
import { listMissions } from '@/services/missions';

export default function StudentMissionsScreen() {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const missions = listMissions(query);

  return (
    <Screen title={t('missions.title')} withTabBar>
      <TextField
        placeholder={t('common.search')}
        accessibilityLabel={t('common.search')}
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
      />
      {missions.length === 0 ? (
        <ThemedText themeColor="textSecondary">{t('common.empty')}</ThemedText>
      ) : null}
      {missions.map((mission) => (
        <MissionCard key={mission.id} mission={mission} />
      ))}
    </Screen>
  );
}
