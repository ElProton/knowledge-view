import { createContext } from 'react';
import { AuthContextType } from '@/types/auth.types';

const defaultContext: AuthContextType = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  handleCallback: async () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultContext);
