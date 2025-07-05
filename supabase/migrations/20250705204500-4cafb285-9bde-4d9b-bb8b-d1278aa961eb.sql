-- Criar novo usuário administrador com tratamento de conflitos
DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Inserir novo usuário se não existir
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
    )
    ON CONFLICT (email) DO NOTHING;
    
    -- Obter o ID do usuário
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'acoteixeira7484@gmail.com';
    
    -- Inserir papel de admin se não existir
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Inserir perfil se não existir
    INSERT INTO public.users_profiles (id, email, role, name)
    VALUES (new_user_id, 'acoteixeira7484@gmail.com', 'admin', 'Administrador')
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        name = EXCLUDED.name;
        
END $$;