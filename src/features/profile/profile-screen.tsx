import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/session-context';
import { useI18n, type Locale } from '@/i18n';

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
];

/** Profil et réglages, communs aux espaces étudiant et entreprise. */
export function ProfileScreen() {
  const { session, signOut } = useSession();
  const { t, locale, setLocale } = useI18n();

  return (
    <Screen title={t('profile.title')} withTabBar>
      <View style={styles.identity}>
        <ThemedText style={styles.name}>{session?.displayName}</ThemedText>
        {session?.verified ? <Badge label={t('common.verified')} tone="success" /> : null}
      </View>
      {session?.role === 'student' ? (
        <ThemedText themeColor="textSecondary">{t('profile.completion', { percent: 80 })}</ThemedText>
      ) : null}

      <ThemedText type="smallBold" style={styles.section}>
        {t('profile.language')}
      </ThemedText>
      <View style={styles.row}>
        {LOCALES.map(({ value, label }) => (
          <View key={value} style={styles.rowItem}>
            <Button
              title={label}
              variant={locale === value ? 'primary' : 'secondary'}
              onPress={() => setLocale(value)}
            />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Button title={t('auth.signOut')} variant="ghost" onPress={signOut} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
  },
  section: {
    marginTop: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  rowItem: {
    flex: 1,
  },
});
