
import React from 'react';
import { BookOpen, ArrowDown } from 'lucide-react';

interface LegislacaoCardProps {
  title: string;
  description: string;
  downloadUrl: string;
  isNew?: boolean;
}

const LegislacaoCard = ({ title, description, downloadUrl, isNew = false }: LegislacaoCardProps) => {
  return (
    <div className="glass-card p-6 flex flex-col items-start gap-4 animate-fade-in transition-all hover:shadow-xl">
      <div className="flex justify-between items-start w-full">
        <BookOpen className="text-escutaris-terracotta mb-2 h-6 w-6" />
        {isNew && <span className="tag-new">Novo</span>}
      </div>
      <h3 className="text-escutaris-terracotta text-xl font-semibold animate-slide-in">
        {title}
      </h3>
      <p className="text-muted-foreground">
        {description}
      </p>
      <a 
        href={downloadUrl} 
        target="_blank" 
        rel="noreferrer" 
        className="btn-secondary mt-auto flex items-center gap-2"
      >
        <ArrowDown size={18} /> Acessar
      </a>
    </div>
  );
};

export default LegislacaoCard;
