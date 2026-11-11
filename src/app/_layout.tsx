import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans/400Regular';
import { PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans/500Medium';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans/800ExtraBold';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplash } from '@/components/brand/animated-splash';
import { SessionProvider, useSession } from '@/features/auth/session-context';
import { MissionsProvider } from '@/features/missions/missions-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { I18nProvider } from '@/i18n';

// Le splash natif reste affiché jusqu'à ce que le splash animé prenne le relais.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  // Le splash natif reste à l'écran pendant le chargement. En cas d'échec,
  // l'app s'affiche quand même, avec la police du système.
  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <I18nProvider>
        <SessionProvider>
          <MissionsProvider>
            <RootNavigator />
          </MissionsProvider>
          <AnimatedSplash />
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
        <Stack.Screen name="mission/[id]" />
        <Stack.Screen name="conversation/[id]" />
      </Stack.Protected>

      <Stack.Protected guard={session?.role === 'company'}>
        <Stack.Screen name="mission/new" options={{ presentation: 'modal' }} />
      </Stack.Protected>
    </Stack>
  );
}
