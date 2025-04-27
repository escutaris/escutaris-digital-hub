
import React from 'react';
import { BookOpen, ArrowDown } from 'lucide-react';
import { Material } from '@/lib/supabase';

interface LegislacaoCardProps {
  material: Material;
}

const LegislacaoCard = ({ material }: LegislacaoCardProps) => {
  return (
    <div className="glass-card p-6 flex flex-col items-start gap-4 animate-fade-in transition-all hover:shadow-xl hover:scale-105 duration-300">
      <div className="flex justify-between items-start w-full">
        <BookOpen className="text-escutaris-terracotta mb-2 h-6 w-6" />
        {material.is_new && <span className="tag-new">Novo</span>}
      </div>
      <h3 className="text-escutaris-terracotta text-xl font-semibold animate-slide-in">
        {material.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {material.description}
      </p>
      <a 
        href={material.file_url} 
        target="_blank" 
        rel="noreferrer" 
        className="btn-secondary mt-auto flex items-center gap-2 transition-all hover:scale-105 duration-300"
      >
        <ArrowDown size={18} /> Acessar
      </a>
    </div>
  );
};

export default LegislacaoCard;
