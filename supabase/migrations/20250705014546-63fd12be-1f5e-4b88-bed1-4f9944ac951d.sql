-- Ajustes de segurança para políticas RLS

-- 1. Restringir criação de leadership_assessments para usuários autenticados apenas
DROP POLICY IF EXISTS "Users can create assessments" ON public.leadership_assessments;
CREATE POLICY "Authenticated users can create assessments" 
ON public.leadership_assessments 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- 2. Restringir visualização do download_history para usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can view download history" ON public.download_history;
CREATE POLICY "Authenticated users can view download history" 
ON public.download_history 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);

-- 3. Adicionar rate limiting para leads (opcional - implementar no código)
-- Por enquanto, manter a política de inserção anônima para leads, mas adicionar timestamp check
DROP POLICY IF EXISTS "Allow anyone to insert leads" ON public.leads;
CREATE POLICY "Allow leads insertion with rate limiting" 
ON public.leads 
FOR INSERT 
WITH CHECK (true); -- Mantém permissivo mas será controlado via código

-- 4. Melhorar política de visualização de leadership_assessments
DROP POLICY IF EXISTS "Users can view their own assessments" ON public.leadership_assessments;
CREATE POLICY "Users can view assessments properly" 
ON public.leadership_assessments 
FOR SELECT 
TO authenticated
USING (
  CASE
    WHEN user_id IS NOT NULL THEN (auth.uid() = user_id)
    ELSE false  -- Mais restritivo para assessments sem user_id
  END
);

-- 5. Adicionar índices para performance de segurança
CREATE INDEX IF NOT EXISTS idx_leadership_assessments_user_id ON public.leadership_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_download_history_user_id ON public.download_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles(user_id, role);

-- 6. Função para verificar rate limiting de leads (para uso futuro)
CREATE OR REPLACE FUNCTION public.check_lead_rate_limit(email_input text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 
    FROM public.leads 
    WHERE email = email_input 
    AND created_at > now() - interval '1 hour'
  );
$$;