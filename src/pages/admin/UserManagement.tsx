import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { NavigationButton } from '../../components/NavigationButton';
import { UserCreator } from '../../components/UserCreator';
import { LogoutButton } from '../../components/LogoutButton';
import { getSupabaseClient } from '../../services/supabase';
import { UserRole, updateUserRole } from '../../services/auth';
import { useAuth } from '../../hooks/useAuth';

export default function UserManagement(): JSX.Element {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('user');

  // Query para obtener todos los usuarios
  const { data: users, isLoading } = useQuery(['all-users'], async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  });

  // Mutation para cambiar rol
  const updateRoleMutation = useMutation(
    ({ userId, role }: { userId: string; role: UserRole }) => updateUserRole(userId, role),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['all-users']);
        setSelectedUser(null);
        alert('Rol actualizado correctamente');
      },
      onError: (error: any) => {
        alert(`Error: ${error?.message || 'No se pudo actualizar el rol'}`);
      }
    }
  );

  const handleRoleChange = () => {
    if (!selectedUser) return;
    updateRoleMutation.mutate({ userId: selectedUser, role: newRole });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Solo los administradores pueden acceder a esta página</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <NavigationButton to="/admin" label="← Volver al panel" />
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Gestión de Usuarios</h1>
          <LogoutButton variant="secondary" size="md" />
        </div>

        {/* Componente para crear usuarios */}
        <div className="mb-8">
          <UserCreator />
        </div>

        {/* Lista de usuarios */}
        <div className="bg-white/90 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Usuarios del Sistema</h2>
          
          {isLoading ? (
            <div className="text-center py-8 text-slate-600">Cargando usuarios...</div>
          ) : users?.length === 0 ? (
            <div className="text-center py-8 text-slate-600">No hay usuarios registrados.</div>
          ) : (
            <div className="space-y-4">
              {users?.map((user) => (
                <div key={user.id} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-slate-800">
                          {user.full_name || 'Sin nombre'}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'guide' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role === 'admin' ? 'Administrador' : 
                           user.role === 'guide' ? 'Guía' : 'Usuario'}
                        </span>
                      </div>
                      
                      <div className="text-sm text-slate-600">
                        <div>Email: {user.email || 'No especificado'}</div>
                        <div>Registrado: {new Date(user.created_at || '').toLocaleDateString('es-CL')}</div>
                        {user.updated_at && (
                          <div>Actualizado: {new Date(user.updated_at).toLocaleDateString('es-CL')}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedUser(user.user_id);
                          setNewRole(user.role);
                        }}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                      >
                        Cambiar Rol
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal para cambiar rol */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Cambiar Rol de Usuario</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nuevo Rol:
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">Usuario</option>
                  <option value="guide">Guía</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRoleChange}
                  disabled={updateRoleMutation.isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {updateRoleMutation.isLoading ? 'Actualizando...' : 'Confirmar'}
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Información sobre roles */}
        <div className="mt-6 bg-white/10 rounded-2xl p-4">
          <h3 className="text-white font-semibold mb-2">Información sobre roles:</h3>
          <div className="text-sm text-white/80 space-y-2">
            <div>
              <span className="font-medium text-red-300">Administrador:</span> Acceso completo al sistema, puede gestionar usuarios y todos los guías.
            </div>
            <div>
              <span className="font-medium text-blue-300">Guía:</span> Puede gestionar su propio perfil y servicios.
            </div>
            <div>
              <span className="font-medium text-gray-300">Usuario:</span> Acceso básico, solo puede navegar por la web pública.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
