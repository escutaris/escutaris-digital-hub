
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
    <div className="glass-card overflow-hidden transition-all hover:shadow-lg duration-300 group">
      <div className="p-4">
        <div className="flex gap-4">
          {/* Icon & Badge Section */}
          <div className="flex-shrink-0 relative">
            <div className="w-12 h-12 bg-gradient-to-br from-escutaris-green/10 to-escutaris-terracotta/10 rounded-lg flex items-center justify-center group-hover:from-escutaris-green/20 group-hover:to-escutaris-terracotta/20 transition-colors">
              <FileText className="h-6 w-6 text-escutaris-green" />
            </div>
            {material.is_new && (
              <div className="absolute -top-1 -right-1 bg-escutaris-terracotta text-white text-xs px-1.5 py-0.5 rounded-full text-[10px] font-medium">
                NOVO
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  PDF
                </span>
                {'download_count' in material && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Download size={10} />
                    {material.download_count}
                  </span>
                )}
              </div>
              <button
                onClick={handleFavoriteToggle}
                disabled={isLoading}
                className={`p-1.5 rounded-full transition-all ${
                  isFavorited 
                    ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-500'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Heart className={`h-3.5 w-3.5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            <h3 className="text-foreground font-semibold mb-1 line-clamp-2 text-sm leading-tight">
              {material.title}
            </h3>
            
            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-3">
              {material.description}
            </p>
            
            <a 
              href={material.file_url} 
              target="_blank" 
              rel="noreferrer" 
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-escutaris-green hover:text-escutaris-green-dark transition-colors"
            >
              <Download size={12} />
              Baixar Material
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;
