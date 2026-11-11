import { useRef, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { Logo } from '@/components/brand/logo';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/session-context';
import { MissionsScene, PaymentScene, VerifiedScene } from '@/features/onboarding/scenes';
import { useTheme } from '@/hooks/use-theme';
import { useI18n, type TranslationKey } from '@/i18n';

const SLIDES: { title: TranslationKey; body: TranslationKey; scene: ReactNode }[] = [
  { title: 'onboarding.1.title', body: 'onboarding.1.body', scene: <MissionsScene /> },
  { title: 'onboarding.2.title', body: 'onboarding.2.body', scene: <VerifiedScene /> },
  { title: 'onboarding.3.title', body: 'onboarding.3.body', scene: <PaymentScene /> },
];

const BAR = { width: 28, gap: 6 };

/**
 * Tutoriel de premier lancement. Les pages suivent le doigt : l'indicateur et
 * les illustrations sont pilotés par la position du défilement, pas par une
 * animation déclenchée après coup.
 */
export default function OnboardingScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { completeOnboarding } = useSession();
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [step, setStep] = useState(0);
  const pager = useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.set(event.contentOffset.x);
  });

  useAnimatedReaction(
    () => (pageWidth > 0 ? Math.round(scrollX.value / pageWidth) : 0),
    (current, previous) => {
      if (current !== previous) scheduleOnRN(setStep, current);
    },
  );

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: pageWidth > 0 ? (scrollX.value / pageWidth) * (BAR.width + BAR.gap) : 0 },
    ],
  }));

  const isLast = step === SLIDES.length - 1;

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: theme.background,
          paddingTop: insets.top + Spacing.three,
          paddingBottom: insets.bottom + Spacing.four,
        },
      ]}>
      <View style={styles.topBar}>
        <Logo width={84} />
        {isLast ? null : (
          <Button title={t('common.skip')} variant="ghost" onPress={completeOnboarding} />
        )}
      </View>

      <Animated.ScrollView
        ref={pager}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onLayout={(event) => {
          setPageWidth(event.nativeEvent.layout.width);
          setPageHeight(event.nativeEvent.layout.height);
        }}
        style={styles.pager}>
        {SLIDES.map((slide, index) => (
          <Slide
            key={slide.title}
            index={index}
            width={pageWidth}
            height={pageHeight}
            scrollX={scrollX}
            scene={slide.scene}>
            <ThemedText type="title" style={styles.center} accessibilityRole="header">
              {t(slide.title)}
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.center}>
              {t(slide.body)}
            </ThemedText>
          </Slide>
        ))}
      </Animated.ScrollView>

      <View style={styles.footer}>
        <View
          style={styles.bars}
          accessibilityRole="progressbar"
          accessibilityLabel={t('onboarding.pageOf', { current: step + 1, total: SLIDES.length })}>
          {SLIDES.map((slide) => (
            <View key={slide.title} style={[styles.bar, { backgroundColor: theme.backgroundSelected }]} />
          ))}
          <Animated.View
            style={[styles.bar, styles.activeBar, { backgroundColor: theme.primary }, indicatorStyle]}
          />
        </View>

        <Button
          title={isLast ? t('common.start') : t('common.next')}
          onPress={
            isLast
              ? completeOnboarding
              : () => pager.current?.scrollTo({ x: (step + 1) * pageWidth, animated: true })
          }
        />
      </View>
    </View>
  );
}

type SlideProps = {
  index: number;
  width: number;
  height: number;
  scrollX: SharedValue<number>;
  scene: ReactNode;
  children: ReactNode;
};

function Slide({ index, width, height, scrollX, scene, children }: SlideProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();

  // Distance à la page courante : 0 quand la page est centrée, ±1 pour ses voisines.
  const sceneStyle = useAnimatedStyle(() => {
    const distance = width > 0 ? scrollX.value / width - index : 0;
    if (reducedMotion) return { opacity: 1 - Math.min(1, Math.abs(distance)) };
    return {
      opacity: interpolate(Math.abs(distance), [0, 0.8], [1, 0], 'clamp'),
      transform: [
        // L'illustration glisse moins vite que la page : léger effet de profondeur.
        { translateX: distance * width * 0.35 },
        { scale: interpolate(Math.abs(distance), [0, 1], [1, 0.86], 'clamp') },
      ],
    };
  });

  return (
    <View style={[styles.slide, { width, height }]}>
      <View style={styles.sceneArea}>
        <View style={[styles.blob, { backgroundColor: theme.primarySoft }]} />
        <Animated.View style={sceneStyle}>{scene}</Animated.View>
      </View>
      <View style={styles.copy}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 54,
    paddingHorizontal: Spacing.four,
  },
  pager: {
    flex: 1,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.five,
  },
  sceneArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  blob: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 96,
    transform: [{ rotate: '12deg' }],
  },
  copy: {
    maxWidth: 420,
    gap: Spacing.two,
  },
  center: {
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  bars: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: BAR.gap,
  },
  bar: {
    width: BAR.width,
    height: 6,
    borderRadius: Radius.pill,
  },
  activeBar: {
    position: 'absolute',
    left: 0,
  },
});
