import { APPLICATIONS, CONVERSATIONS, MISSIONS } from '@/features/missions/mock-data';
import type { Application, Conversation, Mission } from '@/types/models';

/**
 * Couche d'accès aux données. Les écrans ne lisent jamais les mocks directement :
 * brancher le backend revient à remplacer le corps de ces fonctions par `apiFetch`.
 */

export function listMissions(query = ''): Mission[] {
  const q = query.trim().toLowerCase();
  if (!q) return MISSIONS;
  return MISSIONS.filter((m) =>
    [m.title, m.company, m.sector, m.location].some((field) => field.toLowerCase().includes(q)),
  );
}

export function getMission(id: string): Mission | undefined {
  return MISSIONS.find((m) => m.id === id);
}

export function listApplications(): Application[] {
  return APPLICATIONS;
}

export function listConversations(): Conversation[] {
  return CONVERSATIONS;
}
