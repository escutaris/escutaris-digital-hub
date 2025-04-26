
import React, { useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut } from 'lucide-react';
import MaterialsList from '@/components/admin/MaterialsList';
import MaterialForm from '@/components/admin/MaterialForm';
import Logo from '@/components/Logo';
import { Link } from 'react-router-dom';

const Admin = () => {
  const { signOut } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  
  const handleMaterialChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-escutaris-green-light/10 to-escutaris-terracotta-light/5">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Logo size="h-12 w-12" />
            </Link>
            <h1 className="text-2xl font-bold text-escutaris-green">Painel Administrativo</h1>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="list">Materiais Cadastrados</TabsTrigger>
            <TabsTrigger value="create">Adicionar Material</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <MaterialsList onMaterialChange={handleMaterialChange} refreshTrigger={refreshTrigger} />
          </TabsContent>
          
          <TabsContent value="create">
            <MaterialForm onMaterialAdded={handleMaterialChange} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
