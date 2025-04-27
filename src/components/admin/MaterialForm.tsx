import React, { useState } from 'react';
import { Material } from '@/lib/types/material';
import { uploadMaterial } from '@/lib/api/materials';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
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
import { Loader, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MaterialFormProps {
  onMaterialAdded: () => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ onMaterialAdded }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'material' | 'legislacao' | 'ferramenta'>('material');
  const [isNew, setIsNew] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: 'Arquivo obrigatório',
        description: 'Por favor, selecione um arquivo para upload',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      await uploadMaterial(file, {
        title,
        description,
        category,
        is_new: isNew,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('material');
      setIsNew(false);
      setFile(null);
      
      // Notify parent component
      onMaterialAdded();
      
      toast({
        title: 'Material adicionado com sucesso',
        description: 'O material foi adicionado à Central Escutaris.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao adicionar material',
        description: error.message || 'Ocorreu um erro ao fazer o upload do material.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Novo Material</CardTitle>
        <CardDescription>
          Preencha o formulário para adicionar um novo material à Central Escutaris
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
          
          <div className="space-y-2">
            <Label htmlFor="file">Arquivo</Label>
            <div className="flex items-center gap-4">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                required
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-escutaris-green-light file:text-escutaris-green hover:file:bg-escutaris-green-light/80"
              />
              {file && (
                <p className="text-sm text-muted-foreground">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Adicionar Material
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MaterialForm;
