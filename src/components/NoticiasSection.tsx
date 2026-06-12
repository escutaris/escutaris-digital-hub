import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Newspaper, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  slug: string;
  published_at: string;
  source_name: string | null;
}

const fetchLatestNews = async (): Promise<NewsItem[]> => {
  const { data, error } = await (supabase as any)
    .from('news')
    .select('id, title, description, slug, published_at, source_name')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(4);

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
      <div className="mb-8">
        <p className="font-poppins text-xs tracking-widest uppercase text-escutaris-terracota mb-2">
          Curadoria do clube
        </p>
        <h2 className="section-title flex items-center gap-3">
          <Newspaper className="h-6 w-6" /> O que está acontecendo
        </h2>
        <p className="font-poppins text-sm text-muted-foreground mt-2 max-w-xl leading-relaxed">
          Normas, decisões e novidades sobre NR-1, riscos psicossociais e saúde mental
          no trabalho — selecionadas para você não precisar garimpar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {noticias.map((n) => (
          <Link
            key={n.id}
            to={`/noticias/${n.slug}`}
            className="glass-card group p-5 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-3">
              {n.source_name && (
                <span className="font-poppins text-[10px] uppercase tracking-widest text-muted-foreground border border-border px-2 py-0.5 rounded-sm">
                  {n.source_name}
                </span>
              )}
              <span className="font-poppins text-xs text-muted-foreground">
                {new Date(n.published_at).toLocaleDateString('pt-BR', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}
              </span>
            </div>

            <h3 className="font-cormorant text-xl font-semibold text-escutaris-verde leading-snug mb-2 line-clamp-2">
              {n.title}
            </h3>

            <p className="font-poppins text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1 mb-3">
              {n.description}
            </p>

            <span className="inline-flex items-center gap-1.5 text-xs font-poppins font-medium text-escutaris-terracota group-hover:gap-2.5 transition-all">
              Ler mais <ArrowRight size={13} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default NoticiasSection;
