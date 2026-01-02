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

export interface PostLink {
  label: string;
  url: string;
  id: string | null;
}

export interface PostDocument extends KBDocument {
  type: 'post';
  data: {
    platform: string;
    published_date: string;
    content: string;
    engagement?: {
      views?: number;
      reaction?: number;
      comments?: number;
      shares?: number;
    };
  };
  links?: PostLink[];
}

export interface DocumentListResponse {
  items: KBDocument[];
  total: number;
  limit: number;
  skip: number;
}
