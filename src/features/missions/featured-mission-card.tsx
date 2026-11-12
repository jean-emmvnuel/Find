import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Brand, Font, Radius, Shadows, Spacing } from '@/constants/theme';
import { useI18n } from '@/i18n';
import type { Mission } from '@/types/models';

import { formatPay } from './format';
import { openMission } from './mission-card';

export const FEATURED_CARD_WIDTH = 284;

const ON_NAVY = '#FFFFFF';
const ON_NAVY_MUTED = '#C3CBEA';

/**
 * Mission mise en avant : carte bleu marine de la marque, identique dans les
 * deux thèmes, avec l'orange réservé à l'action.
 */
export function FeaturedMissionCard({ mission }: { mission: Mission }) {
  const { t } = useI18n();

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${mission.title}, ${mission.company}, ${formatPay(mission, t)}`}
      onPress={() => openMission(mission.id)}
      style={styles.card}>
      <View style={styles.top}>
        <View style={styles.sector}>
          <Text style={styles.sectorLabel}>{mission.sector}</Text>
        </View>
        {mission.companyVerified ? (
          <View style={styles.inline}>
            <Icon name="verified" size={16} color={ON_NAVY_MUTED} />
            <Text style={styles.muted}>{t('common.verified')}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {mission.title}
        </Text>
        <Text style={styles.muted} numberOfLines={1}>
          {mission.company} · {mission.location}
        </Text>
      </View>

      <View style={styles.bottom}>
        <View>
          <Text style={styles.pay}>{formatPay(mission, t)}</Text>
          <Text style={styles.muted}>{mission.duration}</Text>
        </View>
        <View style={styles.go}>
          <Icon name="chevronRight" size={20} color={Brand.navy} />
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    width: FEATURED_CARD_WIDTH,
    padding: Spacing.three,
    borderRadius: Radius.large,
    backgroundColor: Brand.navy,
    // Liseré clair : détache la carte du fond en mode sombre.
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    gap: Spacing.three,
    ...Shadows.raised,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sector: {
    paddingHorizontal: 10,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  sectorLabel: {
    fontFamily: Font.bold,
    fontSize: 12,
    lineHeight: 16,
    color: ON_NAVY,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  body: {
    gap: Spacing.one,
    minHeight: 76,
  },
  title: {
    fontFamily: Font.bold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.1,
    color: ON_NAVY,
  },
  muted: {
    fontFamily: Font.medium,
    fontSize: 13,
    lineHeight: 18,
    color: ON_NAVY_MUTED,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  pay: {
    fontFamily: Font.extrabold,
    fontSize: 20,
    lineHeight: 26,
    color: ON_NAVY,
  },
  go: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.orange,
  },
});
