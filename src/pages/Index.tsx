
import React from 'react';
import Header from '../components/Header';
import MaterialCard from '../components/MaterialCard';
import LegislacaoCard from '../components/LegislacaoCard';
import FerramentaCard from '../components/FerramentaCard';
import NoticiaCard from '../components/NoticiaCard';
import Footer from '../components/Footer';
import LoadingScreen from '../components/LoadingScreen';
import WhatsAppButton from '../components/WhatsAppButton';
import { MessageSquare, FileText, BookOpen, File, Calendar } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-escutaris-green-light/20 to-escutaris-terracotta-light/10">
      <LoadingScreen />
      <WhatsAppButton />
      
      <div className="max-w-7xl w-full mx-auto px-4">
        <Header />
        
        {/* Materiais Escutaris */}
        <section className="section-padding" id="materiais">
          <h2 className="text-escutaris-green text-3xl md:text-4xl font-bold mb-8 animate-slide-in flex items-center gap-2">
            <FileText className="h-7 w-7" /> Materiais Escutaris
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MaterialCard 
              title="Guia Rápido: Avaliação Psicossocial no PGR" 
              description="Um passo a passo prático para implementar os fatores psicossociais no seu PGR." 
              downloadUrl="#material-1"
              isNew={true}
            />
            <MaterialCard 
              title="Checklist de Conformidade: NR-1 e ISO 45003" 
              description="Checklist completo para avaliar sua empresa nas novas exigências psicossociais." 
              downloadUrl="#material-2"
            />
            <MaterialCard 
              title="Ebook Saúde Mental nas Organizações" 
              description="Principais riscos, desafios e soluções para proteger o bem-estar dos colaboradores." 
              downloadUrl="#material-3"
            />
          </div>
        </section>
        
        {/* Entenda a Legislação */}
        <section className="section-padding" id="legislacao">
          <h2 className="text-escutaris-terracotta text-3xl md:text-4xl font-bold mb-8 animate-slide-in flex items-center gap-2">
            <BookOpen className="h-7 w-7" /> Entenda a Legislação
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <LegislacaoCard 
              title="NR-1: Disposições Gerais" 
              description="Um resumo prático sobre as exigências da NR-1 em relação aos fatores psicossociais." 
              downloadUrl="#legislacao-1"
            />
            <LegislacaoCard 
              title="ISO 45003: Guia Completo" 
              description="Tudo que você precisa saber sobre a ISO 45003 e sua aplicação prática." 
              downloadUrl="#legislacao-2"
              isNew={true}
            />
          </div>
        </section>
        
        {/* Ferramentas Práticas */}
        <section className="section-padding" id="ferramentas">
          <h2 className="text-escutaris-green text-3xl md:text-4xl font-bold mb-8 animate-slide-in flex items-center gap-2">
            <File className="h-7 w-7" /> Ferramentas Práticas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FerramentaCard 
              title="Planilha de Avaliação de Riscos Psicossociais" 
              description="Template adaptável para integrar ao seu PGR e fazer avaliações conforme a NR-1." 
              downloadUrl="#ferramenta-1"
              isNew={true}
            />
            <FerramentaCard 
              title="Template de Plano de Ação" 
              description="Organize suas ações para gerenciar os riscos psicossociais identificados." 
              downloadUrl="#ferramenta-2"
            />
            <FerramentaCard 
              title="Formulário de Pesquisa Organizacional" 
              description="Modelo para coleta de informações sobre fatores psicossociais no trabalho." 
              downloadUrl="#ferramenta-3"
            />
          </div>
        </section>
        
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
