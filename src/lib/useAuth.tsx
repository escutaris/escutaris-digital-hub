
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
    console.log('🛡️ ProtectedRoute check - Loading:', loading, 'User:', !!user, 'IsAdmin:', isAdmin);
    
    if (!loading) {
      if (!user) {
        console.log('🔒 No user found, redirecting to login...');
        navigate('/login', { replace: true });
      } else if (!isAdmin) {
        console.log('🔒 User is not admin, access denied');
        // Instead of redirecting to login, show access denied
        // This prevents infinite loops when user is logged in but not admin
      } else {
        console.log('✅ Access granted to admin area!');
      }
    }
  }, [user, loading, isAdmin, navigate]);

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

  if (!user || !isAdmin) {
    console.log('🚫 ProtectedRoute - Access denied');
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-background via-muted/20 to-accent/10">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-destructive/10 rounded-full">
              <Loader className="h-16 w-16 text-destructive" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {!user 
              ? 'Você precisa fazer login para acessar esta área.' 
              : 'Você não tem permissão para acessar o painel administrativo.'
            }
          </p>
          
          <button 
            onClick={() => navigate('/', { replace: true })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  console.log('🎉 ProtectedRoute - Rendering protected content');
  return <>{children}</>;
}
