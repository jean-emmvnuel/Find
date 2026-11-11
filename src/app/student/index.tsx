import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { StatStrip } from '@/components/ui/stat-strip';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/session-context';
import {
  FEATURED_CARD_WIDTH,
  FeaturedMissionCard,
} from '@/features/missions/featured-mission-card';
import { MissionCard } from '@/features/missions/mission-card';
import { useMissions } from '@/features/missions/missions-context';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import { filterMissions } from '@/services/missions';

export default function StudentHomeScreen() {
  const theme = useTheme();
  const { t } = useI18n();
  const { session } = useSession();
  const { missions, applications, savedCount } = useMissions();
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState<string | null>(null);

  const sectors = [...new Set(missions.map((mission) => mission.sector))];
  const results = filterMissions(missions, query, sector);
  const browsing = query.trim() === '' && sector === null;
  const featured = missions.filter((mission) => mission.companyVerified).slice(0, 3);
  const name = session?.displayName ?? '';

  const activity = [
    { label: t('home.applications'), value: applications.length },
    {
      label: t('home.accepted'),
      value: applications.filter((application) => application.status === 'accepted').length,
    },
    { label: t('home.saved'), value: savedCount },
  ];

  return (
    <Screen withTabBar>
      <Reveal style={styles.header}>
        <View style={styles.grow}>
          <ThemedText type="title" accessibilityRole="header" numberOfLines={1}>
            {t('missions.greeting', { name: name.split(' ')[0] })}
          </ThemedText>
          <View style={styles.inline}>
            <Icon name="location" size={16} color={theme.textSecondary} />
            <ThemedText type="small" themeColor="textSecondary">
              {t('home.location')}
            </ThemedText>
          </View>
        </View>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t('home.openProfile')}
          onPress={() => router.navigate('/student/profile')}>
          <Avatar name={name} size={48} />
        </PressableScale>
      </Reveal>

      <Reveal index={1}>
        <TextField
          icon="search"
          placeholder={t('common.search')}
          accessibilityLabel={t('common.search')}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          autoCorrect={false}
        />
      </Reveal>

      {browsing ? (
        <>
          <Reveal index={2}>
            <StatStrip items={activity} accessibilityLabel={t('home.activity')} />
          </Reveal>

          <Reveal index={3} style={styles.section}>
            <ThemedText type="heading">{t('home.recommended')}</ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={FEATURED_CARD_WIDTH + Spacing.three}
              decelerationRate="fast"
              style={styles.bleed}
              contentContainerStyle={styles.carousel}>
              {featured.map((mission) => (
                <FeaturedMissionCard key={mission.id} mission={mission} />
              ))}
            </ScrollView>
          </Reveal>
        </>
      ) : null}

      <Reveal index={4} style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="heading">{t('home.all')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t('missions.count', { count: results.length })}
          </ThemedText>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bleed}
          contentContainerStyle={styles.chips}>
          <Chip label={t('common.all')} selected={sector === null} onPress={() => setSector(null)} />
          {sectors.map((item) => (
            <Chip
              key={item}
              label={item}
              selected={sector === item}
              onPress={() => setSector(sector === item ? null : item)}
            />
          ))}
        </ScrollView>
      </Reveal>

      {results.length === 0 ? (
        <EmptyState
          icon="search"
          title={t('missions.noResult')}
          action={
            <Button
              title={t('missions.clearFilters')}
              variant="ghost"
              onPress={() => {
                setQuery('');
                setSector(null);
              }}
            />
          }
        />
      ) : (
        <View style={styles.list}>
          {results.map((mission, index) => (
            <Reveal key={mission.id} index={index + 5}>
              <MissionCard mission={mission} />
            </Reveal>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  grow: {
    flex: 1,
    gap: Spacing.half,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  section: {
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  // Carrousel et filtres défilent jusqu'au bord de l'écran, au-delà de la marge.
  bleed: {
    marginHorizontal: -Spacing.four,
  },
  carousel: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },
  chips: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  list: {
    gap: Spacing.three,
  },
});
