export interface KBDocument {
  id: string;
  title: string;
  type: string;
  theme?: string[];
  tags?: string[];
  data?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  deleted_at?: string;
}

export interface PromptDocument extends KBDocument {
  type: 'prompt';
  data: {
    content: string;
  };
}

export interface DocumentListResponse {
  items: KBDocument[];
  total: number;
  limit: number;
  skip: number;
}
