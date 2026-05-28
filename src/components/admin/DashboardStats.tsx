import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Heart, Newspaper, TrendingUp, Users } from 'lucide-react';
import { Loader } from 'lucide-react';

interface Stats {
  total_materials: number;
  new_materials: number;
  cat_material: number;
  cat_legislacao: number;
  cat_ferramenta: number;
  total_news: number;
  published_news: number;
  total_downloads: number;
  downloads_7d: number;
  total_favorites: number;
  total_leads: number;
}

const fetchStats = async (): Promise<Stats> => {
  const [materials, news, downloads, downloads7d, favorites, leads] = await Promise.all([
    supabase.from('materials').select('category, is_new'),
    supabase.from('news').select('is_published'),
    supabase.from('download_history').select('id', { count: 'exact', head: true }),
    supabase.from('download_history').select('id', { count: 'exact', head: true })
      .gte('downloaded_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from('user_favorites').select('id', { count: 'exact', head: true }),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('marca', 'escutaris'),
  ]);

  const mats = materials.data ?? [];
  const newsItems = news.data ?? [];

  return {
    total_materials: mats.length,
    new_materials: mats.filter(m => m.is_new).length,
    cat_material: mats.filter(m => m.category === 'material').length,
    cat_legislacao: mats.filter(m => m.category === 'legislacao').length,
    cat_ferramenta: mats.filter(m => m.category === 'ferramenta').length,
    total_news: newsItems.length,
    published_news: newsItems.filter(n => n.is_published).length,
    total_downloads: downloads.count ?? 0,
    downloads_7d: downloads7d.count ?? 0,
    total_favorites: favorites.count ?? 0,
    total_leads: leads.count ?? 0,
  };
};

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: string;
}

const StatCard = ({ title, value, subtitle, icon, color = 'text-escutaris-green' }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className={color}>{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-escutaris-green">{value}</div>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </CardContent>
  </Card>
);

const DashboardStats = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchStats,
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-escutaris-green" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Não foi possível carregar as estatísticas.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-escutaris-green">Visão Geral</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard
          title="Materiais"
          value={stats.total_materials}
          subtitle={`${stats.new_materials} marcados como novos`}
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          title="Notícias"
          value={stats.total_news}
          subtitle={`${stats.published_news} publicadas`}
          icon={<Newspaper className="h-5 w-5" />}
        />
        <StatCard
          title="Downloads"
          value={stats.total_downloads}
          subtitle={`${stats.downloads_7d} nos últimos 7 dias`}
          icon={<Download className="h-5 w-5" />}
          color="text-escutaris-terracotta"
        />
        <StatCard
          title="Favoritos"
          value={stats.total_favorites}
          icon={<Heart className="h-5 w-5" />}
          color="text-escutaris-terracotta"
        />
        <StatCard
          title="Leads"
          value={stats.total_leads}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Legislação"
          value={stats.cat_legislacao}
          subtitle="documentos legislativos"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          title="Ferramentas"
          value={stats.cat_ferramenta}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          title="Materiais Técnicos"
          value={stats.cat_material}
          icon={<FileText className="h-5 w-5" />}
        />
      </div>
    </div>
  );
};

export default DashboardStats;
