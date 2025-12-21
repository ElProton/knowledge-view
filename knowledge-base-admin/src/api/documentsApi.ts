import { apiClient } from './apiClient';
import { 
  Document, 
  DocumentFilters, 
  DocumentsResponse, 
  DocumentUpdatePayload 
} from '@/types/document.types';

export const documentsApi = {
  getDocuments: async (filters: DocumentFilters = {}): Promise<DocumentsResponse> => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = `/documents${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<DocumentsResponse>(endpoint);
  },

  getDocument: async (id: string): Promise<Document> => {
    return apiClient.get<Document>(`/documents/${id}`);
  },

  updateDocument: async (id: string, payload: DocumentUpdatePayload): Promise<Document> => {
    return apiClient.patch<Document>(`/documents/${id}`, payload);
  },

  validateSpecification: async (id: string): Promise<Document> => {
    return apiClient.patch<Document>(`/documents/${id}`, { status: 'validated' });
  },

  rejectSpecification: async (id: string, reason?: string): Promise<Document> => {
    return apiClient.patch<Document>(`/documents/${id}`, { 
      status: 'rejected',
      metadata: reason ? { rejection_reason: reason } : undefined,
    });
  },
};
