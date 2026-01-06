---
id: "epic-knowledge-base-admin"
title: "Interface d'Administration de la Base de Connaissances"
type: "epic"
tags: ["admin", "knowledge-base", "spa", "react", "typescript"]
status: "active"

relationships:
  part_of: []
  depends_on: []
  triggers:
    - "feature-auth-oauth2"
    - "feature-documents-crud"
    - "feature-spec-review"
---

# Interface d'Administration de la Base de Connaissances - Vue d'ensemble

L'interface d'administration de la base de connaissances est une application web monopage (SPA) développée avec React 18 et TypeScript. Cette épopée fournit aux utilisateurs internes un outil efficace pour gérer, réviser et valider les documents générés par les agents IA. Le système implémente un workflow de validation structuré pour les spécifications, la gestion des connaissances et des prompts d'instructions.

## 1. Spécifications Fonctionnelles

### User Story
En tant qu'**administrateur de la base de connaissances**, je veux disposer d'une interface centralisée pour gérer les documents (spécifications, connaissances, prompts), afin de maintenir la qualité et la cohérence des contenus utilisés par les agents IA.

### Inputs (Entrées)
- Authentification OAuth2 avec credentials utilisateur
- Documents Markdown stockés dans la base de données
- Filtres de recherche (type, status, pagination)
- Modifications de contenu et changements de statut

### Outputs (Sorties)
- Interface utilisateur responsive avec navigation sidebar
- Visualisation et édition de contenu Markdown
- Actions de validation/rejet de spécifications
- Notifications de succès/erreur des opérations

## 2. Scénario d'Usage (Use Case)

### Acteurs
- **Principal :** Administrateur authentifié (utilisateur interne)
- **Système :** Application React SPA + API Backend REST

### Pré-conditions
- Le serveur API backend doit être opérationnel
- Le serveur OAuth2 doit être configuré et accessible
- L'utilisateur doit posséder des credentials valides

### Flux Nominal (Happy Path)

1. L'**Administrateur** accède à l'URL de l'application
2. Le **Système** détecte l'absence de token et redirige vers la page de login
3. L'**Administrateur** clique sur "Se connecter"
4. Le **Système** redirige vers le serveur OAuth2 pour authentification
5. L'**Administrateur** s'authentifie et autorise l'application
6. Le **Système** reçoit le code d'autorisation et l'échange contre des tokens
7. Le **Système** stocke les tokens et récupère les informations utilisateur
8. Le **Système** affiche le tableau de bord avec les sections disponibles
9. L'**Administrateur** navigue vers "Revue Specs" via la sidebar
10. Le **Système** charge et affiche la liste des spécifications en status `spec_to_validate`
11. L'**Administrateur** sélectionne une spécification pour examen
12. Le **Système** affiche le contenu Markdown de la spécification
13. L'**Administrateur** valide ou rejette la spécification
14. Le **Système** met à jour le status du document et déclenche la feature `feature-documents-crud`

### Flux Alternatifs

#### Cas A : Échec d'authentification OAuth2
- Si l'échange de code échoue, le **Système** affiche un message d'erreur
- Le **Système** efface les tokens stockés et redirige vers la page de login

#### Cas B : Session expirée (Token 401)
- Si l'API retourne un code 401, le **Système** intercepte l'erreur via l'apiClient
- Le **Système** déclenche automatiquement la déconnexion
- Le **Système** redirige l'utilisateur vers la page de login

#### Cas C : Erreur réseau
- Si une requête échoue pour raison réseau, le **Système** affiche un ErrorDisplay
- Le **Système** propose un bouton "Réessayer" pour relancer l'opération

## 3. Règles Techniques & Contraintes

### Architecture
- **Pattern :** Single Page Application (SPA) avec routing côté client
- **État :** Context API React pour l'authentification globale
- **Modularité :** Configuration des sections extensible via `config/sections.ts`
- **Lazy Loading :** Chargement différé des pages via React.lazy() et Suspense

### Sécurité
- **Authentification :** OAuth2 Authorization Code Flow obligatoire
- **Stockage :** Tokens stockés dans localStorage (clés préfixées `kb_`)
- **Routes Protégées :** HOC `ProtectedRoute` vérifie l'authentification avant affichage
- **Intercepteur API :** Ajout automatique du Bearer token dans les headers
- **Déconnexion Auto :** Sur réponse 401, déconnexion et redirection automatiques

### Performance
- **Build :** Optimisation via Vite (tree-shaking, code splitting)
- **Suspense :** Fallback Loader pendant le chargement des pages lazy
- **CSS Modules :** Isolation des styles et élimination du CSS non utilisé

### Styling
- **Approche :** CSS Modules natifs sans framework UI lourd
- **Variables CSS :** Thème centralisé dans `index.css`
- **Principe :** Efficacité > Esthétique (interface sobre et fonctionnelle)

### Extensibilité
- **Sections :** Nouvelle section ajoutée via `config/sections.ts` (enabled: true/false)
- **API :** Client HTTP générique supportant tous les verbes REST
- **Types :** TypeScript strict mode avec inférence complète

## 4. Modèle de Données

### AuthState
```typescript
{
  user: {
    id: string,
    username: string,
    email: string
  } | null,
  accessToken: string | null,
  refreshToken: string | null,
  isAuthenticated: boolean,
  isLoading: boolean
}
```

### Document
```typescript
{
  id: string,
  type: 'specification' | 'knowledge' | 'prompt' | 'prospect',
  status: 'draft' | 'spec_to_validate' | 'validated' | 'rejected' | 'published',
  title: string,
  content: string,  // Markdown
  created_at: string,
  updated_at: string,
  metadata?: Record<string, unknown>
}
```

### SectionConfig
```typescript
{
  id: string,
  label: string,
  icon: string,
  path: string,
  component: ComponentType,
  defaultFilters?: {
    type?: DocumentType,
    status?: DocumentStatus
  },
  enabled: boolean
}
```

## 5. Stack Technique

| Composant | Technologie | Version |
|-----------|------------|---------|
| Framework UI | React | 18.2.0 |
| Langage | TypeScript | 5.2.2 |
| Build Tool | Vite | 5.0.0 |
| Routing | React Router DOM | 6.20.0 |
| Markdown | React Markdown | 9.0.1 |
| Styling | CSS Modules | Native |
| Authentification | OAuth2 | Authorization Code Flow |
| État Global | React Context API | Native |

## 6. Structure des Dossiers

```
knowledge-base-admin/
├── src/
│   ├── api/              # Clients HTTP et endpoints
│   ├── auth/             # Contexte et logique OAuth2
│   ├── components/       # Composants réutilisables
│   │   ├── common/       # Boutons, Loaders, Modales
│   │   └── layout/       # Header, Sidebar, MainLayout
│   ├── config/           # Configuration des sections
│   ├── hooks/            # Hooks personnalisés
│   ├── pages/            # Pages de l'application
│   ├── types/            # Définitions TypeScript
│   └── utils/            # Fonctions utilitaires
```

## 7. Workflow de Validation

Le système implémente un workflow de validation structuré :

1. Les agents IA génèrent des spécifications avec status `spec_to_validate`
2. Les administrateurs accèdent à la section "Revue Specs"
3. Les spécifications sont affichées avec leur contenu Markdown
4. L'administrateur peut :
   - **Valider :** Passe le status à `validated`
   - **Rejeter :** Passe le status à `rejected` avec raison optionnelle
   - **Modifier :** Édite le contenu avant validation

## 8. Points d'Extension Futurs

- Implémentation complète des pages SpecReview, KnowledgeReview, PromptsView
- Éditeur Markdown avec prévisualisation temps réel
- Système de commentaires et d'annotations
- Historique des versions avec diff
- Recherche full-text dans les documents
- Export de documents en PDF/HTML
- Gestion des permissions granulaires par rôle
