import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n, type TranslationKey } from '@/i18n';
import type { ApplicationStatus } from '@/types/models';

const STEPS: { status: ApplicationStatus; label: TranslationKey }[] = [
  { status: 'pending', label: 'applications.step.sent' },
  { status: 'accepted', label: 'applications.step.accepted' },
  { status: 'ongoing', label: 'applications.step.ongoing' },
  { status: 'done', label: 'applications.step.done' },
];

const DOT = 22;

/** Suivi d'une candidature, de l'envoi à la fin de la mission. */
export function ApplicationSteps({ status }: { status: ApplicationStatus }) {
  const theme = useTheme();
  const { t } = useI18n();
  const current = STEPS.findIndex((step) => step.status === status);

  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={t('applications.progress', {
        current: current + 1,
        total: STEPS.length,
        step: t(STEPS[current].label),
      })}>
      {STEPS.map((step, index) => {
        const reached = index <= current;
        return (
          <View key={step.status} style={styles.step}>
            {index > 0 ? (
              <View
                style={[styles.line, { backgroundColor: reached ? theme.primary : theme.border }]}
              />
            ) : null}
            <View
              style={[
                styles.dot,
                reached
                  ? { backgroundColor: theme.primary, borderColor: theme.primary }
                  : { backgroundColor: theme.backgroundElement, borderColor: theme.border },
              ]}>
              {reached ? <Icon name="check" size={16} color={theme.onPrimary} /> : null}
            </View>
            <ThemedText
              type="caption"
              themeColor={index === current ? 'text' : 'textSecondary'}
              numberOfLines={1}>
              {t(step.label)}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  step: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one,
  },
  // Trait reliant ce point au précédent, centré sur la hauteur des points.
  line: {
    position: 'absolute',
    top: DOT / 2 - 1,
    right: '50%',
    width: '100%',
    height: 2,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
