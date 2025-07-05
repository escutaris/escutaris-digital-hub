import React, { useState, useEffect, useRef } from 'react';
import { Material } from '@/lib/types/material';
import { fetchMaterials } from '@/lib/api/materials';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import MaterialCard from './MaterialCard';
import { Loader, FileText, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

interface MaterialsSectionProps {
  sectionId: string;
  title: string;
  icon: React.ReactNode;
  category: string;
}

const MaterialsSection: React.FC<MaterialsSectionProps> = ({ sectionId, title, icon, category }) => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 9;
  
  const { data: materials, isLoading, error } = useQuery({
    queryKey: ['materials', search],
    queryFn: () => fetchMaterials(search, ''),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Erro ao carregar materiais',
        description: 'Não foi possível carregar os materiais. Tente novamente.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const filteredMaterials = category && category !== 'todos' 
    ? materials?.filter(m => m.category === category)
    : materials;

  // Paginação
  const totalPages = filteredMaterials ? Math.ceil(filteredMaterials.length / itemsPerPage) : 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMaterials = filteredMaterials?.slice(startIndex, startIndex + itemsPerPage);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSearch: () => {
      searchInputRef.current?.focus();
    }
  });

  const renderCard = (material: Material) => {
    return <MaterialCard key={material.id} material={material} />;
  };

  return (
    <section className="section-padding" id={sectionId}>
      <h2 className="text-escutaris-green text-3xl md:text-4xl font-bold mb-6 animate-slide-in flex items-center gap-2">
        {icon} {title}
      </h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder="Pesquisar materiais... (Ctrl+K)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>Todos os materiais técnicos e ferramentas</span>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-escutaris-green" />
        </div>
      ) : paginatedMaterials && paginatedMaterials.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedMaterials.map(renderCard)}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Nenhum material encontrado com os filtros atuais.
          </p>
          <button 
            onClick={() => setSearch('')}
            className="mt-4 text-escutaris-green hover:underline"
          >
            Limpar busca
          </button>
        </div>
      )}
    </section>
  );
};

export default MaterialsSection;
