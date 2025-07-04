import { supabase } from '@/integrations/supabase/client';
import { News, NewsFormData } from '@/lib/types/news';

export const fetchNews = async (limit?: number): Promise<News[]> => {
  let query = supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Erro ao buscar notícias: ${error.message}`);
  }

  return data || [];
};

export const fetchNewsBySlug = async (slug: string): Promise<News | null> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    throw new Error(`Erro ao buscar notícia: ${error.message}`);
  }

  return data;
};

export const fetchAllNews = async (): Promise<News[]> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar notícias: ${error.message}`);
  }

  return data || [];
};

export const createNews = async (newsData: NewsFormData): Promise<News> => {
  const { data, error } = await supabase
    .from('news')
    .insert([newsData])
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao criar notícia: ${error.message}`);
  }

  return data;
};

export const updateNews = async (id: string, newsData: Partial<NewsFormData>): Promise<News> => {
  const { data, error } = await supabase
    .from('news')
    .update(newsData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao atualizar notícia: ${error.message}`);
  }

  return data;
};

export const deleteNews = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Erro ao deletar notícia: ${error.message}`);
  }
};