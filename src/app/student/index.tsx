import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/session-context';
import { CategoryTile } from '@/features/missions/category-tile';
import {
  FEATURED_CARD_WIDTH,
  FeaturedMissionCard,
} from '@/features/missions/featured-mission-card';
import { MissionCard } from '@/features/missions/mission-card';
import { useMissions } from '@/features/missions/missions-context';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import { filterMissions } from '@/services/missions';

type Feed = 'forYou' | 'recent' | 'saved';

export default function StudentHomeScreen() {
  const theme = useTheme();
  const { t } = useI18n();
  const { session } = useSession();
  const { missions: allMissions, isSaved } = useMissions();
  // Les missions pourvues ou expirées ne sont plus proposées aux étudiants.
  const missions = allMissions.filter((mission) => mission.status === 'active');
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState<string | null>(null);
  const [feed, setFeed] = useState<Feed>('forYou');

  const sectors = [...new Set(missions.map((mission) => mission.sector))];
  const name = session?.displayName ?? '';
  const filtering = query.trim() !== '' || sector !== null;

  const matching = filterMissions(missions, query, sector);
  const results = {
    // Entreprises vérifiées d'abord, puis les mieux notées.
    forYou: [...matching].sort(
      (a, b) =>
        Number(b.companyVerified) - Number(a.companyVerified) ||
        (b.companyRating ?? 0) - (a.companyRating ?? 0),
    ),
    recent: [...matching].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo),
    saved: matching.filter((mission) => isSaved(mission.id)),
  }[feed];
  const featured = missions.filter((mission) => mission.companyVerified).slice(0, 3);

  const clearFilters = () => {
    setQuery('');
    setSector(null);
  };

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

      <Reveal index={2} style={styles.section}>
        <ThemedText type="heading">{t('home.categories')}</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bleed}
          contentContainerStyle={styles.row}>
          <CategoryTile
            all
            index={0}
            label={t('common.all')}
            selected={sector === null}
            onPress={() => setSector(null)}
          />
          {sectors.map((item, index) => (
            <CategoryTile
              key={item}
              index={index + 1}
              label={item}
              selected={sector === item}
              onPress={() => setSector(sector === item ? null : item)}
            />
          ))}
        </ScrollView>
      </Reveal>

      {filtering ? null : (
        <Reveal index={3} style={styles.section}>
          <ThemedText type="heading">{t('home.recommended')}</ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={FEATURED_CARD_WIDTH + Spacing.three}
            decelerationRate="fast"
            style={styles.bleed}
            contentContainerStyle={styles.row}>
            {featured.map((mission) => (
              <FeaturedMissionCard key={mission.id} mission={mission} />
            ))}
          </ScrollView>
        </Reveal>
      )}

      <Reveal index={4} style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="heading">{t('home.all')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t('missions.count', { count: results.length })}
          </ThemedText>
        </View>
        <SegmentedControl
          accessibilityLabel={t('home.feed')}
          value={feed}
          onChange={setFeed}
          options={[
            { value: 'forYou', label: t('home.forYou') },
            { value: 'recent', label: t('home.recent') },
            { value: 'saved', label: t('home.savedTab') },
          ]}
        />
      </Reveal>

      {results.length > 0 ? (
        <View style={styles.list}>
          {results.map((mission, index) => (
            // La clé inclut l'onglet : changer de flux rejoue l'apparition de la liste.
            <Reveal key={`${feed}-${mission.id}`} index={index}>
              <MissionCard mission={mission} />
            </Reveal>
          ))}
        </View>
      ) : feed === 'saved' && !filtering ? (
        <EmptyState icon="bookmark" title={t('home.savedEmpty')} hint={t('home.savedHint')} />
      ) : (
        <EmptyState
          icon="search"
          title={t('missions.noResult')}
          action={<Button title={t('missions.clearFilters')} variant="ghost" onPress={clearFilters} />}
        />
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
  // Les rangées horizontales défilent jusqu'au bord de l'écran, au-delà de la marge.
  bleed: {
    marginHorizontal: -Spacing.four,
  },
  row: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    // Laisse la place à l'ombre des cartes, que le défilement rognerait.
    paddingBottom: Spacing.four,
    marginBottom: -Spacing.three,
  },
  list: {
    gap: Spacing.three,
  },
});
