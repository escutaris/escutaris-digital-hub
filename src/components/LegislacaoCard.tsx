
import React, { useState } from 'react';
import { BookOpen, ArrowDown, Heart } from 'lucide-react';
import { Material } from '@/lib/types/material';
import { MaterialWithStats } from '@/lib/types/favorites';
import { addToFavorites, removeFromFavorites, recordDownload } from '@/lib/api/favorites';
import { useToast } from '@/hooks/use-toast';
import LazyImage from './LazyImage';

interface LegislacaoCardProps {
  material: Material | MaterialWithStats;
}

const LegislacaoCard = ({ material }: LegislacaoCardProps) => {
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(
    'is_favorited' in material ? material.is_favorited : false
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteToggle = async () => {
    setIsLoading(true);
    try {
      if (isFavorited) {
        await removeFromFavorites(material.id);
        setIsFavorited(false);
        toast({
          title: 'Removido dos favoritos',
          description: 'Legislação removida da sua lista de favoritos.',
        });
      } else {
        await addToFavorites(material.id);
        setIsFavorited(true);
        toast({
          title: 'Adicionado aos favoritos',
          description: 'Legislação salva na sua lista de favoritos.',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao gerenciar favorito',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    recordDownload(material.id);
  };

  return (
    <div className="glass-card p-6 flex flex-col items-start gap-4 animate-fade-in transition-all hover:shadow-xl hover:scale-105 duration-300 group">
      <div className="flex justify-between items-start w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-colors">
            <BookOpen className="text-secondary h-5 w-5" />
          </div>
          <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            LEI
          </div>
        </div>
        <div className="flex items-center gap-2">
          {material.is_new && (
            <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full animate-pulse">
              Novo
            </span>
          )}
          <button
            onClick={handleFavoriteToggle}
            disabled={isLoading}
            className={`p-1 rounded-full transition-colors ${
              isFavorited 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-muted-foreground hover:text-red-500'
            }`}
            aria-label={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      
      <div className="w-full">
        <h3 className="text-foreground text-xl font-semibold mb-2 line-clamp-2">
          {material.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-sm line-clamp-3">
          {material.description}
        </p>
      </div>
      
      <div className="flex justify-between items-center w-full mt-auto pt-4 border-t border-border/50">
        <a 
          href={material.file_url} 
          target="_blank" 
          rel="noreferrer" 
          onClick={handleDownload}
          className="btn-secondary flex items-center gap-2 transition-all hover:scale-105 duration-300 text-sm"
        >
          <ArrowDown size={16} /> Acessar
        </a>
        {'download_count' in material && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <ArrowDown size={12} />
            {material.download_count}
          </span>
        )}
      </div>
    </div>
  );
};

export default LegislacaoCard;
