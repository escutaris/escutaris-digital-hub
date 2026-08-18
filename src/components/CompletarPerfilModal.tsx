import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/useAuth';
import { useToast } from '@/hooks/use-toast';
import { lerDownloadPendente } from '@/lib/downloadPendente';
import { EVENTO_ENTREGUE } from './RetomarDownload';

/**
 * Perguntado UMA vez, depois que a pessoa já entrou — nunca antes.
 *
 * O login por Google e por link no e-mail entrega o e-mail, mas não diz de onde
 * a pessoa fala. Organização e área de atuação são o que transforma uma lista de
 * e-mails numa lista que dá para abordar por segmento.
 *
 * Quem fecha sem responder não é perguntado de novo por 7 dias naquele aparelho.
 */

const ADIAR_KEY = 'escutaris:perfil-adiado-ate';
const ADIAR_DIAS = 7;

const AREAS = [
  'Recursos Humanos',
  'Segurança do Trabalho / SST',
  'Saúde ocupacional',
  'Gestão / Liderança',
  'Jurídico',
  'Consultoria',
  'Estudante',
  'Outra',
];

const CompletarPerfilModal = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [nome, setNome] = useState('');
  const [organizacao, setOrganizacao] = useState('');
  const [area, setArea] = useState('');

  // Quem entrou para buscar um material recebe o material primeiro. Perguntar
  // antes disso é cobrar pedágio na porta, exatamente o que queremos evitar.
  const [materialNaFrente, setMaterialNaFrente] = useState(() => !!lerDownloadPendente());

  useEffect(() => {
    if (!materialNaFrente) return;
    const liberar = () => setMaterialNaFrente(false);
    window.addEventListener(EVENTO_ENTREGUE, liberar);
    return () => window.removeEventListener(EVENTO_ENTREGUE, liberar);
  }, [materialNaFrente]);

  useEffect(() => {
    if (authLoading || !user || materialNaFrente) return;

    const adiadoAte = Number(localStorage.getItem(ADIAR_KEY) ?? 0);
    if (Date.now() < adiadoAte) return;

    let cancelado = false;

    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, organizacao, area')
        .eq('id', user.id)
        .maybeSingle();

      if (cancelado || error || !data) return;
      if (data.organizacao) return; // já respondeu

      setNome(data.name || (user.user_metadata?.full_name as string) || '');
      setArea(data.area || '');
      setOpen(true);
    })();

    return () => {
      cancelado = true;
    };
  }, [user, authLoading, materialNaFrente]);

  const adiar = () => {
    localStorage.setItem(ADIAR_KEY, String(Date.now() + ADIAR_DIAS * 24 * 60 * 60 * 1000));
    setOpen(false);
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSalvando(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        name: nome.trim() || null,
        organizacao: organizacao.trim() || null,
        area: area || null,
      })
      .eq('id', user.id);
    setSalvando(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Não consegui salvar',
        description: error.message,
      });
      return;
    }

    toast({ title: 'Obrigada! Perfil completo.' });
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(34, 45, 25, 0.7)' }}
      onClick={adiar}
    >
      <div
        className="bg-escutaris-offwhite w-full max-w-md rounded-sm shadow-2xl relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={adiar}
          className="absolute top-4 right-4 text-escutaris-verde/40 hover:text-escutaris-verde transition-colors"
          aria-label="Responder depois"
        >
          <X size={18} />
        </button>

        <form onSubmit={salvar} className="p-8">
          <p className="font-poppins text-xs tracking-widest uppercase text-escutaris-terracota mb-3">
            Falta pouco
          </p>
          <h2 className="font-cormorant text-3xl font-semibold text-escutaris-verde leading-tight mb-2">
            De onde você fala?
          </h2>
          <p className="font-poppins text-sm text-muted-foreground mb-6 leading-relaxed">
            Duas respostas rápidas para eu enviar material que faz sentido para o seu dia.
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="font-poppins text-sm text-foreground/80 block mb-1.5" htmlFor="perfil-nome">
                Nome
              </label>
              <input
                id="perfil-nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Como podemos te chamar?"
                className="w-full font-poppins text-sm border border-escutaris-verde/20 rounded-sm px-3 py-2.5 bg-white focus:outline-none focus:border-escutaris-terracota transition-colors"
              />
            </div>

            <div>
              <label className="font-poppins text-sm text-foreground/80 block mb-1.5" htmlFor="perfil-org">
                Onde você trabalha
              </label>
              <input
                id="perfil-org"
                value={organizacao}
                onChange={(e) => setOrganizacao(e.target.value)}
                placeholder="Nome da empresa ou instituição"
                className="w-full font-poppins text-sm border border-escutaris-verde/20 rounded-sm px-3 py-2.5 bg-white focus:outline-none focus:border-escutaris-terracota transition-colors"
              />
            </div>

            <div>
              <label className="font-poppins text-sm text-foreground/80 block mb-1.5" htmlFor="perfil-area">
                Sua área
              </label>
              <select
                id="perfil-area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full font-poppins text-sm border border-escutaris-verde/20 rounded-sm px-3 py-2.5 bg-white focus:outline-none focus:border-escutaris-terracota transition-colors"
              >
                <option value="">Selecione</option>
                {AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={salvando}
            className="w-full bg-escutaris-terracota text-white font-poppins font-medium py-3 rounded-sm hover:bg-escutaris-terracota/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar
          </button>

          <button
            type="button"
            onClick={adiar}
            className="w-full mt-3 font-poppins text-xs text-muted-foreground/80 hover:text-escutaris-terracota hover:underline transition-colors"
          >
            Responder depois
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompletarPerfilModal;
