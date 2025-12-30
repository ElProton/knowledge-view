import { lazy } from 'react';
import { SectionConfig } from '@/types/section.types';

const HomePage = lazy(() => import('@/pages/Home/HomePage'));
const SpecReviewPage = lazy(() => import('@/pages/SpecReview/SpecReviewPage'));
const KnowledgeReviewPage = lazy(() => import('@/pages/KnowledgeReview/KnowledgeReviewPage'));
const PromptsViewPage = lazy(() => import('@/pages/PromptsView/PromptsViewPage'));

export const sections: SectionConfig[] = [
  {
    id: 'home',
    label: 'Accueil',
    icon: '🏠',
    path: '/',
    component: HomePage,
    enabled: true,
  },
  {
    id: 'spec-review',
    label: 'Revue Specs',
    icon: '📋',
    path: '/specs',
    component: SpecReviewPage,
    defaultFilters: {
      type: 'specification',
      status: 'spec_to_validate',
    },
    enabled: true,
  },
  {
    id: 'knowledge-review',
    label: 'Connaissances',
    icon: '📚',
    path: '/knowledge',
    component: KnowledgeReviewPage,
    defaultFilters: {
      type: 'knowledge',
    },
    enabled: true,
  },
  {
    id: 'prompts-view',
    label: 'Prompts',
    icon: '💬',
    path: '/prompts',
    component: PromptsViewPage,
    defaultFilters: {
      type: 'prompt',
    },
    enabled: true,
  },
];

export const getSectionByPath = (path: string): SectionConfig | undefined => {
  return sections.find(section => section.path === path);
};

export const getEnabledSections = (): SectionConfig[] => {
  return sections.filter(section => section.enabled);
};
