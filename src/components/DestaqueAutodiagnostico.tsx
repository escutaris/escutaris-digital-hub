import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';

/**
 * Bloco de destaque da home: convida para o autodiagnóstico NR-1.
 * Fica logo abaixo da capa, antes do acesso rápido.
 */
const DestaqueAutodiagnostico = () => {
  return (
    <section className="section-padding" id="autodiagnostico">
      <div className="bg-escutaris-verde-marca rounded-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 p-8 sm:p-10 lg:p-12">
          <div className="flex-1 min-w-0">
            <p className="font-poppins text-[11px] tracking-[0.2em] uppercase text-escutaris-ambar mb-3">
              Autodiagnóstico gratuito · NR-1 psicossocial
            </p>

            <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-4">
              Onde a sua empresa está na NR-1?
            </h2>

            <p className="font-poppins text-sm sm:text-base text-white/75 leading-relaxed max-w-2xl">
              São 32 perguntas sobre o ciclo completo de um diagnóstico psicossocial, do
              planejamento à ação. Você responde e vê, na hora, o que já está de pé e onde
              estão as lacunas.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 font-poppins text-xs text-white/55">
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                4 minutos
              </span>
              <span>Para RH, SESMT e liderança</span>
              <span>Elaborado pela equipe técnica da Escutaris</span>
            </div>
          </div>

          <div className="flex-shrink-0">
            <a
              href="https://autodiagnostico.escutaris.com.br/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-escutaris-terracota text-white font-poppins font-medium px-7 py-4 rounded-sm hover:bg-escutaris-terracota/90 transition-colors group"
            >
              Fazer o autodiagnóstico
              <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestaqueAutodiagnostico;
