import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Check } from 'lucide-react';

const Cadastro = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-escutaris-offwhite p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <Link to="/">
            <Logo size="h-16 w-16" className="mb-4" />
          </Link>
          <h2 className="font-cormorant text-3xl font-semibold text-escutaris-verde text-center">
            Entre no clube
          </h2>
          <p className="font-poppins text-sm text-muted-foreground text-center mt-2">
            Conta gratuita — leva 30 segundos
          </p>
        </div>

        <ul className="space-y-2 mb-6">
          {[
            'Baixe todos os materiais técnicos',
            'Guarde favoritos e seu histórico',
            'Saiba das novidades em primeira mão',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 font-poppins text-sm text-foreground/70">
              <Check size={15} className="text-escutaris-terracota mt-0.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <AuthForm type="signup" />

        <div className="mt-6 text-center space-y-2">
          <p className="font-poppins text-sm text-muted-foreground">
            Já tem conta?{' '}
            <Link to="/login" className="text-escutaris-terracota hover:underline">
              Entrar
            </Link>
          </p>
          <Link to="/" className="font-poppins text-xs text-muted-foreground/70 hover:underline block">
            Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
