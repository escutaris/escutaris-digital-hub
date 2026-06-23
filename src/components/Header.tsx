import React from 'react';
import { Link } from 'react-router-dom';
import { User, BookOpen, Wrench, MessageSquare, Newspaper } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '@/lib/useAuth';

const Header = () => {
  const { user, isAdmin } = useAuth();

  const scrollToMateriais = () => {
    document.getElementById('materiais')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-escutaris-offwhite/95 backdrop-blur-sm border-b border-escutaris-verde/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="h-10 w-10" />

          <div className="hidden md:flex items-center gap-8 text-sm font-poppins text-escutaris-verde/70">
            <a href="#comunidade" className="hover:text-escutaris-verde transition-colors">A Comunidade</a>
            <a href="#materiais" className="hover:text-escutaris-verde transition-colors">Materiais</a>
            <a href="#videos" className="hover:text-escutaris-verde transition-colors">Vídeos</a>
            <a href="#contato" className="hover:text-escutaris-verde transition-colors">Contato</a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden sm:flex items-center gap-1.5 text-sm font-poppins text-escutaris-verde/70 hover:text-escutaris-verde transition-colors"
                  >
                    Painel
                  </Link>
                )}
                <Link
                  to="/conta"
                  className="flex items-center gap-1.5 text-sm font-poppins text-escutaris-verde border border-escutaris-verde/30 px-4 py-1.5 rounded-sm hover:border-escutaris-verde transition-colors"
                >
                  <User size={15} />
                  Minha conta
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-poppins text-escutaris-verde px-3 py-1.5 hover:text-escutaris-verde/70 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="text-sm font-poppins font-medium text-white bg-escutaris-terracota px-4 py-1.5 rounded-sm hover:bg-escutaris-terracota/90 transition-colors"
                >
                  Criar conta grátis
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-escutaris-verde text-white py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <img
          src="/assets/comunidade-hero.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-escutaris-verde/70 via-escutaris-verde/60 to-escutaris-verde/90" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-xs font-poppins tracking-widest uppercase mb-8 text-white/80">
            Comunidade Escutaris
          </div>

          <h1 className="font-cormorant text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight mb-6">
            A comunidade de quem cuida<br className="hidden md:block" /> da saúde mental no trabalho
          </h1>

          <p className="font-poppins text-white/70 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Materiais técnicos, ferramentas, notícias e atualizações sobre NR-1,
            ISO 45003 e riscos psicossociais — em um só lugar, feito para RH, SST e lideranças.
            Entrar é gratuito.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <button
                onClick={scrollToMateriais}
                className="bg-escutaris-terracota text-white font-poppins font-medium px-8 py-3 rounded-sm hover:bg-escutaris-terracota/90 transition-colors"
              >
                Ir para os materiais
              </button>
            ) : (
              <Link
                to="/cadastro"
                className="bg-escutaris-terracota text-white font-poppins font-medium px-8 py-3 rounded-sm hover:bg-escutaris-terracota/90 transition-colors"
              >
                Criar conta gratuita
              </Link>
            )}
            <a
              href="#materiais-escutaris"
              className="border border-white/30 text-white font-poppins px-8 py-3 rounded-sm hover:bg-white/10 transition-colors text-center"
            >
              Conhecer o acervo
            </a>
          </div>
        </div>
      </section>

      {/* Quick access bar */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-center gap-6">
          <a href="#materiais" className="flex items-center gap-2 text-sm font-poppins text-escutaris-verde/70 hover:text-escutaris-verde transition-colors">
            <BookOpen size={15} /> Materiais técnicos
          </a>
          <span className="text-border hidden sm:block">|</span>
          <a href="#videos" className="flex items-center gap-2 text-sm font-poppins text-escutaris-verde/70 hover:text-escutaris-verde transition-colors">
            <Wrench size={15} /> Vídeos
          </a>
          <span className="text-border hidden sm:block">|</span>
          <a href="#comunidade" className="flex items-center gap-2 text-sm font-poppins text-escutaris-verde/70 hover:text-escutaris-verde transition-colors">
            <Newspaper size={15} /> A comunidade
          </a>
          <span className="text-border hidden sm:block">|</span>
          <a href="#contato" className="flex items-center gap-2 text-sm font-poppins text-escutaris-verde/70 hover:text-escutaris-verde transition-colors">
            <MessageSquare size={15} /> Fale com a Escutaris
          </a>
        </div>
      </div>
    </>
  );
};

export default Header;
