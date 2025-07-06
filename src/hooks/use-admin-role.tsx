
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAdminRole(userId: string | undefined) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      console.log('🔍 useAdminRole - No userId provided');
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const checkAdminRole = async () => {
      try {
        console.log('🔍 useAdminRole - Checking admin role for user:', userId);
        
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .maybeSingle();
        
        if (!isMounted) return;
        
        if (error) {
          console.error('❌ useAdminRole - Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          const adminStatus = !!roles;
          console.log('✅ useAdminRole - Admin status determined:', adminStatus);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error('💥 useAdminRole - Exception checking admin role:', error);
        if (isMounted) {
          setIsAdmin(false);
        }
      } finally {
        if (isMounted) {
          console.log('🏁 useAdminRole - Setting loading to false');
          setLoading(false);
        }
      }
    };

    // Execute immediately without debounce
    checkAdminRole();
    
    return () => {
      isMounted = false;
    };
  }, [userId]);

  console.log('🎯 useAdminRole hook state:', { userId: !!userId, isAdmin, loading });
  return { isAdmin, loading };
}
