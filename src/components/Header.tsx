import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, BookOpen, Wrench, MessageSquare } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '@/lib/useAuth';
import LeadCaptureModal from './LeadCaptureModal';

const Header = () => {
  const { user } = useAuth();
  const [showLeadModal, setShowLeadModal] = useState(false);

  const hasLead = () => typeof window !== 'undefined' && !!localStorage.getItem('escutaris_lead');

  const handleCTA = () => {
    if (hasLead()) {
      document.getElementById('materiais')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setShowLeadModal(true);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-escutaris-offwhite/95 backdrop-blur-sm border-b border-escutaris-verde/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="h-10 w-10" />

          <div className="hidden md:flex items-center gap-8 text-sm font-poppins text-escutaris-verde/70">
            <a href="#materiais" className="hover:text-escutaris-verde transition-colors">Materiais</a>
            <a href="#ferramentas" className="hover:text-escutaris-verde transition-colors">Ferramentas</a>
            <a href="#contato" className="hover:text-escutaris-verde transition-colors">Contato</a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-sm font-poppins text-escutaris-verde hover:text-escutaris-verde/80 transition-colors"
              >
                <User size={15} />
                Painel
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-sm font-poppins text-escutaris-verde border border-escutaris-verde/30 px-4 py-1.5 rounded-sm hover:border-escutaris-verde transition-colors"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-escutaris-verde text-white py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-xs font-poppins tracking-widest uppercase mb-8 text-white/80">
            NR-1 &nbsp;·&nbsp; ISO 45003 &nbsp;·&nbsp; Saúde Mental
          </div>

          <h1 className="font-cormorant text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight mb-6">
            A referência técnica em<br className="hidden md:block" /> saúde mental no trabalho
          </h1>

          <p className="font-poppins text-white/70 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Guias, ferramentas e materiais para RH, SST e lideranças.
            Acesso gratuito — cadastre seu e-mail e comece agora.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleCTA}
              className="bg-escutaris-terracota text-white font-poppins font-medium px-8 py-3 rounded-sm hover:bg-escutaris-terracota/90 transition-colors"
            >
              Acessar os materiais
            </button>
            <a
              href="#materiais"
              className="border border-white/30 text-white font-poppins px-8 py-3 rounded-sm hover:bg-white/10 transition-colors text-center"
            >
              Ver o que tem aqui
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
          <a href="#ferramentas" className="flex items-center gap-2 text-sm font-poppins text-escutaris-verde/70 hover:text-escutaris-verde transition-colors">
            <Wrench size={15} /> Ferramentas e quiz
          </a>
          <span className="text-border hidden sm:block">|</span>
          <a href="#contato" className="flex items-center gap-2 text-sm font-poppins text-escutaris-verde/70 hover:text-escutaris-verde transition-colors">
            <MessageSquare size={15} /> Fale com a Escutaris
          </a>
        </div>
      </div>

      <LeadCaptureModal
        open={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        onSuccess={() => {
          setShowLeadModal(false);
          document.getElementById('materiais')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </>
  );
};

export default Header;
