
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="section-padding text-center text-muted-foreground text-sm animate-fade-in">
      <div className="border-t border-border pt-6 mt-12">
        <p>© {currentYear} Escutaris. Todos os direitos reservados.</p>
        <p className="mt-2">
          Desenvolvido com ❤️ para promover saúde mental nas organizações.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
