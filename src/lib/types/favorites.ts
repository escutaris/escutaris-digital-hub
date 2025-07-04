export type UserFavorite = {
  id: string;
  user_id: string;
  material_id: string;
  created_at: string;
};

export type DownloadHistory = {
  id: string;
  material_id: string;
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  downloaded_at: string;
};

export type MaterialWithStats = {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  is_new: boolean;
  created_at: string;
  category: 'material' | 'legislacao' | 'ferramenta';
  download_count: number;
  is_favorited: boolean;
};