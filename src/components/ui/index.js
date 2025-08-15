import React from 'react';
import { motion } from 'framer-motion';

// Animated Card Component
export const AnimatedCard = ({ 
  children, 
  className = '', 
  delay = 0, 
  onClick = null,
  hoverScale = 1.02 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ 
        scale: hoverScale,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={`cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
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

// Progressive Image Component
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
    <motion.div className={`relative overflow-hidden ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-500 ${
          imageLoaded ? 'blur-0' : 'blur-sm'
        }`}
        {...props}
      />
      {!imageLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
        >
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
      )}
    </motion.div>
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
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
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
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
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
    </motion.button>
  );
};

// Floating Action Button
export const FloatingActionButton = ({ 
  onClick, 
  icon, 
  className = '',
  tooltip = '' 
}) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setShowTooltip(true)}
      onHoverEnd={() => setShowTooltip(false)}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-40 ${className}`}
        onClick={onClick}
      >
        {icon}
      </motion.button>
      
      {tooltip && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: showTooltip ? 1 : 0, x: showTooltip ? 0 : 10 }}
          className="fixed bottom-8 right-20 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg z-50 pointer-events-none"
        >
          {tooltip}
        </motion.div>
      )}
    </motion.div>
  );
};

// Page Transition Wrapper
export const PageTransition = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger Container for Lists
export const StaggerContainer = ({ children, className = '', staggerDelay = 0.1 }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default {
  AnimatedCard,
  GuideCardSkeleton,
  ServiceCardSkeleton,
  ProgressiveImage,
  Button,
  FloatingActionButton,
  PageTransition,
  StaggerContainer,
  StaggerItem
};
