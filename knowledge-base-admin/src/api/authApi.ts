import { OAUTH2_CONFIG } from '@/config/constants';
import { OAuth2TokenResponse, User } from '@/types/auth.types';

export const authApi = {
  getAuthorizationUrl: (): string => {
    const params = new URLSearchParams({
      client_id: OAUTH2_CONFIG.clientId,
      redirect_uri: OAUTH2_CONFIG.redirectUri,
      response_type: 'code',
      scope: OAUTH2_CONFIG.scope,
    });
    return `${OAUTH2_CONFIG.authUrl}?${params.toString()}`;
  },

  exchangeCodeForToken: async (code: string): Promise<OAuth2TokenResponse> => {
    const response = await fetch(OAUTH2_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: OAUTH2_CONFIG.clientId,
        redirect_uri: OAUTH2_CONFIG.redirectUri,
        code,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    return response.json();
  },

  refreshToken: async (refreshToken: string): Promise<OAuth2TokenResponse> => {
    const response = await fetch(OAUTH2_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: OAUTH2_CONFIG.clientId,
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    return response.json();
  },

  getCurrentUser: async (accessToken: string): Promise<User> => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get current user');
    }

    return response.json();
  },
};
