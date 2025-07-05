import React, { useState, useRef, useEffect } from 'react';
import { Loader } from 'lucide-react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/placeholder.svg',
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {isInView && (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Loader className="h-6 w-6 animate-spin" />
            </div>
          )}
          <img
            src={hasError ? placeholder : src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={`transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            {...props}
          />
        </>
      )}
      {!isInView && (
        <div className="bg-muted animate-pulse" style={{ aspectRatio: '16/9' }} />
      )}
    </div>
  );
};

export default LazyImage;