---
id: "documents-crud"
title: "Gestion CRUD des Documents"
type: "feature"
tags: ["api", "documents", "crud", "markdown"]
status: "active"

relationships:
  part_of: ["epic-knowledge-base-admin"]
  depends_on: ["feature-auth-oauth2", "service-api-backend"]
  triggers: ["feature-spec-review", "feature-knowledge-review", "feature-prompts-view"]
---

# Gestion CRUD des Documents - Vue d'ensemble

La feature de gestion CRUD permet d'interagir avec l'API backend pour récupérer, modifier et mettre à jour les documents de la base de connaissances. Cette fonctionnalité fournit une couche d'abstraction typée pour toutes les opérations sur les documents (spécifications, connaissances, prompts).

## 1. Spécifications Fonctionnelles

### User Story
En tant que **développeur de composant**, je veux disposer d'une API client typée pour manipuler les documents, afin d'implémenter facilement les fonctionnalités de listing, consultation et modification.

### Inputs (Entrées)
- Filtres de recherche optionnels (status, type, page, limit)
- ID de document pour opérations ciblées
- Payload de mise à jour (title, content, status, metadata)

### Outputs (Sorties)
- Liste paginée de documents avec métadonnées
- Document individuel complet
- Document mis à jour après modification
- Gestion automatique des erreurs HTTP

## 2. Scénario d'Usage (Use Case)

### Acteurs
- **Principal :** Composant React (Page ou Hook custom)
- **Système :** API Client + Backend REST

### Pré-conditions
- L'utilisateur doit être authentifié (access_token valide)
- L'API backend doit être accessible

### Flux Nominal (Récupération de documents filtrés)

1. Le **Composant** appelle `documentsApi.getDocuments({ type: 'specification', status: 'spec_to_validate', page: 1, limit: 20 })`
2. Le **Système** construit les paramètres de requête URLSearchParams
3. Le **Système** génère l'endpoint `/documents?type=specification&status=spec_to_validate&page=1&limit=20`
4. Le **Système** appelle `apiClient.get<DocumentsResponse>(endpoint)`
5. L'**API Client** ajoute automatiquement le header `Authorization: Bearer <token>`
6. L'**API Client** envoie la requête GET au backend
7. Le **Backend** retourne un objet `DocumentsResponse` :
   ```json
   {
     "documents": [...],
     "total": 45,
     "page": 1,
     "limit": 20
   }
   ```
8. Le **Système** retourne la réponse typée au composant
9. Le **Composant** utilise les données pour affichage

### Flux Nominal (Récupération d'un document)

1. Le **Composant** appelle `documentsApi.getDocument('doc-uuid')`
2. Le **Système** construit l'endpoint `/documents/doc-uuid`
3. Le **Système** appelle `apiClient.get<Document>(endpoint)`
4. L'**API Client** envoie la requête GET avec le token
5. Le **Backend** retourne l'objet `Document` complet
6. Le **Système** retourne le document typé au composant

### Flux Nominal (Mise à jour d'un document)

1. Le **Composant** appelle `documentsApi.updateDocument('doc-uuid', { title: 'Nouveau titre', content: '# Contenu modifié' })`
2. Le **Système** construit l'endpoint `/documents/doc-uuid`
3. Le **Système** appelle `apiClient.patch<Document>(endpoint, payload)`
4. L'**API Client** sérialise le payload en JSON
5. L'**API Client** ajoute le header `Content-Type: application/json`
6. L'**API Client** envoie la requête PATCH avec le token
7. Le **Backend** met à jour le document et retourne le document modifié
8. Le **Système** retourne le document mis à jour au composant

### Flux Nominal (Validation de spécification)

1. Le **Composant** appelle `documentsApi.validateSpecification('spec-uuid')`
2. Le **Système** appelle en interne `updateDocument('spec-uuid', { status: 'validated' })`
3. Le **Système** suit le flux de mise à jour standard
4. Le **Backend** change le status à `validated`
5. Le **Système** retourne le document validé

### Flux Nominal (Rejet de spécification)

1. Le **Composant** appelle `documentsApi.rejectSpecification('spec-uuid', 'Raison du rejet')`
2. Le **Système** construit le payload :
   ```typescript
   {
     status: 'rejected',
     metadata: { rejection_reason: 'Raison du rejet' }
   }
   ```
3. Le **Système** appelle `updateDocument('spec-uuid', payload)`
4. Le **Backend** change le status à `rejected` et stocke la raison
5. Le **Système** retourne le document rejeté

### Flux Alternatifs

#### Cas A : Document non trouvé (404)
- Si le backend retourne 404 :
  1. L'**API Client** détecte `!response.ok`
  2. L'**API Client** crée un objet `ApiError` :
     ```typescript
     {
       code: 404,
       message: "Ressource introuvable.",
       details: undefined
     }
     ```
  3. L'**API Client** lance (throw) cette erreur
  4. Le **Composant** doit capturer l'erreur dans un try/catch ou via ErrorBoundary

#### Cas B : Paramètres invalides (400)
- Si le backend retourne 400 avec body JSON :
  ```json
  {
    "message": "Invalid status value",
    "details": "Status must be one of: draft, spec_to_validate, validated, rejected, published"
  }
  ```
  1. L'**API Client** parse le body JSON
  2. L'**API Client** crée un `ApiError` avec message et details
  3. L'**API Client** lance l'erreur

#### Cas C : Erreur serveur (500)
- Si le backend retourne 500 :
  1. L'**API Client** crée un `ApiError` avec code 500
  2. Le message par défaut est "Erreur serveur. Veuillez réessayer plus tard."
  3. Le **Composant** peut afficher un ErrorDisplay avec bouton "Réessayer"

#### Cas D : Token expiré (401)
- Si le backend retourne 401 :
  1. L'**API Client** détecte le code 401
  2. L'**API Client** appelle `onUnauthorized()` configuré par AuthProvider
  3. Le **Système** déclenche la déconnexion automatique
  4. L'utilisateur est redirigé vers `/login`

## 3. Règles Techniques & Contraintes

### API Contract
- **Base URL :** Configurée via `VITE_API_BASE_URL`
- **Endpoints :**
  - `GET /documents?type={type}&status={status}&page={page}&limit={limit}` - Liste paginée
  - `GET /documents/{id}` - Document individuel
  - `PATCH /documents/{id}` - Mise à jour partielle
- **Authentification :** Bearer token requis dans header `Authorization`
- **Content-Type :** `application/json` pour POST/PATCH/PUT

### Gestion des Erreurs
- **Centralisation :** Toutes les erreurs HTTP sont transformées en `ApiError`
- **Propagation :** Les erreurs sont lancées (throw) et doivent être capturées par les composants
- **Messages :** Messages d'erreur localisés en français via `getErrorMessage(statusCode)`

### Types
- **Type-Safety :** Tous les appels API retournent des types TypeScript stricts
- **Filtres :** Les filtres optionnels utilisent le type `DocumentFilters`
- **Enums :** Les enums TypeScript garantissent la validité des types et status

### Performance
- **Pagination :** Support natif de la pagination côté serveur
- **Filtrage Serveur :** Filtrage par type/status délégué au backend
- **Pas de Cache :** Pas de cache client (requête fraîche à chaque appel)

## 4. Modèle de Données

### Document
```typescript
{
  id: "doc-uuid-123",
  type: "specification" | "knowledge" | "prompt" | "prospect",
  status: "draft" | "spec_to_validate" | "validated" | "rejected" | "published",
  title: "Titre du document",
  content: "# Contenu Markdown\n\nTexte...",
  created_at: "2024-01-15T10:30:00Z",
  updated_at: "2024-01-15T14:20:00Z",
  metadata: {
    rejection_reason: "Raison du rejet" // Optionnel
  }
}
```

### DocumentFilters
```typescript
{
  status?: "spec_to_validate",
  type?: "specification",
  page?: 1,
  limit?: 20
}
```

### DocumentsResponse (Liste Paginée)
```typescript
{
  documents: [
    { id: "1", type: "specification", ... },
    { id: "2", type: "knowledge", ... }
  ],
  total: 45,
  page: 1,
  limit: 20
}
```

### DocumentUpdatePayload
```typescript
{
  title?: "Nouveau titre",
  content?: "# Nouveau contenu",
  status?: "validated",
  metadata?: {
    rejection_reason: "Raison"
  }
}
```

## 5. API Client (Implémentation)

### apiClient.ts
- **Classe :** `ApiClient` centralisée
- **Base URL :** Configurée à l'instanciation
- **Méthodes :** `get`, `post`, `put`, `patch`, `delete`
- **Intercepteurs :**
  - Ajout automatique du Bearer token
  - Gestion des réponses 204 No Content (retourne `{}`)
  - Détection et déclenchement `onUnauthorized` sur 401
  - Parsing automatique des erreurs JSON

### documentsApi.ts
- **Namespace :** Objet `documentsApi` avec méthodes statiques
- **Fonctions :**
  - `getDocuments(filters)` - Liste paginée
  - `getDocument(id)` - Document individuel
  - `updateDocument(id, payload)` - Mise à jour partielle
  - `validateSpecification(id)` - Raccourci pour validation
  - `rejectSpecification(id, reason)` - Raccourci pour rejet

## 6. Exemple d'Utilisation

### Dans un composant React
```typescript
import { useState, useEffect } from 'react';
import { documentsApi } from '@/api/documentsApi';
import { Document, DocumentsResponse } from '@/types/document.types';
import { ErrorDisplay } from '@/components/common/ErrorDisplay/ErrorDisplay';
import { Loader } from '@/components/common/Loader/Loader';

export const SpecsList = () => {
  const [data, setData] = useState<DocumentsResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSpecs = async () => {
      try {
        setIsLoading(true);
        const response = await documentsApi.getDocuments({
          type: 'specification',
          status: 'spec_to_validate'
        });
        setData(response);
        setError(null);
      } catch (err) {
        setError(parseApiError(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecs();
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <ErrorDisplay error={error} onRetry={fetchSpecs} />;

  return (
    <div>
      {data.documents.map(doc => (
        <div key={doc.id}>{doc.title}</div>
      ))}
    </div>
  );
};
```

## 7. Points d'Extension Futurs

- Hook personnalisé `useDocuments(filters)` pour simplifier l'usage
- Cache côté client avec invalidation (React Query / SWR)
- Support du refresh token automatique
- Optimistic updates pour UX instantanée
- Batch operations (validation multiple, suppression en masse)
- WebSocket pour synchronisation temps réel des modifications
