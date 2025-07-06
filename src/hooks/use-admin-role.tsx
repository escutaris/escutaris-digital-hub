import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAdminRole(userId: string | undefined) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const checkAdminRole = async () => {
      try {
        console.log('🔍 Checking admin role for user:', userId);
        
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .maybeSingle();
        
        if (!isMounted) return;
        
        if (error) {
          console.error('❌ Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          const adminStatus = !!roles;
          console.log('✅ Admin status:', adminStatus);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error('💥 Exception checking admin role:', error);
        if (isMounted) {
          setIsAdmin(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Debounce the check to avoid too many requests
    const timeoutId = setTimeout(checkAdminRole, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [userId]);

  return { isAdmin, loading };
}