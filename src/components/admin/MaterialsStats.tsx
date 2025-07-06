
import React from 'react';
import { Material } from '@/lib/types/material';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BookOpen, Wrench, Star } from 'lucide-react';

interface MaterialsStatsProps {
  materials: Material[];
}

const MaterialsStats: React.FC<MaterialsStatsProps> = ({ materials }) => {
  const totalMaterials = materials.length;
  const newMaterials = materials.filter(m => m.is_new).length;
  const materialsByCategory = {
    material: materials.filter(m => m.category === 'material').length,
    legislacao: materials.filter(m => m.category === 'legislacao').length,
    ferramenta: materials.filter(m => m.category === 'ferramenta').length,
  };

  const stats = [
    {
      title: 'Total de Materiais',
      value: totalMaterials,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Marcados como Novos',
      value: newMaterials,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Materiais Técnicos',
      value: materialsByCategory.material,
      icon: FileText,
      color: 'text-escutaris-green',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Legislação',
      value: materialsByCategory.legislacao,
      icon: BookOpen,
      color: 'text-escutaris-terracotta',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MaterialsStats;
