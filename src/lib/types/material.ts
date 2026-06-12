
export type Material = {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  is_new: boolean;
  created_at: string;
  category: 'material' | 'legislacao' | 'ferramenta';
  cover_url?: string | null;
};
