import React from 'react';
import { Star, Brain, Bot, FileText, ArrowRight } from 'lucide-react';

const DestaquesSection = () => {
  const destaques = [
    {
      title: 'Quiz Interativo',
      description: 'Avalie suas competências em riscos psicossociais com nosso quiz prático de 10 perguntas.',
      icon: <Brain className="h-8 w-8" />,
      action: 'Fazer Quiz',
      url: 'https://quiz-gptconsultor.escutaris.com/',
      gradient: 'from-escutaris-green to-escutaris-green-light',
      badge: 'GRÁTIS',
    },
    {
      title: 'Consultor Digital',
      description: 'Acesso imediato ao nosso GPT especializado em fatores psicossociais no trabalho.',
      icon: <Bot className="h-8 w-8" />,
      action: 'Acessar Consultor',
      url: 'https://chatgpt.com/g/g-6758b41e39988191b59b0e966fe3a6a8-consultor-psicossocial-digital',
      gradient: 'from-escutaris-terracotta to-escutaris-terracotta-light',
      badge: 'NOVO',
    },
    {
      title: 'Materiais Técnicos',
      description: 'Biblioteca completa com ferramentas práticas, guias e materiais atualizados conforme NR-1 e ISO 45003.',
      icon: <FileText className="h-8 w-8" />,
      action: 'Ver Materiais',
      url: '#materiais',
      gradient: 'from-primary to-primary/80',
      badge: 'ATUALIZADO',
    },
  ];

  return (
    <section className="section-padding" id="destaques">
      <h2 className="text-escutaris-green text-3xl md:text-4xl font-bold mb-8 animate-slide-in flex items-center gap-2">
        <Star className="h-7 w-7" /> Destaques
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {destaques.map((destaque, index) => (
          <div
            key={index}
            className="glass-card overflow-hidden animate-fade-in transition-all hover:shadow-xl hover:scale-105 duration-300 group"
          >
            {/* Header com gradiente */}
            <div className={`relative p-6 bg-gradient-to-br ${destaque.gradient} text-white`}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  {destaque.icon}
                </div>
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                  {destaque.badge}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">
                {destaque.title}
              </h3>
            </div>
            
            {/* Conteúdo */}
            <div className="p-6">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {destaque.description}
              </p>
              
              <a
                href={destaque.url}
                target={destaque.url.startsWith('http') ? '_blank' : '_self'}
                rel={destaque.url.startsWith('http') ? 'noreferrer' : undefined}
                className="btn-primary w-full flex items-center justify-center gap-2 transition-all hover:scale-105 duration-300"
              >
                {destaque.action}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {/* Call to action adicional */}
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4 text-lg">
          Explore todos os recursos da Central Escutaris
        </p>
        <a
          href="#contato"
          className="btn-secondary inline-flex items-center gap-2 transition-all hover:scale-105 duration-300"
        >
          Fale Conosco <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
};

export default DestaquesSection;