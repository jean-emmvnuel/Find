import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { cardSurface, Radius, Spacing } from '@/constants/theme';
import { formatApplied } from '@/features/missions/format';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import type { Candidate } from '@/types/models';

import { CandidateRating } from './candidate-rating';
import { CANDIDATE_LABEL, CANDIDATE_TONE, openCandidate } from './candidate-status';

type CandidateRowProps = {
  candidate: Candidate;
  /** Titre de la mission visée, affiché quand la liste mélange plusieurs missions. */
  missionTitle?: string;
};

/** Candidat dans une liste : qui, sa réputation, et où en est la décision. */
export function CandidateRow({ candidate, missionTitle }: CandidateRowProps) {
  const theme = useTheme();
  const { t } = useI18n();

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${candidate.name}, ${candidate.field}, ${t(CANDIDATE_LABEL[candidate.status])}`}
      onPress={() => router.push(openCandidate(candidate.id))}
      style={[styles.card, cardSurface(theme)]}>
      <View style={styles.top}>
        <Avatar name={candidate.name} size={48} />
        <View style={styles.text}>
          <View style={styles.inline}>
            <ThemedText type="bodyBold" numberOfLines={1} style={styles.shrink}>
              {candidate.name}
            </ThemedText>
            {candidate.verified ? <Icon name="verified" size={16} color={theme.success} /> : null}
          </View>
          <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
            {candidate.field}
          </ThemedText>
          <CandidateRating candidate={candidate} />
        </View>
        <Icon name="chevronRight" size={20} color={theme.textSecondary} />
      </View>

      <View style={[styles.bottom, { borderTopColor: theme.border }]}>
        <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1} style={styles.shrink}>
          {missionTitle
            ? t('company.forMission', { title: missionTitle })
            : formatApplied(candidate.appliedDaysAgo, t)}
        </ThemedText>
        <Badge label={t(CANDIDATE_LABEL[candidate.status])} tone={CANDIDATE_TONE[candidate.status]} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: Radius.large,
    gap: Spacing.three,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  shrink: {
    flexShrink: 1,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
  },
});
