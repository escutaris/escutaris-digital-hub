export type News = {
  id: string;
  title: string;
  description: string;
  content: string | null;
  slug: string;
  is_featured: boolean;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  source_name?: string | null;
  source_url?: string | null;
};

export type NewsFormData = {
  title: string;
  description: string;
  content?: string;
  slug: string;
  is_featured: boolean;
  is_published: boolean;
};