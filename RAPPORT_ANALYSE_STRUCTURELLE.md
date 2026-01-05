# Rapport d'Analyse Structurelle (TypeScript)

## 1. Synthèse
*   **État général :** À améliorer
*   **Score de maintenabilité estimé :** 6/10
    *   *Méthodologie :* Score basé sur la densité d'anti-patterns, le niveau de duplication de code, et la couverture du typage strict. Pénalités : usages de `any` (-1), duplications majeures (-1), dépendances manquantes dans les hooks (-1), assertions non sécurisées (-1). Bonus : architecture générique existante (+1), gestion centralisée des erreurs (+1).

---

## 2. Duplications de Code (DRY)

### Services identiques
*   **[src/services/posts/postService.ts:8-66] & [src/services/prompts/promptService.ts:5-56] & [src/services/models/modelService.ts:5-56] :**
    Les trois services (`PostService`, `PromptService`, `ModelService`) dupliquent intégralement la même structure CRUD : `getAll`, `getOne`, `create`, `update`, `checkTitleExists`. Seul le `type` diffère. Le hook générique `useResource` existe déjà mais ces services legacy persistent.

### Logique de parsing de réponse API
*   **[src/services/posts/postService.ts:17-22] & [src/services/models/modelService.ts:14-19] & [src/services/prompts/promptService.ts:14-19] & [src/hooks/useResource.ts:78-93] :**
    La logique de parsing `if (Array.isArray(response)) ... else if (response.items)` est répétée 4 fois. Factoriser dans un helper utilitaire.

### Formatage de dates
*   **[src/utils/dataHelpers.ts:53-83] & [src/utils/dataHelpers.ts:92-128] :**
    `formatMongoDate` et `formatMongoDateTime` partagent ~80% de logique identique (parsing du format MongoDB `{ $date: ... }`). Extraire la logique de parsing dans une fonction privée.

### Formulaires : logique d'initialisation état
*   **[src/components/posts/PostForm.tsx:26-37] & [src/components/needs/NeedForm.tsx:23-32] :**
    Les `useEffect` de synchronisation `value → state local` sont quasi-identiques. Pattern à considérer via un hook custom `useFormSync`.

---

## 3. Anti-Patterns & Architecture

### Usage de `any`
*   **[src/hooks/useResource.ts:71] :** `apiClient.get<any>`
    *   *Détail technique :* Perte totale de la sécurité de type sur la réponse API. Typer avec un type union explicite `T[] | { items: T[]; total: number }`.

*   **[src/utils/dataHelpers.ts:14] :** `export function getNestedValue<T = any>(obj: any, ...)`
    *   *Détail technique :* Le paramètre `obj: any` détruit toute inférence de type. Utiliser un générique contraint.

*   **[src/utils/dataHelpers.ts:53, 92] :** `dateValue: any`
    *   *Détail technique :* Typer avec `string | { $date: string } | null | undefined`.

*   **[src/services/posts/postService.ts:10, 49] :** `apiClient.get<any>`
    *   *Détail technique :* Idem - typer avec l'union appropriée.

*   **[src/services/prompts/promptService.ts:7, 43] :** `apiClient.get<any>`
    *   *Détail technique :* Pattern identique à corriger.

*   **[src/services/models/modelService.ts:7, 42] :** `apiClient.get<any>`
    *   *Détail technique :* Pattern identique à corriger.

*   **[src/types/document.types.ts:9] :** `data: Record<string, any>`
    *   *Détail technique :* Le type `any` dans le `Record` affaiblit le typage de toute donnée métier. Considérer un générique ou des types discriminés.

*   **[src/types/resource.types.ts:17] :** `[key: string]: any`
    *   *Détail technique :* Index signature trop permissive. Neutralise les vérifications TypeScript sur `BaseDocument`.

### Assertions de type (`as`)
*   **[src/hooks/useApi.ts:26] :** `const apiError = err as ApiError`
    *   *Détail technique :* Assertion non sécurisée. Vérifier le type avec un type guard avant le cast.

*   **[src/services/posts/postService.ts:18-19, 28-29, 35-36, 44] :** `as PostDocument[]`, `as PostDocument`
    *   *Détail technique :* Assertions multiples sans validation runtime. Si l'API change, aucune erreur à la compilation.

*   **[src/services/prompts/promptService.ts:15-16, 23-24, 30, 38] :** Mêmes assertions `as PromptDocument`.
    *   *Détail technique :* Risque identique.

*   **[src/services/models/modelService.ts:14-15, 22-23, 29, 39] :** Mêmes assertions `as ModelDocument`.
    *   *Détail technique :* Risque identique.

*   **[src/services/api/apiClient.ts:91] :** `return undefined as T`
    *   *Détail technique :* Cast dangereux. Le type `T` peut ne pas être compatible avec `undefined`.

### Magic Strings
*   **[src/services/posts/postService.ts:11, 35] :** `type: 'post'`
*   **[src/services/prompts/promptService.ts:8, 29] :** `type: 'prompt'`
*   **[src/services/models/modelService.ts:8, 29] :** `type: 'model'`
*   **[src/features/needs/needs.config.ts:9] :** `resourceType: 'besoin'`
    *   *Détail technique :* Les types de documents sont hardcodés en strings. Centraliser dans une enum ou un objet constant pour éviter les fautes de frappe.

### useEffect avec dépendances manquantes
*   **[src/components/posts/PostForm.tsx:41-57] :** `useEffect` appelle `onChange` mais `onChange` n'est pas dans le tableau de dépendances, ni `value?.data?.engagement`.
    *   *Détail technique :* Peut causer des closures stales ou des re-renders inutiles. Ajouter les dépendances ou mémoïser.

*   **[src/components/needs/NeedForm.tsx:34-50] :** Même problème avec `onChange` absent des dépendances.
    *   *Détail technique :* Comportement potentiellement inconsistant lors des mises à jour.

---

## 4. Robustesse & "Edge Cases"

### Accès sans Optional Chaining
*   **[src/services/posts/postService.ts:59] :** `doc.title.toLowerCase()`
    *   *Contexte :* `doc.title` peut être `null` ou `undefined` selon `KBDocument`. Utiliser `doc.title?.toLowerCase()`.

*   **[src/services/prompts/promptService.ts:50] :** `doc.title.toLowerCase()`
    *   *Contexte :* Même risque de `TypeError`.

*   **[src/services/models/modelService.ts:50] :** `doc.title.toLowerCase()`
    *   *Contexte :* Même risque de `TypeError`.

*   **[src/hooks/useResource.ts:248] :** `doc.title.toLowerCase() === title.toLowerCase()`
    *   *Contexte :* Si `doc.title` est `null`/`undefined`, exception runtime.

### Promesses sans gestion d'erreur explicite
*   **[src/pages/Posts/PostListPage.tsx:14] :** `fetchAll(limit, skip)` dans `useEffect`
    *   *Contexte :* La promesse flotte sans `.catch()`. Si `fetchAll` rejette, l'erreur n'est pas interceptée localement (bien que le hook gère l'état `error`, le pattern reste fragile).

*   **[src/pages/Posts/PostDetailPage.tsx:17] :** `fetchOne(id)` dans `useEffect`
    *   *Contexte :* Même pattern - promesse flottante.

*   **[src/pages/Needs/NeedDetailPage.tsx:18] :** `fetchOne(id)` dans `useEffect`
    *   *Contexte :* Même pattern.

### Typage trop large ou implicite
*   **[src/types/document.types.ts:4] :** `title?: string | null`
    *   *Contexte :* Le titre est optionnel et nullable, mais plusieurs composants supposent qu'il est toujours défini (ex: `doc.title.toLowerCase()`). Incohérence type/usage.

*   **[src/types/resource.types.ts:29] :** `formatter?: (value: any, item: T) => ReactNode`
    *   *Contexte :* `value: any` empêche toute vérification de type dans les formatters.

### Gestion des valeurs nulles
*   **[src/components/posts/PostForm.tsx:35] :** `const postLink = value.links?.find(...)`
    *   *Contexte :* `postLink?.url` peut être `null` selon le type. Bien géré ici mais propager le pattern partout.

*   **[src/pages/Posts/PostDetailPage.tsx:48-49] :** `postLink?.url || null`
    *   *Contexte :* Gestion correcte mais la fonction `getPostUrl` pourrait être undefined si `currentItem` change entre les appels.

### Mutation potentielle d'objets
*   **[src/pages/Needs/NeedDetailPage.tsx:56-62] :** `...currentItem.data`
    *   *Contexte :* Le spread est superficiel. Si `currentItem.data` contient des objets imbriqués, ils sont partagés par référence. Risque de mutation accidentelle.

---

## 5. Recommandations Prioritaires

1.  **Supprimer les services dupliqués** (`postService`, `promptService`, `modelService`) au profit du hook générique `useResource` déjà implémenté.

2.  **Créer un type union strict pour les réponses API** (ex: `type ApiListResponse<T> = T[] | { items: T[]; total: number }`) et un helper de normalisation centralisé.

3.  **Éliminer les usages explicites de `any`** par des types explicites ou des génériques contraints. Le mode `strict` est actif mais les `any` déclarés explicitement ne sont pas détectés.

4.  **Ajouter des type guards** pour valider les assertions de type (`as`) sur les réponses API.

5.  **Centraliser les types de documents** dans une enum cohérente : `enum DocumentType { POST = 'post', PROMPT = 'prompt', MODEL = 'model', BESOIN = 'besoin' }`.

6.  **Corriger les tableaux de dépendances** des `useEffect` dans `PostForm` et `NeedForm`.

7.  **Utiliser Optional Chaining** (`?.`) systématiquement pour les accès à `title` et autres propriétés nullable.

8.  **Typer explicitement les formatters** de colonnes avec un générique lié à la clé de propriété.
