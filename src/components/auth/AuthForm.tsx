
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
import { Loader2, MailCheck } from 'lucide-react';

/**
 * Duas portas de entrada, nenhuma com senha para o membro novo:
 *   1. Google  — um clique, e-mail já verificado.
 *   2. Link no e-mail (magic link) — para quem não usa Google.
 *
 * A senha continua existindo, escondida atrás de "Entrar com senha", porque as
 * contas antigas e a conta admin reserva foram criadas com senha. Ninguém novo
 * cria senha, então não há senha para esquecer.
 */

const linkSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: 'E-mail inválido' }),
});

const linkSignupSchema = linkSchema.extend({
  name: z.string().min(2, { message: 'Informe seu nome' }),
});

const senhaSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

const AuthForm = ({ type }: { type: 'login' | 'signup' }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [modoSenha, setModoSenha] = useState(false);
  const [linkEnviadoPara, setLinkEnviadoPara] = useState<string | null>(null);

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

  const linkForm = useForm<z.infer<typeof linkSignupSchema>>({
    resolver: zodResolver(type === 'signup' ? linkSignupSchema : linkSchema),
    defaultValues: { name: '', email: '' },
  });

  const senhaForm = useForm<z.infer<typeof senhaSchema>>({
    resolver: zodResolver(senhaSchema),
    defaultValues: { email: '', password: '' },
  });

  const enviarLink = async (values: z.infer<typeof linkSignupSchema>) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          shouldCreateUser: true,
          data: values.name?.trim() ? { full_name: values.name.trim() } : undefined,
        },
      });
      if (error) throw error;

      setLinkEnviadoPara(values.email);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Não consegui enviar o link',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const entrarComSenha = async (values: z.infer<typeof senhaSchema>) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('E-mail ou senha incorretos. Se preferir, entre pelo link no e-mail.');
        }
        throw error;
      }

      toast({ title: 'Que bom ter você de volta!' });

      setTimeout(() => {
        setLoading(false);
        navigate('/', { replace: true });
      }, 500);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Falha no login',
        description: error.message,
      });
      setLoading(false);
    }
  };

  // Confirmação de link enviado — substitui o formulário para a pessoa não reenviar sem parar.
  if (linkEnviadoPara) {
    return (
      <div className="text-center space-y-4 py-2">
        <MailCheck className="mx-auto h-10 w-10 text-escutaris-terracota" />
        <div className="space-y-2">
          <p className="font-poppins font-medium text-foreground">Enviamos seu link de entrada</p>
          <p className="font-poppins text-sm text-muted-foreground leading-relaxed">
            Abra o e-mail que acabou de chegar em{' '}
            <span className="font-medium text-foreground">{linkEnviadoPara}</span> e clique no botão
            para entrar. Se não achar, olhe no spam ou na aba Promoções.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setLinkEnviadoPara(null)}
        >
          Usar outro e-mail
        </Button>
      </div>
    );
  }

  return (
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

      {!modoSenha ? (
        <Form {...linkForm}>
          <form onSubmit={linkForm.handleSubmit(enviarLink)} className="space-y-4">
            {type === 'signup' && (
              <FormField
                control={linkForm.control}
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
              control={linkForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading || googleLoading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando o link...
                </>
              ) : (
                'Receber link de entrada'
              )}
            </Button>

            <p className="font-poppins text-xs text-center text-muted-foreground leading-relaxed">
              Sem senha para criar nem para esquecer. Você recebe um link no e-mail e entra por ele.
            </p>
          </form>
        </Form>
      ) : (
        <Form {...senhaForm}>
          <form onSubmit={senhaForm.handleSubmit(entrarComSenha)} className="space-y-4">
            <FormField
              control={senhaForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={senhaForm.control}
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

            <Button type="submit" className="w-full" disabled={loading || googleLoading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </Form>
      )}

      <button
        type="button"
        onClick={() => setModoSenha((v) => !v)}
        className="w-full font-poppins text-xs text-muted-foreground/80 hover:text-escutaris-terracota hover:underline transition-colors"
      >
        {modoSenha ? 'Prefiro receber o link no e-mail' : 'Já tenho senha nesta conta'}
      </button>
    </div>
  );
};

export default AuthForm;
