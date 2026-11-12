import { StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { useTheme } from '@/hooks/use-theme';

const SIZE = 30;
const OVERLAP = 10;

/** Visages des premiers candidats, superposés comme sur les places de marché. */
export function AvatarStack({ names, max = 3 }: { names: string[]; max?: number }) {
  const theme = useTheme();

  return (
    <View style={styles.row} importantForAccessibility="no-hide-descendants" accessible={false}>
      {names.slice(0, max).map((name, index) => (
        <View
          key={name}
          style={[
            styles.ring,
            { borderColor: theme.backgroundElement, marginLeft: index === 0 ? 0 : -OVERLAP },
          ]}>
          <Avatar name={name} size={SIZE} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  ring: {
    borderWidth: 2,
    borderRadius: SIZE,
  },
});
