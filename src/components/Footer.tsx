import React from 'react';
import { Instagram, Linkedin, Youtube } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-escutaris-verde text-white/70 py-14 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div className="flex flex-col gap-4">
            <Logo size="h-10 w-10" />
            <p className="font-cormorant text-xl text-white/90 font-medium max-w-xs leading-snug">
              Referência técnica em saúde mental e riscos psicossociais no trabalho.
            </p>
          </div>

          <div className="flex flex-col gap-3 font-poppins text-sm">
            <a
              href="https://escutaris.com.br/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              escutaris.com.br
            </a>
            <a
              href="mailto:contato@escutaris.com.br"
              className="hover:text-white transition-colors"
            >
              contato@escutaris.com.br
            </a>
          </div>

          <div className="flex gap-5">
            <a href="https://www.instagram.com/escutarissaudemental/" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
            <a href="https://www.linkedin.com/in/escutaris/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="https://www.youtube.com/@Escutaris" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-white transition-colors">
              <Youtube size={20} />
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6">
          <p className="font-poppins text-xs text-white/40 text-center">
            © {currentYear} Escutaris. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
