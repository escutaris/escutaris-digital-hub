
import React, { useState } from 'react';
import { File, Download, Heart } from 'lucide-react';
import { Material } from '@/lib/types/material';
import { MaterialWithStats } from '@/lib/types/favorites';
import { addToFavorites, removeFromFavorites, recordDownload } from '@/lib/api/favorites';
import { useToast } from '@/hooks/use-toast';

interface FerramentaCardProps {
  material: Material | MaterialWithStats;
}

const FerramentaCard = ({ material }: FerramentaCardProps) => {
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
          description: 'Ferramenta removida da sua lista de favoritos.',
        });
      } else {
        await addToFavorites(material.id);
        setIsFavorited(true);
        toast({
          title: 'Adicionado aos favoritos',
          description: 'Ferramenta salva na sua lista de favoritos.',
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
    <div className="glass-card p-6 flex flex-col items-start gap-4 animate-fade-in transition-all hover:shadow-xl hover:scale-105 duration-300">
      <div className="flex justify-between items-start w-full">
        <File className="text-escutaris-green mb-2 h-6 w-6" />
        <div className="flex items-center gap-2">
          {material.is_new && (
            <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
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
      <h3 className="text-escutaris-green text-xl font-semibold animate-slide-in">
        {material.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {material.description}
      </p>
      <div className="flex justify-between items-center w-full mt-auto">
        <a 
          href={material.file_url} 
          target="_blank" 
          rel="noreferrer" 
          onClick={handleDownload}
          className="btn-primary flex items-center gap-2 transition-all hover:scale-105 duration-300"
        >
          <Download size={18} /> Baixar Ferramenta
        </a>
        {'download_count' in material && (
          <span className="text-sm text-muted-foreground">
            {material.download_count} downloads
          </span>
        )}
      </div>
    </div>
  );
};

export default FerramentaCard;
