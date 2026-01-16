---
id: "feat-section-applications"
title: "Section Applications"
type: "feature"
tags: ["section", "applications", "crud", "features-management"]
status: "active"

relationships:
  part_of: ["epic-ui-features"]
  depends_on: ["feat-generic-section", "feat-authentication"]
  triggers: []
---

# Section Applications

## Vue d'ensemble

Section de gestion des applications et de leurs fonctionnalités (features). Chaque application possède un cycle de vie (draft → dev → staging → prod → deprecated) et peut être associée à plusieurs fonctionnalités.

## Structure du document

### ApplicationDocument (`src/types/document.types.ts`)

```typescript
enum ApplicationStatus {
  DRAFT = 'draft',
  DEV = 'dev',
  STAGING = 'staging',
  PROD = 'prod',
  DEPRECATED = 'deprecated'
}

interface Feature {
  name?: string;
  description?: string;
  [key: string]: unknown;
}

interface ApplicationData {
  content: string;
  url?: string | null;
  status: ApplicationStatus;
  features: Feature[];
  [key: string]: unknown;
}

interface ApplicationDocument extends KBDocument<ApplicationData> {
  type: 'application';
}
```

**Champs exploités :**

| Champ | Type | Description |
|-------|------|-------------|
| `title` | `string` | Nom de l'application |
| `data.content` | `string` | Description globale |
| `data.url` | `string \| null` | URL de l'application |
| `data.status` | `ApplicationStatus` | Statut dans le cycle de vie |
| `data.features` | `Feature[]` | Liste des fonctionnalités |

## Pages

### ApplicationListPage (`src/pages/Applications/ApplicationListPage.tsx`)

- Route : `/application`
- Utilise `ResourceList` avec `applicationsConfig`
- Colonnes affichées : Titre, Statut (uppercase), URL, Date de création

### ApplicationCreatePage (`src/pages/Applications/ApplicationCreatePage.tsx`)

- Route : `/application/new`
- Utilise `ResourceView` avec `ApplicationForm`
- Navigation vers la liste après création réussie

### ApplicationDetailPage (`src/pages/Applications/ApplicationDetailPage.tsx`)

- Route : `/application/:id`
- Utilise `ResourceView` en mode édition
- Chargement asynchrone via `fetchOne`

## Configuration applicationsConfig

**Fichier :** `src/features/applications/applications.config.ts`

```typescript
const applicationsConfig: ResourceConfig<ApplicationDocument> = {
  resourceType: DocumentType.APPLICATION,
  
  labels: {
    singular: 'une Application',
    plural: 'Applications',
  },
  
  list: {
    columns: [
      { key: 'title', label: 'Titre', sortable: true },
      { 
        key: 'data.status', 
        label: 'Statut',
        formatter: (value) => value?.toUpperCase() || 'N/A'
      },
      { key: 'data.url', label: 'URL' },
      { 
        key: 'created_at', 
        label: 'Date de création',
        formatter: (value) => formatMongoDate(value)
      },
    ],
  },
  
  readOnlyFields: ['title'],
};
```

## Formulaire ApplicationForm

**Fichier :** `src/components/applications/ApplicationForm.tsx`

### Implémentation

Implémente `ResourceFormProps<ApplicationDocument>` pour injection dans `ResourceView`.

### Champs du formulaire

| Champ | Type | Obligatoire | Éditable |
|-------|------|-------------|----------|
| Titre | `text` | Oui | Non (en édition) |
| Statut | `select` | Oui | Oui |
| Description | `textarea` | Oui | Oui |
| URL | `url` | Non | Oui |

### Valeurs du select Statut

| Valeur | Label affiché |
|--------|---------------|
| `draft` | Draft |
| `dev` | Développement |
| `staging` | Staging |
| `prod` | Production |
| `deprecated` | Dépréciée |

### Section Features

**Statut MVP :** Lecture seule uniquement.

- Affichage accordéon des fonctionnalités existantes
- Chaque feature affiche son `name`, `description` et propriétés additionnelles
- Note indicative : "La gestion des fonctionnalités sera disponible dans une version ultérieure."

### Synchronisation état local/props

```typescript
useEffect(() => {
  if (value) {
    setTitle(value.title || '');
    setContent(value.data?.content || '');
    setUrl(value.data?.url || '');
    setStatus(value.data?.status || ApplicationStatus.DRAFT);
    setFeatures(value.data?.features || []);
  }
}, [value]);
```

**Important :** Cette synchronisation est nécessaire car les données sont chargées de manière asynchrone. Sans elle, le formulaire reste vide après le chargement.

### Propagation des changements

Le hook `useCallback` + `useEffect` propage les modifications vers le parent :

```typescript
const handleFormChange = useCallback(() => {
  const formData: Partial<ApplicationDocument> = {
    title,
    data: { content, url: url || null, status, features },
  };
  onChange(formData);
}, [title, content, url, status, features, onChange]);

useEffect(() => {
  handleFormChange();
}, [handleFormChange]);
```

## Configuration de la section

**Extrait de `sectionsConfig` :**

```typescript
{
  id: 'applications',
  label: 'Applications',
  path: '/application',
  icon: 'grid',
  description: 'Gérer les applications et leurs fonctionnalités',
},
{
  id: 'applications-create',
  path: '/application/new',
  hidden: true,
},
{
  id: 'applications-detail',
  path: '/application/:id',
  hidden: true,
}
```

## API

**Type de document :** `application`

Endpoints utilisés :
- `GET /documents?type=application` - Liste
- `GET /documents/{id}` - Détail
- `POST /documents` - Création
- `PUT /documents/{id}` - Mise à jour
- `DELETE /documents/{id}` - Suppression
