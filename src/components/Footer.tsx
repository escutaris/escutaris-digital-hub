
import React from 'react';
import { Instagram, Linkedin, Youtube } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="section-padding text-center text-muted-foreground animate-fade-in">
      <div className="border-t border-border pt-10 mt-12">
        <div className="flex flex-col items-center gap-8">
          <Logo />
          
          <div className="flex flex-col gap-4 md:flex-row md:gap-10 items-center justify-center">
            <a 
              href="https://escutaris.com.br/" 
              target="_blank" 
              rel="noreferrer" 
              className="text-foreground hover:text-escutaris-green transition-colors"
            >
              escutaris.com.br
            </a>
            <a 
              href="mailto:contato@escutaris.com.br" 
              className="text-foreground hover:text-escutaris-green transition-colors"
            >
              contato@escutaris.com.br
            </a>
          </div>
          
          <div className="flex gap-6 items-center justify-center">
            <a 
              href="https://www.instagram.com/escutarissaudemental/" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-escutaris-terracotta text-muted-foreground transition-colors"
              aria-label="Instagram da Escutaris"
            >
              <Instagram size={24} />
            </a>
            <a 
              href="https://www.linkedin.com/in/escutaris/" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-escutaris-terracotta text-muted-foreground transition-colors"
              aria-label="LinkedIn da Escutaris"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="https://www.youtube.com/@Escutaris" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-escutaris-terracotta text-muted-foreground transition-colors"
              aria-label="Canal do Youtube da Escutaris"
            >
              <Youtube size={24} />
            </a>
          </div>
          
          <div>
            <p>© {currentYear} Escutaris. Todos os direitos reservados.</p>
            <p className="mt-2">
              Desenvolvido com ❤️ para promover saúde mental nas organizações.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
