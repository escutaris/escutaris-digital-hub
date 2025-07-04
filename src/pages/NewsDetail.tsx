import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchNewsBySlug } from '@/lib/api/news';
import { Calendar, ArrowLeft, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useToast } from '@/hooks/use-toast';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news', slug],
    queryFn: () => fetchNewsBySlug(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  React.useEffect(() => {
    if (error) {
      toast({
        title: 'Erro ao carregar notícia',
        description: 'Não foi possível carregar a notícia. Tente novamente.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <WhatsAppButton />
        <div className="max-w-7xl w-full mx-auto px-4">
          <Header />
          <div className="flex justify-center py-20">
            <Loader className="h-12 w-12 animate-spin text-secondary" />
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <WhatsAppButton />
        <div className="max-w-7xl w-full mx-auto px-4">
          <Header />
          <div className="section-padding text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Notícia não encontrada
            </h1>
            <p className="text-muted-foreground mb-8">
              A notícia que você está procurando não existe ou foi removida.
            </p>
            <Link 
              to="/" 
              className="btn-primary inline-flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Voltar ao início
            </Link>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <WhatsAppButton />
      <div className="max-w-7xl w-full mx-auto px-4">
        <Header />
        
        <article className="section-padding max-w-4xl mx-auto">
          <Breadcrumbs items={[
            { label: 'Início', href: '/' },
            { label: 'Notícias', href: '/#noticias' },
            { label: news.title }
          ]} />

          <div className="glass-card p-8 animate-fade-in">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
              <Calendar size={16} />
              <span>
                {format(new Date(news.published_at), 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
              </span>
              {news.is_featured && (
                <>
                  <span>•</span>
                  <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                    Destaque
                  </span>
                </>
              )}
            </div>

            <h1 className="text-secondary text-3xl md:text-4xl font-bold mb-4 animate-slide-in">
              {news.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {news.description}
            </p>

            {news.content && (
              <div className="prose prose-lg max-w-none text-foreground">
                {news.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </article>

        <Footer />
      </div>
    </div>
  );
};

export default NewsDetail;