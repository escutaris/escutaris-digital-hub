import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Newspaper, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  source_name: string | null;
  source_url: string | null;
}

const fetchLatestNews = async (): Promise<NewsItem[]> => {
  const { data, error } = await (supabase as any)
    .from('news')
    .select('id, title, slug, published_at, source_name, source_url')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Erro ao buscar notícias:', error);
    return [];
  }
  return data || [];
};

const NoticiasSection = () => {
  const { data: noticias, isLoading } = useQuery<NewsItem[]>({
    queryKey: ['latest-news'],
    queryFn: fetchLatestNews,
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading || !noticias || noticias.length === 0) return null;

  return (
    <section className="section-padding" id="noticias">
      <div className="mb-6">
        <p className="font-poppins text-xs tracking-widest uppercase text-escutaris-terracota mb-2">
          Curadoria da comunidade
        </p>
        <h2 className="section-title flex items-center gap-3">
          <Newspaper className="h-6 w-6" /> Últimas notícias
        </h2>
        <p className="font-poppins text-sm text-muted-foreground mt-2 max-w-xl leading-relaxed">
          O que saiu sobre NR-1, riscos psicossociais e saúde mental no trabalho —
          direto das fontes, para você ler se quiser.
        </p>
      </div>

      <div className="bg-white border border-border rounded-lg divide-y divide-border">
        {noticias.map((n) => {
          const externa = !!n.source_url;
          const Linha = (
            <div className="flex items-start justify-between gap-4 px-5 py-4 group">
              <div className="min-w-0">
                <p className="font-poppins text-sm text-foreground leading-snug group-hover:text-escutaris-terracota transition-colors">
                  {n.title}
                </p>
                <p className="font-poppins text-xs text-muted-foreground mt-1">
                  {n.source_name ?? 'Escutaris'}
                  {' · '}
                  {new Date(n.published_at).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </p>
              </div>
              <ExternalLink
                size={14}
                className="text-muted-foreground/40 group-hover:text-escutaris-terracota transition-colors flex-shrink-0 mt-1"
              />
            </div>
          );

          return externa ? (
            <a key={n.id} href={n.source_url!} target="_blank" rel="noopener noreferrer" className="block">
              {Linha}
            </a>
          ) : (
            <Link key={n.id} to={`/noticias/${n.slug}`} className="block">
              {Linha}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default NoticiasSection;
