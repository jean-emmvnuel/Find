import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Logo } from '@/components/brand/logo';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { cardSurface, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n, type TranslationKey } from '@/i18n';
import type { UserRole } from '@/types/models';

const ROLES: { role: UserRole; icon: IconName; title: TranslationKey; hint: TranslationKey }[] = [
  { role: 'student', icon: 'school', title: 'auth.iAmStudent', hint: 'auth.studentHint' },
  { role: 'company', icon: 'building', title: 'auth.iAmCompany', hint: 'auth.companyHint' },
];

export default function WelcomeScreen() {
  const theme = useTheme();
  const { t } = useI18n();

  return (
    <Screen scroll={false}>
      <Reveal style={styles.hero}>
        <Logo width={230} />
        <ThemedText themeColor="textSecondary" style={styles.center}>
          {t('auth.tagline')}
        </ThemedText>
      </Reveal>

      {ROLES.map(({ role, icon, title, hint }, index) => (
        <Reveal key={role} index={index + 1}>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={t(title)}
            accessibilityHint={t(hint)}
            onPress={() => router.push({ pathname: '/sign-up', params: { role } })}
            style={[styles.roleCard, cardSurface(theme)]}>
            <View
              style={[
                styles.roleIcon,
                { backgroundColor: role === 'student' ? theme.primarySoft : theme.accentSoft },
              ]}>
              <Icon name={icon} size={24} color={role === 'student' ? theme.primary : theme.text} />
            </View>
            <View style={styles.roleText}>
              <ThemedText type="heading">{t(title)}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {t(hint)}
              </ThemedText>
            </View>
            <Icon name="chevronRight" color={theme.textSecondary} />
          </PressableScale>
        </Reveal>
      ))}

      <Reveal index={3}>
        <Button title={t('auth.haveAccount')} variant="ghost" onPress={() => router.push('/sign-in')} />
      </Reveal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  center: {
    textAlign: 'center',
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.large,
  },
  roleIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleText: {
    flex: 1,
    gap: Spacing.half,
  },
});
