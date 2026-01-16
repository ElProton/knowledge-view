---
id: "feat-home-page"
title: "Page d'accueil"
type: "feature"
tags: ["navigation", "home", "dashboard"]
status: "active"

relationships:
  part_of: ["epic-ui-features"]
  depends_on: ["feat-authentication", "feat-generic-section"]
  triggers: []
---

# Page d'accueil (Home)

## Vue d'ensemble

Page d'accueil servant de point d'entrée principal à l'application. Affiche une vue d'ensemble des sections disponibles et permet une navigation rapide vers chaque fonctionnalité.

## Architecture

**Fichier :** `src/pages/Home/HomePage.tsx`
**Route :** `/`

## Fonctionnalités

### Message de bienvenue personnalisé

Affiche le prénom de l'utilisateur connecté :

```typescript
const { user } = useAuth();
// ...
<h1>
  Bienvenue{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''} 👋
</h1>
```

### Grille des sections

Affiche toutes les sections non-masquées et actives :

```typescript
const otherSections = sectionsConfig.filter(
  (section) => section.id !== 'home' && !section.disabled
);
```

Chaque carte de section affiche :
- Icône (via `iconMap`)
- Nom de la section (`label`)
- Description (si présente)

### Mapping des icônes

```typescript
const iconMap: Record<string, string> = {
  home: '🏠',
  document: '📄',
  book: '📚',
  code: '💻',
  default: '📁',
};
```

### Section "À propos"

Liste statique des fonctionnalités principales :
- Valider les spécifications générées par les agents IA
- Consulter et modifier les connaissances stockées
- Gérer les prompts système
- Suivre les prospects et autres données métier

## État vide

Si aucune section n'est configurée :

```tsx
<div className={styles.emptyState}>
  <p>Aucune section configurée pour le moment.</p>
  <p>Les sections seront ajoutées au fur et à mesure du développement.</p>
</div>
```

## Structure CSS

**Classes principales :**

| Classe | Usage |
|--------|-------|
| `.homePage` | Container principal |
| `.header` | En-tête avec titre et sous-titre |
| `.sectionsGrid` | Grille responsive des cartes de section |
| `.sectionCard` | Carte individuelle (lien vers la section) |
| `.infoSection` | Section "À propos" |

## Dépendances

- `useAuth` : Récupération des informations utilisateur
- `sectionsConfig` : Configuration des sections disponibles
- `react-router-dom` : Navigation via composant `Link`

## Configuration de la section

**Extrait de `sectionsConfig` :**

```typescript
{
  id: 'home',
  label: 'Accueil',
  path: '/',
  icon: 'home',
  description: "Vue d'ensemble et navigation",
  component: lazy(() => import('../pages/Home/HomePage')),
}
```

## Intégration routing

La page d'accueil est chargée via le lazy loading défini dans `sectionsConfig` et rendue dans le `MainFrame` du layout principal.
