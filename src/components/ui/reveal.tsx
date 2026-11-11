import { useEffect, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

import { Springs, Stagger } from '@/constants/motion';

type RevealProps = {
  children: ReactNode;
  /** Rang dans la séquence : chaque rang arrive un peu après le précédent. */
  index?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Apparition d'un bloc à l'ouverture d'un écran : il monte de quelques points
 * et se pose sans rebond. En mouvement réduit, simple fondu.
 */
export function Reveal({ children, index = 0, style }: RevealProps) {
  const progress = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    progress.set(withDelay(
      Math.min(index * Stagger.step, Stagger.max),
      withSpring(1, Springs.settle),
    ));
  }, [index, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, progress.value * 1.6),
    transform: [{ translateY: reducedMotion ? 0 : (1 - progress.value) * 16 }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}
