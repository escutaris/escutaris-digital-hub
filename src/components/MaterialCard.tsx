
import React, { useState } from 'react';
import { FileText, Download, Heart } from 'lucide-react';
import { Material } from '@/lib/types/material';
import { MaterialWithStats } from '@/lib/types/favorites';
import { addToFavorites, removeFromFavorites, recordDownload } from '@/lib/api/favorites';
import { useToast } from '@/hooks/use-toast';

interface MaterialCardProps {
  material: Material | MaterialWithStats;
}

const MaterialCard = ({ material }: MaterialCardProps) => {
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
          description: 'Material removido da sua lista de favoritos.',
        });
      } else {
        await addToFavorites(material.id);
        setIsFavorited(true);
        toast({
          title: 'Adicionado aos favoritos',
          description: 'Material salvo na sua lista de favoritos.',
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
    <div className="glass-card overflow-hidden animate-fade-in transition-all hover:shadow-xl hover:scale-105 duration-300 group">
      <div className="relative aspect-video bg-gradient-to-br from-escutaris-green-light/20 to-escutaris-terracotta-light/20 flex items-center justify-center">
        <FileText className="h-16 w-16 text-escutaris-green/40" />
        {material.is_new && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full animate-pulse">
            NOVO
          </div>
        )}
        <button
          onClick={handleFavoriteToggle}
          disabled={isLoading}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all ${
            isFavorited 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start w-full mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <FileText className="text-primary h-5 w-5" />
            </div>
            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              PDF
            </div>
          </div>
        </div>
        
        <div className="w-full mb-4">
          <h3 className="text-foreground text-xl font-semibold mb-2 line-clamp-2">
            {material.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm line-clamp-3">
            {material.description}
          </p>
        </div>
        
        <div className="flex justify-between items-center w-full pt-4 border-t border-border/50">
          <a 
            href={material.file_url} 
            target="_blank" 
            rel="noreferrer" 
            onClick={handleDownload}
            className="btn-primary flex items-center gap-2 transition-all hover:scale-105 duration-300 text-sm"
          >
            <Download size={16} /> Baixar Material
          </a>
          {'download_count' in material && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Download size={12} />
              {material.download_count}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;
