import {
  TabList,
  TabSlot,
  TabTrigger,
  Tabs,
  type TabListProps,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Font, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import type { TabConfig } from './app-tabs';

export type { TabConfig };

/** Version web : barre d'onglets en bas, comme dans l'app native. */
export default function AppTabs({ tabs }: { tabs: TabConfig[] }) {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      {/* Les déclencheurs doivent rester les enfants directs de la liste :
          c'est ainsi qu'expo-router enregistre les onglets. */}
      <TabList asChild>
        <BottomTabList>
          {tabs.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <TabButton icon={tab.md}>{tab.label}</TabButton>
            </TabTrigger>
          ))}
        </BottomTabList>
      </TabList>
    </Tabs>
  );
}

function BottomTabList(props: TabListProps) {
  const theme = useTheme();

  return (
    <View
      {...props}
      style={[styles.bar, { backgroundColor: theme.backgroundElement, borderTopColor: theme.border }]}>
      <View style={styles.items}>{props.children}</View>
    </View>
  );
}

type TabButtonProps = TabTriggerSlotProps & { icon: TabConfig['md'] };

function TabButton({ children, isFocused, icon, ref, ...props }: TabButtonProps) {
  const theme = useTheme();
  const color = isFocused ? theme.primary : theme.textSecondary;

  return (
    // Le type de `ref` fourni par expo-router/ui diffère de celui de Pressable (même élément natif).
    <Pressable
      {...props}
      ref={ref as never}
      accessibilityRole="tab"
      accessibilityState={{ selected: !!isFocused }}
      style={({ pressed }) => [styles.tab, pressed && styles.pressed]}>
      <View style={[styles.iconPill, isFocused && { backgroundColor: theme.primarySoft }]}>
        <SymbolView name={{ android: icon, web: icon }} size={24} tintColor={color} />
      </View>
      <Text numberOfLines={1} style={[styles.label, { color }]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  items: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.two,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.half,
    paddingTop: Spacing.two,
    paddingBottom: 10,
  },
  pressed: {
    opacity: 0.6,
  },
  iconPill: {
    width: 56,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: Font.semibold,
    fontSize: 11,
    lineHeight: 14,
  },
});
