
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

  const checkAdminRole = async (userId: string) => {
    try {
      console.log('Checking admin role for user:', userId);
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }
      
      const adminStatus = !!roles;
      console.log('Admin status:', adminStatus);
      return adminStatus;
    } catch (error) {
      console.error('Exception checking admin role:', error);
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        setLoading(true);
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) {
            setLoading(false);
          }
          return;
        }

        console.log('Initial session:', session?.user?.email || 'No session');
        
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            const adminStatus = await checkAdminRole(session.user.id);
            if (isMounted) {
              setIsAdmin(adminStatus);
            }
          } else {
            setIsAdmin(false);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email || 'No session');
        
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Use setTimeout to avoid blocking the auth state change
            setTimeout(async () => {
              if (isMounted) {
                const adminStatus = await checkAdminRole(session.user.id);
                if (isMounted) {
                  setIsAdmin(adminStatus);
                }
              }
            }, 0);
          } else {
            setIsAdmin(false);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('Signing out...');
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
    console.log('ProtectedRoute - Loading:', loading, 'User:', !!user, 'IsAdmin:', isAdmin);
    
    if (!loading) {
      if (!user) {
        console.log('No user, redirecting to login');
        navigate('/login');
      } else if (!isAdmin) {
        console.log('User not admin, redirecting to login');
        navigate('/login');
      }
    }
  }, [user, loading, isAdmin, navigate]);

  if (loading) {
    console.log('ProtectedRoute showing loading...');
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-8 w-8 animate-spin text-escutaris-green" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    console.log('ProtectedRoute - No access, returning null');
    return null;
  }

  console.log('ProtectedRoute - Access granted, rendering children');
  return <>{children}</>;
}
