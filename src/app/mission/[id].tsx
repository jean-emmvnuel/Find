import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
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
import { Icon, type IconName } from '@/components/ui/icon';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { StatStrip } from '@/components/ui/stat-strip';
import { Durations, Springs } from '@/constants/motion';
import { cardSurface, Radius, Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/session-context';
import { CandidateRow } from '@/features/company/candidate-row';
import { CompanyRating } from '@/features/missions/company-rating';
import { formatPay, formatPosted } from '@/features/missions/format';
import { useMissions } from '@/features/missions/missions-context';
import { SaveButton } from '@/features/missions/save-button';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';

export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { t } = useI18n();
  const { session } = useSession();
  const { getMission, hasApplied, apply, candidatesFor, closeMission } = useMissions();
  const reducedMotion = useReducedMotion();
  const [sending, setSending] = useState(false);
  const confirm = useSharedValue(1);
  const mission = getMission(id);

  const confirmStyle = useAnimatedStyle(() => ({ transform: [{ scale: confirm.value }] }));

  if (!mission) {
    return (
      <Screen backLabel={t('common.back')}>
        <EmptyState icon="search" title={t('missions.notFound')} />
      </Screen>
    );
  }

  const isStudent = session?.role === 'student';
  const applied = hasApplied(mission.id);
  // Nouveaux candidats d'abord, puis recrutés, puis refusés.
  const order = { new: 0, hired: 1, declined: 2 } as const;
  const candidates = [...candidatesFor(mission.id)].sort(
    (a, b) => order[a.status] - order[b.status] || a.appliedDaysAgo - b.appliedDaysAgo,
  );

  const submit = () => {
    setSending(true);
    // Simule l'envoi en attendant l'API des candidatures.
    setTimeout(() => {
      apply(mission.id);
      setSending(false);
      if (!reducedMotion) {
        // La confirmation « prend » : seule réponse à rebond de l'écran.
        confirm.set(withSequence(
          withTiming(0.94, { duration: Durations.press }),
          withSpring(1, Springs.pop),
        ));
      }
    }, 500);
  };

  const facts: { icon: IconName; label: string; value: string }[] = [
    { icon: 'wallet', label: t('missions.pay'), value: formatPay(mission, t) },
    { icon: 'calendar', label: t('missions.duration'), value: mission.duration },
    { icon: 'clock', label: t('missions.schedule'), value: mission.schedule },
    { icon: 'location', label: t('missions.location'), value: mission.location },
  ].filter((fact): fact is { icon: IconName; label: string; value: string } => fact.value !== '');

  return (
    <Screen
      backLabel={t('common.back')}
      headerAction={isStudent ? <SaveButton missionId={mission.id} on="page" /> : undefined}
      footer={
        isStudent ? (
          <Animated.View style={[styles.footer, confirmStyle]}>
            {applied ? (
              <>
                <Button title={t('missions.applied')} variant="success" icon="check" disabled />
                <Button
                  title={t('missions.viewApplication')}
                  variant="ghost"
                  // Revient à l'espace étudiant déjà ouvert au lieu d'en empiler un second.
                  onPress={() => router.dismissTo('/student/applications')}
                />
              </>
            ) : (
              <View style={styles.action}>
                <View>
                  <ThemedText type="caption" themeColor="textSecondary">
                    {t('missions.pay')}
                  </ThemedText>
                  <ThemedText type="heading">{formatPay(mission, t)}</ThemedText>
                </View>
                <View style={styles.actionButton}>
                  <Button title={t('missions.apply')} loading={sending} onPress={submit} />
                </View>
              </View>
            )}
          </Animated.View>
        ) : mission.status === 'active' ? (
          <Button
            title={t('company.close')}
            variant="secondary"
            icon="check"
            onPress={() => closeMission(mission.id)}
          />
        ) : undefined
      }>
      <Reveal style={styles.block}>
        <Badge label={mission.sector} tone="accent" />
        <ThemedText type="title" accessibilityRole="header">
          {mission.title}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {formatPosted(mission.postedDaysAgo, t)} · {mission.applicants} {t('missions.applicants')}
        </ThemedText>
      </Reveal>

      {isStudent ? (
        <Reveal index={1} style={[styles.companyCard, cardSurface(theme)]}>
          <Avatar name={mission.company} shape="square" size={48} />
          <View style={styles.companyText}>
            <ThemedText type="bodyBold">{mission.company}</ThemedText>
            <CompanyRating mission={mission} />
            {mission.companyVerified ? (
              <Badge label={t('profile.verifiedCompany')} tone="success" icon="verified" />
            ) : null}
          </View>
        </Reveal>
      ) : (
        <Reveal index={1}>
          <StatStrip
            accessibilityLabel={t('dashboard.overview')}
            items={[
              { label: t('company.viewsLabel'), value: mission.views },
              { label: t('company.candidates'), value: candidates.length },
              {
                label: t('company.newCandidates'),
                value: candidates.filter((candidate) => candidate.status === 'new').length,
              },
            ]}
          />
        </Reveal>
      )}

      {isStudent ? null : (
        <Reveal index={2} style={styles.block}>
          <ThemedText type="heading">{t('company.candidates')}</ThemedText>
          {candidates.length === 0 ? (
            <EmptyState
              icon="people"
              title={t('company.noCandidates')}
              hint={t('company.noCandidatesHint')}
            />
          ) : (
            <View style={styles.candidates}>
              {candidates.map((candidate) => (
                <CandidateRow key={candidate.id} candidate={candidate} />
              ))}
            </View>
          )}
        </Reveal>
      )}

      <Reveal index={2} style={styles.facts}>
        {facts.map((fact) => (
          <View key={fact.label} style={[styles.fact, cardSurface(theme)]}>
            <Icon name={fact.icon} color={theme.primary} />
            <ThemedText type="caption" themeColor="textSecondary">
              {fact.label}
            </ThemedText>
            <ThemedText type="smallBold">{fact.value}</ThemedText>
          </View>
        ))}
      </Reveal>

      <Reveal index={3} style={styles.block}>
        <ThemedText type="heading">{t('missions.about')}</ThemedText>
        <ThemedText themeColor="textSecondary">{mission.description}</ThemedText>
      </Reveal>

      {mission.skills.length > 0 ? (
        <Reveal index={4} style={styles.block}>
          <ThemedText type="heading">{t('missions.skills')}</ThemedText>
          <View style={styles.skills}>
            {mission.skills.map((skill) => (
              <Chip key={skill} label={skill} />
            ))}
          </View>
        </Reveal>
      ) : null}

    </Screen>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: Spacing.two,
  },
  companyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.large,
  },
  companyText: {
    flex: 1,
    gap: Spacing.one,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  actionButton: {
    flex: 1,
  },
  facts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  fact: {
    flexGrow: 1,
    flexBasis: '45%',
    padding: Spacing.three,
    borderRadius: Radius.medium,
    gap: Spacing.one,
  },
  candidates: {
    gap: Spacing.three,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  footer: {
    gap: Spacing.one,
  },
});
