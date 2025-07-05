import DOMPurify from 'dompurify';
import { supabase } from '@/integrations/supabase/client';

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
  });
};

/**
 * Sanitize plain text input
 */
export const sanitizeText = (text: string): string => {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

/**
 * Verify if current user is admin
 */
export const verifyAdmin = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }

  const { data: roles, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .maybeSingle();

  if (error) {
    console.error('Error verifying admin status:', error);
    return false;
  }

  return !!roles;
};

/**
 * Validate file upload security
 */
export const validateFileUpload = (file: File): { isValid: boolean; error?: string } => {
  // Check file size (50MB limit)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: 'Arquivo muito grande. Limite de 50MB.' };
  }

  // Allowed file types for materials
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
  ];

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Tipo de arquivo não permitido.' };
  }

  return { isValid: true };
};

/**
 * Log security events for audit
 */
export const logSecurityEvent = async (
  action: string,
  tableName: string,
  recordId?: string,
  oldValues?: any,
  newValues?: any
): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user?.id || null,
        action,
        table_name: tableName,
        record_id: recordId,
        old_values: oldValues,
        new_values: newValues,
        ip_address: null, // Could be enhanced with actual IP detection
        user_agent: navigator.userAgent,
      });
  } catch (error) {
    console.error('Error logging security event:', error);
  }
};