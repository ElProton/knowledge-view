---
id: "auth-oauth2"
title: "Authentification OAuth2"
type: "feature"
tags: ["auth", "security", "oauth2", "tokens"]
status: "active"

relationships:
  part_of: ["epic-knowledge-base-admin"]
  depends_on: ["service-oauth2-server", "service-api-backend"]
  triggers: ["feature-protected-routes", "feature-api-authentication"]
---

# Authentification OAuth2 - Vue d'ensemble

La feature d'authentification OAuth2 permet aux utilisateurs internes de se connecter de manière sécurisée à l'interface d'administration via le flux Authorization Code. Cette fonctionnalité gère le cycle complet d'authentification, du login initial jusqu'à la gestion automatique des tokens et de la déconnexion.

## 1. Spécifications Fonctionnelles

### User Story
En tant qu'**utilisateur interne**, je veux me connecter via OAuth2 pour accéder de manière sécurisée à l'interface d'administration, afin de gérer les documents de la base de connaissances.

### Inputs (Entrées)
- Code d'autorisation retourné par le serveur OAuth2 (via URL callback)
- Configuration OAuth2 (client_id, redirect_uri, auth_url, token_url)
- Refresh token pour renouvellement de session

### Outputs (Sorties)
- Access token JWT stocké dans localStorage
- Refresh token stocké dans localStorage
- Objet User contenant id, username, email
- État d'authentification global via AuthContext

## 2. Scénario d'Usage (Use Case)

### Acteurs
- **Principal :** Utilisateur non authentifié
- **Système :** Application React + Serveur OAuth2

### Pré-conditions
- Le serveur OAuth2 doit être configuré et accessible
- Les variables d'environnement OAuth2 doivent être définies
- L'utilisateur doit posséder des credentials valides sur le serveur OAuth2

### Flux Nominal (Login)

1. L'**Utilisateur** arrive sur l'application sans token valide
2. Le **Système** détecte via AuthProvider que `isAuthenticated = false`
3. Le **ProtectedRoute** redirige vers `/login`
4. L'**Utilisateur** clique sur le bouton "Se connecter"
5. Le **Système** appelle `authApi.getAuthorizationUrl()`
6. Le **Système** construit l'URL OAuth2 avec les paramètres :
   - client_id
   - redirect_uri
   - response_type=code
   - scope=read write
7. Le **Système** redirige le navigateur vers le serveur OAuth2 (window.location.href)
8. L'**Utilisateur** s'authentifie sur le serveur OAuth2 et autorise l'application
9. Le **Serveur OAuth2** redirige vers `redirect_uri?code=AUTHORIZATION_CODE`
10. Le **Système** détecte le paramètre `code` dans l'URL
11. Le **Système** appelle `handleCallback(code)` automatiquement
12. Le **Système** appelle `authApi.exchangeCodeForToken(code)`
13. Le **Système** envoie une requête POST au token_url avec :
    - grant_type=authorization_code
    - client_id
    - redirect_uri
    - code
14. Le **Serveur OAuth2** retourne `{ access_token, refresh_token, token_type, expires_in }`
15. Le **Système** appelle `authApi.getCurrentUser(access_token)`
16. Le **Système** stocke les tokens via `tokenStorage.setAccessToken/setRefreshToken`
17. Le **Système** stocke l'objet User via `tokenStorage.setUser(JSON.stringify(user))`
18. Le **Système** met à jour l'état AuthContext avec les nouvelles données
19. Le **Système** redirige vers la page d'origine ou `/` par défaut

### Flux Nominal (Déconnexion)

1. L'**Utilisateur** clique sur "Déconnexion" dans le Header
2. Le **Système** appelle `logout()` depuis AuthContext
3. Le **Système** appelle `tokenStorage.clearTokens()` qui supprime :
   - kb_access_token
   - kb_refresh_token
   - kb_user
4. Le **Système** réinitialise l'état AuthContext :
   ```typescript
   {
     user: null,
     accessToken: null,
     refreshToken: null,
     isAuthenticated: false,
     isLoading: false
   }
   ```
5. Le **Système** redirige automatiquement vers `/login` via ProtectedRoute

### Flux Alternatifs

#### Cas A : Échec d'échange de code
- Si l'API `exchangeCodeForToken` retourne une erreur, le **Système** :
  1. Log l'erreur dans la console
  2. Appelle `logout()` pour nettoyer l'état
  3. Affiche la page de login avec l'état initial

#### Cas B : Token expiré (401 Unauthorized)
- Si l'apiClient reçoit une réponse 401 :
  1. L'intercepteur `onUnauthorized` est déclenché automatiquement
  2. Le **Système** appelle `logout()`
  3. Le **Système** efface tous les tokens
  4. Le **ProtectedRoute** détecte `isAuthenticated = false`
  5. Le **Système** redirige vers `/login`

#### Cas C : Initialisation avec token existant
- Si au chargement de l'application un token existe dans localStorage :
  1. Le **Système** lit `kb_access_token` et `kb_user`
  2. Le **Système** parse l'objet User
  3. Le **Système** restaure l'état AuthContext
  4. Le **Système** définit `isAuthenticated = true`
  5. L'**Utilisateur** accède directement au contenu protégé

#### Cas D : Données corrompues dans localStorage
- Si le parsing de l'objet User échoue :
  1. Le **Système** capture l'exception dans le try/catch
  2. Le **Système** appelle `logout()` pour nettoyer
  3. Le **Système** redirige vers `/login`

## 3. Règles Techniques & Contraintes

### Sécurité
- **Flow OAuth2 :** Authorization Code (recommandé pour SPA avec backend)
- **Scope :** "read write" pour accès complet à l'API
- **Stockage :** localStorage (clés préfixées `kb_` pour éviter collisions)
- **Interception :** Ajout automatique du Bearer token dans toutes les requêtes API
- **Rotation :** Support du refresh token (fonction disponible, non auto-implémentée)

### Performance
- **Lazy Check :** Le token n'est validé côté serveur qu'à la première requête API
- **Initialisation :** Restauration instantanée depuis localStorage au démarrage
- **Optimisation :** Pas de re-render inutile (useCallback pour login/logout)

### Gestion d'État
- **Pattern :** Context API React pour distribution globale
- **Provider :** AuthProvider englobe toute l'application dans `main.tsx`
- **Hook :** `useAuth()` expose les données et actions d'authentification
- **Protection :** HOC `ProtectedRoute` vérifie `isAuthenticated` avant render

### Erreurs
- **Fail Fast :** Échec d'authentification = nettoyage complet et redirection
- **Logs :** Erreurs loggées dans la console pour debugging
- **UX :** Loader full-screen pendant les opérations async (échange de code)

## 4. Modèle de Données

### AuthState (Context)
```typescript
{
  user: {
    id: "user-uuid",
    username: "admin",
    email: "admin@example.com"
  } | null,
  accessToken: "eyJhbGciOiJIUzI1NiIs..." | null,
  refreshToken: "refresh-token-string" | null,
  isAuthenticated: true | false,
  isLoading: true | false
}
```

### OAuth2TokenResponse (API)
```typescript
{
  access_token: "eyJhbGciOiJIUzI1NiIs...",
  refresh_token: "refresh-token-string",
  token_type: "Bearer",
  expires_in: 3600
}
```

### LocalStorage Keys
```typescript
{
  kb_access_token: "eyJhbGciOiJIUzI1NiIs...",
  kb_refresh_token: "refresh-token-string",
  kb_user: '{"id":"user-uuid","username":"admin","email":"admin@example.com"}'
}
```

## 5. Configuration OAuth2

Les paramètres OAuth2 sont chargés depuis les variables d'environnement :

```env
VITE_OAUTH2_CLIENT_ID=your-client-id
VITE_OAUTH2_REDIRECT_URI=http://localhost:3000/callback
VITE_OAUTH2_AUTH_URL=http://localhost:8000/oauth/authorize
VITE_OAUTH2_TOKEN_URL=http://localhost:8000/oauth/token
```

## 6. Composants Impliqués

### AuthContext.tsx
- Définit la structure du contexte d'authentification
- Exporte le contexte React

### AuthProvider.tsx
- Gère le cycle de vie de l'authentification
- Initialise l'état depuis localStorage au montage
- Fournit les fonctions `login()`, `logout()`, `handleCallback()`
- Configure l'intercepteur de déconnexion sur apiClient

### useAuth.ts
- Hook personnalisé pour accéder au contexte d'authentification
- Vérifie que le hook est utilisé dans un AuthProvider
- Retourne l'état et les actions d'authentification

### ProtectedRoute.tsx
- HOC qui protège les routes nécessitant authentification
- Affiche un Loader pendant `isLoading`
- Redirige vers `/login` si non authentifié
- Préserve la route d'origine dans `location.state.from`

### LoginPage.tsx
- Détecte le paramètre `code` dans l'URL au montage
- Appelle `handleCallback(code)` automatiquement si présent
- Affiche un Loader pendant le traitement
- Redirige vers la page d'origine après succès
- Affiche le bouton "Se connecter" qui appelle `login()`

## 7. Flux de Données

### Initialisation Application
```
App Start → AuthProvider.useEffect() → tokenStorage.getAccessToken()
  ↓ (si token existe)
  → tokenStorage.getUser() → JSON.parse(user)
  → setState({ user, accessToken, isAuthenticated: true, isLoading: false })
  ↓ (si pas de token)
  → setState({ isAuthenticated: false, isLoading: false })
```

### Login Flow
```
User Click "Login" → login() → authApi.getAuthorizationUrl()
  → window.location.href = authUrl
  → OAuth2 Server → User Login
  → Redirect to /callback?code=XXX
  → useEffect détecte code
  → handleCallback(code) → authApi.exchangeCodeForToken(code)
  → authApi.getCurrentUser(access_token)
  → tokenStorage.setAccessToken/setRefreshToken/setUser
  → setState({ user, tokens, isAuthenticated: true })
  → navigate(from)
```

### API Call avec Token
```
Component → apiClient.get('/endpoint')
  → apiClient.request()
  → tokenStorage.getAccessToken()
  → headers['Authorization'] = 'Bearer ' + token
  → fetch(url, { headers })
  ↓ (si 401)
  → onUnauthorized() → logout()
  → tokenStorage.clearTokens()
  → setState({ isAuthenticated: false })
```

## 8. Points de Vigilance

### Sécurité
- ⚠️ Les tokens sont stockés en localStorage (vulnérable à XSS)
- ⚠️ Pas d'implémentation du refresh automatique des tokens
- ⚠️ Pas de validation de l'expiration côté client

### UX
- ✅ Loader affiché pendant les opérations async
- ✅ Préservation de la route d'origine pour redirection post-login
- ✅ Message d'erreur loggé en console (à améliorer avec ErrorDisplay)

### Maintenance
- ✅ Configuration centralisée dans `config/constants.ts`
- ✅ Séparation claire entre logique auth et logique métier
- ✅ Type-safety complète avec TypeScript
