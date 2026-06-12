import React from 'react';
import { BookOpen, FileText, MessageCircle, ArrowUpRight } from 'lucide-react';

interface Publicacao {
  url: string;
  rotulo: string;
  icone: React.ReactNode;
  titulo: React.ReactNode;
  descricao: string;
  cta: string;
  capa?: string;
  capaAlt?: string;
}

const publicacoes: Publicacao[] = [
  {
    url: 'https://livrotrabalhodoi.escutaris.com/',
    rotulo: 'Livro',
    icone: <BookOpen size={16} className="text-escutaris-terracota" />,
    titulo: <>Quando o<br />Trabalho Dói</>,
    descricao:
      'Do adoecimento silencioso à cultura de bem-estar. Um guia essencial sobre saúde mental no trabalho — para quem lidera, cuida ou simplesmente trabalha.',
    cta: 'Conhecer o livro',
    capa: '/assets/capa-livro-trabalho-doi.webp',
    capaAlt: 'Capa do livro Quando o Trabalho Dói',
  },
  {
    url: 'https://guia.anateixeiramed.com.br/',
    rotulo: 'Guia técnico',
    icone: <FileText size={16} className="text-escutaris-terracota" />,
    titulo: <>Do Relato à<br />Tomada de Decisão</>,
    descricao:
      'Avaliação técnica do nexo entre transtornos de saúde mental e contexto ocupacional, em 12 passos — com base na NR-1, NR-17 e Portaria MTE 1.419/2024.',
    cta: 'Conhecer o guia',
  },
  {
    url: 'https://guiaquandoelafala.escutaris.com/',
    rotulo: 'Guia de comunicação',
    icone: <MessageCircle size={16} className="text-escutaris-terracota" />,
    titulo: <>Quando Ela Fala,<br />Todo Mundo Ouve</>,
    descricao:
      'Para mulheres que desejam se posicionar com clareza no ambiente profissional — com exemplos reais de comunicação consciente, firme e respeitosa.',
    cta: 'Conhecer o guia',
    capa: '/assets/capa-guia-quando-ela-fala.webp',
    capaAlt: 'Capa do guia Quando Ela Fala, Todo Mundo Ouve',
  },
];

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
        {publicacoes.map((p) => (
          <a
            key={p.url}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="group bg-white border border-escutaris-verde/15 rounded-lg p-7 flex flex-col hover:shadow-xl transition-shadow"
          >
            {p.capa ? (
              <div className="flex justify-center mb-6 pt-2">
                <img
                  src={p.capa}
                  alt={p.capaAlt}
                  loading="lazy"
                  className="h-52 w-auto rounded-sm shadow-lg group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="flex justify-center items-center mb-6 pt-2">
                <div className="h-52 w-36 rounded-sm bg-escutaris-oat border border-escutaris-verde/10 flex flex-col items-center justify-center gap-3 text-escutaris-oliva">
                  <FileText size={28} />
                  <span className="font-poppins text-[10px] tracking-widest uppercase text-center px-3">
                    Guia técnico<br />27 páginas
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mb-3">
              {p.icone}
              <span className="font-poppins text-xs tracking-widest uppercase text-escutaris-verde/60">
                {p.rotulo}
              </span>
            </div>

            <h3 className="font-cormorant text-2xl font-semibold text-escutaris-verde leading-tight mb-3">
              {p.titulo}
            </h3>

            <p className="font-poppins text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
              {p.descricao}
            </p>

            <span className="inline-flex items-center gap-1.5 font-poppins text-sm font-medium text-escutaris-terracota group-hover:gap-3 transition-all">
              {p.cta} <ArrowUpRight size={15} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default PublicacoesSection;
