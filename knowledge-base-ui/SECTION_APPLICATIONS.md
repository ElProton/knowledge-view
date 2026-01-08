# Section Applications - Documentation

## Vue d'ensemble

Cette section permet de gérer les applications et leurs fonctionnalités (features) dans la Knowledge Base.

### Implémentation MVP

La version actuelle (MVP) offre :
- ✅ CRUD complet des applications
- ✅ Affichage des features en lecture seule (accordéon)
- ✅ Initialisation automatique des features (tableau vide à la création)
- ⏳ Gestion des features (ajout/modification/suppression) - **À venir**

## Architecture

Cette section suit l'architecture générique de ressources décrite dans `ARCHITECTURE_GENERIQUE.md`.

### Fichiers créés

```
src/
├── types/document.types.ts              # Types ApplicationDocument, ApplicationStatus, Feature
├── features/applications/
│   └── applications.config.ts           # Configuration de la ressource
├── components/applications/
│   ├── ApplicationForm.tsx              # Formulaire avec affichage features
│   └── ApplicationForm.module.css       # Styles du formulaire
└── pages/Applications/
    ├── ApplicationListPage.tsx          # Liste des applications
    ├── ApplicationCreatePage.tsx        # Création d'application
    └── ApplicationDetailPage.tsx        # Détail/Édition
```

## Types de données

### ApplicationDocument

```typescript
interface ApplicationDocument extends KBDocument<ApplicationData> {
  type: 'application';
}
```

### ApplicationData

```typescript
interface ApplicationData {
  content: string;                    // Requis
  url?: string | null;                // Optionnel
  status: ApplicationStatus;          // Requis
  features: Feature[];                // Requis (vide à la création)
}
```

### ApplicationStatus (Enum)

- `DRAFT` : Brouillon
- `DEV` : Développement
- `STAGING` : Pré-production
- `PROD` : Production
- `DEPRECATED` : Dépréciée

### Feature

```typescript
interface Feature {
  name?: string;
  description?: string;
  [key: string]: unknown;  // Propriétés additionnelles
}
```

## Fonctionnalités

### Liste des applications

- Affiche : Titre, Statut, URL, Date de création
- Pagination standard (25/50/100 par page)
- Navigation vers détail ou création

### Création d'application

**Champs requis :**
- Titre
- Statut
- Description (content)

**Champs optionnels :**
- URL

**Règle importante (RG-002) :**
Les features sont initialisées comme un tableau vide `[]` automatiquement.

### Détail/Édition

- Modification de tous les champs (sauf titre si configuré en readOnly)
- Affichage des features en accordéon (lecture seule dans le MVP)
- Suppression de l'application

### Affichage des Features

Les features sont affichées dans des éléments `<details>` repliables :
- Fermées par défaut pour ne pas surcharger l'interface
- Clic sur le nom pour déplier/replier
- Affichage de toutes les propriétés de la feature
- Message si aucune feature n'est associée

## Règles de Gestion (Business Rules)

### RG-001 : Structure
Une application hérite de `KBDocument` et possède des champs spécifiques : `content`, `url`, `status`, `features`.

### RG-002 : Initialisation
À la création, `features` doit être un tableau vide `[]`.

### RG-003 : Immutabilité MVP
Dans le MVP, les features sont en lecture seule. Aucune modification possible via l'interface.

### RG-004 : Affichage
Les features sont présentées dans des conteneurs repliables (accordéon).

### RG-005 : Champs Requis
`status` et `content` sont obligatoires pour la validation.

## Configuration de la section

Dans `sections.config.ts` :

```typescript
{
  id: 'applications',
  label: 'Applications',
  path: '/application',
  icon: 'grid',
  description: 'Gérer les applications et leurs fonctionnalités',
  component: lazy(() => import('../pages/Applications/ApplicationListPage')),
}
```

## Routes

- `/application` - Liste
- `/application/new` - Création
- `/application/:id` - Détail/Édition

## Évolutions prévues

### Version 2.0 (Post-MVP)

- [ ] Ajout de features depuis l'interface
- [ ] Modification des features existantes
- [ ] Suppression de features
- [ ] Réorganisation/tri des features
- [ ] Templates de features prédéfinis
- [ ] Import/Export de features

### Améliorations potentielles

- [ ] Filtrage par statut dans la liste
- [ ] Recherche d'applications
- [ ] Historique des modifications
- [ ] Validation du format URL
- [ ] Liens entre applications
- [ ] Diagramme de dépendances

## Conformité aux Guidelines

Cette implémentation respecte strictement les règles de `developpement_guideline.md` :

### Architecture (1.0)
✅ Injection de dépendances (useResource hook)
✅ Pas d'état global mutable
✅ Couche service via hook générique
✅ Séparation des responsabilités (config/form/pages)

### Fonctions (2.0)
✅ Guard clauses dans les handlers
✅ Responsabilité unique par fonction
✅ Pas d'imbrication excessive

### Robustesse (3.0)
✅ Validation défensive des types
✅ Exceptions spécifiques
✅ Pas d'exceptions avalées
✅ useEffect pour synchronisation state

### Sécurité (4.0)
✅ Pas d'injection XSS (textContent)
✅ Confirmation pour suppression
✅ Validation des entrées

### Imports (5.0)
✅ Imports statiques en tête de fichier
✅ Pas d'imports circulaires
✅ Structure PEP 8 (standard > tiers > local)

### Centralisation (6.0)
✅ Configuration centralisée
✅ Pas de duplication de code
✅ Réutilisation de composants génériques

### Nommage (9.0)
✅ Noms descriptifs et intentionnels
✅ Booléens en forme interrogative (`expandedFeatures`)
✅ Verbes pour actions, noms pour données

### Documentation (11.0)
✅ Commentaires explicatifs du POURQUOI
✅ Docblocks pour fonctions publiques
✅ Références aux règles de gestion

## Tests recommandés

### Tests unitaires

```typescript
describe('ApplicationForm', () => {
  it('initialise features comme tableau vide', () => {
    // Test RG-002
  });
  
  it('synchronise les props avec le state local', () => {
    // Test du useEffect critique
  });
  
  it('préserve les features existantes lors de l\'édition', () => {
    // Test RG-003
  });
});
```

### Tests d'intégration

- Création d'une application → features = []
- Édition d'une application → features préservées
- Suppression d'une application → confirmation requise

### Tests E2E

- Parcours complet : Liste → Création → Détail → Édition → Suppression
- Navigation entre sections
- Gestion d'erreurs API

## Support et Maintenance

Pour toute question ou évolution, se référer à :
- Spécification technique : `SPÉCIFICATION TECHNIQUE DÉTAILLÉE : Gestion des Applications (MVP)`
- Architecture générique : `ARCHITECTURE_GENERIQUE.md`
- Guidelines de développement : `developpement_guideline.md`
