/**
 * Types de documents centralisés.
 * Utiliser cette enum pour éviter les magic strings.
 */
export enum DocumentType {
  POST = 'post',
  PROMPT = 'prompt',
  MODEL = 'model',
  BESOIN = 'besoin',
  APPLICATION = 'application'
}

/**
 * Type union pour les valeurs de date MongoDB.
 * Peut être une string ISO, un objet MongoDB ou null/undefined.
 */
export type MongoDateValue = string | { $date: string } | null | undefined;

/**
 * Interface de base pour tous les documents de la Knowledge Base.
 * Utilise un générique pour permettre des types de données spécifiques.
 */
export interface KBDocument<TData = Record<string, unknown>> {
  id: string;
  title?: string | null;
  type: string;
  theme?: string[];
  tags?: string[];
  tech_stack?: string[] | null;
  data: TData;
  links?: { url: string | null; label: string | null }[];
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
  deleted_at?: string | null;
  deleted_by?: string | null;
}

export interface PromptData {
  content: string;
  [key: string]: unknown;
}

export interface PromptDocument extends KBDocument<PromptData> {
  type: 'prompt';
}

export interface PostLink {
  label: string;
  url: string;
  id: string | null;
}

export interface PostData {
  platform: string;
  published_date: string;
  content: string;
  engagement?: {
    views?: number;
    reaction?: number;
    comments?: number;
    shares?: number;
  };
  [key: string]: unknown;
}

export interface PostDocument extends KBDocument<PostData> {
  type: 'post';
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
export interface Specification {
  job_story: string;
  acceptance_criteria: string[];
  out_of_scope: string[];
  constraints: {
    regulatory: string | null;
    temporal: string | null;
    budgetary: string | null;
  };
  gap_analysis: string;
  source_quote: string;
}

export interface NeedData {
  status: NeedStatus;
  content: string;
  iteration: number;
  response?: string;
  parent_application_id?: string;
  parent_application_name?: string;
  specification?: Specification;
  [key: string]: unknown;
}

/**
 * Document de type "besoin" pour le workflow de validation agents/humains.
 */
export interface NeedDocument extends KBDocument<NeedData> {
  type: 'need';
}

/**
 * Données spécifiques à un modèle.
 */
export interface ModelData {
  content: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Document de type "modèle" pour stocker des structures de données JSON.
 */
export interface ModelDocument extends KBDocument<ModelData> {
  type: 'model';
}

/**
 * Statuts possibles pour une application.
 */
export enum ApplicationStatus {
  DRAFT = 'draft',
  DEV = 'dev',
  STAGING = 'staging',
  PROD = 'prod',
  DEPRECATED = 'deprecated'
}

/**
 * Fonctionnalité (Feature) d'une application.
 */
export interface Feature {
  name?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Données spécifiques à une application.
 */
export interface ApplicationData {
  content: string;
  url?: string | null;
  status: ApplicationStatus;
  features: Feature[];
  [key: string]: unknown;
}

/**
 * Document de type "application" pour gérer les applications et leurs fonctionnalités.
 */
export interface ApplicationDocument extends KBDocument<ApplicationData> {
  type: 'application';
}

export interface DocumentListResponse {
  items: KBDocument[];
  total: number;
  limit: number;
  skip: number;
}
