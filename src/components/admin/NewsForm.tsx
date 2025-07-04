import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { createNews, updateNews } from '@/lib/api/news';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { News, NewsFormData } from '@/lib/types/news';

const newsFormSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  description: z.string().min(1, 'Descrição é obrigatória').max(500, 'Descrição muito longa'),
  content: z.string().optional(),
  slug: z.string()
    .min(1, 'Slug é obrigatório')
    .max(100, 'Slug muito longo')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  is_featured: z.boolean(),
  is_published: z.boolean(),
});

interface NewsFormProps {
  news?: News | null;
  onClose: () => void;
  onSuccess: () => void;
}

const NewsForm: React.FC<NewsFormProps> = ({ news, onClose, onSuccess }) => {
  const { toast } = useToast();
  const isEdit = !!news;

  const form = useForm<NewsFormData>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: news?.title || '',
      description: news?.description || '',
      content: news?.content || '',
      slug: news?.slug || '',
      is_featured: news?.is_featured || false,
      is_published: news?.is_published || true,
    },
  });

  const createMutation = useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      toast({
        title: 'Sucesso',
        description: 'Notícia criada com sucesso.',
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a notícia.',
        variant: 'destructive',
      });
      console.error(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewsFormData> }) => 
      updateNews(id, data),
    onSuccess: () => {
      toast({
        title: 'Sucesso',
        description: 'Notícia atualizada com sucesso.',
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a notícia.',
        variant: 'destructive',
      });
      console.error(error);
    },
  });

  const onSubmit = (data: NewsFormData) => {
    if (isEdit && news) {
      updateMutation.mutate({ id: news.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  const handleTitleChange = (title: string) => {
    form.setValue('title', title);
    if (!isEdit || !news?.slug) {
      const slug = generateSlug(title);
      form.setValue('slug', slug);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
          <ArrowLeft size={18} />
          Voltar
        </Button>
        <h2 className="text-2xl font-bold text-foreground">
          {isEdit ? 'Editar Notícia' : 'Nova Notícia'}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Notícia</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o título da notícia"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleTitleChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (URL amigável)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="slug-da-noticia"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite uma breve descrição da notícia"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo Completo (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite o conteúdo completo da notícia"
                        rows={10}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-6">
                <FormField
                  control={form.control}
                  name="is_published"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Publicar notícia</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Marcar como destaque</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Save size={18} />
                  {isEdit ? 'Atualizar' : 'Criar'} Notícia
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsForm;