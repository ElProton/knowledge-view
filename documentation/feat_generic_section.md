---
id: "feat-generic-section"
title: "Système de sections génériques customisables"
type: "feature"
tags: ["architecture", "generic-components", "sections", "configuration"]
status: "active"

relationships:
  part_of: ["epic-ui-features"]
  depends_on: ["feat-authentication"]
  triggers: ["feat-section-prompts", "feat-section-applications", "feat-section-posts", "feat-section-needs", "feat-section-models"]
---

# Système de sections génériques customisables

## Vue d'ensemble

Architecture basée sur le pattern **Configuration-Driven UI** permettant de créer des sections CRUD complètes via une configuration déclarative. Chaque section est définie par une configuration et utilise des composants génériques (`ResourceList`, `ResourceView`).

## Architecture

### Composants génériques

| Composant | Responsabilité |
|-----------|----------------|
| `ResourceList<T>` | Affichage en grille avec pagination et filtres rapides |
| `ResourceView<T>` | Enveloppe création/édition avec injection de formulaire |
| `ResourceConfig<T>` | Interface de configuration d'une ressource |

### Pattern d'injection

```
┌──────────────────┐     ┌─────────────────┐
│ sectionsConfig   │────>│ SectionConfig   │
│ (routing/labels) │     │ component: lazy │
└──────────────────┘     └────────┬────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌────────────────┐      ┌────────────────┐       ┌────────────────┐
│  ListPage      │      │  CreatePage    │       │  DetailPage    │
│  ResourceList  │      │  ResourceView  │       │  ResourceView  │
│  + config      │      │  + FormComponent│      │  + FormComponent│
└────────────────┘      └────────────────┘       └────────────────┘
```

## Configuration des sections

### SectionConfig (`src/config/sections.config.ts`)

```typescript
interface SectionConfig {
  id: string;
  label: string;
  path: string;
  icon?: string;
  description?: string;
  component: LazyExoticComponent<ComponentType>;
  filter?: Record<string, string>;
  disabled?: boolean;
  hidden?: boolean;
}
```

**Propriétés clés :**

| Propriété | Description |
|-----------|-------------|
| `id` | Identifiant unique de la section |
| `path` | Route associée (peut contenir des paramètres `:id`) |
| `hidden` | Masque la section de la navigation (routes enfants) |
| `disabled` | Désactive complètement la section |
| `component` | Composant lazy-loadé |

### ResourceConfig (`src/types/resource.types.ts`)

```typescript
interface ResourceConfig<T extends BaseDocument> {
  resourceType: string;
  labels: {
    singular: string;
    plural: string;
  };
  list: {
    columns: ColumnConfig<T>[];
    quickFilters?: QuickFilter<T>[];
  };
  readOnlyFields?: (keyof T)[];
}
```

**Configuration des colonnes :**

```typescript
interface ColumnConfig<T> {
  key: keyof T | string;  // Supporte chemins imbriqués: 'data.status'
  label: string;
  formatter?: (value: unknown, item: T) => ReactNode;
  sortable?: boolean;
}
```

## Composants génériques

### ResourceList (`src/components/generic/ResourceList.tsx`)

**Props :**

| Prop | Type | Description |
|------|------|-------------|
| `config` | `ResourceConfig<T>` | Configuration de la ressource |
| `items` | `T[]` | Données à afficher |
| `loading` | `boolean` | État de chargement |
| `error` | `string \| null` | Message d'erreur |
| `basePath` | `string` | URL de base pour navigation détail |
| `createPath` | `string` | URL de création |
| `pagination` | `object` | Configuration pagination |
| `customActions` | `(item: T) => ReactNode` | Slot d'actions personnalisées |

**Fonctionnalités :**
- Filtres rapides côté client via `quickFilters`
- Pagination avec choix du nombre d'éléments par page
- Navigation vers le détail au clic sur une carte
- Formatage personnalisé des valeurs via `formatter`

### ResourceView (`src/components/generic/ResourceView.tsx`)

**Props :**

| Prop | Type | Description |
|------|------|-------------|
| `config` | `ResourceConfig<T>` | Configuration de la ressource |
| `mode` | `'create' \| 'edit'` | Mode d'affichage |
| `FormComponent` | `ResourceFormComponent<T>` | Formulaire injecté |
| `initialValues` | `T` | Valeurs initiales (mode édition) |
| `onSubmit` | `(data) => Promise<void>` | Callback de soumission |
| `onDelete` | `() => Promise<void>` | Callback de suppression |
| `listPath` | `string` | URL de retour à la liste |
| `extraActions` | `ReactNode` | Slot d'actions supplémentaires |

**Comportement :**
- Synchronise automatiquement `formData` avec `initialValues` (chargement asynchrone)
- Confirmation avant suppression via `window.confirm`
- Gestion de l'état `isSubmitting` pour éviter les doubles soumissions

### ResourceFormProps

**Interface pour les formulaires injectables :**

```typescript
interface ResourceFormProps<T> {
  value?: Partial<T>;
  onChange: (value: Partial<T>) => void;
  isEditing?: boolean;
  isLoading?: boolean;
}
```

## Hook useResource

**Fichier :** `src/hooks/useResource.ts`

Hook générique centralisant les opérations CRUD :

```typescript
const { items, loading, error, fetchAll, create, update, remove } = 
  useResource<T>(config);
```

**Actions disponibles :**

| Action | Description |
|--------|-------------|
| `fetchAll(limit, skip)` | Liste paginée avec filtre par type |
| `fetchOne(id)` | Récupération d'un élément |
| `create(data)` | Création avec injection automatique du type |
| `update(id, data)` | Mise à jour |
| `remove(id)` | Suppression |
| `checkTitleExists(title)` | Vérification d'unicité du titre |

## BaseDocument

**Interface de base pour tous les documents :**

```typescript
interface BaseDocument<TData = Record<string, unknown>> {
  id: string;
  type: string;
  title?: string | null;
  created_at: string;
  updated_at: string;
  theme?: string[];
  tags?: string[];
  data?: TData;
}
```

## Création d'une nouvelle section

1. **Définir le type de document** dans `src/types/document.types.ts`
2. **Créer la configuration** dans `src/features/{section}/{section}.config.ts`
3. **Créer le formulaire spécifique** dans `src/components/{section}/{Section}Form.tsx`
4. **Créer les pages** (List, Create, Detail) utilisant les composants génériques
5. **Enregistrer dans `sectionsConfig`** avec routes associées
