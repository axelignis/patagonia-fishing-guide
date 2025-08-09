import React from 'react';

interface PriceDisplayProps {
  price: number;
  className?: string;
  showBothCurrencies?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Tasa de cambio aproximada CLP a USD (1 USD = 900 CLP aproximadamente)
const CLP_TO_USD_RATE = 900;

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  price, 
  className = '', 
  showBothCurrencies = true,
  size = 'md'
}) => {
  const usdPrice = Math.round(price / CLP_TO_USD_RATE);
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const currencyClasses = {
    sm: 'text-xs',
    md: 'text-sm', 
    lg: 'text-base',
    xl: 'text-lg'
  };

  if (!showBothCurrencies) {
    return (
      <div className={`font-bold ${className} ${sizeClasses[size]}`}>
        ${price.toLocaleString()} CLP
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className={`font-bold text-emerald-600 ${sizeClasses[size]}`}>
        ${price.toLocaleString()} CLP
      </div>
      <div className={`text-slate-500 ${currencyClasses[size]} mt-1`}>
        ~${usdPrice} USD
      </div>
    </div>
  );
};
