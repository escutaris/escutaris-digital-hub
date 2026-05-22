import React from 'react';
import Header from '../components/Header';
import MaterialsSection from '../components/MaterialsSection';
import Footer from '../components/Footer';
import LoadingScreen from '../components/LoadingScreen';
import WhatsAppButton from '../components/WhatsAppButton';
import QuizSection from '../components/QuizSection';
import ConsultorSection from '../components/ConsultorSection';
import ReferenciasSection from '../components/ReferenciasSection';
import DestaquesSection from '../components/DestaquesSection';
import { FileText, MessageSquare } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-escutaris-offwhite">
      <LoadingScreen />
      <WhatsAppButton />

      <Header />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Destaques / Acesso rápido */}
        <DestaquesSection />

        {/* Materiais técnicos */}
        <MaterialsSection
          sectionId="materiais"
          title="Materiais Técnicos"
          icon={<FileText className="h-6 w-6" />}
          category="todos"
        />

        {/* Ferramentas e Quiz */}
        <div id="ferramentas">
          <QuizSection />
          <ConsultorSection />
        </div>

        {/* Referências */}
        <ReferenciasSection />

        {/* Fale com a Escutaris */}
        <section className="section-padding text-center border-t border-border" id="contato">
          <h2 className="section-title mb-3">Fale com a Escutaris</h2>
          <p className="font-poppins text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
            Tem dúvidas sobre como aplicar os conhecimentos ou precisa de suporte personalizado?
            Nossa equipe está pronta para ajudar sua empresa.
          </p>
          <a
            href="https://api.whatsapp.com/send?phone=557582217557&text=Ol%C3%A1,%20gostaria%20de%20saber%20mais%20sobre%20seus%20servi%C3%A7os"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <MessageSquare size={16} /> Entrar em Contato
          </a>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
