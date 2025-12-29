import { ApiError } from '../types/api.types';

export const formatErrorMessage = (error: ApiError): string => {
  if (error.code === '401') {
    return 'Session expirée. Veuillez vous reconnecter.';
  }
  if (error.code === '403') {
    return 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
  }
  if (error.code === '404') {
    return 'Ressource non trouvée.';
  }
  if (error.code === '500') {
    return 'Erreur serveur. Veuillez réessayer plus tard.';
  }
  return error.message || 'Une erreur inattendue est survenue.';
};

export const isAuthError = (error: ApiError): boolean => {
  return error.code === '401' || error.code === '403';
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof TypeError && error.message === 'Failed to fetch';
};
