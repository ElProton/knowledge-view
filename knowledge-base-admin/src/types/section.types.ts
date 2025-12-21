import { ComponentType } from 'react';
import { DocumentType, DocumentStatus } from './document.types';

export interface SectionConfig {
  id: string;
  label: string;
  icon: string; // Emoji ou icône textuelle
  path: string;
  component: ComponentType;
  defaultFilters?: {
    type?: DocumentType;
    status?: DocumentStatus;
  };
  enabled: boolean;
}
