
import React, { useEffect, useState } from 'react';

export const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular tempo de carregamento mínimo para melhor UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/95 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-escutaris-green border-t-transparent rounded-full animate-spin"></div>
        <p className="text-escutaris-green text-lg font-semibold">
          Carregando a Central Escutaris...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
