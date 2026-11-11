import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Screen } from '@/components/ui/screen';
import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import { getMission, listApplications } from '@/services/missions';
import type { ApplicationStatus } from '@/types/models';

const STATUS_TONE: Record<ApplicationStatus, Extract<ThemeColor, 'primary' | 'success' | 'warning' | 'danger'>> = {
  pending: 'warning',
  accepted: 'success',
  refused: 'danger',
  ongoing: 'primary',
  done: 'primary',
};

export default function StudentApplicationsScreen() {
  const theme = useTheme();
  const { t } = useI18n();
  const applications = listApplications();

  return (
    <Screen title={t('applications.title')} withTabBar>
      {applications.map((application) => {
        const mission = getMission(application.missionId);
        if (!mission) return null;
        return (
          <View key={application.id} style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText style={styles.title}>{mission.title}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {mission.company} · {application.appliedAt}
            </ThemedText>
            <Badge label={t(`status.${application.status}`)} tone={STATUS_TONE[application.status]} />
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: Radius.large,
    gap: Spacing.two,
  },
  title: {
    fontWeight: 700,
  },
});
