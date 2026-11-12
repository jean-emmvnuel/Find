import { APPLICATIONS, CANDIDATES, CONVERSATIONS, MESSAGES, MISSIONS } from '@/features/missions/mock-data';
import type { Application, Candidate, Conversation, Message, Mission } from '@/types/models';

/**
 * Couche d'accès aux données. Les écrans ne lisent jamais les mocks directement :
 * brancher le backend revient à remplacer le corps de ces fonctions par `apiFetch`.
 */

export function listMissions(): Mission[] {
  return MISSIONS;
}

export function listApplications(): Application[] {
  return APPLICATIONS;
}

/** Candidatures reçues par l'entreprise connectée, toutes missions confondues. */
export function listCandidates(): Candidate[] {
  return CANDIDATES;
}

export function listConversations(): Conversation[] {
  return CONVERSATIONS;
}

export function getConversation(id: string): Conversation | undefined {
  return CONVERSATIONS.find((conversation) => conversation.id === id);
}

export function listMessages(conversationId: string): Message[] {
  return MESSAGES[conversationId] ?? [];
}

/** Recherche plein texte et filtre par secteur, appliqués côté client. */
export function filterMissions(missions: Mission[], query: string, sector: string | null): Mission[] {
  const q = query.trim().toLowerCase();
  return missions.filter(
    (mission) =>
      (!sector || mission.sector === sector) &&
      (!q ||
        [mission.title, mission.company, mission.sector, mission.location].some((field) =>
          field.toLowerCase().includes(q),
        )),
  );
}
