
export type Material = {
  id: string;
  title: string;
  description: string | null;
  /**
   * O endereço do arquivo NÃO vem mais na listagem pública: o visitante enxerga
   * o card inteiro, menos o link. Quem está logado busca o endereço na hora do
   * clique, por `fetchMaterialLink`. No painel do admin o campo vem preenchido.
   */
  file_url?: string;
  /** Vem do banco (coluna gerada): true quando o material é uma página, não um arquivo. */
  is_web_guide: boolean;
  is_new: boolean;
  created_at: string;
  category: 'material' | 'legislacao' | 'ferramenta';
  cover_url?: string | null;
  is_autoral?: boolean;
};
