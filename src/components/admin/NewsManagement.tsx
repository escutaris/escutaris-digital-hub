import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllNews, deleteNews } from '@/lib/api/news';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import NewsForm from './NewsForm';
import DeleteNewsDialog from './DeleteNewsDialog';
import { News } from '@/lib/types/news';

const NewsManagement = () => {
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [newsToDelete, setNewsToDelete] = useState<News | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: news, isLoading } = useQuery({
    queryKey: ['all-news'],
    queryFn: fetchAllNews,
  });

  const deleteNewsMutation = useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      toast({
        title: 'Sucesso',
        description: 'Notícia excluída com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['all-news'] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
      setNewsToDelete(null);
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a notícia.',
        variant: 'destructive',
      });
      console.error(error);
    },
  });

  const handleEdit = (news: News) => {
    setSelectedNews(news);
    setShowForm(true);
  };

  const handleDelete = (news: News) => {
    setNewsToDelete(news);
  };

  const handleNewNews = () => {
    setSelectedNews(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedNews(null);
  };

  if (showForm) {
    return (
      <NewsForm
        news={selectedNews}
        onClose={handleFormClose}
        onSuccess={() => {
          handleFormClose();
          queryClient.invalidateQueries({ queryKey: ['all-news'] });
          queryClient.invalidateQueries({ queryKey: ['news'] });
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Gerenciamento de Notícias</h2>
        <Button onClick={handleNewNews} className="flex items-center gap-2">
          <Plus size={18} />
          Nova Notícia
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Carregando notícias...</p>
        </div>
      ) : !news || news.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma notícia encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item) => (
            <Card key={item.id} className="animate-fade-in">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                  <div className="flex gap-2 ml-2">
                    {item.is_published ? (
                      <Badge variant="default" className="flex items-center gap-1">
                        <Eye size={12} /> Publicado
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <EyeOff size={12} /> Rascunho
                      </Badge>
                    )}
                    {item.is_featured && (
                      <Badge variant="outline">Destaque</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {item.description}
                </p>
                <div className="text-xs text-muted-foreground mb-4">
                  Criado em: {format(new Date(item.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                  {item.is_published && (
                    <span className="ml-2">
                      • Publicado em: {format(new Date(item.published_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="flex items-center gap-1"
                  >
                    <Edit size={14} />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DeleteNewsDialog
        news={newsToDelete}
        onClose={() => setNewsToDelete(null)}
        onConfirm={() => {
          if (newsToDelete) {
            deleteNewsMutation.mutate(newsToDelete.id);
          }
        }}
      />
    </div>
  );
};

export default NewsManagement;