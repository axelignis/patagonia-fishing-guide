import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogoutButton } from '../components/LogoutButton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireGuide?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requireGuide = false 
}: ProtectedRouteProps): JSX.Element {
  const { session, loading, isAdmin, canAccessAdmin, profile, role } = useAuth();

  // Debug logging

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  // Verificar permisos específicos
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-400 text-2xl mb-4">🚫 Acceso Denegado</div>
          <div className="text-white mb-6">Solo los administradores pueden acceder a esta sección.</div>
          
          <div className="space-y-3">
            <LogoutButton 
              variant="danger"
              className="w-full"
              redirectTo="/admin/login"
            />
            
            <button 
              onClick={() => window.location.href = '/'} 
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              Ir al Inicio
            </button>
          </div>
          
          <div className="mt-6 text-sm text-gray-400">
            Si crees que deberías tener acceso, contacta al administrador.
          </div>
        </div>
      </div>
    );
  }

  if (requireGuide && !canAccessAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-400 text-2xl mb-4">🚫 Acceso Denegado</div>
          <div className="text-white mb-6">No tienes permisos para acceder a esta sección.</div>
          
          <div className="space-y-3">
            <LogoutButton 
              variant="danger"
              className="w-full"
              redirectTo="/admin/login"
            />
            
            <button 
              onClick={() => window.location.href = '/'} 
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              Ir al Inicio
            </button>
          </div>
          
          <div className="mt-6 text-sm text-gray-400">
            Necesitas permisos de guía o administrador para acceder.
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


