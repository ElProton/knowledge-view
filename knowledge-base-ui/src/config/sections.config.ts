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
  // {
  //   id: 'prompts',
  //   label: 'Prompts',
  //   path: '/prompts',
  //   icon: 'code',
  //   description: 'Visualiser et modifier les prompts système',
  //   component: lazy(() => import('../sections/Prompts/PromptsPage')),
  //   filter: { type: 'prompt' }
  // },
];
