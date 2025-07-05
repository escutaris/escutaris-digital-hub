-- Criar novo usuário administrador verificando existência primeiro
DO $$
DECLARE
    new_user_id uuid;
    user_exists boolean := false;
BEGIN
    -- Verificar se usuário já existe
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'acoteixeira7484@gmail.com') INTO user_exists;
    
    IF NOT user_exists THEN
        -- Inserir novo usuário
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
    END IF;
    
    -- Obter o ID do usuário
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'acoteixeira7484@gmail.com';
    
    -- Inserir papel de admin se não existir
    IF NOT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = new_user_id AND role = 'admin') THEN
        INSERT INTO public.user_roles (user_id, role) VALUES (new_user_id, 'admin');
    END IF;
    
    -- Inserir ou atualizar perfil
    IF NOT EXISTS(SELECT 1 FROM public.users_profiles WHERE id = new_user_id) THEN
        INSERT INTO public.users_profiles (id, email, role, name)
        VALUES (new_user_id, 'acoteixeira7484@gmail.com', 'admin', 'Administrador');
    ELSE
        UPDATE public.users_profiles 
        SET email = 'acoteixeira7484@gmail.com', role = 'admin', name = 'Administrador'
        WHERE id = new_user_id;
    END IF;
        
END $$;