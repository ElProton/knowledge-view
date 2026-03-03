# Guideline : Standard de Documentation des Features (AI-Ready)

## 1. Objectifs
Ce standard vise à créer une documentation hybride :
1.  **Pour les Humains :** Une source de vérité claire, agnostique et standardisée.
2.  **Pour les IA (RAG) :** Un format optimisé pour l'indexation vectorielle ("chunking") et la récupération de contexte.
3.  **Pour le Suivi (Mindmap) :** Une structure de données permettant de générer automatiquement des graphes de dépendances et de processus.

---

## 2. Règles Fondamentales

### Règle d'Or : "Une Feature = Un Fichier"
Chaque fonctionnalité distincte doit avoir son propre fichier Markdown (`.md`).
Si la modification s'effectue sur une feature existante, tu modifies le fichier Markdown qui lui correspond.
*   **OUI :** `feature-auth-login.md`, `feature-auth-reset-password.md`
*   **NON :** `auth-complete-specs.md` (Fichier trop gros, mauvaise granularité pour l'IA).

### Règle de Contextualisation
Les algorithmes de découpage (splitters) peuvent isoler un paragraphe du reste du fichier.
*   **Interdit :** Utiliser "Elle", "Il", "Cela" pour parler de la feature.
*   **Obligatoire :** Répéter le nom de la feature ou utiliser "Le système".
    *   *Mauvais :* "Elle prend en paramètre un ID."
    *   *Bon :* "La feature `Export PDF` prend en paramètre un ID."

---

## 3. Le Frontmatter (Métadonnées)
Chaque fichier **DOIT** commencer par un bloc YAML. C'est ce bloc qui permet de construire la **Mindmap** et de filtrer les résultats de l'IA.

Les champs `relationships` sont obligatoires pour lier les features entre elles sans dépendre du texte.

```yaml
---
id: "slug-unique-de-la-feature"   # Ex: checkout-process-payment
title: "Nom Humain de la Feature" # Ex: Processus de Paiement Stripe
type: "feature"                   # Choix: feature, epic, component, service
tags: ["domaine", "mot-clé"]      # Ex: ["billing", "payment", "critical"]
status: "active"                  # active, draft, deprecated

# Cœur de la Mindmap
relationships:
  part_of: ["epic-billing"]       # La fonctionnalité parente
  depends_on:                     # Pré-requis techniques ou fonctionnels
    - "service-user-profile"
    - "feature-cart-validation"
  triggers:                       # Ce que cette feature lance ensuite
    - "feature-invoice-generation"
    - "email-confirmation-sent"
---
```

---

## 4. Gabarit de Contenu (Template)

Le corps du fichier doit suivre strictement cette hiérarchie de titres (`#`, `##`) pour permettre un découpage (chunking) intelligent par section.

### `# [Titre Feature] - Vue d'ensemble`
*Un résumé de 2 à 3 phrases décrivant le but métier. Cette section sert d'ancrage sémantique principal pour la base vectorielle.*

### `## 1. Spécifications Fonctionnelles`
*Description factuelle des entrées et sorties.*
*   **User Story :** En tant que [Acteur], je veux [Action], afin de [But].
*   **Inputs (Entrées) :** Liste des données nécessaires (ex: Formulaire, Paramètres URL).
*   **Outputs (Sorties) :** Résultat attendu (ex: Redirection, Nouvelle entrée en BDD, JSON).

### `## 2. Scénario d'Usage (Use Case)`
*Description textuelle séquentielle du déroulement. Pas de schéma, uniquement une narration logique étape par étape.*

*   **Acteurs :** Qui initie l'action (Utilisateur, Cron job, API externe).
*   **Pré-conditions :** État nécessaire avant le début (ex: Utilisateur connecté).
*   **Flux Nominal (Happy Path) :**
    1.  L'acteur initie l'action X.
    2.  Le système valide Y.
    3.  Le système exécute Z.
    4.  Le système déclenche la feature liée [ID-Feature-Suivante].
*   **Flux Alternatifs (Gestion des erreurs) :**
    *   *Cas A :* Si la validation échoue, alors...
    *   *Cas B :* Si le service externe ne répond pas, alors...

### `## 3. Règles Techniques & Contraintes`
*Détails d'implémentation agnostiques (Business Logic).*
*   **Validations :** Règles métiers strictes (ex: Montant > 0).
*   **Sécurité :** Habilitations requises (ex: Rôle ADMIN uniquement).
*   **Performance :** Contraintes de temps (ex: Timeout après 30s).

### `## 4. Modèle de Données`
*Représentation simplifiée des données manipulées ou persistées.*

---

## 5. Exemple Concret : `feature-password-reset.md`

Voici à quoi ressemble un fichier final respectant ce guideline.

```markdown
---
id: "auth-password-reset-request"
title: "Demande de réinitialisation de mot de passe"
type: "feature"
tags: ["auth", "security", "email"]
status: "active"
relationships:
  part_of: ["epic-authentication"]
  depends_on: ["service-smtp-provider", "service-database"]
  triggers: ["email-reset-link-send"]
---

# [Auth] Demande Réinitialisation MDP - Vue d'ensemble
Cette fonctionnalité permet à un utilisateur ayant oublié son mot de passe de demander l'envoi d'un lien sécurisé par email pour restaurer l'accès à son compte. Elle est critique pour la rétention utilisateur.

## 1. Spécifications Fonctionnelles
*   **User Story :** En tant qu'utilisateur non connecté, je veux recevoir un lien de réinitialisation pour récupérer mon accès.
*   **Inputs :** Adresse Email (string).
*   **Outputs :** Message de confirmation (générique pour sécurité) et déclenchement d'envoi d'email.

## 2. Scénario d'Usage (Use Case)

### Acteurs
*   **Principal :** Visiteur (Utilisateur non authentifié).
*   **Système :** Backend API.

### Pré-conditions
*   Le service d'envoi d'email (SMTP) doit être opérationnel.

### Flux Nominal (Succès)
1.  Le **Visiteur** saisit son email sur le formulaire "Mot de passe oublié".
2.  Le **Système** reçoit la requête et valide le format de l'email.
3.  Le **Système** vérifie si l'email correspond à un compte actif.
4.  Le **Système** génère un token unique à usage unique (expiration 1h).
5.  Le **Système** délègue l'envoi à la feature `email-reset-link-send`.
6.  Le **Système** affiche un message de succès au Visiteur ("Si ce compte existe, un email a été envoyé").

### Flux Alternatifs
*   **Email Invalide (Format) :** Le Système rejette la demande immédiatement (Erreur format).
*   **Email Inconnu :** Le Système ne fait rien en base de données, mais affiche le même message de succès (Security by obscurity) pour éviter l'énumération des utilisateurs.
*   **Compte suspendu :** Le mail n'est pas envoyé.

## 3. Règles Techniques & Contraintes
*   **Sécurité (Throttling) :** Limiter à 3 demandes par adresse IP par heure pour éviter le spam.
*   **Expiration :** Le token généré ne doit être valide que 60 minutes.
*   **Idempotence :** Si une demande est refaite, l'ancien token doit être invalidé.

## 4. Modèle de Données
Champs manipulés lors de la transaction :
*   `email` (string, required)
*   `reset_token` (hash string)
*   `requested_at` (timestamp)
*   `ip_address` (string)
```