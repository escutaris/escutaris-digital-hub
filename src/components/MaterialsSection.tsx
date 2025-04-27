
import React, { useState, useEffect } from 'react';
import { Material, fetchMaterials } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import MaterialCard from './MaterialCard';
import LegislacaoCard from './LegislacaoCard';
import FerramentaCard from './FerramentaCard';
import { Loader, FileText, BookOpen, File, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface MaterialsSectionProps {
  sectionId: string;
  title: string;
  icon: React.ReactNode;
  category: string;
}

const MaterialsSection: React.FC<MaterialsSectionProps> = ({ sectionId, title, icon, category }) => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('todos');
  
  // Fetch materials using React Query
  const { data: materials, isLoading, error } = useQuery({
    queryKey: ['materials', search, activeFilter === 'todos' ? '' : activeFilter],
    queryFn: () => fetchMaterials(search, activeFilter === 'todos' ? '' : activeFilter),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Show toast on error
  useEffect(() => {
    if (error) {
      toast({
        title: 'Erro ao carregar materiais',
        description: 'Não foi possível carregar os materiais. Tente novamente.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Filter materials by category if a specific category is provided
  const filteredMaterials = category && category !== 'todos' 
    ? materials?.filter(m => m.category === category)
    : materials;

  const renderCard = (material: Material) => {
    switch (material.category) {
      case 'material':
        return <MaterialCard key={material.id} material={material} />;
      case 'legislacao':
        return <LegislacaoCard key={material.id} material={material} />;
      case 'ferramenta':
        return <FerramentaCard key={material.id} material={material} />;
      default:
        return <MaterialCard key={material.id} material={material} />;
    }
  };

  return (
    <section className="section-padding" id={sectionId}>
      <h2 className="text-escutaris-green text-3xl md:text-4xl font-bold mb-6 animate-slide-in flex items-center gap-2">
        {icon} {title}
      </h2>
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Pesquisar materiais..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <ToggleGroup type="single" value={activeFilter} onValueChange={val => val && setActiveFilter(val)}>
          <ToggleGroupItem value="todos" aria-label="Todos os materiais">
            Todos
          </ToggleGroupItem>
          <ToggleGroupItem value="material" aria-label="Apenas materiais">
            <FileText className="h-4 w-4 mr-2" /> Materiais
          </ToggleGroupItem>
          <ToggleGroupItem value="legislacao" aria-label="Apenas legislações">
            <BookOpen className="h-4 w-4 mr-2" /> Legislações
          </ToggleGroupItem>
          <ToggleGroupItem value="ferramenta" aria-label="Apenas ferramentas">
            <File className="h-4 w-4 mr-2" /> Ferramentas
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-escutaris-green" />
        </div>
      ) : filteredMaterials && filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMaterials.map(renderCard)}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Nenhum material encontrado com os filtros atuais.
          </p>
          <button 
            onClick={() => { 
              setSearch(''); 
              setActiveFilter('todos'); 
            }}
            className="mt-4 text-escutaris-green hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </section>
  );
};

export default MaterialsSection;
