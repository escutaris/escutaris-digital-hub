
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
    console.log('🚀 Initializing auth...');
    let isMounted = true;

    // Timeout de segurança
    const safetyTimeout = setTimeout(() => {
      if (isMounted) {
        console.log('⏰ Safety timeout reached, setting loading to false');
        setLoading(false);
      }
    }, 3000); // Reduzido para 3 segundos

    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email || 'No session');
        
        if (!isMounted) return;

        // Limpar timeout de segurança
        clearTimeout(safetyTimeout);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 User found, checking admin status...');
          try {
            const adminStatus = await checkAdminRole(session.user.id);
            if (isMounted) {
              setIsAdmin(adminStatus);
              console.log('🎯 Final admin status:', adminStatus);
            }
          } catch (error) {
            console.error('💥 Error in admin check:', error);
            if (isMounted) {
              setIsAdmin(false);
            }
          }
        } else {
          setIsAdmin(false);
        }
        
        if (isMounted) {
          setLoading(false);
          console.log('✅ Auth initialization complete');
        }
      }
    );

    // Verificar sessão inicial
    console.log('🔍 Getting initial session...');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('❌ Error getting session:', error);
        if (isMounted) {
          setLoading(false);
        }
        return;
      }
      
      console.log('📋 Initial session result:', session?.user?.email || 'No session');
      
      // Se não há sessão, definir loading como false imediatamente
      if (!session && isMounted) {
        setLoading(false);
        console.log('⚡ No session found, loading set to false immediately');
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth effect');
      isMounted = false;
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
        console.log('🔒 No user, redirecting to login...');
        navigate('/login');
      } else if (!isAdmin) {
        console.log('🔒 User not admin, redirecting to login...');
        navigate('/login');
      } else {
        console.log('✅ Access granted!');
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
    console.log('🚫 ProtectedRoute - No access, showing loading while redirecting');
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
