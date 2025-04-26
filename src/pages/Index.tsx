
import React from 'react';
import Header from '../components/Header';
import MaterialsSection from '../components/MaterialsSection';
import Footer from '../components/Footer';
import LoadingScreen from '../components/LoadingScreen';
import WhatsAppButton from '../components/WhatsAppButton';
import { MessageSquare, FileText, BookOpen, File, Calendar } from 'lucide-react';
import NoticiaCard from '../components/NoticiaCard';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-escutaris-green-light/20 to-escutaris-terracotta-light/10">
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
        
        {/* Atualizações e Notícias */}
        <section className="section-padding" id="noticias">
          <h2 className="text-escutaris-terracotta text-3xl md:text-4xl font-bold mb-8 animate-slide-in flex items-center gap-2">
            <Calendar className="h-7 w-7" /> Atualizações e Notícias
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NoticiaCard 
              title="Nova planilha de avaliação de riscos psicossociais disponível" 
              description="Lançamos uma ferramenta completa para avaliação de riscos psicossociais alinhada com a NR-1 e ISO 45003." 
              date="26 Abr, 2025"
              url="#noticia-1"
              isNew={true}
            />
            <NoticiaCard 
              title="Webinar: Saúde Mental nas Organizações" 
              description="Participe do nosso próximo webinar sobre estratégias para promover bem-estar psicológico no ambiente corporativo." 
              date="15 Abr, 2025"
              url="#noticia-2"
            />
          </div>
        </section>
        
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
            href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20Central%20Escutaris." 
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
