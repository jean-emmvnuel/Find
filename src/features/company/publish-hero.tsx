import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Brand, Font, Radius, Shadows, Spacing } from '@/constants/theme';
import { useI18n } from '@/i18n';

const ON_NAVY = '#FFFFFF';
const ON_NAVY_MUTED = '#C3CBEA';

/**
 * Appel à publier : bloc bleu marine de la marque, identique dans les deux
 * thèmes, avec l'orange réservé à l'action — comme la carte mise en avant côté étudiant.
 */
export function PublishHero() {
  const { t } = useI18n();

  return (
    <View style={styles.card}>
      <View style={styles.text}>
        <Text style={styles.title} accessibilityRole="header">
          {t('company.heroTitle')}
        </Text>
        <Text style={styles.body}>{t('company.heroBody')}</Text>
      </View>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={t('missions.publish')}
        onPress={() => router.push('/mission/new')}
        style={styles.action}>
        <Icon name="plus" size={20} color={Brand.navy} />
        <Text style={styles.actionLabel}>{t('missions.publish')}</Text>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.four,
    borderRadius: Radius.large,
    backgroundColor: Brand.navy,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    gap: Spacing.three,
    ...Shadows.raised,
  },
  text: {
    gap: Spacing.one,
  },
  title: {
    fontFamily: Font.extrabold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: ON_NAVY,
  },
  body: {
    fontFamily: Font.medium,
    fontSize: 14,
    lineHeight: 20,
    color: ON_NAVY_MUTED,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    minHeight: 50,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.large,
    backgroundColor: Brand.orange,
  },
  actionLabel: {
    fontFamily: Font.bold,
    fontSize: 16,
    color: Brand.navy,
  },
});
