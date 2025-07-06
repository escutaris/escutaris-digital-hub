
import React, { createContext, useContext, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { useAuthSession } from '@/hooks/use-auth-session';
import { useAdminRole } from '@/hooks/use-admin-role';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, user, loading: sessionLoading } = useAuthSession();
  const { isAdmin, loading: adminLoading } = useAdminRole(user?.id);
  
  const loading = sessionLoading || adminLoading;

  const signOut = async () => {
    console.log('🚪 Signing out...');
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    loading,
    signOut,
    isAdmin,
  };

  console.log('🎭 AuthProvider - Loading:', loading, 'User:', !!user, 'IsAdmin:', isAdmin);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    console.log('⏳ ProtectedRoute showing loading...');
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Acesso Negado</h2>
          <p className="mb-4">Você não tem permissão para acessar esta área.</p>
          <button onClick={() => navigate('/')}>Voltar</button>
        </div>
      </div>
    );
  }

  console.log('🎉 ProtectedRoute - Rendering protected content');
  return <>{children}</>;
}
