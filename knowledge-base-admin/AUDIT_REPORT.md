# Rapport d'Analyse Structurelle (TypeScript)

## 1. Synthèse
*   **État général :** À améliorer
*   **Score de maintenabilité estimé :** 7/10

Le code présente une architecture solide avec une bonne séparation des responsabilités (API, types, composants). Cependant, plusieurs problèmes de configuration TypeScript, des duplications de code dans les pages, et quelques faiblesses de robustesse nécessitent attention.

## 2. Duplications de Code (DRY)

*   **[SpecReviewPage.tsx:1-24] & [PromptsViewPage.tsx:1-24] & [KnowledgeReviewPage.tsx:1-24] :** Structure JSX identique pour les pages "placeholder". Chaque page utilise le même pattern avec `ContentFrame`, un icône, un titre "Section en cours de développement", un paragraphe descriptif et une liste. Factoriser dans un composant `PlaceholderPage` générique avec props pour le titre, l'icône, la description et les items de liste.

*   **[authApi.ts:15-33] & [authApi.ts:36-53] :** Logique de requête POST vers `tokenUrl` dupliquée entre `exchangeCodeForToken` et `refreshToken`. Seuls les paramètres `grant_type` et la clé de token (code vs refresh_token) diffèrent. Extraire une méthode privée `postTokenRequest(params: URLSearchParams)`.

*   **[documentsApi.ts:32-34] & [documentsApi.ts:36-41] :** `validateSpecification` et `rejectSpecification` appellent tous deux `apiClient.patch` avec `status` modifié. Pattern identique avec variation mineure.

## 3. Anti-Patterns & Architecture

*   **[main.tsx : L6] :** Non-null assertion operator (`!`)
    *   *Détail technique :* L'assertion `document.getElementById('root')!` suppose que l'élément existe toujours. Si l'ID est absent du HTML, une exception runtime sera levée. Préférer une vérification explicite ou un fallback.

*   **[LoginPage.tsx : L15] :** Type assertion dangereuse (`as`)
    *   *Détail technique :* `(location.state as { from?: { pathname: string } })` effectue une assertion de type sans validation runtime. Si `location.state` a une structure différente, l'accès à `from.pathname` sera incorrect sans erreur TypeScript.

*   **[AuthContext.tsx : L10-12] :** Valeurs par défaut factices dans le contexte
    *   *Détail technique :* Les fonctions `login`, `logout`, `handleCallback` sont définies comme no-op `() => {}`. Si le contexte est utilisé hors du Provider, aucune erreur explicite ne sera levée, masquant les bugs.

*   **[Configuration] :** Fichier `.eslintrc` absent
    *   *Détail technique :* La commande `npm run lint` échoue car aucune configuration ESLint n'existe. Impossible d'appliquer les règles de qualité de code configurées dans `package.json`.

## 4. Robustesse & "Edge Cases"

*   **[AuthProvider.tsx : L43] :** [SyntaxError - JSON.parse]
    *   *Contexte :* `JSON.parse(storedUser)` est appelé dans un bloc try/catch, ce qui est correct. Cependant, si `localStorage` contient une valeur corrompue mais parsable (ex: `"null"`, `"undefined"`), le cast vers `User` sera silencieusement incorrect.

*   **[authApi.ts : L32-33, L51-52, L65-66] :** [Typage implicite avec `response.json()`]
    *   *Contexte :* Les méthodes `exchangeCodeForToken`, `refreshToken` et `getCurrentUser` retournent directement `response.json()` sans validation du schéma de la réponse. Si l'API retourne une structure inattendue, TypeScript ne détectera pas l'erreur.

*   **[apiClient.ts : L48] :** [Catch silencieux]
    *   *Contexte :* `.catch(() => ({}))` lors du parsing de l'erreur JSON masque toute erreur de parsing et retourne un objet vide. Le message d'erreur affiché sera potentiellement `undefined` ou `statusText` par défaut.

*   **[LoginPage.tsx : L19] :** [Promesse non-chaînée dans useEffect]
    *   *Contexte :* `handleCallback(code)` est une fonction async mais son appel dans `useEffect` ne gère pas explicitement le cas d'erreur (le catch est dans `AuthProvider` mais pas de feedback UI en cas d'échec).

*   **[config/constants.ts : L1-7] :** [Valeurs d'environnement vides]
    *   *Contexte :* `OAUTH2_CONFIG.clientId` peut être une chaîne vide si la variable d'environnement n'est pas définie. L'authentification échouera silencieusement sans message d'erreur explicite au démarrage.

## 5. Recommandations Prioritaires

1. **Créer un fichier `.eslintrc.cjs`** avec la configuration ESLint pour React/TypeScript afin de restaurer la vérification statique du code.

2. **Factoriser les pages placeholder** dans un composant réutilisable `PlaceholderPage` acceptant les props: `title`, `icon`, `description`, `features: string[]`.

3. **Remplacer l'assertion non-null dans `main.tsx`** par une vérification:
   ```typescript
   const root = document.getElementById('root');
   if (!root) throw new Error('Root element not found');
   ReactDOM.createRoot(root).render(...);
   ```

4. **Valider `location.state` dans LoginPage** avec un type guard ou une bibliothèque de validation de schéma (zod, io-ts).

5. **Ajouter une validation runtime des réponses API** avec un schéma de type (zod) pour garantir la conformité des données reçues avec les interfaces TypeScript.

6. **Implémenter une vérification des variables d'environnement critiques** au démarrage de l'application avec messages d'erreur explicites si OAuth2 n'est pas configuré.
