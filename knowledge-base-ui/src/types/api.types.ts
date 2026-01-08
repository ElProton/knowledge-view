export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Type union strict pour les réponses de liste de l'API.
 * L'API peut retourner soit un tableau direct, soit un objet avec items et total.
 */
export type ApiListResponse<T> = T[] | { items: T[]; total: number };

/**
 * Résultat normalisé d'une liste après traitement.
 */
export interface NormalizedListResponse<T> {
  items: T[];
  total: number;
}

/**
 * Type guard pour vérifier si une erreur est une ApiError.
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as ApiError).code === 'string' &&
    typeof (error as ApiError).message === 'string'
  );
}

/**
 * Type guard pour vérifier si la réponse est un objet paginé.
 */
export function isPaginatedResponse<T>(
  response: ApiListResponse<T>
): response is { items: T[]; total: number } {
  return (
    typeof response === 'object' &&
    response !== null &&
    'items' in response &&
    Array.isArray((response as { items: T[] }).items)
  );
}

/**
 * Normalise une réponse de liste API en format cohérent.
 * @param response - Réponse brute de l'API
 * @returns Objet normalisé avec items et total
 */
export function normalizeApiListResponse<T>(
  response: ApiListResponse<T>
): NormalizedListResponse<T> {
  if (Array.isArray(response)) {
    return {
      items: response,
      total: response.length
    };
  }

  if (isPaginatedResponse(response)) {
    return {
      items: response.items,
      total: response.total || response.items.length
    };
  }

  // Fallback pour réponse invalide
  return {
    items: [],
    total: 0
  };
}
