import { apiClient } from '../api/apiClient';
import { endpoints } from '../api/endpoints';
import { ModelDocument, KBDocument } from '../../types/document.types';

class ModelService {
  async getModels(limit: number = 25, skip: number = 0): Promise<ModelDocument[]> {
    const response = await apiClient.get<any>(endpoints.documents.list, {
      type: 'model',
      limit: limit.toString(),
      skip: skip.toString(),
      sort: '-updated_at',
    });

    if (Array.isArray(response)) {
      return response as ModelDocument[];
    } else if (response.items && Array.isArray(response.items)) {
      return response.items as ModelDocument[];
    }

    return [];
  }

  async getModel(id: string): Promise<ModelDocument> {
    const response = await apiClient.get<KBDocument>(endpoints.documents.get(id));
    return response as ModelDocument;
  }

  async createModel(model: Partial<ModelDocument>): Promise<ModelDocument> {
    const response = await apiClient.post<KBDocument>(endpoints.documents.create, {
      ...model,
      type: 'model',
    });
    return response as ModelDocument;
  }

  async updateModel(id: string, data: Partial<ModelDocument>): Promise<ModelDocument> {
    const response = await apiClient.put<KBDocument>(endpoints.documents.update(id), data);
    return response as ModelDocument;
  }

  async checkTitleExists(title: string): Promise<boolean> {
    const response = await apiClient.get<any>(endpoints.documents.list, {
      type: 'model',
      q: title,
      limit: '1',
    });

    const items: KBDocument[] = Array.isArray(response)
      ? response
      : (response.items || []);

    return items.some((doc) => doc.title.toLowerCase() === title.toLowerCase());
  }
}

export const modelService = new ModelService();
