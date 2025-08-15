import React from 'react';

// Versión simplificada sin Framer Motion para compatibilidad inmediata
export const AnimatedCard = ({ 
    children, 
    className = '',
    delay = 0,
    onClick,
    ...props 
}) => {
    const handleClick = onClick || (() => {});
    
    return (
        <div 
            className={`beast-card cursor-pointer ${className}`}
            style={{ animationDelay: `${delay}ms` }}
            onClick={handleClick}
            {...props}
        >
            {children}
        </div>
    );
};

// Loading Skeletons
export const GuideCardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-md p-4">
    <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="mt-4 flex justify-between items-center">
      <div className="h-6 bg-gray-200 rounded w-20"></div>
      <div className="h-8 bg-gray-200 rounded w-24"></div>
    </div>
  </div>
);

export const ServiceCardSkeleton = () => (
  <div className="animate-pulse border rounded-lg p-4 bg-white shadow-sm">
    <div className="h-6 bg-gray-200 rounded mb-3"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
      <div className="h-8 bg-gray-200 rounded w-24"></div>
    </div>
  </div>
);

// Progressive Image Component simplificado
export const ProgressiveImage = ({ 
  src, 
  placeholder, 
  alt, 
  className = '',
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState(placeholder);

  React.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setImageLoaded(true);
    };
    img.src = src;
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-500 ${
          imageLoaded ? 'blur-0' : 'blur-sm'
        }`}
        {...props}
      />
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

// Enhanced Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg focus:ring-blue-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 focus:ring-gray-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
        loading ? 'cursor-not-allowed opacity-75' : ''
      }`}
      onClick={loading ? undefined : onClick}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Cargando...
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Page Transition Wrapper simplificado
export const PageTransition = ({ children, className = '' }) => {
  return (
    <div className={`animate-fadeIn ${className}`}>
      {children}
    </div>
  );
};

// Stagger Container simplificado
export const StaggerContainer = ({ children, className = '', staggerDelay = 0.1 }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export const StaggerItem = ({ children, className = '' }) => {
  return (
    <div className={`animate-slideInUp ${className}`}>
      {children}
    </div>
  );
};

export default {
  AnimatedCard,
  GuideCardSkeleton,
  ServiceCardSkeleton,
  ProgressiveImage,
  Button,
  PageTransition,
  StaggerContainer,
  StaggerItem
};
