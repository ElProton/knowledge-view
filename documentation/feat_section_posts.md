---
id: "feat-section-posts"
title: "Section Posts"
type: "feature"
tags: ["section", "posts", "crud", "social-media"]
status: "active"

relationships:
  part_of: ["epic-ui-features"]
  depends_on: ["feat-generic-section", "feat-authentication"]
  triggers: []
---

# Section Posts

## Vue d'ensemble

Section dédiée à la gestion des publications sur les réseaux sociaux (LinkedIn, Twitter, etc.). Permet le suivi des posts avec leurs métadonnées d'engagement et leurs liens externes.

## Structure du document

### PostDocument (`src/types/document.types.ts`)

```typescript
interface PostLink {
  label: string;
  url: string;
  id: string | null;
}

interface PostData {
  platform: string;
  published_date: string;
  content: string;
  engagement?: {
    views?: number;
    reaction?: number;
    comments?: number;
    shares?: number;
  };
  [key: string]: unknown;
}

interface PostDocument extends KBDocument<PostData> {
  type: 'post';
}
```

**Champs exploités :**

| Champ | Type | Description |
|-------|------|-------------|
| `title` | `string` | Titre du post |
| `theme` | `string[]` | Thèmes associés |
| `tags` | `string[]` | Tags pour catégorisation |
| `data.platform` | `string` | Plateforme (LinkedIn, Twitter, etc.) |
| `data.published_date` | `string` | Date de publication |
| `data.content` | `string` | Contenu du post |
| `data.engagement` | `object` | Métriques d'engagement |
| `links` | `PostLink[]` | Liens externes (URL du post) |

## Pages

### PostListPage (`src/pages/Posts/PostListPage.tsx`)

- Route : `/post`
- Utilise `ResourceList` avec `postsConfig`
- Colonnes affichées : Titre, Plateforme, Date de publication

### PostCreatePage (`src/pages/Posts/PostCreatePage.tsx`)

- Route : `/post/new`
- Utilise `ResourceView` avec `PostForm`

### PostDetailPage (`src/pages/Posts/PostDetailPage.tsx`)

- Route : `/post/:id`
- Utilise `ResourceView` en mode édition

## Configuration postsConfig

**Fichier :** `src/features/posts/posts.config.ts`

```typescript
const postsConfig: ResourceConfig<PostDocument> = {
  resourceType: DocumentType.POST,
  
  labels: {
    singular: 'un Post',
    plural: 'Posts',
  },
  
  list: {
    columns: [
      { key: 'title', label: 'Titre', sortable: true },
      { 
        key: 'data.platform', 
        label: 'Plateforme',
        formatter: (value) => String(value || 'Non définie')
      },
      { 
        key: 'data.published_date', 
        label: 'Date de publication',
        formatter: (value) => formatMongoDate(value, 'Non définie')
      },
    ],
  },
  
  readOnlyFields: ['title'],
};
```

## Formulaire PostForm

**Fichier :** `src/components/posts/PostForm.tsx`

### Implémentation

Implémente `ResourceFormProps<PostDocument>` pour injection dans `ResourceView`.

### Champs du formulaire

| Champ | Type | Obligatoire | Éditable | Notes |
|-------|------|-------------|----------|-------|
| Titre | `text` | Oui | Non (en édition) | |
| Plateforme | `text` | Non | Oui | Placeholder: "LinkedIn, Twitter, etc." |
| Date de publication | `date` | Non | Oui | |
| Thèmes | `text` | Non | Oui | Séparés par virgules |
| Tags | `text` | Non | Oui | Séparés par virgules |
| Lien vers le post | `url` | Non | Oui | Stocké dans `links` avec label "post" |
| Contenu | `textarea` | Non | Oui | Max 2000 caractères |

### Limite de caractères

Le contenu du post est limité à 2000 caractères :

```typescript
const POST_CONTENT_MAX_LENGTH = 2000;
const remainingChars = POST_CONTENT_MAX_LENGTH - content.length;
```

Un compteur affiche les caractères restants.

### Gestion des liens

Le lien vers le post est géré séparément dans le champ `links` :

```typescript
links: postUrl
  ? [{ label: 'post', url: postUrl }]
  : []
```

Récupération à l'affichage :
```typescript
const postLink = value.links?.find((link) => link.label === 'post');
setPostUrl(postLink?.url || '');
```

### Préservation de l'engagement

Les métriques d'engagement sont préservées lors des modifications :

```typescript
data: {
  // ... autres champs
  engagement: value?.data?.engagement || {},
}
```

## Configuration de la section

**Extrait de `sectionsConfig` :**

```typescript
{
  id: 'posts',
  label: 'Posts',
  path: '/post',
  icon: 'share',
  description: 'Gérer les publications réseaux sociaux',
},
{
  id: 'posts-create',
  path: '/post/new',
  hidden: true,
},
{
  id: 'posts-detail',
  path: '/post/:id',
  hidden: true,
}
```

## API

**Type de document :** `post`

Endpoints utilisés :
- `GET /documents?type=post` - Liste
- `GET /documents/{id}` - Détail
- `POST /documents` - Création
- `PUT /documents/{id}` - Mise à jour
- `DELETE /documents/{id}` - Suppression
