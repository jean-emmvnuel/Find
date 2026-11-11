/**
 * Langage de mouvement de Find. Une seule règle : par défaut, rien ne rebondit.
 * Le rebond est réservé aux gestes qui ont donné une impulsion (un tap qui
 * « coche » quelque chose, un favori).
 *
 * `dampingRatio` 1 = amortissement critique (aucun dépassement) ;
 * `duration` joue le rôle de la « réponse » : plus court = plus vif.
 */
export const Springs = {
  /** Retour d'un élément pressé. */
  press: { dampingRatio: 1, duration: 220 },
  /** Apparition ou déplacement d'un élément d'interface. */
  settle: { dampingRatio: 1, duration: 480 },
  /** Curseur d'un contrôle que l'on vient de toucher. */
  snappy: { dampingRatio: 0.85, duration: 340 },
  /** Confirmation d'une action : favori, candidature envoyée. */
  pop: { dampingRatio: 0.5, duration: 420 },
} as const;

export const Durations = {
  /** Réponse au toucher : doit sembler immédiate. */
  press: 90,
  fast: 160,
  base: 240,
} as const;

/** Échelonnement des éléments d'une liste à l'apparition. */
export const Stagger = { step: 55, max: 330 } as const;
