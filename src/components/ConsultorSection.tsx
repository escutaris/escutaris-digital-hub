import React from 'react';
import { Bot, Shield, BookCheck, Lightbulb, Star, ArrowRight } from 'lucide-react';

const ConsultorSection = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8" id="consultor">
      <div className="max-w-6xl mx-auto">
        {/* Compact Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bot className="h-6 w-6 text-escutaris-terracotta" />
            <h2 className="text-2xl font-bold text-escutaris-green">Consultor Psicossocial Digital</h2>
          </div>
          <p className="text-escutaris-terracotta font-medium">Seu assistente especializado em riscos psicossociais</p>
        </div>

        {/* Compact Main Card */}
        <div className="bg-gradient-to-r from-white to-escutaris-terracotta-light/5 rounded-xl p-6 shadow-md border border-escutaris-terracotta-light/20">
          <div className="grid lg:grid-cols-3 gap-6 items-center">
            {/* Content */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-escutaris-green mb-3">
                Transforme seus Diagnósticos Psicossociais com Apoio Técnico Especializado
              </h3>
              
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Assistente digital para interpretar normas, fortalecer o PGR e reduzir a pressão das decisões técnicas, com segurança e respaldo científico.
              </p>

              {/* Compact Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-start gap-2">
                  <BookCheck className="h-4 w-4 text-escutaris-terracotta mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-escutaris-green text-sm">Interpretação Especializada</h4>
                    <p className="text-xs text-muted-foreground">Suporte técnico para normas e documentos</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-escutaris-terracotta mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-escutaris-green text-sm">Base Científica</h4>
                    <p className="text-xs text-muted-foreground">Fundamentado em regulamentações oficiais</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-escutaris-terracotta mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-escutaris-green text-sm">Fontes Validadas</h4>
                    <p className="text-xs text-muted-foreground">Questionários e práticas reconhecidas</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-escutaris-terracotta mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-escutaris-green text-sm">Boas Práticas</h4>
                    <p className="text-xs text-muted-foreground">Sugestões para fortalecer o PGR</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Pricing & CTA */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-escutaris-terracotta to-escutaris-terracotta-dark rounded-lg p-4 text-white mb-4">
                <div className="mb-3">
                  <p className="text-xs opacity-90 mb-1">Oferta especial:</p>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-sm line-through opacity-70">R$97</span>
                    <span className="text-2xl font-bold">R$27</span>
                  </div>
                  <p className="text-xs opacity-90">acesso imediato!</p>
                </div>
                
                <div className="flex justify-center mb-3">
                  <img 
                    src="/assets/consultor-psicossocial.png"
                    alt="Consultor Psicossocial Digital"
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>

              <a
                href="https://chk.eduzz.com/D0RAEKJ19Y"
                target="_blank"
                rel="noreferrer"
                className="bg-escutaris-terracotta hover:bg-escutaris-terracotta-dark text-white px-6 py-3 rounded-lg font-semibold text-sm inline-flex items-center gap-2 transition-all hover:scale-105 duration-300 shadow-md w-full justify-center"
              >
                Acessar Agora
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultorSection;