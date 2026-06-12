
import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-escutaris-offwhite p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <Link to="/">
            <Logo size="h-16 w-16" className="mb-4" />
          </Link>
          <h2 className="font-cormorant text-3xl font-semibold text-escutaris-verde text-center">
            Que bom te ver de novo
          </h2>
          <p className="font-poppins text-sm text-muted-foreground text-center mt-2">
            Entre na sua conta da Comunidade Escutaris
          </p>
        </div>

        <AuthForm type="login" />

        <div className="mt-6 text-center space-y-2">
          <p className="font-poppins text-sm text-muted-foreground">
            Ainda não é da comunidade?{' '}
            <Link to="/cadastro" className="text-escutaris-terracota hover:underline">
              Criar conta gratuita
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

export default Login;
