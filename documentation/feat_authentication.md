---
id: "feat-authentication"
title: "Authentification Firebase via Google OAuth"
type: "feature"
tags: ["authentication", "firebase", "google-oauth", "security"]
status: "active"

relationships:
  part_of: ["epic-ui-features"]
  depends_on: []
  triggers: ["feat-protected-routes"]
---

# Authentification Firebase via Google OAuth

## Vue d'ensemble

Système d'authentification basé sur Firebase Authentication avec fournisseur Google OAuth. L'accès à l'interface est restreint aux utilisateurs internes autorisés.

## Architecture

### Composants impliqués

| Composant | Rôle |
|-----------|------|
| `AuthContext` | Provider React gérant l'état d'authentification global |
| `authService` | Abstraction des opérations Firebase Auth |
| `LoginPage` | Interface de connexion utilisateur |
| `useAuth` | Hook d'accès au contexte d'authentification |
| `ProtectedRoute` | Composant HOC protégeant les routes authentifiées |

### Flux d'authentification

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  LoginPage  │────>│  authService │────>│ Firebase    │
│             │     │ signInGoogle │     │ Auth        │
└─────────────┘     └──────────────┘     └─────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │ AuthContext  │
                    │ setUser()    │
                    └──────────────┘
```

## Implémentation

### AuthContext (`src/contexts/AuthContext.tsx`)

**Interface exposée :**

```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
}
```

**Comportement :**
- Souscription à `onAuthStateChanged` au montage pour synchroniser l'état utilisateur
- Gestion des états `loading` et `error` lors des opérations d'authentification
- Propagation du token Firebase pour les appels API authentifiés

### authService (`src/services/auth/authService.ts`)

**API :**

| Méthode | Description | Retour |
|---------|-------------|--------|
| `signInWithGoogle()` | Ouvre le popup Google OAuth | `Promise<User>` |
| `signOut()` | Déconnecte l'utilisateur | `Promise<void>` |
| `getCurrentUser()` | Retourne l'utilisateur courant | `User \| null` |
| `getIdToken()` | Récupère le JWT Firebase | `Promise<string \| null>` |
| `onAuthStateChange(callback)` | Souscrit aux changements d'état | Unsubscribe function |

### Protection des routes (`src/routes.tsx`)

Le composant `ProtectedRoute` :
- Affiche un spinner pendant la vérification (`loading: true`)
- Redirige vers `/login` si aucun utilisateur authentifié
- Rend les enfants si l'utilisateur est authentifié

```tsx
<ProtectedRoute>
  <AppLayout />
</ProtectedRoute>
```

## Intégration API

Le `apiClient` injecte automatiquement le token Bearer dans les headers :

```typescript
const token = await authService.getIdToken();
headers.set('Authorization', `Bearer ${token}`);
```

## États UI

| État | Affichage LoginPage |
|------|---------------------|
| `loading: false, user: null` | Bouton "Se connecter avec Google" actif |
| `loading: true` | Bouton désactivé, texte "Connexion en cours..." |
| `error` | Composant `ErrorDisplay` avec message |
| `user` présent | Redirection vers `/` |

## Configuration Firebase

Configuration attendue dans `src/services/auth/firebaseConfig.ts` :
- `apiKey`
- `authDomain`
- `projectId`

Variables d'environnement requises (voir `.env.example`).
