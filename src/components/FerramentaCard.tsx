
import React from 'react';
import { File, Download } from 'lucide-react';
import { Material } from '@/lib/types/material';

interface FerramentaCardProps {
  material: Material;
}

const FerramentaCard = ({ material }: FerramentaCardProps) => {
  return (
    <div className="glass-card p-6 flex flex-col items-start gap-4 animate-fade-in transition-all hover:shadow-xl hover:scale-105 duration-300">
      <div className="flex justify-between items-start w-full">
        <File className="text-escutaris-green mb-2 h-6 w-6" />
        {material.is_new && <span className="tag-new">Novo</span>}
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
        <Download size={18} /> Baixar Ferramenta
      </a>
    </div>
  );
};

export default FerramentaCard;
