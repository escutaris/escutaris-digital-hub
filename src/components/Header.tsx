
import React from 'react';

const Header = () => {
  return (
    <header className="section-padding text-center animate-fade-in">
      <h1 className="text-escutaris-green text-4xl font-bold mb-6 animate-slide-in">
        Bem-vindo à Central Escutaris
      </h1>
      <p className="text-muted-foreground max-w-3xl mx-auto">
        Seu ponto de apoio técnico e estratégico sobre fatores psicossociais no trabalho.
        Acesse materiais práticos, ferramentas, atualizações e novidades, sempre atualizados 
        conforme a NR-1 e ISO 45003.
      </p>
      <p className="text-escutaris-green font-semibold mt-4">
        Salve este link e volte sempre!
      </p>
    </header>
  );
};

export default Header;
