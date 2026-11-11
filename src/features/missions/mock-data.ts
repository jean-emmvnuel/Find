import type { Application, Conversation, Mission } from '@/types/models';

/** Données de démonstration, à remplacer par l'API quand le backend sera prêt. */
export const MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Hôte / hôtesse d’accueil — salon professionnel',
    company: 'Ivoire Events',
    companyVerified: true,
    sector: 'Événementiel',
    location: 'Plateau, Abidjan',
    pay: 15000,
    payUnit: 'day',
    duration: '3 jours',
    schedule: '08h00 – 17h00',
    description:
      'Accueil et orientation des visiteurs, gestion des badges et distribution des supports pendant le salon.',
    skills: ['Accueil', 'Français', 'Anglais'],
    status: 'active',
    applicants: 12,
  },
  {
    id: 'm2',
    title: 'Inventoriste — grande distribution',
    company: 'Super Marché Cocody',
    companyVerified: true,
    sector: 'Distribution',
    location: 'Cocody, Abidjan',
    pay: 2000,
    payUnit: 'hour',
    duration: '1 semaine',
    schedule: '18h00 – 23h00',
    description: 'Comptage des stocks en magasin et saisie des quantités sur terminal mobile.',
    skills: ['Rigueur', 'Saisie'],
    status: 'active',
    applicants: 5,
  },
  {
    id: 'm3',
    title: 'Assistant·e saisie de données',
    company: 'Lagune Conseil',
    companyVerified: false,
    sector: 'Bureautique',
    location: 'Marcory, Abidjan',
    pay: 60000,
    payUnit: 'mission',
    duration: '2 semaines',
    schedule: '09h00 – 16h00',
    description: 'Saisie et contrôle de formulaires papier dans un tableur, vérification des doublons.',
    skills: ['Excel', 'Saisie', 'Organisation'],
    status: 'active',
    applicants: 8,
  },
];

export const APPLICATIONS: Application[] = [
  { id: 'a1', missionId: 'm1', status: 'accepted', appliedAt: '2026-11-02' },
  { id: 'a2', missionId: 'm3', status: 'pending', appliedAt: '2026-11-08' },
];

export const CONVERSATIONS: Conversation[] = [
  { id: 'c1', with: 'Ivoire Events', lastMessage: 'Rendez-vous lundi à 7h45 à l’entrée.', unread: 1 },
];
