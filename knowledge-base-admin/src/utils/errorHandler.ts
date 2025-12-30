import { ApiError } from '@/types/api.types';
import { HTTP_STATUS } from '@/config/constants';

export const parseApiError = (error: unknown): ApiError => {
  if (error instanceof Response) {
    return {
      code: error.status,
      message: getErrorMessage(error.status),
    };
  }

  if (error instanceof Error) {
    return {
      code: 0,
      message: error.message || 'Une erreur inattendue est survenue',
    };
  }

  return {
    code: 0,
    message: 'Une erreur inconnue est survenue',
  };
};

export const getErrorMessage = (statusCode: number): string => {
  switch (statusCode) {
    case HTTP_STATUS.BAD_REQUEST: 
      return 'Requête invalide. Vérifiez les données envoyées.';
    case HTTP_STATUS.UNAUTHORIZED: 
      return 'Session expirée. Veuillez vous reconnecter.';
    case HTTP_STATUS.FORBIDDEN:
      return 'Accès non autorisé à cette ressource.';
    case HTTP_STATUS.NOT_FOUND:
      return 'Ressource introuvable.';
    case HTTP_STATUS.INTERNAL_ERROR:
      return 'Erreur serveur. Veuillez réessayer plus tard.';
    default:
      return 'Une erreur est survenue.';
  }
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof TypeError && error.message === 'Failed to fetch';
};
