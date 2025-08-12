import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationButton } from '../../components/NavigationButton';
import { DashboardCard } from '../../components/DashboardCard';
import { LogoutButton } from '../../components/LogoutButton';
import { useAuth } from '../../hooks/useAuth';

export default function AdminDashboard(): JSX.Element {
  const { isAdmin, role, profile, session } = useAuth();

  const getUserRoleName = (userRole: string) => {
    switch (userRole) {
      case 'admin':
        return 'Administrador';
      case 'guide':
        return 'Guía';
      case 'user':
        return 'Usuario';
      default:
        return 'Sin rol';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <NavigationButton to="/" label="← Volver al inicio" />
          <LogoutButton 
            variant="danger" 
            size="md"
            redirectTo="/"
          />
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Panel de Administración</h1>
          <div className="text-emerald-300">
            Bienvenido, {profile?.full_name || session?.user?.email || 'Usuario'} 
            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
              role === 'admin' ? 'bg-red-100 text-red-800' :
              role === 'guide' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {getUserRoleName(role)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Panel de Guía - Disponible para TODOS los usuarios autenticados */}
          <DashboardCard
            title="Mi Panel de Guía"
            description="Gestiona tu perfil, servicios y disponibilidad"
            icon="🎣"
            link="/panel-guia"
            color="green"
          />

          {/* Gestión de Guías - Solo para admins */}
          {role === 'admin' && (
            <DashboardCard
              title="Gestión de Guías"
              description="Crear, editar y eliminar guías del sistema"
              icon="👥"
              link="/admin/guides"
              color="blue"
            />
          )}

          {/* Gestión de Usuarios - Solo para admins */}
          {role === 'admin' && (
            <DashboardCard
              title="Gestión de Usuarios"
              description="Administrar usuarios y roles del sistema"
              icon="⚙️"
              link="/admin/users"
              color="purple"
            />
          )}

          {/* Información adicional para usuarios normales */}
          {role === 'user' && (
            <div className="col-span-full bg-blue-50 border border-blue-200 text-blue-800 p-6 rounded-xl">
              <div className="text-center">
                <div className="text-3xl mb-3">👤</div>
                <h3 className="text-xl font-semibold mb-2">Panel de Usuario</h3>
                <p className="text-sm">
                  Desde tu panel de guía puedes gestionar tu perfil y servicios. 
                  Contacta al administrador para obtener permisos adicionales.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Información sobre permisos */}
        <div className="mt-8 bg-white/10 rounded-2xl p-4">
          <h3 className="text-white font-semibold mb-2">Tus permisos:</h3>
          <div className="text-sm text-white/80 space-y-1">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              Gestionar tu perfil de guía
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              Administrar tus servicios
            </div>
            {isAdmin && (
              <>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Gestionar todos los guías (Admin)
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Administrar usuarios y roles (Admin)
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


