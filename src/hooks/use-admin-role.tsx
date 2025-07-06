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

    const checkAdminRole = async () => {
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
          setIsAdmin(false);
        } else {
          const adminStatus = !!roles;
          console.log('✅ Admin status:', adminStatus);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error('💥 Exception checking admin role:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [userId]);

  return { isAdmin, loading };
}