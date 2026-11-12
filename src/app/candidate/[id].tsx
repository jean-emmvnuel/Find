import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { StatStrip } from '@/components/ui/stat-strip';
import { Durations, Springs } from '@/constants/motion';
import { cardSurface, Radius, Spacing } from '@/constants/theme';
import { CANDIDATE_LABEL, CANDIDATE_TONE } from '@/features/company/candidate-status';
import { formatApplied, formatPay, formatRating } from '@/features/missions/format';
import { openMission } from '@/features/missions/mission-card';
import { useMissions } from '@/features/missions/missions-context';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';

export default function CandidateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { t, locale } = useI18n();
  const { getCandidate, getMission, decide } = useMissions();
  const reducedMotion = useReducedMotion();
  const confirm = useSharedValue(1);
  const confirmStyle = useAnimatedStyle(() => ({ transform: [{ scale: confirm.value }] }));

  const candidate = getCandidate(id);
  if (!candidate) {
    return (
      <Screen backLabel={t('common.back')}>
        <EmptyState icon="search" title={t('candidate.notFound')} />
      </Screen>
    );
  }
  const mission = getMission(candidate.missionId);

  const hire = () => {
    decide(candidate.id, 'hired');
    if (!reducedMotion) {
      // Le recrutement « prend » : seule réponse à rebond de l'écran.
      confirm.set(withSequence(withTiming(0.94, { duration: Durations.press }), withSpring(1, Springs.pop)));
    }
  };

  const footer = {
    new: (
      <View style={styles.actions}>
        <View style={styles.grow}>
          <Button title={t('candidate.decline')} variant="secondary" onPress={() => decide(candidate.id, 'declined')} />
        </View>
        <View style={styles.grow}>
          <Button title={t('candidate.hire')} icon="check" onPress={hire} />
        </View>
      </View>
    ),
    hired: (
      <>
        <Button title={t('candidate.hiredDone')} variant="success" icon="check" disabled />
        <Button
          title={t('candidate.message')}
          variant="ghost"
          icon="chat"
          onPress={() => router.dismissTo('/company/messages')}
        />
      </>
    ),
    declined: (
      <>
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          {t('candidate.declinedDone')}
        </ThemedText>
        <Button title={t('candidate.undo')} variant="ghost" onPress={() => decide(candidate.id, 'new')} />
      </>
    ),
  }[candidate.status];

  return (
    <Screen
      backLabel={t('common.back')}
      footer={<Animated.View style={[styles.footer, confirmStyle]}>{footer}</Animated.View>}>
      <Reveal style={styles.identity}>
        <Avatar name={candidate.name} size={88} />
        <View style={styles.identityText}>
          <ThemedText type="title" accessibilityRole="header" style={styles.center}>
            {candidate.name}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
            {candidate.field}
          </ThemedText>
          <View style={styles.inline}>
            <Icon name="school" size={16} color={theme.textSecondary} />
            <ThemedText type="caption" themeColor="textSecondary">
              {candidate.school}
            </ThemedText>
          </View>
        </View>
        <View style={styles.badges}>
          <Badge label={t(CANDIDATE_LABEL[candidate.status])} tone={CANDIDATE_TONE[candidate.status]} />
          {candidate.verified ? (
            <Badge label={t('candidate.verified')} tone="success" icon="verified" />
          ) : null}
        </View>
      </Reveal>

      <Reveal index={1}>
        <StatStrip
          accessibilityLabel={candidate.name}
          items={[
            {
              label: t('candidate.rating'),
              value: candidate.rating === null ? '—' : formatRating(candidate.rating, locale),
            },
            { label: t('candidate.missions'), value: candidate.completedMissions },
            { label: t('candidate.skills'), value: candidate.skills.length },
          ]}
        />
      </Reveal>

      <Reveal index={2} style={styles.block}>
        <ThemedText type="heading">{t('candidate.pitch')}</ThemedText>
        <View style={[styles.quote, cardSurface(theme), { borderLeftColor: theme.primary }]}>
          <ThemedText themeColor="textSecondary">{candidate.pitch}</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            {formatApplied(candidate.appliedDaysAgo, t)}
          </ThemedText>
        </View>
      </Reveal>

      {candidate.skills.length > 0 ? (
        <Reveal index={3} style={styles.block}>
          <ThemedText type="heading">{t('candidate.skills')}</ThemedText>
          <View style={styles.skills}>
            {candidate.skills.map((skill) => (
              <Chip key={skill} label={skill} />
            ))}
          </View>
        </Reveal>
      ) : null}

      {mission ? (
        <Reveal index={4} style={styles.block}>
          <ThemedText type="heading">{t('candidate.appliedFor')}</ThemedText>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={mission.title}
            onPress={() => openMission(mission.id)}
            style={[styles.mission, cardSurface(theme)]}>
            <View style={[styles.missionIcon, { backgroundColor: theme.primarySoft }]}>
              <Icon name="briefcase" size={20} color={theme.primary} />
            </View>
            <View style={styles.grow}>
              <ThemedText type="smallBold" numberOfLines={2}>
                {mission.title}
              </ThemedText>
              <ThemedText type="caption" themeColor="textSecondary">
                {formatPay(mission, t)} · {mission.duration}
              </ThemedText>
            </View>
            <Icon name="chevronRight" size={20} color={theme.textSecondary} />
          </PressableScale>
        </Reveal>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  identityText: {
    alignItems: 'center',
    gap: Spacing.half,
  },
  center: {
    textAlign: 'center',
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  block: {
    gap: Spacing.two,
  },
  quote: {
    padding: Spacing.three,
    borderRadius: Radius.medium,
    borderLeftWidth: 3,
    gap: Spacing.two,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  mission: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.large,
  },
  missionIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grow: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  footer: {
    gap: Spacing.one,
  },
});
