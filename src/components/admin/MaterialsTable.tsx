
import React from 'react';
import { Material } from '@/lib/types/material';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Eye, Trash2, FileText, BookOpen, File } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface MaterialsTableProps {
  materials: Material[];
  onToggleIsNew: (material: Material) => void;
  onDeleteClick: (material: Material) => void;
}

const MaterialsTable: React.FC<MaterialsTableProps> = ({
  materials,
  onToggleIsNew,
  onDeleteClick,
}) => {
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
                onCheckedChange={() => onToggleIsNew(material)}
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
                  onClick={() => onDeleteClick(material)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MaterialsTable;
