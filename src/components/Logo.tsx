
import React from 'react';

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-10 w-10 overflow-hidden">
        <div className="absolute inset-0 bg-escutaris-green rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xl">E</span>
        </div>
      </div>
      <span className="text-escutaris-green text-xl font-bold">Escutaris</span>
    </div>
  );
};

export default Logo;
