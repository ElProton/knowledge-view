export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const OAUTH2_CONFIG = {
  clientId: import.meta.env.VITE_OAUTH2_CLIENT_ID || '',
  redirectUri: import.meta.env.VITE_OAUTH2_REDIRECT_URI || 'http://localhost:3000/callback',
  authUrl: import.meta.env.VITE_OAUTH2_AUTH_URL || '',
  tokenUrl: import.meta.env.VITE_OAUTH2_TOKEN_URL || '',
  scope: 'read write',
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'kb_access_token',
  REFRESH_TOKEN: 'kb_refresh_token',
  USER: 'kb_user',
} as const;

export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_ERROR: 500,
} as const;
