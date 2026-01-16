---
id: "feat-protected-routes"
title: "Routes protégées par authentification"
type: "feature"
tags: ["routing", "authentication", "security", "navigation"]
status: "active"

relationships:
  part_of: ["epic-ui-features"]
  depends_on: ["feat-authentication"]
  triggers: []
---

# Routes protégées par authentification

## Vue d'ensemble

Mécanisme de protection des routes nécessitant une authentification. Toutes les routes de l'application (sauf `/login`) sont protégées et redirigent vers la page de connexion si l'utilisateur n'est pas authentifié.

## Architecture

### Composant ProtectedRoute

**Fichier :** `src/routes.tsx`

```typescript
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Vérification de l'authentification..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

### Comportement

| État | Action |
|------|--------|
| `loading: true` | Affichage du spinner plein écran |
| `loading: false, user: null` | Redirection vers `/login` avec `replace` |
| `loading: false, user: present` | Rendu des enfants |

## Structure de routing

```tsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route
    path="/*"
    element={
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    }
  />
</Routes>
```

**Points clés :**
- `/login` est la seule route publique
- Toutes les autres routes (`/*`) sont englobées par `ProtectedRoute`
- `AppLayout` contient le `Sidebar` et le `MainFrame` avec les routes enfants

## Layout de l'application

**Fichier :** `src/components/layout/AppLayout/AppLayout.tsx`

```tsx
const AppLayout: React.FC = () => {
  return (
    <div className={styles.appLayout}>
      <Sidebar />
      <MainFrame />
    </div>
  );
};
```

## MainFrame et routes dynamiques

Le `MainFrame` charge dynamiquement les composants des sections via `sectionsConfig` :

```tsx
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    {sectionsConfig.map((section) => (
      <Route
        key={section.id}
        path={section.path}
        element={<section.component />}
      />
    ))}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
</Suspense>
```

## Sidebar

**Fichier :** `src/components/layout/Sidebar/Sidebar.tsx`

### Navigation

Affiche les sections non-masquées et actives :

```typescript
sectionsConfig
  .filter((section) => !section.disabled && !section.hidden)
  .map((section) => (
    <NavLink
      key={section.id}
      to={section.path}
      className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
    >
      {/* ... */}
    </NavLink>
  ))
```

### Section utilisateur

Affiche les informations de l'utilisateur connecté :
- Photo de profil
- Nom d'affichage ou email
- Bouton de déconnexion

## Redirections

### Depuis LoginPage

Si l'utilisateur est déjà connecté, redirection automatique vers la page d'accueil :

```tsx
// Dans LoginPage.tsx
if (user) {
  return <Navigate to="/" replace />;
}
```

### Route inconnue

Les routes non définies sont redirigées vers la page `NotFoundPage`.

## États de chargement

Le composant `LoadingSpinner` est utilisé :
- Pendant la vérification d'authentification initiale
- Pendant le lazy loading des composants de section via `Suspense`
