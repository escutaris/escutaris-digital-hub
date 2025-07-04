import React from 'react';
import { Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchNews } from '@/lib/api/news';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Loader } from 'lucide-react';

const NewsSection = () => {
  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news', 4], // Limit to 4 news for homepage
    queryFn: () => fetchNews(4),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <section className="section-padding" id="noticias">
        <h2 className="text-escutaris-terracotta text-3xl md:text-4xl font-bold mb-8 animate-slide-in flex items-center gap-2">
          <Calendar className="h-7 w-7" /> Atualizações e Notícias
        </h2>
        <div className="flex justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-escutaris-terracotta" />
        </div>
      </section>
    );
  }

  if (error || !news || news.length === 0) {
    return (
      <section className="section-padding" id="noticias">
        <h2 className="text-escutaris-terracotta text-3xl md:text-4xl font-bold mb-8 animate-slide-in flex items-center gap-2">
          <Calendar className="h-7 w-7" /> Atualizações e Notícias
        </h2>
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Nenhuma notícia disponível no momento.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding" id="noticias">
      <h2 className="text-escutaris-terracotta text-3xl md:text-4xl font-bold mb-8 animate-slide-in flex items-center gap-2">
        <Calendar className="h-7 w-7" /> Atualizações e Notícias
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((item) => (
          <div 
            key={item.id} 
            className="glass-card p-6 animate-fade-in transition-all hover:shadow-xl hover:scale-105 duration-300"
          >
            <div className="flex justify-between items-start w-full mb-2">
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Calendar size={14} />
                <span>
                  {format(new Date(item.published_at), 'dd MMM, yyyy', { locale: ptBR })}
                </span>
              </div>
              {item.is_featured && (
                <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                  Destaque
                </span>
              )}
            </div>
            <h3 className="text-escutaris-terracotta text-xl font-semibold mb-2 animate-slide-in">
              {item.title}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {item.description}
            </p>
            <Link 
              to={`/noticias/${item.slug}`}
              className="text-escutaris-terracotta font-semibold hover:underline hover:text-escutaris-terracotta-dark transition-colors"
            >
              Leia mais →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;