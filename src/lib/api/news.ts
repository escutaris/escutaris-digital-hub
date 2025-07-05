import { supabase } from '@/integrations/supabase/client';
import { News, NewsFormData } from '@/lib/types/news';
import { verifyAdmin, sanitizeText, sanitizeHtml, logSecurityEvent } from '../security';

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
  // Verify admin permissions since this includes unpublished news
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    throw new Error('Acesso negado. Apenas administradores podem ver todas as notícias.');
  }

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
  // Verify admin permissions
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    throw new Error('Acesso negado. Apenas administradores podem criar notícias.');
  }

  // Sanitize input data
  const sanitizedData = {
    ...newsData,
    title: sanitizeText(newsData.title),
    description: sanitizeText(newsData.description),
    content: newsData.content ? sanitizeHtml(newsData.content) : null,
    slug: sanitizeText(newsData.slug),
  };

  const { data, error } = await supabase
    .from('news')
    .insert([sanitizedData])
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao criar notícia: ${error.message}`);
  }

  // Log security event
  await logSecurityEvent('INSERT', 'news', data.id, null, data);

  return data;
};

export const updateNews = async (id: string, newsData: Partial<NewsFormData>): Promise<News> => {
  // Verify admin permissions
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    throw new Error('Acesso negado. Apenas administradores podem atualizar notícias.');
  }

  // Sanitize input data
  const sanitizedData: any = {};
  if (newsData.title) sanitizedData.title = sanitizeText(newsData.title);
  if (newsData.description) sanitizedData.description = sanitizeText(newsData.description);
  if (newsData.content !== undefined) {
    sanitizedData.content = newsData.content ? sanitizeHtml(newsData.content) : null;
  }
  if (newsData.slug) sanitizedData.slug = sanitizeText(newsData.slug);
  if (newsData.is_featured !== undefined) sanitizedData.is_featured = newsData.is_featured;
  if (newsData.is_published !== undefined) sanitizedData.is_published = newsData.is_published;

  const { data, error } = await supabase
    .from('news')
    .update(sanitizedData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao atualizar notícia: ${error.message}`);
  }

  // Log security event
  await logSecurityEvent('UPDATE', 'news', id, null, sanitizedData);

  return data;
};

export const deleteNews = async (id: string): Promise<void> => {
  // Verify admin permissions
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    throw new Error('Acesso negado. Apenas administradores podem deletar notícias.');
  }

  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Erro ao deletar notícia: ${error.message}`);
  }

  // Log security event
  await logSecurityEvent('DELETE', 'news', id, null, null);
};