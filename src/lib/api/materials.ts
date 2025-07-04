
import { supabase } from "@/integrations/supabase/client";
import type { Material } from "../types/material";
import type { MaterialWithStats } from "../types/favorites";

export const fetchMaterials = async (
  search: string = '',
  category: string = ''
): Promise<Material[]> => {
  let query = supabase.from('materials')
    .select('*')
    .order('is_new', { ascending: false })
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

  if (category && category !== 'todos') {
    query = query.eq('category', category);
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
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

  if (category && category !== 'todos') {
    query = query.eq('category', category);
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
    download_count: material.download_history?.length || 0,
    is_favorited: user ? !!material.user_favorites?.length : false
  })) as MaterialWithStats[];
};

export const uploadMaterial = async (
  file: File, 
  materialData: Omit<Material, 'id' | 'created_at' | 'file_url'>
): Promise<Material> => {
  // 1. Upload file to storage
  const fileExt = file.name.split('.').pop();
  const filePath = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  
  const { error: uploadError, data: fileData } = await supabase.storage
    .from('materials')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw uploadError;
  }

  // 2. Get the public URL
  const { data: publicUrlData } = supabase.storage
    .from('materials')
    .getPublicUrl(filePath);
  
  const file_url = publicUrlData.publicUrl;

  // 3. Insert record into the database
  const { data, error } = await supabase
    .from('materials')
    .insert({
      ...materialData,
      file_url
    })
    .select()
    .single();

  if (error) {
    console.error('Error inserting material:', error);
    // Delete the uploaded file if the database insert fails
    await supabase.storage.from('materials').remove([filePath]);
    throw error;
  }

  return data as Material;
};

export const updateMaterial = async (
  id: string,
  updates: Partial<Omit<Material, 'id' | 'created_at' | 'file_url'>>
): Promise<void> => {
  const { error } = await supabase
    .from('materials')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating material:', error);
    throw error;
  }
};

export const deleteMaterial = async (id: string, filePath: string): Promise<void> => {
  // 1. Delete the database record
  const { error } = await supabase
    .from('materials')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting material:', error);
    throw error;
  }

  // 2. Extract the filename from the full URL
  const fileName = filePath.split('/').pop();
  if (fileName) {
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('materials')
      .remove([fileName]);
    
    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      // We don't throw here because the database record is already deleted
    }
  }
};
