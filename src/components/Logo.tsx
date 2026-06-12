
import React from 'react';

const Logo = ({
  className = "",
  size = "h-20 w-20", // Increased default size from h-16 w-16 to h-20 w-20
  showName = false
}: {
  className?: string;
  size?: string;
  showName?: boolean;
}) => {
  return <div className={`flex items-center gap-2 ${className}`}>
      <div className={`relative ${size} overflow-hidden`}>
        <img
          src="/assets/logo-escutaris.png"
          alt="Escutaris Logo"
          className="absolute inset-0 object-contain" // Keeping object-contain to prevent cropping
        />
      </div>
      {showName && (
        <span className="font-cormorant text-xl font-semibold text-escutaris-verde leading-none whitespace-nowrap">
          Comunidade Escutaris
        </span>
      )}
    </div>;
};

export default Logo;

