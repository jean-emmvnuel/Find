import { createContext, use, useState, type ReactNode } from 'react';

import { listApplications, listCandidates, listMissions } from '@/services/missions';
import type { Application, Candidate, CandidateStatus, Mission } from '@/types/models';

export type NewMission = Pick<
  Mission,
  'title' | 'description' | 'location' | 'pay' | 'payUnit' | 'duration'
>;

type MissionsState = {
  missions: Mission[];
  applications: Application[];
  getMission: (id: string) => Mission | undefined;
  savedCount: number;
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  hasApplied: (id: string) => boolean;
  apply: (id: string) => void;
  publish: (mission: NewMission, company: string) => void;
  /** Côté entreprise : candidatures reçues et décisions. */
  candidates: Candidate[];
  getCandidate: (id: string) => Candidate | undefined;
  candidatesFor: (missionId: string) => Candidate[];
  decide: (candidateId: string, status: CandidateStatus) => void;
  /** Ferme une mission active : elle passe en « pourvue ». */
  closeMission: (id: string) => void;
};

const MissionsContext = createContext<MissionsState | null>(null);

/**
 * État des missions partagé entre les écrans : favoris, candidatures, missions
 * publiées. En mémoire pour l'instant ; chaque action deviendra un appel API.
 */
export function MissionsProvider({ children }: { children: ReactNode }) {
  const [missions, setMissions] = useState(listMissions);
  const [applications, setApplications] = useState(listApplications);
  const [saved, setSaved] = useState<string[]>([]);
  const [candidates, setCandidates] = useState(listCandidates);

  const value: MissionsState = {
    missions,
    applications,
    getMission: (id) => missions.find((mission) => mission.id === id),
    savedCount: saved.length,
    isSaved: (id) => saved.includes(id),
    toggleSaved: (id) =>
      setSaved((current) =>
        current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
      ),
    hasApplied: (id) => applications.some((application) => application.missionId === id),
    apply: (id) =>
      setApplications((current) =>
        current.some((application) => application.missionId === id)
          ? current
          : [
              {
                id: `a${current.length + 1}`,
                missionId: id,
                status: 'pending',
                appliedAt: new Date().toISOString().slice(0, 10),
              },
              ...current,
            ],
      ),
    publish: (mission, company) =>
      setMissions((current) => [
        {
          ...mission,
          id: `m${current.length + 1}`,
          company,
          companyVerified: true,
          sector: 'Autre',
          schedule: '',
          skills: [],
          status: 'active',
          applicants: 0,
          postedDaysAgo: 0,
          companyRating: null,
          companyMissions: current.filter((item) => item.company === company).length + 1,
          views: 0,
        },
        ...current,
      ]),
    candidates,
    getCandidate: (id) => candidates.find((candidate) => candidate.id === id),
    candidatesFor: (missionId) => candidates.filter((candidate) => candidate.missionId === missionId),
    decide: (candidateId, status) =>
      setCandidates((current) =>
        current.map((candidate) => (candidate.id === candidateId ? { ...candidate, status } : candidate)),
      ),
    closeMission: (id) =>
      setMissions((current) =>
        current.map((mission) => (mission.id === id ? { ...mission, status: 'filled' } : mission)),
      ),
  };

  return <MissionsContext value={value}>{children}</MissionsContext>;
}

export function useMissions(): MissionsState {
  const context = use(MissionsContext);
  if (!context) throw new Error('useMissions doit être utilisé dans <MissionsProvider>');
  return context;
}
