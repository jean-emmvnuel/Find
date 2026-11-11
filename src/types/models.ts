/** Modèles métier partagés par toute l'app (alignés sur le brief technique). */

export type UserRole = 'student' | 'company';

export type Session = {
  id: string;
  role: UserRole;
  displayName: string;
  verified: boolean;
};

export type MissionStatus = 'active' | 'filled' | 'expired';

export type ApplicationStatus = 'pending' | 'accepted' | 'refused' | 'ongoing' | 'done';

export type Mission = {
  id: string;
  title: string;
  company: string;
  companyVerified: boolean;
  sector: string;
  location: string;
  /** Rémunération en FCFA. */
  pay: number;
  payUnit: 'hour' | 'day' | 'mission';
  duration: string;
  schedule: string;
  description: string;
  skills: string[];
  status: MissionStatus;
  applicants: number;
};

export type Application = {
  id: string;
  missionId: string;
  status: ApplicationStatus;
  appliedAt: string;
};

export type Conversation = {
  id: string;
  with: string;
  lastMessage: string;
  unread: number;
};
