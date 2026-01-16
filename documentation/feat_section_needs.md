---
id: "feat-section-needs"
title: "Section Besoins (Needs)"
type: "feature"
tags: ["section", "needs", "workflow", "validation", "specification"]
status: "active"

relationships:
  part_of: ["epic-ui-features"]
  depends_on: ["feat-generic-section", "feat-authentication", "feat-section-applications"]
  triggers: []
---

# Section Besoins (Needs)

## Vue d'ensemble

Section de gestion des besoins métier avec un workflow de validation en plusieurs étapes. Les besoins peuvent être liés à une application parente et suivent un cycle de vie structuré (analyse → validation → détail → spécification).

## Structure du document

### NeedDocument (`src/types/document.types.ts`)

```typescript
enum NeedStatus {
  ANALYSE = 'analyse',
  VALIDATION = 'validation',
  DETAIL = 'detail',
  SPECIFICATION = 'specification',
}

interface Specification {
  job_story: string;
  acceptance_criteria: string[];
  out_of_scope: string[];
  constraints: {
    regulatory: string | null;
    temporal: string | null;
    budgetary: string | null;
  };
  gap_analysis: string;
  source_quote: string;
}

interface NeedData {
  status: NeedStatus;
  content: string;
  iteration: number;
  response?: string;
  parent_application_id?: string;
  parent_application_name?: string;
  specification?: Specification;
  [key: string]: unknown;
}

interface NeedDocument extends KBDocument<NeedData> {
  type: 'need';
}
```

**Champs exploités :**

| Champ | Type | Description |
|-------|------|-------------|
| `title` | `string` | Titre du besoin |
| `theme` | `string[]` | Thèmes associés |
| `tags` | `string[]` | Tags pour catégorisation |
| `data.status` | `NeedStatus` | Statut dans le workflow |
| `data.content` | `string` | Description du besoin |
| `data.iteration` | `number` | Compteur d'itérations |
| `data.response` | `string` | Réponse de rejet (si applicable) |
| `data.parent_application_id` | `string` | Lien vers application parente (ID) |
| `data.parent_application_name` | `string` | Lien vers application parente (nom) |
| `data.specification` | `Specification` | Spécification détaillée |

## Workflow de validation

```
┌─────────┐     ┌────────────┐     ┌────────┐     ┌───────────────┐
│ ANALYSE │────>│ VALIDATION │────>│ DETAIL │────>│ SPECIFICATION │
└─────────┘     └────────────┘     └────────┘     └───────────────┘
     ▲                │                 │                 │
     │                │                 │                 │
     └────────────────┴─────────────────┴─────────────────┘
                      Rejet (avec response)
```

**Transitions :**

| De | Vers | Action |
|----|------|--------|
| `analyse` | `validation` | Valider |
| `validation` | `detail` | Valider |
| `detail` | `specification` | Valider |
| `validation/detail/specification` | `analyse` | Rejeter (avec commentaire) |

## Pages

### NeedListPage (`src/pages/Needs/NeedListPage.tsx`)

- Route : `/need`
- Utilise `ResourceList` avec `needsConfig`
- Colonnes affichées : Titre, Statut (uppercase), Itération, Dernière mise à jour
- Filtres rapides : En analyse, En validation, En détail, En spécification

### NeedCreatePage (`src/pages/Needs/NeedCreatePage.tsx`)

- Route : `/need/new`
- Utilise `ResourceView` avec `NeedForm`
- Statut initial : `analyse`

### NeedDetailPage (`src/pages/Needs/NeedDetailPage.tsx`)

- Route : `/need/:id`
- Utilise `ResourceView` en mode édition
- Intègre `NeedWorkflowActions` via le slot `extraActions`

## Configuration needsConfig

**Fichier :** `src/features/needs/needs.config.ts`

```typescript
const needsConfig: ResourceConfig<NeedDocument> = {
  resourceType: DocumentType.BESOIN,
  
  labels: {
    singular: 'Besoin',
    plural: 'Besoins',
  },
  
  list: {
    columns: [
      { key: 'title', label: 'Titre', sortable: true },
      { key: 'data.status', label: 'Statut', formatter: ... },
      { key: 'data.iteration', label: 'Itération' },
      { key: 'updated_at', label: 'Dernière mise à jour', formatter: ... },
    ],
    
    quickFilters: [
      { id: 'analyse', label: 'En analyse', filterFn: ... },
      { id: 'validation', label: 'En validation', filterFn: ... },
      { id: 'detail', label: 'En détail', filterFn: ... },
      { id: 'specification', label: 'En spécification', filterFn: ... },
    ],
  },
  
  readOnlyFields: ['id', 'created_at', 'updated_at', 'type'],
};
```

## Formulaire NeedForm

**Fichier :** `src/components/needs/NeedForm.tsx`

### Champs du formulaire

| Champ | Type | Obligatoire | Éditable |
|-------|------|-------------|----------|
| Titre | `text` | Oui | Non (en édition) |
| Thème(s) | `text` | Non | Oui |
| Tags | `text` | Non | Oui |
| ID Application parente | `text` | Non | Oui |
| Nom Application parente | `text` | Non | Oui |
| Description du besoin | `textarea` | Oui | Oui |

### Section lecture seule (mode édition)

En mode édition, une section supplémentaire affiche les informations de workflow :
- Statut actuel (disabled)
- Numéro d'itération (disabled)
- Réponse de rejet si présente (disabled)

### Préservation des données de workflow

Le formulaire préserve les données de workflow lors des modifications :

```typescript
data: {
  status: value?.data?.status || NeedStatus.ANALYSE,
  content,
  iteration: value?.data?.iteration || 1,
  response: value?.data?.response,
  // ...
}
```

## NeedWorkflowActions

**Fichier :** `src/components/needs/NeedWorkflowActions.tsx`

Composant spécialisé pour les transitions de workflow, affiché via le slot `extraActions` de `ResourceView`.

### Props

```typescript
interface NeedWorkflowActionsProps {
  need: NeedDocument;
  onStatusChange: (newStatus: NeedStatus, response?: string) => Promise<void>;
  isLoading?: boolean;
}
```

### Comportement

1. **Bouton "Valider"** : Transition vers le statut suivant dans le workflow
2. **Bouton "Rejeter"** : Affiche un champ de réponse obligatoire, puis retourne au statut `analyse`
3. **Fin de workflow** : Affichage d'un message "Besoin validé et spécifié"

### Mapping des transitions

```typescript
const workflow: Record<NeedStatus, NeedStatus | null> = {
  [NeedStatus.ANALYSE]: NeedStatus.VALIDATION,
  [NeedStatus.VALIDATION]: NeedStatus.DETAIL,
  [NeedStatus.DETAIL]: NeedStatus.SPECIFICATION,
  [NeedStatus.SPECIFICATION]: null, // Fin du workflow
};
```

## Configuration de la section

**Extrait de `sectionsConfig` :**

```typescript
{
  id: 'needs',
  label: 'Besoins',
  path: '/need',
  icon: 'clipboard',
  description: 'Gérer les besoins et leur workflow de validation',
},
{
  id: 'needs-create',
  path: '/need/new',
  hidden: true,
},
{
  id: 'needs-detail',
  path: '/need/:id',
  hidden: true,
}
```

## API

**Type de document :** `besoin`

Endpoints utilisés :
- `GET /documents?type=besoin` - Liste
- `GET /documents/{id}` - Détail
- `POST /documents` - Création
- `PUT /documents/{id}` - Mise à jour (y compris transitions de workflow)
- `DELETE /documents/{id}` - Suppression
