import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Durations, Springs } from '@/constants/motion';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';

import { useMissions } from './missions-context';

/** Favori d'une mission. L'icône rebondit à l'enregistrement : le tap l'a « lancée ». */
type SaveButtonProps = {
  missionId: string;
  /** Surface sur laquelle le bouton est posé, pour qu'il s'en détache. */
  on?: 'card' | 'page';
};

export function SaveButton({ missionId, on = 'card' }: SaveButtonProps) {
  const theme = useTheme();
  const { t } = useI18n();
  const { isSaved, toggleSaved } = useMissions();
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const saved = isSaved(missionId);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={t(saved ? 'missions.unsave' : 'missions.save')}
      accessibilityState={{ selected: saved }}
      hitSlop={8}
      onPress={() => {
        if (!saved && !reducedMotion) {
          scale.set(withSequence(
            withTiming(1.3, { duration: Durations.press }),
            withSpring(1, Springs.pop),
          ));
        }
        toggleSaved(missionId);
      }}
      style={[styles.button, {
          backgroundColor: saved
            ? theme.primarySoft
            : on === 'card'
              ? theme.background
              : theme.backgroundElement,
        },
      ]}>
      <Animated.View style={iconStyle}>
        <Icon
          name={saved ? 'bookmarkFilled' : 'bookmark'}
          color={saved ? theme.primary : theme.textSecondary}
        />
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
