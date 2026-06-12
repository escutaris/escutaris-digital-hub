import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Lock } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';

const beneficiosGratuitos = [
  'Biblioteca completa de materiais técnicos para baixar',
  'Favoritos e histórico — retome de onde parou',
  'Notícias e atualizações sobre NR-1 e riscos psicossociais',
  'Vídeos novos do canal toda semana',
];

const beneficiosPremium = [
  'Ferramentas completas e modelos prontos para aplicar na empresa',
  'Consultor Psicossocial Digital incluído na assinatura',
  'Conteúdos exclusivos e aprofundados',
  'Condição especial para quem entrar na comunidade desde o início',
];

const ClubeSection = () => {
  const { user } = useAuth();

  return (
    <section className="section-padding" id="comunidade">
      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <div>
          <p className="font-poppins text-xs tracking-widest uppercase text-escutaris-terracota mb-3">
            Como funciona
          </p>
          <h2 className="section-title mb-3">
            Uma comunidade para quem cuida de quem trabalha
          </h2>
          <p className="font-poppins text-sm text-muted-foreground leading-relaxed">
            Profissionais de RH, SST e lideranças reunidos em torno de um mesmo objetivo:
            ambientes de trabalho mais saudáveis — com técnica, norma e prática.
            A Comunidade Escutaris é o lugar onde esse conhecimento circula.
          </p>
        </div>
        <img
          src="/assets/comunidade-grupo.webp"
          alt="Profissionais conversando em grupo em ambiente de trabalho acolhedor"
          loading="lazy"
          className="rounded-lg shadow-md w-full object-cover aspect-[3/2]"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Membro gratuito */}
        <div className="bg-white border border-escutaris-verde/15 rounded-lg p-8 flex flex-col">
          <p className="font-poppins text-xs tracking-widest uppercase text-escutaris-verde/60 mb-2">
            Disponível agora
          </p>
          <h3 className="font-cormorant text-3xl font-semibold text-escutaris-verde mb-1">
            Membro da comunidade
          </h3>
          <p className="font-poppins text-sm text-muted-foreground mb-6">
            Gratuito — conta criada em 30 segundos
          </p>

          <ul className="space-y-3 mb-8 flex-1">
            {beneficiosGratuitos.map((item) => (
              <li key={item} className="flex items-start gap-3 font-poppins text-sm text-foreground/80 leading-relaxed">
                <Check size={16} className="text-escutaris-terracota mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          {user ? (
            <a
              href="#materiais"
              className="bg-escutaris-verde text-white font-poppins font-medium text-center px-6 py-3 rounded-sm hover:bg-escutaris-verde/90 transition-colors"
            >
              Você já é da comunidade — explorar materiais
            </a>
          ) : (
            <Link
              to="/cadastro"
              className="bg-escutaris-terracota text-white font-poppins font-medium text-center px-6 py-3 rounded-sm hover:bg-escutaris-terracota/90 transition-colors"
            >
              Criar minha conta gratuita
            </Link>
          )}
        </div>

        {/* Premium — em breve */}
        <div className="bg-escutaris-verde-marca text-white rounded-lg p-8 flex flex-col relative overflow-hidden">
          <span className="absolute top-4 right-4 bg-escutaris-terracota text-white text-[10px] font-poppins tracking-widest uppercase px-3 py-1 rounded-full">
            Em breve
          </span>

          <p className="font-poppins text-xs tracking-widest uppercase text-white/50 mb-2">
            Para ir além
          </p>
          <h3 className="font-cormorant text-3xl font-semibold mb-1">
            Membro premium
          </h3>
          <p className="font-poppins text-sm text-white/60 mb-6">
            Assinatura — quem já é da comunidade fica sabendo primeiro
          </p>

          <ul className="space-y-3 mb-8 flex-1">
            {beneficiosPremium.map((item) => (
              <li key={item} className="flex items-start gap-3 font-poppins text-sm text-white/80 leading-relaxed">
                <Lock size={15} className="text-escutaris-terracota mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          {user ? (
            <p className="font-poppins text-xs text-white/50 text-center border border-white/20 px-6 py-3 rounded-sm">
              Você será avisada(o) por e-mail no lançamento
            </p>
          ) : (
            <Link
              to="/cadastro"
              className="border border-white/30 text-white font-poppins font-medium text-center px-6 py-3 rounded-sm hover:bg-white/10 transition-colors"
            >
              Entrar na comunidade para ser avisada(o)
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default ClubeSection;
