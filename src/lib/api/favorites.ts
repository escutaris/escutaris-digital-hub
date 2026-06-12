import { supabase } from '@/integrations/supabase/client';
import { UserFavorite, DownloadHistory, MaterialWithStats } from '../types/favorites';

export const addToFavorites = async (materialId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const { error } = await supabase
    .from('user_favorites')
    .insert({ 
      user_id: user.id, 
      material_id: materialId 
    });

  if (error) {
    throw new Error(`Erro ao adicionar aos favoritos: ${error.message}`);
  }
};

export const removeFromFavorites = async (materialId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('material_id', materialId);

  if (error) {
    throw new Error(`Erro ao remover dos favoritos: ${error.message}`);
  }
};

export const getUserFavorites = async (): Promise<UserFavorite[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar favoritos: ${error.message}`);
  }

  return data || [];
};

export const isMaterialFavorited = async (materialId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('material_id', materialId)
    .maybeSingle();

  if (error) {
    console.error('Erro ao verificar favorito:', error);
    return false;
  }

  return !!data;
};

export const recordDownload = async (materialId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const downloadData = {
    material_id: materialId,
    user_id: user?.id || null,
    ip_address: null, // Pode ser obtido do navegador se necessário
    user_agent: navigator.userAgent
  };

  const { error } = await supabase
    .from('download_history')
    .insert(downloadData);

  if (error) {
    console.error('Erro ao registrar download:', error);
    // Não jogamos erro aqui para não interromper o download
  }
};

export const getMaterialDownloadCount = async (materialId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('download_history')
    .select('*', { count: 'exact', head: true })
    .eq('material_id', materialId);

  if (error) {
    console.error('Erro ao buscar contagem de downloads:', error);
    return 0;
  }

  return count || 0;
};

export interface UserDownloadEntry {
  id: string;
  downloaded_at: string;
  title: string;
  file_url: string;
}

export const fetchUserDownloads = async (): Promise<UserDownloadEntry[]> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('download_history')
    .select(`
      id,
      downloaded_at,
      materials:material_id (
        title,
        file_url
      )
    `)
    .eq('user_id', user.id)
    .order('downloaded_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Erro ao buscar histórico de downloads:', error);
    return [];
  }

  return (data || [])
    .filter((d: any) => d.materials)
    .map((d: any) => ({
      id: d.id,
      downloaded_at: d.downloaded_at,
      title: d.materials.title,
      file_url: d.materials.file_url,
    }));
};

export const fetchFavoriteMaterials = async (): Promise<MaterialWithStats[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .select(`
      *,
      materials:material_id (
        id,
        title,
        description,
        file_url,
        category,
        is_new,
        created_at,
        cover_url
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar materiais favoritos: ${error.message}`);
  }

  // Transform data to include material details and stats
  const materialsWithStats = await Promise.all(
    (data || []).map(async (favorite: any) => {
      const material = favorite.materials;
      if (!material) return null;
      
      const downloadCount = await getMaterialDownloadCount(material.id);
      
      return {
        ...material,
        download_count: downloadCount,
        is_favorited: true
      };
    })
  );

  return materialsWithStats.filter(Boolean);
};