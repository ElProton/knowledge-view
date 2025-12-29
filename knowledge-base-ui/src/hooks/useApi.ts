import { useState, useCallback } from 'react';
import { apiClient } from '../services/api/apiClient';
import { ApiError } from '../types/api.types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (apiCall: () => Promise<T>) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const data = await apiCall();
        setState({ data, loading: false, error: null });
        return data;
      } catch (err) {
        const apiError = err as ApiError;
        setState((prev) => ({ ...prev, loading: false, error: apiError }));
        throw apiError;
      }
    },
    []
  );

  const get = useCallback(
    (endpoint: string, params?: Record<string, string>) =>
      execute(() => apiClient.get<T>(endpoint, params)),
    [execute]
  );

  const post = useCallback(
    (endpoint: string, data: unknown) =>
      execute(() => apiClient.post<T>(endpoint, data)),
    [execute]
  );

  const put = useCallback(
    (endpoint: string, data: unknown) =>
      execute(() => apiClient.put<T>(endpoint, data)),
    [execute]
  );

  const patch = useCallback(
    (endpoint: string, data: unknown) =>
      execute(() => apiClient.patch<T>(endpoint, data)),
    [execute]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    get,
    post,
    put,
    patch,
    reset,
  };
}
