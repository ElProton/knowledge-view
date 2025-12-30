export type DocumentStatus = 
  | 'draft' 
  | 'spec_to_validate' 
  | 'validated' 
  | 'rejected' 
  | 'published';

export type DocumentType = 
  | 'specification' 
  | 'knowledge' 
  | 'prompt' 
  | 'prospect';

export interface Document {
  id: string;
  type: DocumentType;
  status: DocumentStatus;
  title: string;
  content: string; // Markdown
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface DocumentFilters {
  status?: DocumentStatus;
  type?: DocumentType;
  page?: number;
  limit?: number;
}

export interface DocumentsResponse {
  documents: Document[];
  total: number;
  page: number;
  limit: number;
}

export interface DocumentUpdatePayload {
  title?: string;
  content?: string;
  status?: DocumentStatus;
  metadata?: Record<string, unknown>;
}
