
import React from 'react';
import { Calendar } from 'lucide-react';

interface NoticiaCardProps {
  title: string;
  description: string;
  date: string;
  url: string;
  isNew?: boolean;
}

const NoticiaCard = ({ title, description, date, url, isNew = false }: NoticiaCardProps) => {
  return (
    <div className="glass-card p-6 animate-fade-in transition-all hover:shadow-xl">
      <div className="flex justify-between items-start w-full mb-2">
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Calendar size={14} /> <span>{date}</span>
        </div>
        {isNew && <span className="tag-new">Novo</span>}
      </div>
      <h3 className="text-escutaris-terracotta text-xl font-semibold mb-2 animate-slide-in">
        {title}
      </h3>
      <p className="text-muted-foreground mb-4">
        {description}
      </p>
      <a 
        href={url} 
        target="_blank" 
        rel="noreferrer" 
        className="text-escutaris-terracotta font-semibold hover:underline"
      >
        Leia mais →
      </a>
    </div>
  );
};

export default NoticiaCard;
