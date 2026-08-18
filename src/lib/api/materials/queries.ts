
import { supabase } from "@/integrations/supabase/client";
import type { Material } from "../../types/material";
import type { MaterialWithStats } from "../../types/favorites";
import { sanitizeText } from "../../security";

/**
 * Colunas que qualquer visitante pode ler. O `file_url` ficou de fora de
 * propósito: o endereço do arquivo só é entregue a quem tem conta, na hora do
 * clique (ver `fetchMaterialLink`). O banco também revoga essa coluna para o
 * visitante, então pedir '*' aqui daria erro de permissão.
 */
const COLUNAS_PUBLICAS =
  'id, created_at, title, description, category, is_new, cover_url, is_autoral, is_web_guide';

export const fetchMaterials = async (
  search: string = '',
  category: string = ''
): Promise<Material[]> => {
  let query = supabase.from('materials')
    .select(COLUNAS_PUBLICAS)
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
      ${COLUNAS_PUBLICAS},
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

/**
 * Versão do admin: traz o endereço do arquivo, necessário para editar e para
 * apagar o arquivo no storage. Só funciona com sessão de administradora.
 */
export const fetchMaterialsAdmin = async (): Promise<Material[]> => {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching materials (admin):', error);
    return [];
  }

  return data as Material[];
};

/**
 * Entrega o endereço do arquivo de UM material. Depende de sessão: para o
 * visitante o banco recusa a coluna, e é isso que sustenta a exigência de conta.
 */
export const fetchMaterialLink = async (materialId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('materials')
    .select('file_url')
    .eq('id', materialId)
    .maybeSingle();

  if (error || !data) {
    console.error('Erro ao buscar o endereço do material:', error);
    return null;
  }

  return (data as { file_url: string }).file_url;
};

/**
 * Guarda o clique de quem esbarrou na exigência de conta. É o número que diz se
 * o cadastro obrigatório está convertendo ou espantando.
 */
export const registrarBloqueio = async (materialId: string): Promise<void> => {
  const { error } = await supabase.from('download_blocks').insert({ material_id: materialId });
  if (error) console.error('Erro ao registrar o bloqueio:', error);
};
