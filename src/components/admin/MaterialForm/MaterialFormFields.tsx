
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface MaterialFormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  category: 'material' | 'legislacao' | 'ferramenta';
  setCategory: (value: 'material' | 'legislacao' | 'ferramenta') => void;
  isNew: boolean;
  setIsNew: (value: boolean) => void;
  isAutoral: boolean;
  setIsAutoral: (value: boolean) => void;
}

const MaterialFormFields: React.FC<MaterialFormFieldsProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  isNew,
  setIsNew,
  isAutoral,
  setIsAutoral,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nome do material"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Breve descrição sobre o material"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select 
          value={category} 
          onValueChange={(value) => setCategory(value as 'material' | 'legislacao' | 'ferramenta')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="material">Material</SelectItem>
            <SelectItem value="legislacao">Legislação</SelectItem>
            <SelectItem value="ferramenta">Ferramenta</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="is-new"
          checked={isNew}
          onCheckedChange={setIsNew}
        />
        <Label htmlFor="is-new">Marcar como "Novo"</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is-autoral"
          checked={isAutoral}
          onCheckedChange={setIsAutoral}
        />
        <Label htmlFor="is-autoral">Material autoral da Escutaris (aparece na seção "Materiais Escutaris")</Label>
      </div>
    </>
  );
};

export default MaterialFormFields;
