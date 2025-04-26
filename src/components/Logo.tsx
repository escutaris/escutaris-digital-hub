
import React from 'react';

const Logo = ({ className = "", size = "h-10 w-10" }: { className?: string, size?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`relative ${size} overflow-hidden`}>
        <img 
          src="/lovable-uploads/11df6482-a989-4223-8612-1870dc0418ae.png" 
          alt="Escutaris Logo" 
          className="absolute inset-0 object-contain"
        />
      </div>
      <span className="text-escutaris-green text-xl font-bold">Escutaris</span>
    </div>
  );
};

export default Logo;
