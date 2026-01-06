import { STORAGE_KEYS } from '@/config/constants';

export const tokenStorage = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  setAccessToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  clearTokens: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getUser: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.USER);
  },

  setUser: (user: string): void => {
    localStorage.setItem(STORAGE_KEYS.USER, user);
  },
};
