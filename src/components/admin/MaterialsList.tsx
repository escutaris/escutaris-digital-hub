
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Material } from '@/lib/types/material';
import { fetchMaterials, updateMaterial, deleteMaterial } from '@/lib/api/materials';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import MaterialsFilter from './MaterialsFilter';
import MaterialsTable from './MaterialsTable';
import MaterialsStats from './MaterialsStats';
import DeleteMaterialDialog from './DeleteMaterialDialog';

interface MaterialsListProps {
  onMaterialChange: () => void;
  refreshTrigger: number;
}

const MaterialsList: React.FC<MaterialsListProps> = ({ 
  onMaterialChange, 
  refreshTrigger 
}) => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setLoading(true);
        const data = await fetchMaterials();
        setMaterials(data);
        setFilteredMaterials(data);
      } catch (error) {
        toast({
          title: 'Erro ao carregar materiais',
          description: 'Não foi possível carregar os materiais. Tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadMaterials();
  }, [refreshTrigger, toast]);

  // Filter materials based on search and category
  useEffect(() => {
    let filtered = materials;

    if (search) {
      filtered = filtered.filter(material =>
        material.title.toLowerCase().includes(search.toLowerCase()) ||
        (material.description && material.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(material => material.category === categoryFilter);
    }

    setFilteredMaterials(filtered);
  }, [materials, search, categoryFilter]);

  const handleToggleIsNew = async (material: Material) => {
    try {
      await updateMaterial(material.id, { is_new: !material.is_new });
      setMaterials(materials.map(m => 
        m.id === material.id ? { ...m, is_new: !m.is_new } : m
      ));
      
      toast({
        title: 'Material atualizado',
        description: `O material foi ${material.is_new ? 'removido' : 'marcado'} como novo.`,
      });
      
      onMaterialChange();
    } catch (error) {
      toast({
        title: 'Erro ao atualizar material',
        description: 'Não foi possível atualizar o status do material.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteClick = (material: Material) => {
    setMaterialToDelete(material);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!materialToDelete) return;
    
    try {
      await deleteMaterial(materialToDelete.id, materialToDelete.file_url);
      setMaterials(materials.filter(m => m.id !== materialToDelete.id));
      
      toast({
        title: 'Material excluído',
        description: 'O material foi excluído com sucesso.',
      });
      
      onMaterialChange();
    } catch (error) {
      toast({
        title: 'Erro ao excluir material',
        description: 'Não foi possível excluir o material.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setMaterialToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-escutaris-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MaterialsStats materials={materials} />
      
      <Card>
        <CardHeader>
          <CardTitle>Materiais Cadastrados ({filteredMaterials.length})</CardTitle>
          <MaterialsFilter
            search={search}
            categoryFilter={categoryFilter}
            onSearchChange={setSearch}
            onCategoryChange={setCategoryFilter}
          />
        </CardHeader>
        <CardContent>
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {materials.length === 0 
                ? 'Nenhum material cadastrado ainda.' 
                : 'Nenhum material encontrado com os filtros aplicados.'
              }
            </div>
          ) : (
            <div className="overflow-x-auto">
              <MaterialsTable
                materials={filteredMaterials}
                onToggleIsNew={handleToggleIsNew}
                onDeleteClick={handleDeleteClick}
              />
            </div>
          )}
          
          <DeleteMaterialDialog
            material={materialToDelete}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirmDelete={confirmDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialsList;
