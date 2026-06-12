
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
    </Form>
  );
};

export default AuthForm;
