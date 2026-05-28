import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader, UserMinus, UserPlus, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AdminUser {
  user_id: string;
  role: string;
  email: string;
  created_at: string;
}

const fetchAdminUsers = async (): Promise<AdminUser[]> => {
  const { data, error } = await supabase.rpc('get_admin_users' as never);
  if (error) throw error;
  return (data as AdminUser[]) ?? [];
};

const UserManagement = () => {
  const [emailInput, setEmailInput] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: admins, isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchAdminUsers,
  });

  const grantMutation = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.rpc('grant_admin_role' as never, { email_input: email } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Acesso concedido', description: 'O usuário agora tem permissão de admin.' });
      setEmailInput('');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: Error) => {
      const msg = error.message.includes('User not found')
        ? 'Nenhuma conta encontrada com esse e-mail.'
        : 'Não foi possível conceder acesso.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.rpc('revoke_admin_role' as never, { target_user_id: userId } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Acesso removido', description: 'A permissão de admin foi removida.' });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: Error) => {
      const msg = error.message.includes('Cannot revoke your own')
        ? 'Você não pode remover sua própria permissão.'
        : 'Não foi possível remover o acesso.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    },
  });

  const handleGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) grantMutation.mutate(emailInput.trim().toLowerCase());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-escutaris-green" />
        <h2 className="text-xl font-bold text-escutaris-green">Administradores</h2>
      </div>

      {/* Add admin */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conceder acesso admin</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGrant} className="flex gap-2">
            <Input
              type="email"
              placeholder="email@exemplo.com"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!emailInput.trim() || grantMutation.isPending}
              className="flex items-center gap-2 bg-escutaris-green hover:bg-escutaris-green/90"
            >
              {grantMutation.isPending
                ? <Loader className="h-4 w-4 animate-spin" />
                : <UserPlus className="h-4 w-4" />}
              Conceder
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            O usuário precisa ter uma conta criada no sistema antes de receber acesso admin.
          </p>
        </CardContent>
      </Card>

      {/* List admins */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Admins ativos ({admins?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader className="h-6 w-6 animate-spin text-escutaris-green" />
            </div>
          ) : error ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Erro ao carregar lista de admins.
            </p>
          ) : admins?.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum admin encontrado.
            </p>
          ) : (
            <div className="space-y-3">
              {admins?.map(admin => (
                <div
                  key={admin.user_id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div>
                    <p className="text-sm font-medium">{admin.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{admin.role}</Badge>
                      <span className="text-xs text-muted-foreground">
                        desde {format(new Date(admin.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={admin.user_id === user?.id || revokeMutation.isPending}
                    onClick={() => revokeMutation.mutate(admin.user_id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
