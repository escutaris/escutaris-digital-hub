
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, { message: 'Informe seu nome' }),
});

const AuthForm = ({ type }: { type: 'login' | 'signup' }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
      // Redireciona para o Google; o estado de auth é resolvido no retorno.
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Falha ao entrar com Google',
        description: error.message,
      });
      setGoogleLoading(false);
    }
  };

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(type === 'signup' ? signupSchema : loginSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setLoading(true);

    try {
      if (type === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Email ou senha incorretos. Por favor, tente novamente.');
          }
          throw error;
        }

        toast({
          title: 'Que bom ter você de volta!',
        });

        // Wait for auth state to update before navigating
        setTimeout(() => {
          setLoading(false);
          navigate('/', { replace: true });
        }, 500);

      } else {
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: { full_name: values.name.trim() },
          },
        });

        if (error) {
          if (error.message.includes('already registered')) {
            throw new Error('Este e-mail já tem conta na comunidade. Use "Entrar".');
          }
          throw error;
        }

        // Quando a confirmação de e-mail está desligada, a sessão já vem criada
        if (data.session) {
          toast({
            title: 'Bem-vinda(o) à comunidade!',
            description: 'Sua conta foi criada. Bons downloads!',
          });
          setTimeout(() => {
            setLoading(false);
            navigate('/', { replace: true });
          }, 500);
        } else {
          toast({
            title: 'Quase lá!',
            description: 'Enviamos um e-mail de confirmação. Clique no link para ativar sua conta.',
          });
          setLoading(false);
        }
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: type === 'login' ? 'Falha no login' : 'Falha no cadastro',
        description: error.message,
      });
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogle}
        disabled={googleLoading || loading}
      >
        {googleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
            <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
            <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 4.75 12 4.75Z" />
          </svg>
        )}
        {type === 'login' ? 'Entrar com Google' : 'Cadastrar com Google'}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">ou com e-mail</span>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {type === 'signup' && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Como podemos te chamar?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {type === 'login' ? 'Entrando...' : 'Criando sua conta...'}
            </>
          ) : (
            type === 'login' ? 'Entrar' : 'Criar conta gratuita'
          )}
        </Button>
      </form>
      </div>
    </Form>
  );
};

export default AuthForm;
