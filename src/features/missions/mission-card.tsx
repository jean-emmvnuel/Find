import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Badge, type Tone } from '@/components/ui/badge';
import { Icon, type IconName } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { cardSurface, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import type { Mission, MissionStatus } from '@/types/models';

import { formatPay } from './format';
import { SaveButton } from './save-button';

const STATUS_TONE: Record<MissionStatus, Tone> = {
  active: 'success',
  filled: 'primary',
  expired: 'warning',
};

type MissionCardProps = {
  mission: Mission;
  /** `student` : favori et entreprise ; `company` : statut et nombre de candidats. */
  audience?: 'student' | 'company';
};

export function openMission(id: string) {
  router.push({ pathname: '/mission/[id]', params: { id } });
}

export function MissionCard({ mission, audience = 'student' }: MissionCardProps) {
  const theme = useTheme();
  const { t } = useI18n();

  const facts: { icon: IconName; label: string }[] = [
    { icon: 'location', label: mission.location },
    { icon: 'calendar', label: mission.duration },
    { icon: 'clock', label: mission.schedule },
  ].filter((fact): fact is { icon: IconName; label: string } => fact.label !== '');

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${mission.title}, ${mission.company}, ${formatPay(mission, t)}`}
      onPress={() => openMission(mission.id)}
      style={[styles.card, cardSurface(theme)]}>
      <View style={styles.header}>
        <Avatar name={mission.company} shape="square" size={48} />
        <View style={styles.headerText}>
          <View style={styles.inline}>
            <ThemedText type="small" themeColor="textSecondary" numberOfLines={1} style={styles.shrink}>
              {mission.company}
            </ThemedText>
            {mission.companyVerified ? <Icon name="verified" size={16} color={theme.success} /> : null}
          </View>
          <ThemedText type="heading" numberOfLines={2}>
            {mission.title}
          </ThemedText>
        </View>
        {audience === 'student' ? <SaveButton missionId={mission.id} on="page" /> : null}
      </View>

      <View style={styles.facts}>
        {facts.map((fact) => (
          <View key={fact.label} style={[styles.fact, { backgroundColor: theme.background }]}>
            <Icon name={fact.icon} size={16} color={theme.textSecondary} />
            <ThemedText type="caption" themeColor="textSecondary">
              {fact.label}
            </ThemedText>
          </View>
        ))}
      </View>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <ThemedText type="heading" themeColor="primary">
          {formatPay(mission, t)}
        </ThemedText>
        {audience === 'company' ? (
          <View style={styles.inline}>
            <ThemedText type="small" themeColor="textSecondary">
              {mission.applicants} {t('missions.applicants')}
            </ThemedText>
            <Badge label={t(`missions.status.${mission.status}`)} tone={STATUS_TONE[mission.status]} />
          </View>
        ) : (
          <View style={styles.inline}>
            <ThemedText type="smallBold" themeColor="primary">
              {t('missions.view')}
            </ThemedText>
            <Icon name="chevronRight" size={16} color={theme.primary} />
          </View>
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  headerText: {
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
  facts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  fact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.small,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
  },
});
