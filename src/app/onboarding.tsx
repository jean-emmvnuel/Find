import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Logo } from '@/components/brand/logo';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Radius, Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/session-context';
import { useTheme } from '@/hooks/use-theme';
import { useI18n, type TranslationKey } from '@/i18n';

const SLIDES: { title: TranslationKey; body: TranslationKey }[] = [
  { title: 'onboarding.1.title', body: 'onboarding.1.body' },
  { title: 'onboarding.2.title', body: 'onboarding.2.body' },
  { title: 'onboarding.3.title', body: 'onboarding.3.body' },
];

export default function OnboardingScreen() {
  const theme = useTheme();
  const { t } = useI18n();
  const { completeOnboarding } = useSession();
  const [step, setStep] = useState(0);

  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  return (
    <Screen scroll={false}>
      <View style={styles.hero}>
        <Logo variant="symbol" width={140} />
        <ThemedText type="subtitle" style={styles.center}>
          {t(slide.title)}
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.center}>
          {t(slide.body)}
        </ThemedText>
      </View>

      <View style={styles.dots}>
        {SLIDES.map((item, index) => (
          <View
            key={item.title}
            style={[
              styles.dot,
              { backgroundColor: index === step ? theme.primary : theme.backgroundSelected },
              index === step && styles.dotActive,
            ]}
          />
        ))}
      </View>

      <Button
        title={isLast ? t('common.start') : t('common.next')}
        onPress={isLast ? completeOnboarding : () => setStep(step + 1)}
      />
      {isLast ? null : (
        <Button title={t('common.skip')} variant="ghost" onPress={completeOnboarding} />
      )}
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
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
  },
  dotActive: {
    width: 24,
  },
});
