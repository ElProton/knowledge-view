import { apiClient } from '../api/apiClient';
import { endpoints } from '../api/endpoints';
import { PromptDocument, KBDocument } from '../../types/document.types';

class PromptService {
  async getPrompts(limit: number = 25, skip: number = 0): Promise<PromptDocument[]> {
    const response = await apiClient.get<any>(endpoints.documents.list, {
      type: 'prompt',
      limit: limit.toString(),
      skip: skip.toString(),
      sort: '-updated_at',
    });

    if (Array.isArray(response)) {
      return response as PromptDocument[];
    } else if (response.items && Array.isArray(response.items)) {
      return response.items as PromptDocument[];
    }

    return [];
  }

  async getPrompt(id: string): Promise<PromptDocument> {
    const response = await apiClient.get<KBDocument>(endpoints.documents.get(id));
    return response as PromptDocument;
  }

  async createPrompt(prompt: Partial<PromptDocument>): Promise<PromptDocument> {
    const response = await apiClient.post<KBDocument>(endpoints.documents.create, {
      ...prompt,
      type: 'prompt',
    });
    return response as PromptDocument;
  }

  async updatePrompt(id: string, data: Partial<PromptDocument>): Promise<PromptDocument> {
    const response = await apiClient.put<KBDocument>(endpoints.documents.update(id), data);
    return response as PromptDocument;
  }

  async checkTitleExists(title: string): Promise<boolean> {
    const response = await apiClient.get<any>(endpoints.documents.list, {
      type: 'prompt',
      q: title,
      limit: '1',
    });

    const items: KBDocument[] = Array.isArray(response)
      ? response
      : (response.items || []);

    return items.some((doc) => doc.title.toLowerCase() === title.toLowerCase());
  }
}

export const promptService = new PromptService();
