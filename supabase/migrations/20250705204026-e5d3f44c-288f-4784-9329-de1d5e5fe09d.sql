-- Criar novo usuário administrador acoteixeira7484@gmail.com
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'acoteixeira7484@gmail.com',
    crypt('@Acot7484', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- Inserir o papel de administrador para este usuário
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users 
WHERE email = 'acoteixeira7484@gmail.com';

-- Criar perfil do usuário na tabela users_profiles
INSERT INTO public.users_profiles (id, email, role, name)
SELECT id, email, 'admin', 'Administrador'
FROM auth.users 
WHERE email = 'acoteixeira7484@gmail.com';