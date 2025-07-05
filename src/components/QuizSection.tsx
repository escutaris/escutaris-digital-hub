import React from 'react';
import { Brain, Clock, Target, CheckCircle } from 'lucide-react';

const QuizSection = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8" id="quiz">
      <div className="max-w-6xl mx-auto">
        {/* Compact Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="h-6 w-6 text-escutaris-green" />
            <h2 className="text-2xl font-bold text-escutaris-green">Quiz Interativo</h2>
          </div>
          <p className="text-muted-foreground">Teste seus conhecimentos em riscos psicossociais</p>
        </div>

        {/* Compact Quiz Card */}
        <div className="bg-gradient-to-r from-white to-escutaris-green-light/5 rounded-xl p-6 shadow-md border border-escutaris-green-light/20 hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Content */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-escutaris-green mb-3">
                Avalie suas competências em Riscos Psicossociais
              </h3>
              
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Quiz prático de 10 perguntas para avaliar suas competências essenciais na gestão de fatores psicossociais no trabalho.
              </p>

              {/* Compact Features */}
              <div className="flex items-center gap-6 mb-4 text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-escutaris-terracotta" />
                  <span>10 perguntas</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-escutaris-terracotta" />
                  <span>Foco prático</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-escutaris-terracotta" />
                  <span>Resultado imediato</span>
                </div>
              </div>

              {/* CTA Button */}
              <a
                href="https://quiz-gptconsultor.escutaris.com/"
                target="_blank"
                rel="noreferrer"
                className="btn-primary inline-flex items-center gap-2 text-sm transition-all hover:scale-105 duration-300"
              >
                <Brain size={16} />
                Iniciar Quiz
              </a>
            </div>

            {/* Compact Visual */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-escutaris-green to-escutaris-terracotta rounded-full flex items-center justify-center shadow-md">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-escutaris-terracotta rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizSection;