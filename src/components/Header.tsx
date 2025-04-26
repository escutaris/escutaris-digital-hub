
import React from 'react';
import Logo from './Logo';

const Header = () => {
  return (
    <header className="section-padding text-center animate-fade-in">
      <div className="flex flex-col items-center justify-center mb-8">
        <Logo className="mb-6" />
        <h1 className="text-escutaris-green text-4xl sm:text-5xl font-bold mb-6 animate-slide-in">
          Bem-vindo à Central Escutaris
        </h1>
      </div>
      <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
        Seu ponto de apoio técnico e estratégico sobre fatores psicossociais no trabalho.
        Acesse materiais práticos, ferramentas, atualizações e novidades, sempre atualizados 
        conforme a NR-1 e ISO 45003.
      </p>
      <p className="text-escutaris-green font-semibold mt-4 text-lg">
        Salve este link e volte sempre!
      </p>
    </header>
  );
};

export default Header;
