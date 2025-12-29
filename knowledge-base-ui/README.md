# Knowledge Base Manager UI

Interface de gestion de la base de connaissances pour le workflow collaboratif humain-agent.

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- npm ou yarn
- Un projet Firebase configuré avec l'authentification Google

### Installation

```bash
# Cloner le repository
git clone <repository-url>
cd knowledge-base-ui

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos valeurs Firebase
```

### Configuration Firebase

1. Créez un projet sur [Firebase Console](https://console.firebase.google.com/)
2. Activez l'authentification Google dans Firebase Auth
3. Ajoutez votre domaine à la liste des domaines autorisés
4. Copiez les clés de configuration dans `.env.local`

### Lancement

```bash
# Mode développement
npm run dev

# Build production
npm run build

# Preview du build
npm run preview
```

## 📁 Structure du Projet

```
src/
├── components/      # Composants réutilisables
│   ├── common/      # Composants génériques (Button, Error, Loading)
│   └── layout/      # Composants de mise en page (Sidebar, MainFrame)
├── pages/           # Pages de l'application
├── sections/        # Modules fonctionnels (à développer)
├── services/        # Services (API, Auth)
├── contexts/        # Contextes React
├── hooks/           # Hooks personnalisés
├── config/          # Configuration (sections, app)
├── types/           # Types TypeScript
└── utils/           # Utilitaires
```

## ➕ Ajouter une Nouvelle Section

1. Créer le dossier `src/sections/NomSection/`
2. Créer le composant principal `NomSectionPage.tsx`
3. Ajouter la configuration dans `src/config/sections.config.ts`:

```typescript
{
  id: 'nom-section',
  label: 'Nom Section',
  path: '/nom-section',
  icon: 'document',
  description: 'Description de la section',
  component: lazy(() => import('../sections/NomSection/NomSectionPage')),
}
```

## 🔐 Authentification

L'application utilise Firebase Authentication avec Google Sign-In.
Le token JWT est automatiquement inclus dans tous les appels API.

## 📝 Licence

Propriétaire - Usage interne uniquement
