-- Upload de materiais: somente administradoras (aplicado em produção em 12/jun/2026)
DROP POLICY IF EXISTS "Allow anon upload materials" ON storage.objects;
DROP POLICY IF EXISTS "Only admins upload materials" ON storage.objects;
CREATE POLICY "Only admins upload materials"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'materials' AND public.is_admin());
