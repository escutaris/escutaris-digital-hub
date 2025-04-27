
import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Material } from '@/lib/types/material';

interface MaterialCardProps {
  material: Material;
}

const MaterialCard = ({ material }: MaterialCardProps) => {
  return (
    <div className="glass-card p-6 flex flex-col items-start gap-4 animate-fade-in transition-all hover:shadow-xl hover:scale-105 duration-300">
      <div className="flex justify-between items-start w-full">
        <FileText className="text-escutaris-green mb-2 h-6 w-6" />
        {material.is_new && (
          <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
            Novo
          </span>
        )}
      </div>
      <h3 className="text-escutaris-green text-xl font-semibold animate-slide-in">
        {material.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {material.description}
      </p>
      <a 
        href={material.file_url} 
        target="_blank" 
        rel="noreferrer" 
        className="btn-primary mt-auto flex items-center gap-2 transition-all hover:scale-105 duration-300"
      >
        <Download size={18} /> Baixar Material
      </a>
    </div>
  );
};

export default MaterialCard;
