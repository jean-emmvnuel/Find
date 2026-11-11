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
import { Durations, Springs } from '@/constants/motion';
import { cardSurface, Radius, Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/session-context';
import { formatPay } from '@/features/missions/format';
import { useMissions } from '@/features/missions/missions-context';
import { SaveButton } from '@/features/missions/save-button';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';

export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { t } = useI18n();
  const { session } = useSession();
  const { getMission, hasApplied, apply } = useMissions();
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
              <Button title={t('missions.apply')} loading={sending} onPress={submit} />
            )}
          </Animated.View>
        ) : undefined
      }>
      <Reveal style={styles.block}>
        <Badge label={mission.sector} tone="accent" />
        <ThemedText type="title" accessibilityRole="header">
          {mission.title}
        </ThemedText>
        <View style={styles.company}>
          <Avatar name={mission.company} shape="square" size={40} />
          <ThemedText type="bodyBold" style={styles.shrink}>
            {mission.company}
          </ThemedText>
          {mission.companyVerified ? (
            <Badge label={t('common.verified')} tone="success" icon="verified" />
          ) : null}
        </View>
      </Reveal>

      <Reveal index={1} style={styles.facts}>
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

      <Reveal index={2} style={styles.block}>
        <ThemedText type="heading">{t('missions.about')}</ThemedText>
        <ThemedText themeColor="textSecondary">{mission.description}</ThemedText>
      </Reveal>

      {mission.skills.length > 0 ? (
        <Reveal index={3} style={styles.block}>
          <ThemedText type="heading">{t('missions.skills')}</ThemedText>
          <View style={styles.skills}>
            {mission.skills.map((skill) => (
              <Chip key={skill} label={skill} />
            ))}
          </View>
        </Reveal>
      ) : null}

      {isStudent ? null : (
        <Reveal index={4} style={styles.company}>
          <Icon name="people" color={theme.textSecondary} />
          <ThemedText themeColor="textSecondary">
            {mission.applicants} {t('missions.applicants')}
          </ThemedText>
        </Reveal>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: Spacing.two,
  },
  company: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.two,
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
    flexGrow: 1,
    flexBasis: '45%',
    padding: Spacing.three,
    borderRadius: Radius.medium,
    gap: Spacing.one,
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
