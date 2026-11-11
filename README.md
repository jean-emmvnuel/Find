# Find

Application mobile et web de mise en relation entre étudiants et entreprises pour des missions courtes en Côte d'Ivoire. Ce dépôt contient le **frontend** (Expo SDK 58, React Native, Expo Router, TypeScript).

## Démarrer

```bash
npm install
npx expo start
```

| Commande | Rôle |
| --- | --- |
| `npx expo start` | serveur de développement (iOS, Android, web) |
| `npx expo lint` | lint |
| `npm run typecheck` | vérification TypeScript |
| `npx expo install <paquet>` | ajouter une dépendance compatible avec le SDK |

## Architecture

```
assets/
  brand/            sources vectorielles du logo (SVG) : logo, symbole, icônes d'app
  images/           PNG générés depuis assets/brand (icône, splash, logo in-app)
src/
  app/              routes Expo Router — uniquement des écrans et des layouts
    _layout.tsx       providers + gardes de navigation
    index.tsx         redirection selon l'état (onboarding / auth / rôle)
    onboarding.tsx    tutoriel de premier lancement
    (auth)/           welcome, sign-in, sign-up
    student/          onglets étudiant : missions, candidatures, messages, profil
    company/          onglets entreprise : tableau de bord, missions, messages, profil
    mission/[id].tsx  fiche mission
  components/
    brand/            logo
    ui/               briques génériques : Button, TextField, Badge, Screen
    app-tabs(.web)    barre d'onglets native / web
  features/         code métier par domaine (auth, missions, messaging, profile)
  services/         accès aux données : client HTTP + fonctions par ressource
  i18n/             traductions FR / EN et hook useI18n
  constants/        design tokens (couleurs, espacements, rayons)
  hooks/            hooks transverses (thème, schéma de couleurs)
  types/            modèles métier partagés
```

### Règles

- **Les routes restent fines.** Un fichier de `src/app/` assemble des composants ; la logique vit dans `features/` et `services/`.
- **Les écrans ne lisent pas les données directement.** Ils passent par `src/services/`. Aujourd'hui ces fonctions renvoient des données de démonstration ; brancher le backend revient à remplacer leur corps par `apiFetch` (`EXPO_PUBLIC_API_URL`).
- **Aucun texte en dur.** Toute chaîne visible passe par `t('clé')` ; `fr.ts` est la référence et TypeScript impose les mêmes clés dans `en.ts`.
- **Aucune couleur en dur.** Utiliser `useTheme()` et les tokens de `constants/theme.ts`, dérivés du logo.

### Navigation

`src/app/_layout.tsx` protège chaque groupe avec `Stack.Protected` :

| Garde | Écrans accessibles |
| --- | --- |
| onboarding non vu | `onboarding` |
| onboarding vu, pas de session | `(auth)` |
| session étudiant | `student`, `mission/[id]` |
| session entreprise | `company`, `mission/[id]` |

Ces gardes sont côté client : elles organisent le parcours, elles ne remplacent pas le contrôle d'accès du backend.

### Ce qui est simulé pour l'instant

- La session et l'onboarding sont en mémoire (`features/auth/session-context.tsx`) : ils sont réinitialisés à chaque redémarrage.
- La connexion n'appelle aucun serveur ; les missions, candidatures et conversations viennent de `features/missions/mock-data.ts`.

## Logo

Les sources sont dans `assets/brand/`. Pour régénérer les PNG après une modification, rendre chaque SVG à la taille voulue (icône 1024 px, foreground Android 512 px, favicon 48 px) et remplacer le fichier correspondant dans `assets/images/`.

| Couleur | Hex |
| --- | --- |
| Bleu marine | `#0E1B5B` |
| Bleu | `#2A5BEA` |
| Bleu ciel | `#22A7F7` |
| Orange | `#F58A07` |
