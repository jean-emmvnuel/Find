import { Image, type ImageSource } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { SplashBackground } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Splash animé. Il prend le relais du splash natif, qui montre le symbole
 * (loupe + « ! ») centré, et raconte une seule idée : le symbole est le « d! »
 * du mot. La loupe fait un clin d'œil, glisse à sa place, et « Fin » se déroule
 * depuis elle.
 *
 * Tous les calques partagent le même canevas (664 × 340 unités, celui de
 * assets/brand/find-logo.svg) : seuls `transform` et `opacity` sont animés.
 */

// Géométrie du logo, en unités du canevas.
const CANVAS = { width: 664, height: 340 };
const SYMBOL = { centerX: 500, centerY: 171, size: 268 };
const UNDERLINE = { start: 90, end: 435 };
/** Largeur du symbole dans le splash natif (`imageWidth` dans app.json). */
const NATIVE_SPLASH_SYMBOL_WIDTH = 160;

const origin = (x: number, y: number) =>
  `${((x / CANVAS.width) * 100).toFixed(2)}% ${((y / CANVAS.height) * 100).toFixed(2)}%`;

const ORIGIN = {
  symbol: origin(SYMBOL.centerX, SYMBOL.centerY),
  eye: origin(475, 178),
  lens: origin(462, 190),
  bangDot: origin(572, 236),
};

// Chronologie, en millisecondes depuis la disparition du splash natif.
const AT = { wink: 140, sparks: 220, settle: 520, letters: 580, hop: 930, underline: 960, exit: 1750 };
const EXIT_DURATION = 260;

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
/** Ressort sans rebond : rien n'a lancé le symbole, il se pose simplement. */
const SETTLE_SPRING = { dampingRatio: 1, duration: 600 };

const LAYERS = {
  f: require('@/assets/images/splash/f.png'),
  i: require('@/assets/images/splash/i.png'),
  n: require('@/assets/images/splash/n.png'),
  fDark: require('@/assets/images/splash/f-dark.png'),
  iDark: require('@/assets/images/splash/i-dark.png'),
  nDark: require('@/assets/images/splash/n-dark.png'),
  glass: require('@/assets/images/splash/glass.png'),
  eye: require('@/assets/images/splash/eye.png'),
  wink: require('@/assets/images/splash/wink.png'),
  bang: require('@/assets/images/splash/bang.png'),
  underline: require('@/assets/images/splash/underline.png'),
  sparks: [
    require('@/assets/images/splash/spark-1.png'),
    require('@/assets/images/splash/spark-2.png'),
    require('@/assets/images/splash/spark-3.png'),
  ],
} as const;

export function AnimatedSplash() {
  const scheme = useColorScheme();
  const reducedMotion = useReducedMotion();
  // Mesurée au montage plutôt que lue au rendu : avec le rendu serveur (web),
  // la largeur vaut 0 et le canevas resterait vide après hydratation.
  const [screenWidth, setScreenWidth] = useState(0);
  const [visible, setVisible] = useState(true);
  const started = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const logoWidth = Math.min(screenWidth * 0.74, 340);
  const unit = logoWidth / CANVAS.width;
  // Position de départ du symbole : celle du splash natif, pour une reprise sans saut.
  const startScale = NATIVE_SPLASH_SYMBOL_WIDTH / (SYMBOL.size * unit);
  const startX = (CANVAS.width / 2 - SYMBOL.centerX) * unit;

  const settle = useSharedValue(0);
  const wink = useSharedValue(0);
  const sparks = useSharedValue(0);
  const letters = useSharedValue(0);
  const hop = useSharedValue(0);
  const underline = useSharedValue(0);
  const exit = useSharedValue(0);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const dismiss = () => {
    timers.current.forEach(clearTimeout);
    exit.set(withTiming(1, { duration: EXIT_DURATION, easing: Easing.out(Easing.quad) }));
    timers.current = [setTimeout(() => setVisible(false), EXIT_DURATION + 40)];
  };

  const start = () => {
    if (started.current) return;
    started.current = true;

    if (reducedMotion) {
      // Mouvement réduit : aucun déplacement, le mot apparaît en fondu.
      settle.set(1);
      sparks.set(1);
      wink.set(withDelay(AT.wink, withTiming(1, { duration: 120 })));
      letters.set(withDelay(AT.wink, withTiming(1, { duration: 320 })));
      underline.set(withDelay(AT.wink, withTiming(1, { duration: 320 })));
      timers.current.push(setTimeout(dismiss, 1200));
      return;
    }

    wink.set(withDelay(AT.wink, withTiming(1, { duration: 110, easing: Easing.out(Easing.quad) })));
    sparks.set(withDelay(AT.sparks, withTiming(1, { duration: 420, easing: Easing.linear })));
    settle.set(withDelay(AT.settle, withSpring(1, SETTLE_SPRING)));
    letters.set(withDelay(AT.letters, withTiming(1, { duration: 560, easing: Easing.linear })));
    // Seul rebond de la séquence : le « ! » sursaute, il a reçu une impulsion.
    hop.set(withDelay(
      AT.hop,
      withSequence(
        withTiming(1, { duration: 150, easing: Easing.out(Easing.cubic) }),
        withSpring(0, { dampingRatio: 0.45, duration: 480 }),
      ),
    ));
    underline.set(withDelay(AT.underline, withTiming(1, { duration: 460, easing: EASE_OUT })));
    timers.current.push(setTimeout(dismiss, AT.exit));
  };

  const overlayStyle = useAnimatedStyle(() => ({ opacity: 1 - exit.value }));

  const canvasStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + exit.value * 0.04 }],
  }));

  const symbolStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(settle.value, [0, 1], [startX, 0]) },
      { scale: interpolate(settle.value, [0, 1], [startScale, 1]) },
    ],
  }));

  const eyeStyle = useAnimatedStyle(() => ({
    opacity: wink.value < 0.7 ? 1 : 0,
    transform: [{ scaleY: interpolate(wink.value, [0, 0.7], [1, 0.15], 'clamp') }],
  }));

  const winkStyle = useAnimatedStyle(() => ({
    opacity: wink.value < 0.7 ? 0 : 1,
    transform: [{ scaleX: interpolate(wink.value, [0.7, 1], [0.6, 1], 'clamp') }],
  }));

  const bangStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: hop.value * -16 * unit }, { rotate: `${hop.value * 4}deg` }],
  }));

  // Le soulignement se dessine de gauche à droite : une fenêtre qui glisse,
  // et son contenu qui glisse en sens inverse pour rester immobile.
  const underlineWindowStyle = useAnimatedStyle(() => {
    const edge = interpolate(underline.value, [0, 1], [UNDERLINE.start, UNDERLINE.end]) * unit;
    return { transform: [{ translateX: reducedMotion ? 0 : edge - logoWidth }] };
  });
  const underlineContentStyle = useAnimatedStyle(() => {
    const edge = interpolate(underline.value, [0, 1], [UNDERLINE.start, UNDERLINE.end]) * unit;
    return {
      opacity: reducedMotion ? underline.value : 1,
      transform: [{ translateX: reducedMotion ? 0 : logoWidth - edge }],
    };
  });

  if (!visible) return null;

  const dark = scheme === 'dark';
  const canvasSize = { width: logoWidth, height: logoWidth * (CANVAS.height / CANVAS.width) };

  return (
    <Animated.View
      onLayout={(event) => {
        setScreenWidth(event.nativeEvent.layout.width);
        SplashScreen.hideAsync().finally(start);
      }}
      style={[styles.overlay, { backgroundColor: SplashBackground[dark ? 'dark' : 'light'] }, overlayStyle]}>
      <Pressable
        style={styles.fill}
        onPress={dismiss}
        accessibilityRole="button"
        accessibilityLabel="Find">
        <Animated.View key={screenWidth} style={[canvasSize, canvasStyle]}>
          {/* « Fin » se déroule depuis la loupe : n, puis i, puis F. */}
          <Letter progress={letters} index={2} unit={unit} reducedMotion={reducedMotion}>
            <Layer source={dark ? LAYERS.fDark : LAYERS.f} />
          </Letter>
          <Letter progress={letters} index={1} unit={unit} reducedMotion={reducedMotion}>
            <Layer source={dark ? LAYERS.iDark : LAYERS.i} />
          </Letter>
          <Letter progress={letters} index={0} unit={unit} reducedMotion={reducedMotion}>
            <Layer source={dark ? LAYERS.nDark : LAYERS.n} />
          </Letter>

          <Animated.View style={[styles.layer, styles.clip, underlineWindowStyle]}>
            <Animated.View style={[styles.layer, underlineContentStyle]}>
              <Layer source={LAYERS.underline} />
            </Animated.View>
          </Animated.View>

          <Animated.View style={[styles.layer, { transformOrigin: ORIGIN.symbol }, symbolStyle]}>
            {LAYERS.sparks.map((source, index) => (
              <Spark key={index} progress={sparks} index={index}>
                <Layer source={source} />
              </Spark>
            ))}
            <Layer source={LAYERS.glass} />
            <Animated.View style={[styles.layer, { transformOrigin: ORIGIN.eye }, eyeStyle]}>
              <Layer source={LAYERS.eye} />
            </Animated.View>
            <Animated.View style={[styles.layer, { transformOrigin: ORIGIN.eye }, winkStyle]}>
              <Layer source={LAYERS.wink} />
            </Animated.View>
            <Animated.View style={[styles.layer, { transformOrigin: ORIGIN.bangDot }, bangStyle]}>
              <Layer source={LAYERS.bang} />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

function Layer({ source }: { source: ImageSource }) {
  return <Image source={source} style={styles.layer} contentFit="contain" />;
}

type StaggeredProps = {
  progress: SharedValue<number>;
  index: number;
  children: ReactNode;
};

/** Part d'une fenêtre décalée de la progression commune, pour échelonner sans minuteries. */
function staggered(progress: number, index: number, count: number, overlap: number) {
  'worklet';
  const span = 1 / (1 + (count - 1) * (1 - overlap));
  const start = index * span * (1 - overlap);
  return Math.min(1, Math.max(0, (progress - start) / span));
}

function Letter({
  progress,
  index,
  unit,
  reducedMotion,
  children,
}: StaggeredProps & { unit: number; reducedMotion: boolean }) {
  const style = useAnimatedStyle(() => {
    // Décélération franche (quartique), sans dépassement.
    const local = 1 - Math.pow(1 - staggered(progress.value, index, 3, 0.55), 4);
    return {
      opacity: Math.min(1, local * 2.2),
      transform: [{ translateX: reducedMotion ? 0 : (1 - local) * 46 * unit }],
    };
  });
  return <Animated.View style={[styles.layer, style]}>{children}</Animated.View>;
}

function Spark({ progress, index, children }: StaggeredProps) {
  const style = useAnimatedStyle(() => {
    const local = staggered(progress.value, index, 3, 0.5);
    // Léger dépassement : les éclats jaillissent puis se posent.
    const scale = interpolate(local, [0, 0.6, 1], [0.35, 1.12, 1]);
    return { opacity: Math.min(1, local * 3), transform: [{ scale }] };
  });
  const origin: ViewStyle = { transformOrigin: ORIGIN.lens };
  return <Animated.View style={[styles.layer, origin, style]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
  },
  fill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  layer: {
    ...StyleSheet.absoluteFill,
  },
  clip: {
    overflow: 'hidden',
  },
});
