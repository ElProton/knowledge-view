---
id: "feat-section-models"
title: "Section Modèles (Models)"
type: "feature"
tags: ["section", "models", "json", "data-structures"]
status: "active"

relationships:
  part_of: ["epic-ui-features"]
  depends_on: ["feat-generic-section", "feat-authentication"]
  triggers: []
---

# Section Modèles (Models)

## Vue d'ensemble

Section dédiée au stockage et à la gestion de structures de données JSON. Utilisée pour définir des modèles de données réutilisables au sein du système.

## Structure du document

### ModelDocument (`src/types/document.types.ts`)

```typescript
interface ModelData {
  content: Record<string, unknown>;
  [key: string]: unknown;
}

interface ModelDocument extends KBDocument<ModelData> {
  type: 'model';
}
```

**Champs exploités :**

| Champ | Type | Description |
|-------|------|-------------|
| `title` | `string` | Nom identifiant du modèle |
| `theme` | `string[]` | Thèmes associés |
| `tags` | `string[]` | Tags pour catégorisation |
| `data.content` | `Record<string, unknown>` | Structure JSON du modèle |

## Pages

### ModelListPage (`src/pages/Models/ModelListPage.tsx`)

- Route : `/models`
- Utilise `ResourceList` avec `modelsConfig`
- Colonnes affichées : Titre, Date de création, Dernière modification

### ModelCreatePage (`src/pages/Models/ModelCreatePage.tsx`)

- Route : `/models/new`
- Formulaire standalone `ModelForm`

### ModelDetailPage (`src/pages/Models/ModelDetailPage.tsx`)

- Route : `/models/:id`
- Chargement asynchrone via `fetchOne`
- Formulaire en mode édition

## Configuration modelsConfig

**Fichier :** `src/features/models/models.config.ts`

```typescript
const modelsConfig: ResourceConfig<ModelDocument> = {
  resourceType: DocumentType.MODEL,
  
  labels: {
    singular: 'un Modèle',
    plural: 'Modèles',
  },
  
  list: {
    columns: [
      { key: 'title', label: 'Titre', sortable: true },
      { 
        key: 'created_at', 
        label: 'Date de création',
        formatter: (value) => formatMongoDate(value)
      },
      { 
        key: 'updated_at', 
        label: 'Dernière modification',
        formatter: (value) => formatMongoDate(value)
      },
    ],
  },
  
  readOnlyFields: ['title'],
};
```

## Formulaire ModelForm

**Fichier :** `src/components/models/ModelForm.tsx`

### Implémentation

Utilise un pattern legacy avec `onSubmit` direct plutôt que le pattern `ResourceFormProps`. Gère son propre état interne via `useState`.

### Champs du formulaire

| Champ | Type | Obligatoire | Éditable | Notes |
|-------|------|-------------|----------|-------|
| Titre | `text` | Oui | Non (en édition) | Hint affiché en édition |
| Thèmes | `text` | Non | Oui | Séparés par virgules |
| Tags | `text` | Non | Oui | Séparés par virgules |
| Contenu JSON | `textarea` | Non | Oui | Validation JSON à la soumission |

### Validation JSON

Le contenu JSON est validé avant soumission :

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  let parsedContent: Record<string, unknown>;
  try {
    parsedContent = JSON.parse(jsonText);
    setJsonError(null);
  } catch (error) {
    setJsonError('Le contenu JSON est invalide. Veuillez corriger la syntaxe.');
    return;
  }

  // ... soumission
};
```

### Affichage du JSON

Le contenu JSON est formaté pour l'affichage :

```typescript
if (initialData.data?.content) {
  setJsonText(JSON.stringify(initialData.data.content, null, 2));
}
```

### États d'erreur

- **JSON invalide** : Message d'erreur affiché sous le textarea
- **Hint permanent** : "Saisissez un objet JSON valide décrivant la structure du modèle."

## Configuration de la section

**Extrait de `sectionsConfig` :**

```typescript
{
  id: 'models',
  label: 'Modèles',
  path: '/models',
  icon: 'database',
  description: 'Gérer les modèles de données JSON',
},
{
  id: 'models-create',
  path: '/models/new',
  hidden: true,
},
{
  id: 'models-detail',
  path: '/models/:id',
  hidden: true,
}
```

## API

**Type de document :** `model`

Endpoints utilisés :
- `GET /documents?type=model` - Liste
- `GET /documents/{id}` - Détail
- `POST /documents` - Création
- `PUT /documents/{id}` - Mise à jour
- `DELETE /documents/{id}` - Suppression
