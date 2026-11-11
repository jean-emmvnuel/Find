import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/session-context';
import { formatPay } from '@/features/missions/format';
import { useI18n } from '@/i18n';
import { getMission } from '@/services/missions';

export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useI18n();
  const { session } = useSession();
  const [applied, setApplied] = useState(false);
  const mission = getMission(id);

  if (!mission) {
    return (
      <Screen>
        <ThemedText>{t('missions.notFound')}</ThemedText>
      </Screen>
    );
  }

  return (
    <Screen>
      <ThemedText type="subtitle">{mission.title}</ThemedText>
      <View style={styles.row}>
        <ThemedText type="smallBold">{mission.company}</ThemedText>
        {mission.companyVerified ? <Badge label={t('common.verified')} tone="success" /> : null}
      </View>
      <ThemedText themeColor="accent" style={styles.pay}>
        {formatPay(mission, t)}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {mission.location} · {mission.duration} · {mission.schedule}
      </ThemedText>
      <ThemedText>{mission.description}</ThemedText>
      <View style={styles.row}>
        {mission.skills.map((skill) => (
          <Badge key={skill} label={skill} />
        ))}
      </View>
      {session?.role === 'student' ? (
        <Button
          title={applied ? t('missions.applied') : t('missions.apply')}
          disabled={applied}
          onPress={() => setApplied(true)}
        />
      ) : (
        <ThemedText type="small" themeColor="textSecondary">
          {mission.applicants} {t('missions.applicants')}
        </ThemedText>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.two,
  },
  pay: {
    fontWeight: 700,
  },
});
