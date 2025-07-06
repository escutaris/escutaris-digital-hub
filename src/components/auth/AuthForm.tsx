
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

const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

const AuthForm = ({ type }: { type: 'login' | 'signup' }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    console.log('🔄 AuthForm - Starting authentication process');
    
    try {
      if (type === 'login') {
        console.log('🔄 AuthForm - Starting login for:', values.email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        
        if (error) {
          console.error('❌ AuthForm - Login error:', error);
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Email ou senha incorretos. Por favor, tente novamente.');
          }
          throw error;
        }
        
        console.log('✅ AuthForm - Login successful for user:', data.user?.id);
        
        toast({
          title: 'Login realizado com sucesso',
        });
        
        // Reset loading and navigate immediately
        setLoading(false);
        console.log('🚀 AuthForm - Navigating to admin panel');
        navigate('/admin', { replace: true });
        
      } else {
        console.log('🔄 AuthForm - Starting signup for:', values.email);
        
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });
        
        if (error) throw error;
        
        toast({
          title: 'Cadastro realizado',
          description: 'Verifique seu email para confirmar o cadastro',
        });
        
        setLoading(false);
      }
    } catch (error: any) {
      console.error('💥 AuthForm - Authentication error:', error);
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
              {type === 'login' ? 'Entrando...' : 'Cadastrando...'}
            </>
          ) : (
            type === 'login' ? 'Entrar' : 'Cadastrar'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AuthForm;
