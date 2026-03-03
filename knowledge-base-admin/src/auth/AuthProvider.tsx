import { useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { AuthState, User } from '@/types/auth.types';
import { authApi } from '@/api/authApi';
import { tokenStorage } from '@/utils/tokenStorage';
import { apiClient } from '@/api/apiClient';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const logout = useCallback(() => {
    tokenStorage.clearTokens();
    setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    apiClient.setUnauthorizedHandler(logout);
  }, [logout]);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = tokenStorage.getAccessToken();
      const storedUser = tokenStorage.getUser();

      if (storedToken && storedUser) {
        try {
          const user: User = JSON.parse(storedUser);
          setState({
            user,
            accessToken: storedToken,
            refreshToken: tokenStorage.getRefreshToken(),
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          logout();
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, [logout]);

  const login = useCallback(() => {
    const authUrl = authApi.getAuthorizationUrl();
    window.location.href = authUrl;
  }, []);

  const handleCallback = useCallback(async (code: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const tokenResponse = await authApi.exchangeCodeForToken(code);
      const user = await authApi.getCurrentUser(tokenResponse.access_token);

      tokenStorage.setAccessToken(tokenResponse.access_token);
      tokenStorage.setRefreshToken(tokenResponse.refresh_token);
      tokenStorage.setUser(JSON.stringify(user));

      setState({
        user,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Authentication failed:', error);
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        handleCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
