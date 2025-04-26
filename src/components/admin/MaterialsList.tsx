import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Material } from '@/lib/types/material';
import { fetchMaterials, updateMaterial, deleteMaterial } from '@/lib/api/materials';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  Eye, 
  Loader, 
  Pencil, 
  Search, 
  Trash2,
  FileText,
  BookOpen,
  File,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MaterialsListProps {
  onMaterialChange: () => void;
  refreshTrigger: number;
}

const MaterialsList: React.FC<MaterialsListProps> = ({ onMaterialChange, refreshTrigger }) => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  
  // Load materials
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setLoading(true);
        const data = await fetchMaterials(search, categoryFilter);
        setMaterials(data);
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
  }, [search, categoryFilter, refreshTrigger, toast]);
  
  const handleToggleIsNew = async (material: Material) => {
    try {
      await updateMaterial(material.id, { is_new: !material.is_new });
      
      // Update local state
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
      
      // Update local state
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'material':
        return <FileText className="h-4 w-4 text-escutaris-green" />;
      case 'legislacao':
        return <BookOpen className="h-4 w-4 text-escutaris-terracotta" />;
      case 'ferramenta':
        return <File className="h-4 w-4 text-escutaris-green" />;
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Materiais Cadastrados</CardTitle>
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar materiais..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todas categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas categorias</SelectItem>
              <SelectItem value="material">Material</SelectItem>
              <SelectItem value="legislacao">Legislação</SelectItem>
              <SelectItem value="ferramenta">Ferramenta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader className="h-8 w-8 animate-spin text-escutaris-green" />
          </div>
        ) : materials.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum material encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Novo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(material.category)}
                        <span className="capitalize">
                          {material.category === 'legislacao' ? 'Legislação' : material.category}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(material.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={material.is_new}
                        onCheckedChange={() => handleToggleIsNew(material)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <a href={material.file_url} target="_blank" rel="noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleDeleteClick(material)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o material "{materialToDelete?.title}"? 
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default MaterialsList;
