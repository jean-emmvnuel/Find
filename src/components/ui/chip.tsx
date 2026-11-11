import { StyleSheet, Text } from 'react-native';

import { PressableScale } from '@/components/ui/pressable-scale';
import { Font, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

/** Filtre sélectionnable. Sans `onPress`, simple étiquette (compétence, secteur). */
export function Chip({ label, selected = false, onPress }: ChipProps) {
  const theme = useTheme();

  return (
    <PressableScale
      disabled={!onPress}
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={onPress ? { selected } : undefined}
      scaleTo={0.95}
      hitSlop={4}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.text : theme.backgroundElement,
          borderColor: selected ? theme.text : theme.border,
        },
      ]}>
      <Text style={[styles.label, { color: selected ? theme.backgroundElement : theme.text }]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontFamily: Font.bold,
  },
});
