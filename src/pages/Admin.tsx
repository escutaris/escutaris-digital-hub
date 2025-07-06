
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MaterialForm from '@/components/admin/MaterialForm';
import MaterialsList from '@/components/admin/MaterialsList';
import { FileText, Upload, List } from 'lucide-react';

const Admin = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMaterialChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-escutaris-green mb-2 flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie materiais, conteúdos e configurações da Central Escutaris
          </p>
        </div>

        <Tabs defaultValue="materials" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Adicionar Material
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Gerenciar Materiais
            </TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="space-y-6">
            <MaterialForm onMaterialAdded={handleMaterialChange} />
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <MaterialsList 
              onMaterialChange={handleMaterialChange}
              refreshTrigger={refreshTrigger}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
