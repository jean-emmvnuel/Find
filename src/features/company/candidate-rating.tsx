import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import { formatRating } from '@/features/missions/format';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import type { Candidate } from '@/types/models';

/** Note et missions réalisées : le signal de confiance d'un candidat. */
export function CandidateRating({ candidate }: { candidate: Candidate }) {
  const theme = useTheme();
  const { t, locale } = useI18n();

  if (candidate.rating === null) {
    return (
      <ThemedText type="caption" themeColor="textSecondary">
        {t('company.firstMission')}
      </ThemedText>
    );
  }

  const rating = formatRating(candidate.rating, locale);
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${t('missions.ratingLabel', { rating })}, ${t('company.missionsDone', { count: candidate.completedMissions })}`}>
      <Icon name="star" size={16} color={theme.accent} />
      <ThemedText type="caption">{rating}</ThemedText>
      <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1} style={styles.shrink}>
        · {t('company.missionsDone', { count: candidate.completedMissions })}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  shrink: {
    flexShrink: 1,
  },
});
