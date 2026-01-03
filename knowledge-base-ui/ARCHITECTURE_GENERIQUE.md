# Architecture Générique de Ressources

## 📋 Vue d'ensemble

Ce système fournit une architecture générique pour créer des sections CRUD (Create, Read, Update, Delete) avec un minimum de duplication de code. Il utilise le **pattern de composition** avec injection de composants pour allier flexibilité et réutilisabilité.

## 🏗️ Architecture

### Composants Génériques

```
src/
├── components/generic/
│   ├── ResourceList.tsx          # Liste générique de ressources
│   ├── ResourceList.module.css
│   ├── ResourceView.tsx          # Vue détail/création générique
│   └── ResourceView.module.css
├── hooks/
│   └── useResource.ts            # Hook de gestion CRUD
├── types/
│   └── resource.types.ts         # Types et interfaces
└── utils/
    └── dataHelpers.ts            # Helpers pour accès sécurisé
```

### Principe de Fonctionnement

1. **Configuration** : Définir un objet de configuration pour la ressource
2. **Injection** : Fournir un composant de formulaire spécifique
3. **Utilisation** : Les pages deviennent de simples "passe-plats"

## 📝 Guide d'Utilisation

### Étape 1 : Créer le Type de Document

```typescript
// src/types/document.types.ts
export interface MyDocument extends KBDocument {
  type: 'mytype';
  data: {
    specificField: string;
  };
}
```

### Étape 2 : Créer la Configuration

```typescript
// src/features/myfeature/myfeature.config.ts
import { ResourceConfig } from '../../types/resource.types';
import { MyDocument } from '../../types/document.types';
import { formatMongoDate } from '../../utils/dataHelpers';

export const myFeatureConfig: ResourceConfig<MyDocument> = {
  resourceType: 'mytype',
  
  labels: {
    singular: 'un Item',
    plural: 'Items',
  },
  
  list: {
    columns: [
      {
        key: 'title',
        label: 'Titre',
        sortable: true,
      },
      {
        key: 'data.specificField',
        label: 'Champ Spécifique',
      },
      {
        key: 'created_at',
        label: 'Date de création',
        formatter: (value) => formatMongoDate(value),
      },
    ],
  },
  
  readOnlyFields: ['title'],
};
```

### Étape 3 : Créer le Formulaire

```typescript
// src/components/myfeature/MyForm.tsx
import { useState, useEffect } from 'react';
import { MyDocument } from '../../types/document.types';
import { ResourceFormProps } from '../../types/resource.types';

export const MyForm: React.FC<ResourceFormProps<MyDocument>> = ({
  value,
  onChange,
  isEditing,
}) => {
  const [title, setTitle] = useState(value?.title || '');
  const [specificField, setSpecificField] = useState(value?.data?.specificField || '');

  // ⚠️ CRITIQUE : Synchroniser le state local avec les props (chargement asynchrone)
  // Sans cela, le formulaire restera vide après le chargement des données
  useEffect(() => {
    if (value) {
      setTitle(value.title || '');
      setSpecificField(value.data?.specificField || '');
    }
  }, [value]);

  // Propager les changements vers le parent
  useEffect(() => {
    const formData: Partial<MyDocument> = {
      title,
      data: {
        specificField,
      },
    };
    onChange(formData);
  }, [title, specificField]);

  return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isEditing}
      />
      <input
        value={specificField}
        onChange={(e) => setSpecificField(e.target.value)}
      />
    </div>
  );
};
```

### Étape 4 : Créer les Pages

#### Page Liste

```typescript
// src/pages/MyFeature/MyListPage.tsx
import { useEffect, useState } from 'react';
import { MyDocument } from '../../types/document.types';
import { ResourceList } from '../../components/generic/ResourceList';
import { useResource } from '../../hooks/useResource';
import { myFeatureConfig } from '../../features/myfeature/myfeature.config';

export default function MyListPage() {
  const [limit, setLimit] = useState(25);
  const [skip, setSkip] = useState(0);

  const { items, loading, error, total, fetchAll } = useResource<MyDocument>(myFeatureConfig);

  useEffect(() => {
    fetchAll(limit, skip);
  }, [limit, skip, fetchAll]);

  return (
    <ResourceList
      config={myFeatureConfig}
      items={items}
      loading={loading}
      error={error}
      basePath="/myfeature"
      createPath="/myfeature/new"
      onRetry={() => fetchAll(limit, skip)}
      pagination={{
        limit,
        skip,
        total,
        onLimitChange: setLimit,
        onNext: () => setSkip(skip + limit),
        onPrevious: () => setSkip(Math.max(0, skip - limit)),
      }}
    />
  );
}
```

#### Page Détail

```typescript
// src/pages/MyFeature/MyDetailPage.tsx
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MyDocument } from '../../types/document.types';
import { ResourceView } from '../../components/generic/ResourceView';
import { MyForm } from '../../components/myfeature/MyForm';
import { useResource } from '../../hooks/useResource';
import { myFeatureConfig } from '../../features/myfeature/myfeature.config';

export default function MyDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { currentItem, loading, error, fetchOne, update, remove } = 
    useResource<MyDocument>(myFeatureConfig);

  useEffect(() => {
    if (id) {
      fetchOne(id);
    }
  }, [id, fetchOne]);

  const handleSubmit = async (data: Partial<MyDocument>) => {
    if (id) {
      await update(id, data);
      alert('Mis à jour avec succès.');
    }
  };

  const handleDelete = async () => {
    if (id) {
      await remove(id);
    }
  };

  return (
    <ResourceView
      config={myFeatureConfig}
      mode="edit"
      FormComponent={MyForm}
      initialValues={currentItem || undefined}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      listPath="/myfeature"
      onRetry={() => id && fetchOne(id)}
    />
  );
}
```

#### Page Création

```typescript
// src/pages/MyFeature/MyCreatePage.tsx
import { useNavigate } from 'react-router-dom';
import { MyDocument } from '../../types/document.types';
import { ResourceView } from '../../components/generic/ResourceView';
import { MyForm } from '../../components/myfeature/MyForm';
import { useResource } from '../../hooks/useResource';
import { myFeatureConfig } from '../../features/myfeature/myfeature.config';

export default function MyCreatePage() {
  const navigate = useNavigate();

  const { create, checkTitleExists } = useResource<MyDocument>(myFeatureConfig);

  const handleSubmit = async (data: Partial<MyDocument>) => {
    if (!data.title) {
      throw new Error('Le titre est requis.');
    }

    const exists = await checkTitleExists(data.title);
    if (exists) {
      throw new Error('Un item avec ce titre existe déjà.');
    }

    await create(data);
    navigate('/myfeature');
  };

  return (
    <ResourceView
      config={myFeatureConfig}
      mode="create"
      FormComponent={MyForm}
      onSubmit={handleSubmit}
      listPath="/myfeature"
    />
  );
}
```

### Étape 5 : Configurer les Routes

```typescript
// src/config/sections.config.ts
{
  id: 'myfeature',
  label: 'My Feature',
  path: '/myfeature',
  icon: 'icon',
  description: 'Description de la feature',
  component: lazy(() => import('../pages/MyFeature/MyListPage')),
},
{
  id: 'myfeature-create',
  label: 'Créer',
  path: '/myfeature/new',
  component: lazy(() => import('../pages/MyFeature/MyCreatePage')),
  hidden: true,
},
{
  id: 'myfeature-detail',
  label: 'Détail',
  path: '/myfeature/:id',
  component: lazy(() => import('../pages/MyFeature/MyDetailPage')),
  hidden: true,
},
```

## ⚠️ Points de Vigilance (Troubleshooting)

### Chargement Asynchrone et State Local
Lors de l'édition d'un document, les données sont chargées de manière asynchrone. Le composant formulaire (`MyForm`) est monté initialement avec des valeurs vides ou par défaut.
**Impératif :** Vous devez utiliser un `useEffect` pour mettre à jour le state local de votre formulaire lorsque la prop `value` change.

```typescript
useEffect(() => {
  if (value) {
    // Mettre à jour tous les states locaux
    setTitle(value.title || '');
    // ...
  }
}, [value]);
```
Sans cela, le formulaire restera vide même après que les données aient été récupérées de l'API.

## 🔧 Fonctionnalités Avancées

### Formateurs Personnalisés

```typescript
{
  key: 'status',
  label: 'Statut',
  formatter: (value) => (
    <span style={{ color: value === 'active' ? 'green' : 'red' }}>
      {value}
    </span>
  ),
}
```

### Actions Personnalisées

```typescript
<ResourceList
  // ...
  customActions={(item) => (
    <button onClick={() => handleSpecialAction(item)}>
      Action Spéciale
    </button>
  )}
/>
```

### Actions Supplémentaires dans ResourceView

```typescript
<ResourceView
  // ...
  extraActions={
    <button onClick={handlePublish}>Publier</button>
  }
/>
```

## 📊 Exemple Complet : Section Posts

Voir l'implémentation dans :
- `src/features/posts/posts.config.ts`
- `src/components/posts/PostForm.tsx`
- `src/pages/Posts/`

## ✅ Avantages

1. **Réduction de code** : ~80% de code en moins par section
2. **Cohérence** : Comportement uniforme entre toutes les sections
3. **Maintenabilité** : Un seul endroit pour corriger les bugs CRUD
4. **Flexibilité** : Injection de composants spécifiques quand nécessaire
5. **Type-safe** : TypeScript garantit la cohérence des types

## 🔄 Migration d'une Section Existante

1. Créer la configuration de ressource
2. Adapter le formulaire pour implémenter `ResourceFormProps`
3. Remplacer la logique des pages par des appels aux composants génériques
4. Supprimer le code dupliqué (state management, fetch, etc.)
5. Tester la section migrée

## 🎯 Prochaines Étapes

- Migrer la section "Prompts" vers ce système
- Ajouter le support de la recherche/filtres
- Créer des formateurs de données additionnels
- Optimiser la gestion du cache
