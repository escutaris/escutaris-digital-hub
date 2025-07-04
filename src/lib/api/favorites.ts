import { supabase } from '@/integrations/supabase/client';
import { UserFavorite, DownloadHistory } from '../types/favorites';

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