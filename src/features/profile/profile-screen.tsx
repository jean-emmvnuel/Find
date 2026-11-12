import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { StatStrip } from '@/components/ui/stat-strip';
import { cardSurface, Radius, Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/session-context';
import { useMissions } from '@/features/missions/missions-context';
import { useTheme } from '@/hooks/use-theme';
import { useI18n, type Locale, type TranslationKey } from '@/i18n';

const COMPLETION = 0.8;

type Row = { icon: IconName; title: TranslationKey; hint: TranslationKey };

const STUDENT_ROWS: Row[] = [
  { icon: 'document', title: 'profile.documents', hint: 'profile.documentsHint' },
  { icon: 'school', title: 'profile.skillsRow', hint: 'profile.skillsHint' },
  { icon: 'wallet', title: 'profile.payment', hint: 'profile.paymentHint' },
];

const COMPANY_ROWS: Row[] = [
  { icon: 'document', title: 'profile.documents', hint: 'profile.companyDocumentsHint' },
  { icon: 'wallet', title: 'profile.payment', hint: 'profile.paymentHint' },
];

/** Profil et réglages, communs aux espaces étudiant et entreprise. */
export function ProfileScreen() {
  const theme = useTheme();
  const { session, signOut } = useSession();
  const { t, locale, setLocale } = useI18n();
  const { applications, savedCount } = useMissions();
  const isStudent = session?.role === 'student';
  const rows = isStudent ? STUDENT_ROWS : COMPANY_ROWS;
  const completion = t('profile.completion', { percent: Math.round(COMPLETION * 100) });

  return (
    <Screen title={t('profile.title')} withTabBar>
      <Reveal style={[styles.card, styles.identity, cardSurface(theme)]}>
        <Avatar name={session?.displayName ?? ''} size={64} />
        <View style={styles.grow}>
          <ThemedText type="heading">{session?.displayName}</ThemedText>
          {session?.verified ? (
            <Badge
              label={t(isStudent ? 'profile.verifiedStudent' : 'profile.verifiedCompany')}
              tone="success"
              icon="verified"
            />
          ) : null}
        </View>
      </Reveal>

      {isStudent ? (
        <Reveal index={1} style={styles.section}>
          <ThemedText type="smallBold">{completion}</ThemedText>
          <ProgressBar value={COMPLETION} accessibilityLabel={completion} />
        </Reveal>
      ) : null}

      {isStudent ? (
        <Reveal index={2} style={styles.section}>
          <ThemedText type="heading">{t('profile.activity')}</ThemedText>
          <StatStrip
            accessibilityLabel={t('profile.activity')}
            items={[
              { label: t('home.applications'), value: applications.length },
              {
                label: t('home.accepted'),
                value: applications.filter((application) => application.status === 'accepted').length,
              },
              { label: t('home.saved'), value: savedCount },
            ]}
          />
        </Reveal>
      ) : null}

      <Reveal index={3} style={styles.section}>
        <ThemedText type="heading">{t('profile.account')}</ThemedText>
        <View style={[styles.card, styles.list, cardSurface(theme)]}>
          {rows.map((row, index) => (
            // Sections pas encore construites : affichées comme telles, pas comme des liens.
            <View
              key={row.title}
              style={[
                styles.row,
                index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border },
              ]}>
              <View style={[styles.rowIcon, { backgroundColor: theme.primarySoft }]}>
                <Icon name={row.icon} color={theme.primary} />
              </View>
              <View style={styles.grow}>
                <ThemedText type="bodyBold">{t(row.title)}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {t(row.hint)}
                </ThemedText>
              </View>
              <Badge label={t('profile.soon')} tone="accent" />
            </View>
          ))}
        </View>
      </Reveal>

      <Reveal index={4} style={styles.section}>
        <ThemedText type="heading">{t('profile.language')}</ThemedText>
        <SegmentedControl<Locale>
          accessibilityLabel={t('profile.language')}
          value={locale}
          onChange={setLocale}
          options={[
            { value: 'fr', label: 'Français' },
            { value: 'en', label: 'English' },
          ]}
        />
      </Reveal>

      <Reveal index={5}>
        <Button title={t('auth.signOut')} variant="secondary" icon="logout" onPress={signOut} />
      </Reveal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.large,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  grow: {
    flex: 1,
    gap: Spacing.one,
  },
  section: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  list: {
    paddingHorizontal: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.small + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
