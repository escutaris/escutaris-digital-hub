
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, User } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '@/lib/useAuth';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="section-padding text-center animate-fade-in">
      {/* Navigation */}
      {user && (
        <nav className="flex justify-center items-center gap-6 mb-8">
          <Link 
            to="/favoritos" 
            className="flex items-center gap-2 text-escutaris-green hover:text-escutaris-green/80 transition-colors"
          >
            <Heart size={18} />
            Meus Favoritos
          </Link>
          <Link 
            to="/login" 
            className="flex items-center gap-2 text-escutaris-green hover:text-escutaris-green/80 transition-colors"
          >
            <User size={18} />
            Perfil
          </Link>
        </nav>
      )}
      
      <div className="flex flex-col items-center justify-center mb-8">
        <Logo className="mb-6" size="h-28 w-28" />
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

