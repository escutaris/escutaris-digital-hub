import React, { useState, useEffect } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUserFavorites } from '@/lib/api/favorites';
import { fetchMaterials } from '@/lib/api/materials';
import { Material } from '@/lib/types/material';
import { UserFavorite } from '@/lib/types/favorites';
import MaterialCard from '@/components/MaterialCard';
import LegislacaoCard from '@/components/LegislacaoCard';
import FerramentaCard from '@/components/FerramentaCard';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

const Favorites = () => {
  const { toast } = useToast();
  const [favoriteMaterials, setFavoriteMaterials] = useState<Material[]>([]);

  const { data: favorites, isLoading: favoritesLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: getUserFavorites,
  });

  const { data: allMaterials, isLoading: materialsLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: () => fetchMaterials(),
  });

  useEffect(() => {
    if (favorites && allMaterials) {
      const favoriteIds = favorites.map(f => f.material_id);
      const filtered = allMaterials.filter(material => 
        favoriteIds.includes(material.id)
      );
      setFavoriteMaterials(filtered);
    }
  }, [favorites, allMaterials]);

  const renderCard = (material: Material) => {
    const materialWithFavorite = {
      ...material,
      is_favorited: true,
      download_count: 0
    };

    switch (material.category) {
      case 'material':
        return <MaterialCard key={material.id} material={materialWithFavorite} />;
      case 'legislacao':
        return <LegislacaoCard key={material.id} material={materialWithFavorite} />;
      case 'ferramenta':
        return <FerramentaCard key={material.id} material={materialWithFavorite} />;
      default:
        return <MaterialCard key={material.id} material={materialWithFavorite} />;
    }
  };

  if (favoritesLoading || materialsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-escutaris-green"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-escutaris-green hover:text-escutaris-green/80 transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <Heart className="text-escutaris-green h-8 w-8" />
          <h1 className="text-escutaris-green text-3xl md:text-4xl font-bold">
            Meus Favoritos
          </h1>
        </div>

        {favoriteMaterials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteMaterials.map(renderCard)}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-4">
              Você ainda não tem materiais favoritos.
            </p>
            <p className="text-muted-foreground mb-6">
              Explore os materiais disponíveis e clique no ícone de coração para salvá-los aqui.
            </p>
            <Link 
              to="/#materiais" 
              className="btn-primary inline-flex items-center gap-2"
            >
              Explorar Materiais
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;