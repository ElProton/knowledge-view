import { lazy } from 'react';
import { SectionConfig } from '../types/section.types';

export const sectionsConfig: SectionConfig[] = [
  {
    id: 'home',
    label: 'Accueil',
    path: '/',
    icon: 'home',
    description: "Vue d'ensemble et navigation",
    component: lazy(() => import('../pages/Home/HomePage')),
  },
  // Sections futures (commentées pour référence)
  // {
  //   id: 'spec-review',
  //   label: 'Revue des Specs',
  //   path: '/specs',
  //   icon: 'document',
  //   description: 'Valider les spécifications générées par les agents',
  //   component: lazy(() => import('../sections/SpecReview/SpecReviewPage')),
  //   filter: { status: 'spec_to_validate' }
  // },
  // {
  //   id: 'knowledge',
  //   label: 'Connaissances',
  //   path: '/knowledge',
  //   icon: 'book',
  //   description: 'Gérer la base de connaissances',
  //   component: lazy(() => import('../sections/Knowledge/KnowledgePage')),
  // },
  {
    id: 'prompts',
    label: 'Prompts',
    path: '/prompts',
    icon: 'code',
    description: 'Visualiser et modifier les prompts système',
    component: lazy(() => import('../pages/Prompts/PromptListPage')),
  },
  {
    id: 'prompts-create',
    label: 'Créer Prompt',
    path: '/prompts/new',
    component: lazy(() => import('../pages/Prompts/PromptCreatePage')),
    hidden: true,
  },
  {
    id: 'prompts-detail',
    label: 'Détail Prompt',
    path: '/prompts/:id',
    component: lazy(() => import('../pages/Prompts/PromptDetailPage')),
    hidden: true,
  },
  {
    id: 'posts',
    label: 'Posts',
    path: '/post',
    icon: 'share',
    description: 'Gérer les publications réseaux sociaux',
    component: lazy(() => import('../pages/Posts/PostListPage')),
  },
  {
    id: 'posts-create',
    label: 'Créer Post',
    path: '/post/new',
    component: lazy(() => import('../pages/Posts/PostCreatePage')),
    hidden: true,
  },
  {
    id: 'posts-detail',
    label: 'Détail Post',
    path: '/post/:id',
    component: lazy(() => import('../pages/Posts/PostDetailPage')),
    hidden: true,
  },
];
