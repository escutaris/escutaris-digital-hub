import React from 'react';
import { Brain, Bot, FileText, ExternalLink } from 'lucide-react';

const DestaquesSection = () => {
  const acessos = [
    {
      title: 'Quiz Interativo',
      icon: <Brain className="h-5 w-5" />,
      url: 'https://quiz-gptconsultor.escutaris.com/',
      description: 'Avalie suas competências',
    },
    {
      title: 'Consultor Digital',
      icon: <Bot className="h-5 w-5" />,
      url: 'https://chatgpt.com/g/g-6758b41e39988191b59b0e966fe3a6a8-consultor-psicossocial-digital',
      description: 'GPT especializado',
    },
    {
      title: 'Materiais Técnicos',
      icon: <FileText className="h-5 w-5" />,
      url: '#materiais',
      description: 'Biblioteca completa',
    },
  ];

  return (
    <section className="section-padding" id="acessos-rapidos">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 bg-muted/30 rounded-lg border">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Acesso Rápido
          </h3>
          <p className="text-sm text-muted-foreground">
            Ferramentas e recursos essenciais
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {acessos.map((acesso, index) => (
            <a
              key={index}
              href={acesso.url}
              target={acesso.url.startsWith('http') ? '_blank' : '_self'}
              rel={acesso.url.startsWith('http') ? 'noreferrer' : undefined}
              className="flex items-center gap-3 p-3 bg-background rounded-lg border hover:shadow-md transition-all duration-200 group min-w-0"
            >
              <div className="flex-shrink-0 p-2 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors">
                {acesso.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                    {acesso.title}
                  </span>
                  {acesso.url.startsWith('http') && (
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {acesso.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestaquesSection;