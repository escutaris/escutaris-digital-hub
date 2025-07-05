-- Verificar se já existe o papel de admin para o usuário e inserir se não existir
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'
FROM auth.users u
WHERE u.email = 'acoteixeira7484@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = u.id AND ur.role = 'admin'
);

-- Atualizar o perfil para admin se necessário
UPDATE public.users_profiles
SET role = 'admin', name = COALESCE(name, 'Administrador')
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'acoteixeira7484@gmail.com'
);