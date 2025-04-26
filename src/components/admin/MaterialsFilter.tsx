
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MaterialsFilterProps {
  search: string;
  categoryFilter: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const MaterialsFilter: React.FC<MaterialsFilterProps> = ({
  search,
  categoryFilter,
  onSearchChange,
  onCategoryChange,
}) => {
  return (
    <div className="flex items-center gap-4 mt-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar materiais..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select
        value={categoryFilter}
        onValueChange={onCategoryChange}
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
  );
};

export default MaterialsFilter;
