import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge, type Tone } from '@/components/ui/badge';
import { Icon, type IconName } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { cardSurface, Radius, Spacing } from '@/constants/theme';
import { formatPay, formatPosted } from '@/features/missions/format';
import { openMission } from '@/features/missions/mission-card';
import { useMissions } from '@/features/missions/missions-context';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import type { Mission, MissionStatus } from '@/types/models';

import { AvatarStack } from './avatar-stack';

const STATUS_TONE: Record<MissionStatus, Tone> = {
  active: 'success',
  filled: 'primary',
  expired: 'warning',
};

/**
 * Annonce vue par l'entreprise qui l'a publiée : son état, son audience
 * et les candidats qui attendent une réponse.
 */
export function CompanyMissionCard({ mission }: { mission: Mission }) {
  const theme = useTheme();
  const { t } = useI18n();
  const { candidatesFor } = useMissions();
  const candidates = candidatesFor(mission.id);
  const fresh = candidates.filter((candidate) => candidate.status === 'new').length;
  const count =
    candidates.length === 1
      ? t('company.candidateOne')
      : t('company.candidatesCount', { count: candidates.length });

  const facts: { icon: IconName; label: string }[] = [
    { icon: 'location', label: mission.location },
    { icon: 'calendar', label: mission.duration },
  ];

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${mission.title}, ${t(`missions.status.${mission.status}`)}, ${count}`}
      onPress={() => openMission(mission.id)}
      style={[styles.card, cardSurface(theme)]}>
      <View style={styles.top}>
        <Badge label={t(`missions.status.${mission.status}`)} tone={STATUS_TONE[mission.status]} />
        <View style={styles.inline}>
          <Icon name="eye" size={16} color={theme.textSecondary} />
          <ThemedText type="caption" themeColor="textSecondary">
            {t('company.views', { count: mission.views })} · {formatPosted(mission.postedDaysAgo, t)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.body}>
        <ThemedText type="heading" numberOfLines={2}>
          {mission.title}
        </ThemedText>
        <View style={styles.facts}>
          {facts.map((fact) => (
            <View key={fact.icon} style={styles.inline}>
              <Icon name={fact.icon} size={16} color={theme.textSecondary} />
              <ThemedText type="caption" themeColor="textSecondary">
                {fact.label}
              </ThemedText>
            </View>
          ))}
          <ThemedText type="caption" themeColor="primary">
            {formatPay(mission, t)}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        {candidates.length > 0 ? (
          <AvatarStack names={candidates.map((candidate) => candidate.name)} />
        ) : (
          <Icon name="people" size={20} color={theme.textSecondary} />
        )}
        <ThemedText type="smallBold" style={styles.grow}>
          {count}
        </ThemedText>
        {fresh > 0 ? (
          <Badge
            label={fresh === 1 ? t('company.newOne') : t('company.newCount', { count: fresh })}
            tone="accent"
          />
        ) : null}
        <Icon name="chevronRight" size={20} color={theme.textSecondary} />
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
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  body: {
    gap: Spacing.two,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  facts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: Spacing.three,
    rowGap: Spacing.one,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
  },
  grow: {
    flex: 1,
  },
});
