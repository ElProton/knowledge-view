---
id: "epic-ui-features"
title: "Knowledge Base Manager - Features UI"
type: "epic"
tags: ["documentation", "architecture", "features", "index"]
status: "active"

relationships:
  part_of: []
  depends_on: []
  triggers: []
---

# Knowledge Base Manager - Documentation des Features

## Vue d'ensemble

Interface React/TypeScript de gestion d'une base de connaissances. Architecture basée sur des composants génériques configurables et des sections spécialisées.

## Stack technique

| Technologie | Usage |
|-------------|-------|
| React 18 | Framework UI |
| TypeScript | Typage statique |
| Vite | Build tooling |
| React Router | Routing SPA |
| Firebase Auth | Authentification |
| CSS Modules | Styling |

## Index des features

### Infrastructure

| ID | Titre | Description |
|----|-------|-------------|
| `feat-authentication` | [Authentification](./feat_authentication.md) | Firebase + Google OAuth |
| `feat-protected-routes` | [Routes protégées](./feat_protected_routes.md) | Mécanisme de protection des routes |
| `feat-generic-section` | [Sections génériques](./feat_generic_section.md) | Architecture configuration-driven |

### Pages et sections

| ID | Titre | Description |
|----|-------|-------------|
| `feat-home-page` | [Page d'accueil](./feat_home_page.md) | Dashboard et navigation |
| `feat-section-prompts` | [Section Prompts](./feat_section_prompts.md) | Gestion des prompts IA |
| `feat-section-applications` | [Section Applications](./feat_section_applications.md) | Gestion des applications et features |
| `feat-section-posts` | [Section Posts](./feat_section_posts.md) | Publications réseaux sociaux |
| `feat-section-needs` | [Section Besoins](./feat_section_needs.md) | Workflow de validation des besoins |
| `feat-section-models` | [Section Modèles](./feat_section_models.md) | Structures de données JSON |

## Graphe de dépendances

```
                    ┌─────────────────────┐
                    │  feat-authentication │
                    └──────────┬──────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
            ▼                  ▼                  ▼
┌───────────────────┐  ┌──────────────┐   ┌──────────────┐
│feat-protected-routes│ │feat-home-page│   │feat-generic- │
└───────────────────┘  └──────────────┘   │   section    │
                                          └──────┬───────┘
                                                 │
              ┌──────────────┬──────────────┬────┴────────┬──────────────┐
              │              │              │             │              │
              ▼              ▼              ▼             ▼              ▼
       ┌──────────┐   ┌──────────┐   ┌──────────┐  ┌──────────┐   ┌──────────┐
       │ Prompts  │   │  Apps    │   │  Posts   │  │  Needs   │   │  Models  │
       └──────────┘   └──────────┘   └──────────┘  └──────────┘   └──────────┘
```

## Structure du code source

```
src/
├── components/
│   ├── common/          # Composants réutilisables (Button, LoadingSpinner, ErrorDisplay)
│   ├── generic/         # Composants génériques (ResourceList, ResourceView)
│   ├── layout/          # Layout (AppLayout, Sidebar, MainFrame)
│   └── {section}/       # Formulaires spécifiques par section
│
├── config/
│   ├── app.config.ts    # Configuration globale de l'application
│   └── sections.config.ts # Configuration des sections et routing
│
├── contexts/
│   └── AuthContext.tsx  # Provider d'authentification
│
├── features/
│   └── {section}/       # Configuration ResourceConfig par section
│
├── hooks/
│   ├── useAuth.ts       # Hook d'accès au contexte d'authentification
│   └── useResource.ts   # Hook générique CRUD
│
├── pages/
│   └── {Section}/       # Pages (List, Create, Detail) par section
│
├── services/
│   ├── api/             # Client API et endpoints
│   └── auth/            # Services Firebase Auth
│
├── types/
│   ├── api.types.ts     # Types API
│   ├── document.types.ts # Types des documents
│   ├── resource.types.ts # Types du système générique
│   └── section.types.ts  # Types de configuration des sections
│
└── utils/
    └── dataHelpers.ts   # Utilitaires (formatage dates, accès nested values)
```

## Conventions

### Nommage des fichiers

| Type | Convention | Exemple |
|------|------------|---------|
| Page | `{Name}Page.tsx` | `PostListPage.tsx` |
| Composant | `{Name}.tsx` | `ResourceList.tsx` |
| Formulaire | `{Name}Form.tsx` | `ApplicationForm.tsx` |
| Config | `{name}.config.ts` | `posts.config.ts` |
| Style | `{Component}.module.css` | `PostForm.module.css` |

### Types de documents

Utiliser l'enum `DocumentType` :

```typescript
enum DocumentType {
  POST = 'post',
  PROMPT = 'prompt',
  MODEL = 'model',
  BESOIN = 'besoin',
  APPLICATION = 'application'
}
```

### Patterns de formulaire

Deux patterns coexistent :

1. **ResourceFormProps** (recommandé) : Injection via `onChange`
2. **Legacy** : Formulaire autonome avec `onSubmit` direct
