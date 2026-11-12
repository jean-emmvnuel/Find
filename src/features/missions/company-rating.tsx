import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import type { Mission } from '@/types/models';

import { formatRating } from './format';

/** Note de l'entreprise et volume de missions : le signal de confiance d'une annonce. */
export function CompanyRating({ mission }: { mission: Mission }) {
  const theme = useTheme();
  const { t, locale } = useI18n();

  if (mission.companyRating === null) {
    return (
      <ThemedText type="caption" themeColor="textSecondary">
        {t('missions.newCompany')}
      </ThemedText>
    );
  }

  const rating = formatRating(mission.companyRating, locale);
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${t('missions.ratingLabel', { rating })}, ${t('missions.companyMissions', { count: mission.companyMissions })}`}>
      <Icon name="star" size={16} color={theme.accent} />
      <ThemedText type="caption">{rating}</ThemedText>
      <ThemedText type="caption" themeColor="textSecondary">
        · {t('missions.companyMissions', { count: mission.companyMissions })}
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
});
