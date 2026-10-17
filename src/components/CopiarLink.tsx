import React, { useState } from 'react';
import { Check, Link2 } from 'lucide-react';

interface CopiarLinkProps {
  slug: string;
  /** 'botao' na página do material; 'texto' no rodapé do card */
  variante?: 'botao' | 'texto';
}

/**
 * Copia o endereço da página de um material para colar no WhatsApp ou no
 * e-mail. Usa sempre o domínio publicado, para o link copiado da prévia local
 * também funcionar quando chegar em alguém.
 */
const CopiarLink = ({ slug, variante = 'texto' }: CopiarLinkProps) => {
  const [copiado, setCopiado] = useState(false);
  const endereco = `https://comunidade.escutaris.com/materiais/${slug}`;

  const copiar = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(endereco);
    } catch {
      // navegador sem permissão de área de transferência: o prompt deixa copiar à mão
      window.prompt('Copie o link:', endereco);
      return;
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const Icone = copiado ? Check : Link2;
  const rotulo = copiado ? 'Link copiado' : 'Copiar link';

  if (variante === 'botao') {
    return (
      <button
        type="button"
        onClick={copiar}
        className="inline-flex items-center justify-center gap-2 rounded-sm border border-escutaris-verde/30 px-6 py-3 font-poppins text-sm text-escutaris-verde transition-colors hover:border-escutaris-verde"
      >
        <Icone size={16} /> {rotulo}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className="inline-flex items-center gap-1.5 text-xs font-poppins text-escutaris-verde/60 hover:text-escutaris-verde transition-colors"
    >
      <Icone size={13} /> {rotulo}
    </button>
  );
};

export default CopiarLink;
