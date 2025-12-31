// TODO: REFACTOR - Generic Component needed
import { apiClient } from '../api/apiClient';
import { endpoints } from '../api/endpoints';
import { PostDocument, KBDocument } from '../../types/document.types';

const POST_CONTENT_MAX_LENGTH = 2000;

class PostService {
  async getPosts(limit: number = 25, skip: number = 0): Promise<PostDocument[]> {
    const response = await apiClient.get<any>(endpoints.documents.list, {
      type: 'post',
      limit: limit.toString(),
      skip: skip.toString(),
      sort: '-updated_at',
    });

    if (Array.isArray(response)) {
      return response as PostDocument[];
    } else if (response.items && Array.isArray(response.items)) {
      return response.items as PostDocument[];
    }

    return [];
  }

  async getPost(id: string): Promise<PostDocument> {
    const response = await apiClient.get<KBDocument>(endpoints.documents.get(id));
    return response as PostDocument;
  }

  async createPost(post: Partial<PostDocument>): Promise<PostDocument> {
    this.validateContent(post.data?.content);

    const response = await apiClient.post<KBDocument>(endpoints.documents.create, {
      ...post,
      type: 'post',
    });
    return response as PostDocument;
  }

  async updatePost(id: string, data: Partial<PostDocument>): Promise<PostDocument> {
    this.validateContent(data.data?.content);

    const response = await apiClient.put<KBDocument>(endpoints.documents.update(id), data);
    return response as PostDocument;
  }

  async checkTitleExists(title: string): Promise<boolean> {
    const response = await apiClient.get<any>(endpoints.documents.list, {
      type: 'post',
      q: title,
      limit: '1',
    });

    const items: KBDocument[] = Array.isArray(response)
      ? response
      : (response.items || []);

    return items.some((doc) => doc.title.toLowerCase() === title.toLowerCase());
  }

  private validateContent(content: string | undefined): void {
    if (content && content.length > POST_CONTENT_MAX_LENGTH) {
      throw new Error(`Le contenu ne peut pas dépasser ${POST_CONTENT_MAX_LENGTH} caractères.`);
    }
  }
}

export const postService = new PostService();
