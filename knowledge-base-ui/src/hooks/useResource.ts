import { useState, useCallback } from 'react';
import { apiClient } from '../services/api/apiClient';
import { endpoints } from '../services/api/endpoints';
import { BaseDocument, ResourceConfig } from '../types/resource.types';

/**
 * État retourné par le hook useResource.
 */
interface ResourceState<T extends BaseDocument> {
  items: T[];
  currentItem: T | null;
  loading: boolean;
  error: string | null;
  total: number;
}

/**
 * Actions disponibles pour manipuler les ressources.
 */
interface ResourceActions<T extends BaseDocument> {
  fetchAll: (limit?: number, skip?: number) => Promise<void>;
  fetchOne: (id: string) => Promise<void>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<void>;
  checkTitleExists: (title: string, excludeId?: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentItem: () => void;
}

/**
 * Hook générique pour gérer les opérations CRUD sur une ressource.
 * Centralise la logique de fetch, création, mise à jour et suppression.
 * 
 * @param config - Configuration de la ressource
 * @returns État et actions pour manipuler la ressource
 * 
 * @example
 * const { items, loading, error, fetchAll, create } = useResource(postsConfig);
 * 
 * useEffect(() => {
 *   fetchAll();
 * }, []);
 */
export function useResource<T extends BaseDocument>(
  config: ResourceConfig<T>
): ResourceState<T> & ResourceActions<T> {
  const [items, setItems] = useState<T[]>([]);
  const [currentItem, setCurrentItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearCurrentItem = useCallback(() => {
    setCurrentItem(null);
  }, []);

  /**
   * Récupère la liste des éléments avec filtrage par type.
   */
  const fetchAll = useCallback(
    async (limit: number = 25, skip: number = 0) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<any>(endpoints.documents.list, {
          type: config.resourceType,
          limit: limit.toString(),
          skip: skip.toString(),
          sort: '-updated_at',
        });

        let itemsList: T[];
        let totalCount: number;

        if (Array.isArray(response)) {
          itemsList = response as T[];
          totalCount = response.length;
        } else if (response.items && Array.isArray(response.items)) {
          itemsList = response.items as T[];
          totalCount = response.total || response.items.length;
        } else {
          itemsList = [];
          totalCount = 0;
        }

        setItems(itemsList);
        setTotal(totalCount);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors du chargement des données';
        setError(message);
        console.error(`Error fetching ${config.resourceType}:`, err);
      } finally {
        setLoading(false);
      }
    },
    [config.resourceType]
  );

  /**
   * Récupère un seul élément par son ID.
   */
  const fetchOne = useCallback(async (id: string) => {
    if (!id) {
      setError('ID requis pour charger la ressource');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<T>(endpoints.documents.get(id));
      setCurrentItem(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement de la ressource';
      setError(message);
      console.error(`Error fetching ${config.resourceType} ${id}:`, err);
    } finally {
      setLoading(false);
    }
  }, [config.resourceType]);

  /**
   * Crée un nouvel élément.
   * Force le type de ressource dans les données envoyées.
   */
  const create = useCallback(
    async (data: Partial<T>): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const payload = {
          ...data,
          type: config.resourceType,
        };

        const response = await apiClient.post<T>(endpoints.documents.create, payload);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors de la création';
        setError(message);
        console.error(`Error creating ${config.resourceType}:`, err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [config.resourceType]
  );

  /**
   * Met à jour un élément existant.
   */
  const update = useCallback(
    async (id: string, data: Partial<T>): Promise<T> => {
      if (!id) {
        const errorMsg = 'ID requis pour mettre à jour la ressource';
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.put<T>(endpoints.documents.update(id), data);
        
        if (currentItem && currentItem.id === id) {
          setCurrentItem(response);
        }
        
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
        setError(message);
        console.error(`Error updating ${config.resourceType} ${id}:`, err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [config.resourceType, currentItem]
  );

  /**
   * Supprime un élément.
   */
  const remove = useCallback(
    async (id: string): Promise<void> => {
      if (!id) {
        const errorMsg = 'ID requis pour supprimer la ressource';
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      setLoading(true);
      setError(null);

      try {
        await apiClient.delete(endpoints.documents.delete(id));
        
        setItems((prev) => prev.filter((item) => item.id !== id));
        
        if (currentItem && currentItem.id === id) {
          setCurrentItem(null);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
        setError(message);
        console.error(`Error deleting ${config.resourceType} ${id}:`, err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [config.resourceType, currentItem]
  );

  /**
   * Vérifie si un titre existe déjà pour ce type de ressource.
   * Utilisé pour la validation lors de la création.
   */
  const checkTitleExists = useCallback(
    async (title: string, excludeId?: string): Promise<boolean> => {
      if (!title) {
        return false;
      }

      try {
        const response = await apiClient.get<any>(endpoints.documents.list, {
          type: config.resourceType,
          q: title,
          limit: '10',
        });

        const itemsList: T[] = Array.isArray(response)
          ? response
          : (response.items || []);

        const matchingItems = itemsList.filter((doc) => {
          const isSameTitle = doc.title.toLowerCase() === title.toLowerCase();
          const isDifferentId = excludeId ? doc.id !== excludeId : true;
          return isSameTitle && isDifferentId;
        });

        return matchingItems.length > 0;
      } catch (err) {
        console.error('Error checking title existence:', err);
        return false;
      }
    },
    [config.resourceType]
  );

  return {
    items,
    currentItem,
    loading,
    error,
    total,
    fetchAll,
    fetchOne,
    create,
    update,
    remove,
    checkTitleExists,
    clearError,
    clearCurrentItem,
  };
}
