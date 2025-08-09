import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationButtonProps {
  to: string;
  label: string;
  className?: string;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({ 
  to, 
  label, 
  className = "inline-flex items-center text-emerald-300 hover:text-emerald-200 transition-colors mb-8" 
}) => {
  return (
    <Link to={to} className={className}>
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </Link>
  );
};
