import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  downloadUrl?: string;
}

const LeadCaptureModal = ({ open, onClose, onSuccess, downloadUrl }: Props) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Informe um e-mail válido.');
      return;
    }

    setLoading(true);
    try {
      const { error: dbError } = await supabase
        .from('leads')
        .insert({
          email: email.toLowerCase().trim(),
          marca: 'escutaris',
          profissao: 'outro',
          fonte: 'hub-escutaris',
          consentimento_lgpd: true,
        });

      if (dbError) throw dbError;

      localStorage.setItem('escutaris_lead', email.toLowerCase().trim());

      if (downloadUrl) {
        window.open(downloadUrl, '_blank', 'noopener,noreferrer');
      }

      onSuccess();
    } catch (err) {
      setError('Não foi possível salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(28, 53, 32, 0.7)' }}
    >
      <div className="bg-escutaris-offwhite w-full max-w-md rounded-sm shadow-2xl relative animate-fade-in">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-escutaris-verde/40 hover:text-escutaris-verde transition-colors"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <div className="p-8">
          <p className="font-poppins text-xs tracking-widest uppercase text-escutaris-terracota mb-3">
            Acesso gratuito
          </p>
          <h2 className="font-cormorant text-3xl font-semibold text-escutaris-verde leading-tight mb-2">
            Acesse todos os materiais
          </h2>
          <p className="font-poppins text-sm text-muted-foreground mb-6 leading-relaxed">
            Cadastre seu e-mail para baixar guias, checklists e ferramentas técnicas sobre NR-1, ISO 45003 e saúde mental no trabalho.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-poppins text-xs font-medium text-escutaris-verde/70 uppercase tracking-wide block mb-1.5">
                E-mail profissional
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="voce@empresa.com.br"
                className="w-full border border-border bg-white px-4 py-2.5 text-sm font-poppins text-foreground rounded-sm focus:outline-none focus:border-escutaris-verde placeholder:text-muted-foreground/50"
                required
                autoFocus
              />
            </div>

            {error && (
              <p className="text-xs font-poppins text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-escutaris-terracota text-white font-poppins font-medium py-3 rounded-sm hover:bg-escutaris-terracota/90 transition-colors disabled:opacity-60"
            >
              {loading ? 'Salvando...' : 'Acessar agora'}
            </button>
          </form>

          <p className="font-poppins text-xs text-muted-foreground/60 text-center mt-4">
            Sem spam. Cancele quando quiser.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeadCaptureModal;
