import { LazyExoticComponent, ComponentType } from 'react';

export interface SectionConfig {
  id: string;
  label: string;
  path: string;
  icon?: string;
  description?: string;
  component: LazyExoticComponent<ComponentType<unknown>>;
  filter?: Record<string, string>;
  disabled?: boolean;
  hidden?: boolean;
}
