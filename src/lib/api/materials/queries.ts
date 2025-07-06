
import { supabase } from "@/integrations/supabase/client";
import type { Material } from "../../types/material";
import type { MaterialWithStats } from "../../types/favorites";
import { sanitizeText } from "../../security";

export const fetchMaterials = async (
  search: string = '',
  category: string = ''
): Promise<Material[]> => {
  let query = supabase.from('materials')
    .select('*')
    .order('is_new', { ascending: false })
    .order('created_at', { ascending: false });

  if (search) {
    const sanitizedSearch = sanitizeText(search);
    query = query.or(
      `title.ilike.%${sanitizedSearch}%,description.ilike.%${sanitizedSearch}%`
    );
  }

  if (category && category !== 'todos') {
    const sanitizedCategory = sanitizeText(category);
    query = query.eq('category', sanitizedCategory);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching materials:', error);
    return [];
  }

  return data as Material[];
};

export const fetchMaterialsWithStats = async (
  search: string = '',
  category: string = ''
): Promise<MaterialWithStats[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  let query = supabase.from('materials')
    .select(`
      *,
      download_history(count),
      user_favorites!left(id)
    `)
    .order('is_new', { ascending: false })
    .order('created_at', { ascending: false });

  if (search) {
    const sanitizedSearch = sanitizeText(search);
    query = query.or(
      `title.ilike.%${sanitizedSearch}%,description.ilike.%${sanitizedSearch}%`
    );
  }

  if (category && category !== 'todos') {
    const sanitizedCategory = sanitizeText(category);
    query = query.eq('category', sanitizedCategory);
  }

  if (user) {
    query = query.eq('user_favorites.user_id', user.id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching materials with stats:', error);
    return [];
  }

  return (data || []).map((material: any) => ({
    id: material.id,
    title: material.title,
    description: material.description,
    file_url: material.file_url,
    is_new: material.is_new,
    created_at: material.created_at,
    category: material.category,
    download_count: material.download_history?.count || 0,
    is_favorited: user ? !!material.user_favorites?.length : false
  })) as MaterialWithStats[];
};
