import React, { useState } from 'react';
import { getSupabaseClient } from '../services/supabase';

interface LogoutButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  redirectTo?: string;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'danger',
  size = 'md',
  className = '',
  redirectTo = '/admin/login'
}) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      
      // Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión: ' + error.message);
        return;
      }

      // Limpiar almacenamiento local
      localStorage.clear();
      sessionStorage.clear();

      console.log('Sesión cerrada exitosamente');
      
      // Redirigir
      window.location.href = redirectTo;
    } catch (err) {
      console.error('Error inesperado al cerrar sesión:', err);
      alert('Error inesperado al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return 'bg-red-600 hover:bg-red-700 text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1 text-sm';
      case 'md':
        return 'px-4 py-2 text-base';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        rounded-lg
        transition-colors
        disabled:opacity-50
        disabled:cursor-not-allowed
        font-medium
        ${className}
      `}
    >
      {loading ? 'Cerrando...' : 'Cerrar Sesión'}
    </button>
  );
};
