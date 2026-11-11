import { TabList, TabSlot, TabTrigger, Tabs, type TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';

import { Logo } from '@/components/brand/logo';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';

import type { TabConfig } from './app-tabs';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export type { TabConfig };

/** Version web : barre de navigation flottante en haut de page. */
export default function AppTabs({ tabs }: { tabs: TabConfig[] }) {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <View style={styles.tabListContainer}>
          <ThemedView type="backgroundElement" style={styles.innerContainer}>
            <Logo width={72} style={styles.brand} />
            {tabs.map((tab) => (
              <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
                <TabButton>{tab.label}</TabButton>
              </TabTrigger>
            ))}
          </ThemedView>
        </View>
      </TabList>
    </Tabs>
  );
}

function TabButton({ children, isFocused, ref, ...props }: TabTriggerSlotProps) {
  return (
    // Le type de `ref` fourni par expo-router/ui diffère de celui de Pressable (même élément natif).
    <Pressable {...props} ref={ref as never} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}>
        <ThemedText type="small" themeColor={isFocused ? 'primary' : 'textSecondary'}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  brand: {
    marginRight: 'auto',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
  },
});
