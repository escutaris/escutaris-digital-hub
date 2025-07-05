-- Create security definer function to check admin role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  );
$$;

-- Create function to check if user is authenticated admin
CREATE OR REPLACE FUNCTION public.is_authenticated_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL AND public.is_admin();
$$;

-- Update Materials RLS Policies - Restrict admin operations
DROP POLICY IF EXISTS "Authenticated users can upload materials" ON public.materials;
DROP POLICY IF EXISTS "Authenticated users can update materials" ON public.materials;
DROP POLICY IF EXISTS "Authenticated users can delete materials" ON public.materials;

CREATE POLICY "Only admins can upload materials" 
ON public.materials 
FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update materials" 
ON public.materials 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Only admins can delete materials" 
ON public.materials 
FOR DELETE 
USING (public.is_admin());

-- Update News RLS Policies - Restrict admin operations
DROP POLICY IF EXISTS "Authenticated users can insert news" ON public.news;
DROP POLICY IF EXISTS "Authenticated users can update news" ON public.news;
DROP POLICY IF EXISTS "Authenticated users can delete news" ON public.news;

CREATE POLICY "Only admins can insert news" 
ON public.news 
FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update news" 
ON public.news 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Only admins can delete news" 
ON public.news 
FOR DELETE 
USING (public.is_admin());

-- Add User Roles RLS Policies
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view user roles" 
ON public.user_roles 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Only admins can assign roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update roles" 
ON public.user_roles 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Only admins can delete roles" 
ON public.user_roles 
FOR DELETE 
USING (public.is_admin());

-- Create audit log table for security tracking
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (public.is_admin());

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);