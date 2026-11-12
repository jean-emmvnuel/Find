import type { Tone } from '@/components/ui/badge';
import type { TranslationKey } from '@/i18n';
import type { CandidateStatus } from '@/types/models';

export const CANDIDATE_TONE: Record<CandidateStatus, Tone> = {
  new: 'accent',
  hired: 'success',
  declined: 'danger',
};

export const CANDIDATE_LABEL: Record<CandidateStatus, TranslationKey> = {
  new: 'candidate.status.new',
  hired: 'candidate.status.hired',
  declined: 'candidate.status.declined',
};

/** Lien vers la fiche d'un candidat, à passer à `router.push`. */
export function openCandidate(id: string) {
  return { pathname: '/candidate/[id]' as const, params: { id } };
}
