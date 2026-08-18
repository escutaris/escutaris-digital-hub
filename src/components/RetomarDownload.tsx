import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { fetchMaterialLink } from '@/lib/api/materials';
import { recordDownload } from '@/lib/api/favorites';
import {
  lerDownloadPendente,
  limparDownloadPendente,
  type DownloadPendente,
} from '@/lib/downloadPendente';

/**
 * Entrega o material que a pessoa tentou baixar ANTES de ter conta.
 *
 * Sem isto, quem clica em "Baixar", cria a conta e volta cai na página inicial,
 * no topo, sem o arquivo: precisa lembrar o que queria e procurar o card de novo
 * entre dezenas. É o ponto em que o cadastro recém-feito não vira download.
 *
 * O navegador só deixa abrir uma aba dentro de um clique, e aqui não há clique:
 * a entrega vem de uma volta de e-mail ou do Google. Por isso a tentativa
 * automática pode ser barrada, e existe a faixa com o botão como rede.
 */

export const EVENTO_ENTREGUE = 'escutaris:download-entregue';

const RetomarDownload = () => {
  const { user, loading } = useAuth();
  const [pendente, setPendente] = useState<DownloadPendente | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const encerrar = () => {
    setPendente(null);
    setUrl(null);
    limparDownloadPendente();
    window.dispatchEvent(new CustomEvent(EVENTO_ENTREGUE));
  };

  useEffect(() => {
    if (loading || !user) return;

    const guardado = lerDownloadPendente();
    if (!guardado) return;

    let cancelado = false;

    (async () => {
      const endereco = await fetchMaterialLink(guardado.materialId);
      if (cancelado || !endereco) {
        limparDownloadPendente();
        return;
      }

      recordDownload(guardado.materialId);
      limparDownloadPendente();

      // Sem 'noopener': com ela o navegador devolve null e nao da para saber se
      // a aba abriu, o que fazia o arquivo cair na propria pagina.
      const aba = window.open(endereco, '_blank');
      if (aba) {
        // abriu sozinho: nada a mostrar, e o modal de perfil pode seguir
        window.dispatchEvent(new CustomEvent(EVENTO_ENTREGUE));
        return;
      }

      // o navegador barrou a aba: a faixa devolve o clique para a pessoa
      setPendente(guardado);
      setUrl(endereco);
    })();

    return () => {
      cancelado = true;
    };
  }, [user, loading]);

  if (!pendente || !url) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-sm bg-escutaris-verde-marca p-4 shadow-2xl">
      <button
        onClick={encerrar}
        className="absolute right-3 top-3 text-white/50 transition-colors hover:text-white"
        aria-label="Fechar"
      >
        <X size={16} />
      </button>

      <p className="font-poppins text-xs uppercase tracking-widest text-white/70">
        Seu material está liberado
      </p>
      <p className="mt-1 mb-3 pr-6 font-poppins text-sm leading-snug text-white">
        {pendente.titulo}
      </p>

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        onClick={encerrar}
        className="inline-flex items-center gap-2 rounded-sm bg-escutaris-terracota px-4 py-2 font-poppins text-sm font-medium text-white transition-colors hover:bg-escutaris-terracota/90"
      >
        <Download size={14} />
        Baixar agora
      </a>
    </div>
  );
};

export default RetomarDownload;
