/**
 * @deprecated Ce service est maintenu pour compatibilité mais devrait être remplacé par useResource.
 * Utilisez plutôt le hook générique useResource avec une config appropriée.
 * 
 * @example
 * const { items, fetchAll, create } = useResource(promptsConfig);
 */
import { apiClient } from '../api/apiClient';
import { endpoints } from '../api/endpoints';
import { PromptDocument, KBDocument, DocumentType } from '../../types/document.types';
import { ApiListResponse, normalizeApiListResponse } from '../../types/api.types';

class PromptService {
  async getPrompts(limit: number = 25, skip: number = 0): Promise<PromptDocument[]> {
    const response = await apiClient.get<ApiListResponse<PromptDocument>>(endpoints.documents.list, {
      type: DocumentType.PROMPT,
      limit: limit.toString(),
      skip: skip.toString(),
      sort: '-updated_at',
    });

    const normalized = normalizeApiListResponse(response);
    return normalized.items;
  }

  async getPrompt(id: string): Promise<PromptDocument> {
    const response = await apiClient.get<KBDocument>(endpoints.documents.get(id));
    return response as PromptDocument;
  }

  async createPrompt(prompt: Partial<PromptDocument>): Promise<PromptDocument> {
    const response = await apiClient.post<KBDocument>(endpoints.documents.create, {
      ...prompt,
      type: DocumentType.PROMPT,
    });
    return response as PromptDocument;
  }

  async updatePrompt(id: string, data: Partial<PromptDocument>): Promise<PromptDocument> {
    const response = await apiClient.put<KBDocument>(endpoints.documents.update(id), data);
    return response as PromptDocument;
  }

  async checkTitleExists(title: string): Promise<boolean> {
    const response = await apiClient.get<ApiListResponse<KBDocument>>(endpoints.documents.list, {
      type: DocumentType.PROMPT,
      q: title,
      limit: '1',
    });

    const normalized = normalizeApiListResponse(response);

    return normalized.items.some((doc) => doc.title?.toLowerCase() === title.toLowerCase());
  }
}

export const promptService = new PromptService();
