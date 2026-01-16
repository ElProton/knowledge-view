---
id: "feat-section-prompts"
title: "Section Prompts"
type: "feature"
tags: ["section", "prompts", "crud", "ai"]
status: "active"

relationships:
  part_of: ["epic-ui-features"]
  depends_on: ["feat-generic-section", "feat-authentication"]
  triggers: []
---

# Section Prompts

## Vue d'ensemble

Section dédiée à la gestion des prompts système utilisés par les agents IA. Permet la visualisation, création et modification des templates de prompts.

## Structure du document

### PromptDocument (`src/types/document.types.ts`)

```typescript
interface PromptData {
  content: string;
  [key: string]: unknown;
}

interface PromptDocument extends KBDocument<PromptData> {
  type: 'prompt';
}
```

**Champs exploités :**

| Champ | Type | Description |
|-------|------|-------------|
| `title` | `string` | Nom identifiant du prompt |
| `theme` | `string[]` | Thèmes associés |
| `tags` | `string[]` | Tags pour catégorisation |
| `data.content` | `string` | Corps du prompt |

## Pages

### PromptListPage (`src/pages/Prompts/PromptListPage.tsx`)

- Route : `/prompts`
- Utilise `ResourceList` avec formulaire non injecté (formulaire standalone)
- Pagination standard (10/25/50 par page)

### PromptCreatePage (`src/pages/Prompts/PromptCreatePage.tsx`)

- Route : `/prompts/new`
- Formulaire standalone `PromptForm`

### PromptDetailPage (`src/pages/Prompts/PromptDetailPage.tsx`)

- Route : `/prompts/:id`
- Chargement asynchrone via `fetchOne`
- Formulaire en mode édition

## Formulaire PromptForm

**Fichier :** `src/components/prompts/PromptForm.tsx`

### Champs du formulaire

| Champ | Type | Obligatoire | Éditable |
|-------|------|-------------|----------|
| Titre | `text` | Oui | Non (en édition) |
| Thèmes | `text` | Non | Oui |
| Tags | `text` | Non | Oui |
| Contenu | `textarea` | Non | Oui |

**Notes :**
- Les thèmes et tags sont saisis comme liste séparée par virgules
- Le parsing `split(',').map(t => t.trim()).filter(Boolean)` est appliqué à la soumission

### Props

```typescript
interface PromptFormProps {
  initialData?: Partial<PromptDocument>;
  onSubmit: (data: Partial<PromptDocument>) => Promise<void>;
  isEditing?: boolean;
  isLoading?: boolean;
}
```

**Remarque :** Ce formulaire utilise un pattern legacy avec `onSubmit` direct plutôt que le pattern `ResourceFormProps`. Il gère son propre état interne via `useState`.

## Configuration de la section

**Extrait de `sectionsConfig` :**

```typescript
{
  id: 'prompts',
  label: 'Prompts',
  path: '/prompts',
  icon: 'code',
  description: 'Visualiser et modifier les prompts système',
},
{
  id: 'prompts-create',
  path: '/prompts/new',
  hidden: true,
},
{
  id: 'prompts-detail',
  path: '/prompts/:id',
  hidden: true,
}
```

## API

**Type de document :** `prompt`

Endpoints utilisés via `useResource` :
- `GET /documents?type=prompt` - Liste
- `GET /documents/{id}` - Détail
- `POST /documents` - Création
- `PUT /documents/{id}` - Mise à jour
- `DELETE /documents/{id}` - Suppression
