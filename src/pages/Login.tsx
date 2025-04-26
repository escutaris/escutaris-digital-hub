
import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-escutaris-green-light/20 to-escutaris-terracotta-light/10 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <Link to="/">
            <Logo size="h-20 w-20" className="mb-4" />
          </Link>
          <h2 className="text-2xl font-bold text-escutaris-green">Login Administrativo</h2>
          <p className="text-muted-foreground text-center mt-2">
            Entre para gerenciar os materiais da Central Escutaris
          </p>
        </div>
        
        <AuthForm type="login" />
        
        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="text-escutaris-terracotta hover:underline"
          >
            Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
