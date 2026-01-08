import { ComponentType, ReactNode } from 'react';

/**
 * Interface de base pour tous les documents de la Knowledge Base.
 * Tous les types de documents doivent étendre cette interface.
 * Utilise un générique pour permettre des types de données spécifiques.
 */
export interface BaseDocument<TData = Record<string, unknown>> {
  id: string;
  type: string;
  title?: string | null;
  created_at: string;
  updated_at: string;
  theme?: string[];
  tags?: string[];
  data?: TData;
}

/**
 * Configuration d'une colonne dans la liste de ressources.
 */
export interface ColumnConfig<T extends BaseDocument> {
  /** Clé de la propriété à afficher (supporte les chemins imbriqués comme 'data.platform') */
  key: keyof T | string;
  /** Label affiché dans l'en-tête de colonne */
  label: string;
  /** Fonction de formatage personnalisée pour la valeur */
  formatter?: (value: unknown, item: T) => ReactNode;
  /** Indique si la colonne est triable */
  sortable?: boolean;
}

/**
 * Configuration complète d'une ressource pour le moteur générique.
 */
export interface ResourceConfig<T extends BaseDocument> {
  /** Type de ressource (ex: 'post', 'prompt') - utilisé pour filtrer les appels API */
  resourceType: string;
  
  /** Labels singulier et pluriel pour l'affichage */
  labels: {
    singular: string;
    plural: string;
  };
  
  /** Configuration de la vue liste */
  list: {
    /** Colonnes à afficher dans la liste */
    columns: ColumnConfig<T>[];
    /** Filtres rapides optionnels pour filtrer la liste côté client */
    quickFilters?: QuickFilter<T>[];
  };
  
  /** Champs en lecture seule (non modifiables en édition) */
  readOnlyFields?: (keyof T)[];
}

/**
 * Props du composant de formulaire injecté dans ResourceView.
 */
export interface ResourceFormProps<T extends BaseDocument> {
  /** Valeur initiale du formulaire */
  value?: Partial<T>;
  /** Callback appelé lors du changement de valeur */
  onChange: (value: Partial<T>) => void;
  /** Indique si le formulaire est en mode édition */
  isEditing?: boolean;
  /** Indique si le formulaire est en cours de chargement */
  isLoading?: boolean;
}

/**
 * Type du composant de formulaire à injecter.
 */
export type ResourceFormComponent<T extends BaseDocument> = ComponentType<ResourceFormProps<T>>;

/**
 * Filtre rapide pour filtrer la liste côté client.
 */
export interface QuickFilter<T extends BaseDocument> {
  /** Identifiant unique du filtre */
  id: string;
  /** Label affiché sur le bouton */
  label: string;
  /** Fonction de filtrage */
  filterFn: (item: T) => boolean;
}
