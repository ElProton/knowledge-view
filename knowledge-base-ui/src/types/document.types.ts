export interface KBDocument {
  id: string;
  title: string;
  type: string;
  theme?: string[];
  tags?: string[];
  data?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  deleted_at?: string;
}

export interface PromptDocument extends KBDocument {
  type: 'prompt';
  data: {
    content: string;
  };
}

export interface PostLink {
  label: string;
  url: string;
  id: string | null;
}

export interface PostDocument extends KBDocument {
  type: 'post';
  data: {
    platform: string;
    published_date: string;
    content: string;
    engagement?: {
      views?: number;
      reaction?: number;
      comments?: number;
      shares?: number;
    };
  };
  links?: PostLink[];
}

/**
 * Statuts possibles pour un besoin dans le workflow de validation.
 */
export enum NeedStatus {
  ANALYSE = 'analyse',
  VALIDATION = 'validation',
  DETAIL = 'detail',
  SPECIFICATION = 'specification',
}

/**
 * Données spécifiques à un besoin.
 */
export interface NeedData {
  status: NeedStatus;
  content: string;
  iteration: number;
  response?: string;
  parent_application_id?: string;
  parent_application_name?: string;
}

/**
 * Document de type "besoin" pour le workflow de validation agents/humains.
 */
export interface NeedDocument extends KBDocument {
  type: 'need';
  data: NeedData;
}

/**
 * Données spécifiques à un modèle.
 */
export interface ModelData {
  content: Record<string, any>;
}

/**
 * Document de type "modèle" pour stocker des structures de données JSON.
 */
export interface ModelDocument extends KBDocument {
  type: 'model';
  data: ModelData;
}

export interface DocumentListResponse {
  items: KBDocument[];
  total: number;
  limit: number;
  skip: number;
}
