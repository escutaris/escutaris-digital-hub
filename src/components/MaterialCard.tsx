
import React from 'react';
import { FileText, Download } from 'lucide-react';

interface MaterialCardProps {
  title: string;
  description: string;
  downloadUrl: string;
  isNew?: boolean;
}

const MaterialCard = ({ title, description, downloadUrl, isNew = false }: MaterialCardProps) => {
  return (
    <div className="glass-card p-6 flex flex-col items-start gap-4 animate-fade-in transition-all hover:shadow-xl hover:scale-105 duration-300">
      <div className="flex justify-between items-start w-full">
        <FileText className="text-escutaris-green mb-2 h-6 w-6" />
        {isNew && <span className="tag-new">Novo</span>}
      </div>
      <h3 className="text-escutaris-green text-xl font-semibold animate-slide-in">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
      <a 
        href={downloadUrl} 
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
