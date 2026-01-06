# Knowledge Base Admin

Interface d'administration de la base de connaissances - Application React + TypeScript + Vite

## 🚀 Démarrage Rapide

### Prérequis
- Node.js >= 18.0.0
- npm ou yarn

### Installation

```bash
# Cloner le projet (si applicable)
cd knowledge-base-admin

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer les variables OAuth2 dans .env
# VITE_OAUTH2_CLIENT_ID=...
# VITE_OAUTH2_AUTH_URL=...
# etc.

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 📋 Commandes Disponibles

```bash
npm run dev      # Démarrer le serveur de développement
npm run build    # Compiler pour la production
npm run preview  # Prévisualiser le build de production
npm run lint     # Linter le code TypeScript/React
```

## 🏗️ Architecture

### Stack Technique
- **Framework UI :** React 18
- **Langage :** TypeScript 5.2
- **Build Tool :** Vite 5.0
- **Routing :** React Router DOM 6.20
- **Styling :** CSS Modules (natifs)
- **Authentification :** OAuth2 Authorization Code Flow

### Structure du Projet

```
src/
├── api/              # Clients HTTP et endpoints
│   ├── apiClient.ts
│   ├── authApi.ts
│   └── documentsApi.ts
├── auth/             # Contexte et logique OAuth2
│   ├── AuthContext.tsx
│   ├── AuthProvider.tsx
│   ├── useAuth.ts
│   └── ProtectedRoute.tsx
├── components/       # Composants réutilisables
│   ├── common/       # Boutons, Loaders, Modales
│   └── layout/       # Header, Sidebar, MainLayout
├── config/           # Configuration des sections
│   ├── constants.ts
│   └── sections.ts
├── pages/            # Pages de l'application
│   ├── Home/
│   ├── Login/
│   ├── SpecReview/
│   ├── KnowledgeReview/
│   └── PromptsView/
├── types/            # Définitions TypeScript
├── utils/            # Fonctions utilitaires
├── App.tsx           # Composant racine avec routing
├── main.tsx          # Point d'entrée
└── index.css         # Styles globaux
```

## 🔐 Configuration OAuth2

L'application utilise OAuth2 pour l'authentification. Configurez les variables d'environnement dans `.env` :

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_OAUTH2_CLIENT_ID=your-client-id
VITE_OAUTH2_REDIRECT_URI=http://localhost:3000/callback
VITE_OAUTH2_AUTH_URL=http://localhost:8000/oauth/authorize
VITE_OAUTH2_TOKEN_URL=http://localhost:8000/oauth/token
```

## 🎨 Design System

L'application utilise un design sobre et fonctionnel basé sur CSS Variables :

- **Palette de couleurs :** Neutre et professionnelle
- **Composants :** Modularisés avec CSS Modules
- **Principe :** Efficacité > Esthétique

Variables CSS disponibles dans `src/index.css`

## 📦 Fonctionnalités

### Implémentées (v1.0)
- ✅ Authentification OAuth2
- ✅ Routes protégées
- ✅ Layout responsive (Header + Sidebar)
- ✅ Configuration des sections extensible
- ✅ Gestion d'état avec Context API
- ✅ Client API typé avec intercepteurs

### En Développement
- 🚧 Liste et filtrage des documents
- 🚧 Visualisation Markdown
- 🚧 Workflow de validation des spécifications
- 🚧 Édition de contenu
- 🚧 Gestion des connaissances
- 🚧 Visualisation des prompts

## 🧪 Tests

```bash
# Les tests seront ajoutés selon tests_guideline.md
npm run test
```

## 📝 Documentation

La documentation complète du projet se trouve dans le dossier `/docs` :

- `epic-knowledge-base-admin.md` - Vue d'ensemble du projet
- `feature-auth-oauth2.md` - Documentation de l'authentification
- `feature-documents-crud.md` - Documentation de l'API documents

## 🛠️ Développement

### Ajouter une Nouvelle Section

1. Créer le composant de page dans `src/pages/`
2. Ajouter la configuration dans `src/config/sections.ts`
3. Le routing est automatique via la boucle dans `App.tsx`

### Conventions de Code

- **TypeScript strict mode** activé
- **Clean Code principles** appliqués
- **Guard clauses** pour la gestion des erreurs
- **CSS Modules** pour l'isolation des styles
- **Nommage** : camelCase pour les variables, PascalCase pour les composants

## 📄 Licence

Propriétaire - Usage interne uniquement

## 👥 Contribution

Projet interne - Suivre les guidelines de développement du repository
