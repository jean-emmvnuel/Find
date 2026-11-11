import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { SessionProvider, useSession } from '@/features/auth/session-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { I18nProvider } from '@/i18n';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <I18nProvider>
        <SessionProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </SessionProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

/**
 * Parcours : onboarding → authentification → espace étudiant ou entreprise.
 * Chaque groupe n'est accessible que si sa garde est vraie ; `index` redirige
 * vers le bon point d'entrée.
 */
function RootNavigator() {
  const { session, hasOnboarded } = useSession();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />

      <Stack.Protected guard={!hasOnboarded}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>

      <Stack.Protected guard={hasOnboarded && !session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={session?.role === 'student'}>
        <Stack.Screen name="student" />
      </Stack.Protected>

      <Stack.Protected guard={session?.role === 'company'}>
        <Stack.Screen name="company" />
      </Stack.Protected>

      <Stack.Protected guard={!!session}>
        <Stack.Screen name="mission/[id]" options={{ headerShown: true, title: '' }} />
      </Stack.Protected>
    </Stack>
  );
}
