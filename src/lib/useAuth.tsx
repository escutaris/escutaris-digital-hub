
import React, { useEffect, useState, createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminRole = async (userId: string): Promise<boolean> => {
    try {
      console.log('🔍 Checking admin role for user:', userId);
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error) {
        console.error('❌ Error checking admin role:', error);
        return false;
      }
      
      const adminStatus = !!roles;
      console.log('✅ Admin status result:', adminStatus);
      return adminStatus;
    } catch (error) {
      console.error('💥 Exception checking admin role:', error);
      return false;
    }
  };

  useEffect(() => {
    console.log('🚀 AuthProvider initializing...');
    let mounted = true;

    // Timeout de segurança mais robusto
    const safetyTimeout = setTimeout(() => {
      if (mounted) {
        console.log('⏰ Safety timeout - forcing loading false');
        setLoading(false);
      }
    }, 10000);

    // Função para processar sessão
    const processSession = async (currentSession: Session | null) => {
      console.log('🔄 Processing session:', !!currentSession);
      
      if (!mounted) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log('👤 Valid session found, checking admin role...');
        try {
          const adminStatus = await checkAdminRole(currentSession.user.id);
          if (mounted) {
            setIsAdmin(adminStatus);
            console.log('🎯 Admin status set to:', adminStatus);
          }
        } catch (error) {
          console.error('💥 Admin check failed:', error);
          if (mounted) {
            setIsAdmin(false);
          }
        }
      } else {
        console.log('❌ No valid session');
        setIsAdmin(false);
      }
      
      if (mounted) {
        clearTimeout(safetyTimeout);
        setLoading(false);
        console.log('✅ Auth processing complete');
      }
    };

    // Listener para mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, !!session);
        await processSession(session);
      }
    );

    // Verificar sessão inicial
    console.log('🔍 Getting initial session...');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('❌ Error getting initial session:', error);
        if (mounted) {
          setLoading(false);
        }
        return;
      }
      
      console.log('📋 Initial session result:', !!session);
      processSession(session);
    });

    return () => {
      console.log('🧹 Cleaning up AuthProvider');
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('🚪 Signing out...');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  const value = {
    session,
    user,
    loading,
    signOut,
    isAdmin,
  };

  console.log('🎭 AuthProvider render - Loading:', loading, 'User:', !!user, 'IsAdmin:', isAdmin);

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
        console.log('🔒 User is not admin, redirecting to login...');
        navigate('/login', { replace: true });
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
          <Loader className="h-8 w-8 animate-spin text-escutaris-green" />
          <p className="text-sm text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    console.log('🚫 ProtectedRoute - Access denied, showing loading while redirecting');
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-8 w-8 animate-spin text-escutaris-green" />
          <p className="text-sm text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  console.log('🎉 ProtectedRoute - Rendering protected content');
  return <>{children}</>;
}
