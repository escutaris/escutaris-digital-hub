
import React, { useState, useEffect } from 'react';
import { uploadMaterial } from '@/lib/api/materials';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MaterialFormFields from './MaterialFormFields';
import FileUploadSection from './FileUploadSection';
import PdfPreview from './PdfPreview';

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
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  // Cleanup da URL do preview quando o componente desmontar
  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  const generatePdfPreview = (file: File) => {
    if (file.type === 'application/pdf') {
      // Limpar preview anterior se existir
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
      
      // Criar nova URL do blob para preview
      const previewUrl = URL.createObjectURL(file);
      setPdfPreviewUrl(previewUrl);
    } else {
      setPdfPreviewUrl(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      generatePdfPreview(selectedFile);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('material');
    setIsNew(false);
    setFile(null);
    
    // Limpar preview
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
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
      
      resetForm();
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
          <MaterialFormFields
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            category={category}
            setCategory={setCategory}
            isNew={isNew}
            setIsNew={setIsNew}
          />
          
          <FileUploadSection
            file={file}
            onFileChange={handleFileChange}
          />
          
          <PdfPreview pdfPreviewUrl={pdfPreviewUrl} />
          
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
