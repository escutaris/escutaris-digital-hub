import React from 'react';
import { Brain, Clock, Target, CheckCircle } from 'lucide-react';

const QuizSection = () => {
  return (
    <section className="section-padding" id="quiz">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-escutaris-green" />
            <h2 className="text-3xl font-bold text-escutaris-green">
              Quiz Interativo
            </h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Teste seus conhecimentos e avalie suas competências
          </p>
        </div>

        {/* Quiz Card */}
        <div className="bg-gradient-to-br from-white to-escutaris-green-light/10 rounded-2xl p-8 shadow-lg border border-escutaris-green-light/20 hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-2xl font-bold text-escutaris-green mb-4">
                Riscos Psicossociais na Prática: Avalie suas competências!
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Além da teoria, a gestão de riscos psicossociais exige aplicação prática. 
                Como você se sai ao identificar fatores, escolher métodos ou integrar ações ao PGR? 
                Faça este quiz rápido de 10 perguntas e avalie suas competências essenciais para o dia a dia.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-escutaris-terracotta" />
                  <span>10 perguntas</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-escutaris-terracotta" />
                  <span>Foco prático</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-escutaris-terracotta" />
                  <span>Avaliação imediata</span>
                </div>
              </div>

              {/* CTA Button */}
              <a
                href="https://quiz-gptconsultor.escutaris.com/"
                target="_blank"
                rel="noreferrer"
                className="btn-primary inline-flex items-center gap-2 py-3 px-8 text-lg transition-all hover:scale-105 duration-300"
              >
                <Brain size={20} />
                Iniciar Quiz
              </a>
            </div>

            {/* Visual Element */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-escutaris-green to-escutaris-terracotta rounded-full flex items-center justify-center shadow-lg">
                  <Brain className="h-16 w-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-escutaris-terracotta rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">10</span>
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