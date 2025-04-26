
import React from 'react';

const Logo = ({
  className = "",
  size = "h-20 w-20" // Increased default size from h-16 w-16 to h-20 w-20
}: {
  className?: string;
  size?: string;
}) => {
  return <div className={`flex items-center gap-2 ${className}`}>
      <div className={`relative ${size} overflow-hidden`}>
        <img 
          src="/lovable-uploads/11df6482-a989-4223-8612-1870dc0418ae.png" 
          alt="Escutaris Logo" 
          className="absolute inset-0 object-contain" // Keeping object-contain to prevent cropping
        />
      </div>
    </div>;
};

export default Logo;

