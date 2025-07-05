import React from 'react';
import { Bot, Shield, BookCheck, Lightbulb, Star, ArrowRight } from 'lucide-react';

const ConsultorSection = () => {
  return (
    <section className="section-padding" id="consultor">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="h-8 w-8 text-escutaris-terracotta" />
            <h2 className="text-3xl font-bold text-escutaris-green">
              Consultor Psicossocial Digital
            </h2>
          </div>
          <p className="text-xl text-escutaris-terracotta font-medium mb-2">
            Seu assistente especializado
          </p>
          <p className="text-muted-foreground text-lg">
            Apoio técnico atualizado
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-white to-escutaris-terracotta-light/10 rounded-2xl p-8 shadow-xl border border-escutaris-terracotta-light/20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div>
              <h3 className="text-2xl font-bold text-escutaris-green mb-6">
                Transforme seus Diagnósticos Psicossociais com Apoio Atualizado e Baseado nas Normas Oficiais
              </h3>
              
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Consultor Psicossocial Digital — Seu assistente especializado para interpretar normas, 
                fortalecer o PGR e reduzir a pressão das decisões técnicas, com segurança e respaldo.
              </p>

              {/* Benefits */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <BookCheck className="h-5 w-5 text-escutaris-terracotta mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-escutaris-green mb-1">Interpretação Especializada</h4>
                    <p className="text-sm text-muted-foreground">
                      Receba suporte técnico para interpretar normas e documentos, sem abrir mão da sua autonomia profissional.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-escutaris-terracotta mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-escutaris-green mb-1">Apoio Técnico de Confiança</h4>
                    <p className="text-sm text-muted-foreground">
                      Fundamentado em regulamentações oficiais, guias do MTE e literatura científica nacional e internacional.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-escutaris-terracotta mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-escutaris-green mb-1">Fontes de Pesquisa Validadas</h4>
                    <p className="text-sm text-muted-foreground">
                      Referência em questionários, matrizes de avaliação e práticas reconhecidas em SST.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-escutaris-terracotta mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-escutaris-green mb-1">Insights e Boas Práticas</h4>
                    <p className="text-sm text-muted-foreground">
                      Obtenha sugestões práticas para fortalecer seu diagnóstico e documentação do PGR.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & CTA */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-escutaris-terracotta to-escutaris-terracotta-dark rounded-xl p-6 text-white mb-6">
                <div className="mb-4">
                  <p className="text-sm opacity-90 mb-2">Oferta especial:</p>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-lg line-through opacity-70">De R$97</span>
                    <span className="text-3xl font-bold">R$27</span>
                  </div>
                  <p className="text-sm opacity-90">acesso imediato!</p>
                </div>
                
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-12 w-12 text-white" />
                </div>
              </div>

              <p className="text-center text-muted-foreground mb-6 italic">
                "Transforme a pressão do PGR em segurança e confiança com o apoio do nosso Consultor Psicossocial Digital."
              </p>

              <a
                href="https://chk.eduzz.com/D0RAEKJ19Y"
                target="_blank"
                rel="noreferrer"
                className="bg-escutaris-terracotta hover:bg-escutaris-terracotta-dark text-white px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-2 transition-all hover:scale-105 duration-300 shadow-lg"
              >
                Acessar Agora
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultorSection;