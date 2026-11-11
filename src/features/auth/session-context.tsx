import { createContext, use, useState, type ReactNode } from 'react';

import type { Session, UserRole } from '@/types/models';

type SessionState = {
  session: Session | null;
  hasOnboarded: boolean;
  completeOnboarding: () => void;
  /** Connexion simulée : sera remplacée par l'appel d'authentification réel. */
  signIn: (role: UserRole, displayName?: string) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionState | null>(null);

/**
 * État de session en mémoire. À faire persister (jeton en stockage sécurisé,
 * indicateur d'onboarding) quand l'authentification backend sera branchée.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  const value: SessionState = {
    session,
    hasOnboarded,
    completeOnboarding: () => setHasOnboarded(true),
    signIn: (role, displayName) =>
      setSession({
        id: 'demo',
        role,
        displayName: displayName?.trim() || (role === 'student' ? 'Awa Koné' : 'Ivoire Events'),
        verified: true,
      }),
    signOut: () => setSession(null),
  };

  return <SessionContext value={value}>{children}</SessionContext>;
}

export function useSession(): SessionState {
  const context = use(SessionContext);
  if (!context) throw new Error('useSession doit être utilisé dans <SessionProvider>');
  return context;
}
