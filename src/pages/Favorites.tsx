import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFavoriteMaterials } from '@/lib/api/favorites';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import MaterialCard from '@/components/MaterialCard';
import { MaterialWithStats } from '@/lib/types/favorites';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const Favorites = () => {
  const { data: favoriteMaterials, isLoading } = useQuery<MaterialWithStats[]>({
    queryKey: ['favorite-materials'],
    queryFn: fetchFavoriteMaterials,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const renderCard = (material: MaterialWithStats) => {
    return <MaterialCard key={material.id} material={material} />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl w-full mx-auto px-4 py-8">
          <Breadcrumbs />
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl w-full mx-auto px-4 py-8">
        <Breadcrumbs />
        
        <div className="flex items-center gap-3 mb-8">
          <Heart className="text-primary h-8 w-8" />
          <h1 className="text-primary text-3xl md:text-4xl font-bold">
            Meus Favoritos
          </h1>
        </div>

        {favoriteMaterials && favoriteMaterials.length > 0 ? (
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