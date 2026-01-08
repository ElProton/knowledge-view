/**
 * @deprecated Ce service est maintenu pour compatibilité mais devrait être remplacé par useResource.
 * Utilisez plutôt le hook générique useResource avec modelsConfig.
 * 
 * @example
 * const { items, fetchAll, create } = useResource(modelsConfig);
 */
import { apiClient } from '../api/apiClient';
import { endpoints } from '../api/endpoints';
import { ModelDocument, KBDocument, DocumentType } from '../../types/document.types';
import { ApiListResponse, normalizeApiListResponse } from '../../types/api.types';

class ModelService {
  async getModels(limit: number = 25, skip: number = 0): Promise<ModelDocument[]> {
    const response = await apiClient.get<ApiListResponse<ModelDocument>>(endpoints.documents.list, {
      type: DocumentType.MODEL,
      limit: limit.toString(),
      skip: skip.toString(),
      sort: '-updated_at',
    });

    const normalized = normalizeApiListResponse(response);
    return normalized.items;
  }

  async getModel(id: string): Promise<ModelDocument> {
    const response = await apiClient.get<KBDocument>(endpoints.documents.get(id));
    return response as ModelDocument;
  }

  async createModel(model: Partial<ModelDocument>): Promise<ModelDocument> {
    const response = await apiClient.post<KBDocument>(endpoints.documents.create, {
      ...model,
      type: DocumentType.MODEL,
    });
    return response as ModelDocument;
  }

  async updateModel(id: string, data: Partial<ModelDocument>): Promise<ModelDocument> {
    const response = await apiClient.put<KBDocument>(endpoints.documents.update(id), data);
    return response as ModelDocument;
  }

  async checkTitleExists(title: string): Promise<boolean> {
    const response = await apiClient.get<ApiListResponse<KBDocument>>(endpoints.documents.list, {
      type: DocumentType.MODEL,
      q: title,
      limit: '1',
    });

    const normalized = normalizeApiListResponse(response);

    return normalized.items.some((doc) => doc.title?.toLowerCase() === title.toLowerCase());
  }
}

export const modelService = new ModelService();
