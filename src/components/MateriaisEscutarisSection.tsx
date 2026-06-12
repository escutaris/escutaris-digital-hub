import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PenLine } from 'lucide-react';
import { fetchMaterials } from '@/lib/api/materials';
import MaterialCard from './MaterialCard';

const MateriaisEscutarisSection = () => {
  const { data: materials, isLoading } = useQuery({
    queryKey: ['materials', ''],
    queryFn: () => fetchMaterials('', ''),
    staleTime: 1000 * 60 * 5,
  });

  const autorais = (materials || []).filter((m) => m.is_autoral);

  if (isLoading || autorais.length === 0) return null;

  return (
    <section className="section-padding" id="materiais-escutaris">
      <div className="mb-8">
        <p className="font-poppins text-xs tracking-widest uppercase text-escutaris-terracota mb-2">
          Produzidos por nós
        </p>
        <h2 className="section-title flex items-center gap-2">
          <PenLine className="h-6 w-6" /> Materiais Escutaris
        </h2>
        <p className="font-poppins text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
          Guias e cartilhas autorais da Escutaris: conteúdo prático, com base técnica,
          feito para aplicar na rotina da sua organização.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {autorais.map((m) => (
          <MaterialCard key={m.id} material={m} />
        ))}
      </div>
    </section>
  );
};

export default MateriaisEscutarisSection;
