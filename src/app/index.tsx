import { Redirect } from 'expo-router';

import { useSession } from '@/features/auth/session-context';

/** Point d'entrée : envoie l'utilisateur vers l'étape qui correspond à son état. */
export default function Index() {
  const { session, hasOnboarded } = useSession();

  if (!hasOnboarded) return <Redirect href="/onboarding" />;
  if (!session) return <Redirect href="/welcome" />;
  return <Redirect href={session.role === 'student' ? '/student' : '/company'} />;
}
