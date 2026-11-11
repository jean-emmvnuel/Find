import type { Href } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';
import type { AndroidSymbol, SFSymbol } from 'expo-symbols';

import { useTheme } from '@/hooks/use-theme';

export type TabConfig = {
  /** Nom du fichier de route dans le dossier du navigateur. */
  name: string;
  /** Chemin complet, utilisé par la version web. */
  href: Href;
  label: string;
  /** Icône iOS (SF Symbols). */
  sf: SFSymbol;
  /** Icône Android (Material Symbols). */
  md: AndroidSymbol;
};

/** Barre d'onglets native, partagée par les espaces étudiant et entreprise. */
export default function AppTabs({ tabs }: { tabs: TabConfig[] }) {
  const theme = useTheme();

  return (
    <NativeTabs
      backgroundColor={theme.background}
      indicatorColor={theme.backgroundSelected}
      tintColor={theme.primary}
      labelStyle={{ selected: { color: theme.primary } }}>
      {tabs.map((tab) => (
        <NativeTabs.Trigger key={tab.name} name={tab.name}>
          <NativeTabs.Trigger.Label>{tab.label}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={tab.sf} md={tab.md} />
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
