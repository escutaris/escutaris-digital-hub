import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * Aba presa na lateral direita: leva a comunidade até o site da Escutaris.
 *
 * A comunidade é a porta de entrada gratuita; quem passa dela procurando
 * material técnico é exatamente quem pode precisar de um diagnóstico. A aba
 * fica à vista o tempo todo em que a pessoa percorre o acervo, sem cobrir o
 * conteúdo e sem disputar espaço com o botão do WhatsApp, que fica no canto
 * de baixo.
 *
 * Escondida em telas pequenas: no celular ela cobriria parte da leitura, e a
 * home já traz o bloco do autodiagnóstico logo abaixo da capa.
 */
const AbaDiagnostico = () => {
  return (
    <a
      href="https://www.escutaris.com.br/diagnostico-dos-fatores-psicossociais-e-saude-mental-no-trabalho"
      target="_blank"
      rel="noreferrer"
      className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 w-[124px] flex-col gap-0.5
                 rounded-l-sm bg-escutaris-terracota px-3 py-2.5 text-white shadow-md
                 transition-all duration-200 hover:bg-escutaris-ares hover:pr-5"
    >
      <span className="font-poppins text-[8px] uppercase tracking-[0.16em] text-white/70">
        Com a Escutaris
      </span>

      <span className="font-cormorant text-[13px] font-semibold leading-tight">
        Faça o diagnóstico dos fatores psicossociais
      </span>

      <span className="mt-0.5 inline-flex items-center gap-1 font-poppins text-[10px] font-medium">
        Clique aqui
        <ArrowRight size={10} />
      </span>
    </a>
  );
};

export default AbaDiagnostico;
