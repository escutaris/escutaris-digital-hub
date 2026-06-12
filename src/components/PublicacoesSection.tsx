import React from 'react';
import { BookOpen, FileText, MessageCircle, ArrowUpRight } from 'lucide-react';

const PublicacoesSection = () => {
  return (
    <section className="section-padding" id="publicacoes">
      <div className="text-center mb-10">
        <p className="font-poppins text-xs tracking-widest uppercase text-escutaris-terracota mb-3">
          Para ir mais fundo
        </p>
        <h2 className="section-title mb-3">Publicações da Dra. Ana Paula Teixeira</h2>
        <p className="font-poppins text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          O conhecimento por trás da Escutaris: um livro para entender,
          um guia para aplicar e um guia para se posicionar.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Livro */}
        <a
          href="https://livrotrabalhodoi.escutaris.com/"
          target="_blank"
          rel="noreferrer"
          className="group bg-escutaris-verde text-white rounded-lg p-8 flex flex-col hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-2 mb-5">
            <BookOpen size={16} className="text-escutaris-terracota" />
            <span className="font-poppins text-xs tracking-widest uppercase text-white/60">
              Livro
            </span>
          </div>

          <h3 className="font-cormorant text-3xl font-semibold leading-tight mb-3">
            Quando o<br />Trabalho Dói
          </h3>

          <p className="font-poppins text-sm text-white/70 leading-relaxed flex-1 mb-6">
            Do adoecimento silencioso à cultura de bem-estar. Um guia essencial
            sobre saúde mental no trabalho — para quem lidera, cuida ou simplesmente trabalha.
          </p>

          <span className="inline-flex items-center gap-1.5 font-poppins text-sm font-medium text-escutaris-terracota group-hover:gap-3 transition-all">
            Conhecer o livro <ArrowUpRight size={15} />
          </span>
        </a>

        {/* Guia técnico */}
        <a
          href="https://guia.anateixeiramed.com.br/"
          target="_blank"
          rel="noreferrer"
          className="group bg-white border border-escutaris-verde/15 rounded-lg p-8 flex flex-col hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-2 mb-5">
            <FileText size={16} className="text-escutaris-terracota" />
            <span className="font-poppins text-xs tracking-widest uppercase text-escutaris-verde/60">
              Guia técnico
            </span>
          </div>

          <h3 className="font-cormorant text-3xl font-semibold text-escutaris-verde leading-tight mb-3">
            Do Relato à<br />Tomada de Decisão
          </h3>

          <p className="font-poppins text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
            Avaliação técnica do nexo entre transtornos de saúde mental e contexto
            ocupacional, em 12 passos — com base na NR-1, NR-17 e Portaria MTE 1.419/2024.
          </p>

          <span className="inline-flex items-center gap-1.5 font-poppins text-sm font-medium text-escutaris-terracota group-hover:gap-3 transition-all">
            Conhecer o guia <ArrowUpRight size={15} />
          </span>
        </a>

        {/* Guia de comunicação */}
        <a
          href="https://guiaquandoelafala.escutaris.com/"
          target="_blank"
          rel="noreferrer"
          className="group bg-escutaris-offwhite border border-escutaris-terracota/30 rounded-lg p-8 flex flex-col hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-2 mb-5">
            <MessageCircle size={16} className="text-escutaris-terracota" />
            <span className="font-poppins text-xs tracking-widest uppercase text-escutaris-verde/60">
              Guia de comunicação
            </span>
          </div>

          <h3 className="font-cormorant text-3xl font-semibold text-escutaris-verde leading-tight mb-3">
            Quando Ela Fala,<br />Todo Mundo Ouve
          </h3>

          <p className="font-poppins text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
            Para mulheres que desejam se posicionar com clareza no ambiente
            profissional — com exemplos reais de comunicação consciente, firme e respeitosa.
          </p>

          <span className="inline-flex items-center gap-1.5 font-poppins text-sm font-medium text-escutaris-terracota group-hover:gap-3 transition-all">
            Conhecer o guia <ArrowUpRight size={15} />
          </span>
        </a>
      </div>
    </section>
  );
};

export default PublicacoesSection;
