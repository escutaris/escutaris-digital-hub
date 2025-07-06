
import React from 'react';
import { Label } from '@/components/ui/label';

interface PdfPreviewProps {
  pdfPreviewUrl: string | null;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({ pdfPreviewUrl }) => {
  if (!pdfPreviewUrl) return null;

  return (
    <div className="space-y-2">
      <Label>Preview do Documento</Label>
      <div className="border rounded-lg overflow-hidden bg-muted">
        <iframe
          src={pdfPreviewUrl}
          className="w-full h-96"
          title="Preview do PDF"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        ✅ PDF carregado com sucesso - visualize o conteúdo acima
      </p>
    </div>
  );
};

export default PdfPreview;
