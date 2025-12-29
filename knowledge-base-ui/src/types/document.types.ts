export interface KBDocument {
  _id: string;
  title: string;
  content: string;
  type: DocumentType;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export type DocumentType = 'specification' | 'knowledge' | 'prompt' | 'prospect' | 'other';

export type DocumentStatus =
  | 'draft'
  | 'spec_to_validate'
  | 'validated'
  | 'rejected'
  | 'archived';
