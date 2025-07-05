
import React from 'react';
import Header from '../components/Header';
import MaterialsSection from '../components/MaterialsSection';
import Footer from '../components/Footer';
import LoadingScreen from '../components/LoadingScreen';
import WhatsAppButton from '../components/WhatsAppButton';
import QuizSection from '../components/QuizSection';
import ConsultorSection from '../components/ConsultorSection';
import { MessageSquare, FileText, BookOpen, File } from 'lucide-react';
import NewsSection from '../components/NewsSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/20 to-accent/10">
      <LoadingScreen />
      <WhatsAppButton />
      
      <div className="max-w-7xl w-full mx-auto px-4">
        <Header />
        
        {/* All Materials Section with filtering */}
        <MaterialsSection 
          sectionId="materiais" 
          title="Materiais Escutaris" 
          icon={<FileText className="h-7 w-7" />}
          category="todos"
        />
        
        {/* Quiz Section */}
        <QuizSection />
        
        {/* Consultor Psicossocial Digital */}
        <ConsultorSection />
        
        {/* Atualizações e Notícias */}
        <NewsSection />
        
        {/* Fale com a Escutaris */}
        <section className="section-padding text-center" id="contato">
          <h2 className="text-escutaris-green text-3xl font-bold mb-8 animate-slide-in">
            Fale com a Escutaris
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-lg leading-relaxed">
            Tem dúvidas sobre como aplicar os conhecimentos ou precisa de suporte personalizado? 
            Nossa equipe está pronta para ajudar sua empresa.
          </p>
          <a 
            href="https://api.whatsapp.com/send?phone=557582217557&text=Ol%C3%A1,%20gostaria%20de%20saber%20mais%20sobre%20seus%20servi%C3%A7os" 
            target="_blank"
            rel="noreferrer"
            className="btn-primary inline-flex items-center gap-2 py-3 px-6 text-lg transition-all hover:scale-105 duration-300"
          >
            <MessageSquare size={20} /> Entrar em Contato
          </a>
        </section>
      
        <Footer />
      </div>
    </div>
  );
};

export default Index;
