# Feature: Applications

## Description

Gestion des applications et de leurs fonctionnalités dans la Knowledge Base.

## Fichiers

- `ApplicationForm.tsx` - Formulaire avec affichage accordéon des features
- `ApplicationForm.module.css` - Styles du formulaire
- `__tests__/ApplicationForm.test.tsx` - Tests unitaires

## Utilisation

```tsx
import { ApplicationForm } from './ApplicationForm';

<ApplicationForm
  value={applicationDocument}
  onChange={handleChange}
  isEditing={false}
/>
```

## Spécificités

### Affichage des Features

Les features sont affichées en lecture seule dans un accordéon (`<details>`).
Chaque feature peut être dépliée pour voir ses détails.

### État MVP

⚠️ **Important** : Dans cette version MVP, les features ne peuvent pas être ajoutées ou modifiées depuis l'interface.
L'ajout de cette fonctionnalité est prévu pour la version 2.0.

### Synchronisation du State

Le formulaire utilise un `useEffect` critique pour synchroniser le state local avec les props.
Cela est nécessaire car les données sont chargées de manière asynchrone lors de l'édition.

```tsx
useEffect(() => {
  if (value) {
    setTitle(value.title || '');
    setContent(value.data?.content || '');
    // ... autres champs
    setFeatures(value.data?.features || []);
  }
}, [value]);
```

## Points de vigilance

1. **Préservation des features** : Lors de l'édition, les features existantes doivent être préservées intactes (RG-003)
2. **Initialisation** : À la création, features doit être un tableau vide (RG-002)
3. **Champs requis** : Titre, Status, Content sont obligatoires (RG-005)

## Tests

Exécuter les tests :

```bash
npm test ApplicationForm
```

Les tests couvrent :
- Initialisation avec features vides
- Préservation des features en édition
- Affichage en accordéon
- Synchronisation avec props
- Validation des champs requis

## Évolutions futures

Version 2.0 :
- Ajout de features via l'interface
- Modification de features existantes
- Suppression de features
- Réorganisation par drag & drop
