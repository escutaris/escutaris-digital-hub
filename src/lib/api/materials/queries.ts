
import { supabase } from "@/integrations/supabase/client";
import type { Material } from "../../types/material";
import type { MaterialWithStats } from "../../types/favorites";
import { sanitizeText } from "../../security";

/**
 * A vitrine é pública e continua sendo: título, descrição, capa e categoria de
 * todos os materiais aparecem para quem nunca se cadastrou — é o que faz a
 * pessoa querer a conta. O que não vem aqui é o endereço do arquivo, que mora
 * em `material_files` e só é entregue no clique de quem tem sessão.
 */
const COLUNAS_PUBLICAS =
  'id, slug, created_at, title, description, category, is_new, cover_url, is_autoral, is_web_guide';

export const fetchMaterials = async (
  search: string = '',
  category: string = ''
): Promise<Material[]> => {
  // Com sessao, o endereco do arquivo vem junto com a lista. Isso deixa o botao
  // ser um link de verdade: o navegador abre a nova aba sozinho, no gesto do
  // clique. Buscar o endereco DEPOIS do clique obrigava a abrir uma aba em
  // branco e preenche-la em seguida, e era isso que fazia o download acontecer
  // na pagina errada.
  const { data: { session } } = await supabase.auth.getSession();
  const colunas = session
    ? `${COLUNAS_PUBLICAS}, material_files ( file_url )`
    : COLUNAS_PUBLICAS;

  let query = supabase.from('materials')
    .select(colunas)
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

  return (data || []).map((m: any) => ({
    ...m,
    file_url: m.material_files?.file_url ?? undefined,
    material_files: undefined,
  })) as Material[];
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
    slug: material.slug,
    cover_url: material.cover_url,
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
    .select('*, material_files(file_url)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching materials (admin):', error);
    return [];
  }

  return (data || []).map((m: any) => ({
    ...m,
    file_url: m.material_files?.file_url ?? undefined,
    material_files: undefined,
  })) as Material[];
};

/**
 * Entrega o endereço do arquivo de UM material. O endereço mora em
 * `material_files`, tabela que o visitante não enxerga: é isso que sustenta a
 * exigência de conta, sem tocar na vitrine, que segue pública para todos.
 */
export const fetchMaterialLink = async (materialId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('material_files')
    .select('file_url')
    .eq('material_id', materialId)
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

/**
 * Um material só, para a página própria dele (/materiais/<slug>). É o que deixa
 * mandar o link de UM guia no WhatsApp em vez da Comunidade inteira. Mesma regra
 * da lista: o endereço do arquivo só vem para quem tem sessão.
 */
export const fetchMaterialBySlug = async (slug: string): Promise<Material | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  const colunas = session
    ? `${COLUNAS_PUBLICAS}, material_files ( file_url )`
    : COLUNAS_PUBLICAS;

  // a coluna slug ainda não está no types.ts gerado: sem o cast o TS se perde
  const { data, error } = await (supabase.from('materials') as any)
    .select(colunas)
    .eq('slug', sanitizeText(slug))
    .maybeSingle();

  if (error || !data) {
    if (error) console.error('Erro ao buscar o material:', error);
    return null;
  }

  const m = data as any;
  return {
    ...m,
    file_url: m.material_files?.file_url ?? undefined,
    material_files: undefined,
  } as Material;
};
