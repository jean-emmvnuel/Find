import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Logo } from '@/components/brand/logo';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useI18n } from '@/i18n';

export default function WelcomeScreen() {
  const { t } = useI18n();

  return (
    <Screen scroll={false}>
      <View style={styles.hero}>
        <Logo width={260} />
        <ThemedText themeColor="textSecondary" style={styles.center}>
          {t('auth.tagline')}
        </ThemedText>
      </View>

      <Button
        title={t('auth.iAmStudent')}
        onPress={() => router.push({ pathname: '/sign-up', params: { role: 'student' } })}
      />
      <Button
        title={t('auth.iAmCompany')}
        variant="secondary"
        onPress={() => router.push({ pathname: '/sign-up', params: { role: 'company' } })}
      />
      <Button title={t('auth.haveAccount')} variant="ghost" onPress={() => router.push('/sign-in')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  center: {
    textAlign: 'center',
  },
});
