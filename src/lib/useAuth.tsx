
import React, { createContext, useContext, useEffect, useState } from 'react';
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

  console.log('🎭 AuthProvider state:', { 
    sessionLoading, 
    adminLoading, 
    loading, 
    hasUser: !!user, 
    isAdmin 
  });

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
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('⏰ ProtectedRoute - Safety timeout reached after 5 seconds');
      setTimeoutReached(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('🛡️ ProtectedRoute useEffect:', { loading, hasUser: !!user, isAdmin });
    
    if (!loading && !user) {
      console.log('🔒 ProtectedRoute - No user, redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading state but with timeout protection
  if (loading && !timeoutReached) {
    console.log('⏳ ProtectedRoute - Showing loading state');
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Force resolution if timeout reached
  if (timeoutReached && loading) {
    console.log('⚠️ ProtectedRoute - Timeout reached, forcing resolution');
    if (!user) {
      navigate('/login', { replace: true });
      return null;
    }
    // If we have a user but admin check is still loading, assume not admin for safety
    if (!isAdmin) {
      console.log('⚠️ ProtectedRoute - Timeout + no admin confirmation = access denied');
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4 text-red-600">Tempo Limite Atingido</h2>
            <p className="mb-4">Não foi possível verificar suas permissões. Tente novamente.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Recarregar
            </button>
            <button 
              onClick={() => navigate('/')}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Voltar
            </button>
          </div>
        </div>
      );
    }
  }

  if (!user) {
    console.log('🔒 ProtectedRoute - No user found');
    return null;
  }

  if (!isAdmin) {
    console.log('🚫 ProtectedRoute - User is not admin');
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Acesso Negado</h2>
          <p className="mb-4">Você não tem permissão para acessar esta área administrativa.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  console.log('🎉 ProtectedRoute - Access granted, rendering protected content');
  return <>{children}</>;
}
