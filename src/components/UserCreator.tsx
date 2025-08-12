import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { getSupabaseClient } from '../services/supabase';
import { UserRole } from '../services/auth';

interface CreateUserFormData {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
}

interface UserCreatorProps {
  onSuccess?: () => void;
}

export const UserCreator: React.FC<UserCreatorProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<CreateUserFormData>({
    email: '',
    password: '',
    full_name: '',
    role: 'user'
  });
  const [showForm, setShowForm] = useState(false);

  const queryClient = useQueryClient();

  const createUserMutation = useMutation(
    async (userData: CreateUserFormData) => {
      const supabase = getSupabaseClient();
      
      console.log('Creando usuario:', userData);

      // 1. Crear usuario en Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        user_metadata: {
          full_name: userData.full_name
        },
        email_confirm: true // Auto-confirmar email
      });

      if (authError) {
        console.error('Error creando usuario en Auth:', authError);
        throw new Error(`Error de autenticación: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('No se pudo crear el usuario');
      }

      console.log('Usuario creado en Auth:', authData.user);

      // 2. Crear perfil del usuario
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: authData.user.id,
            email: authData.user.email,
            full_name: userData.full_name,
            role: userData.role
          }
        ]);

      if (profileError) {
        console.error('Error creando perfil:', profileError);
        throw new Error(`Error creando perfil: ${profileError.message}`);
      }

      console.log('Perfil creado exitosamente');
      return authData.user;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['all-users']);
        setFormData({
          email: '',
          password: '',
          full_name: '',
          role: 'user'
        });
        setShowForm(false);
        onSuccess?.();
        alert('Usuario creado exitosamente');
      },
      onError: (error: any) => {
        console.error('Error en createUserMutation:', error);
        alert(`Error: ${error?.message || 'No se pudo crear el usuario'}`);
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.full_name) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (formData.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    createUserMutation.mutate(formData);
  };

  if (!showForm) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Crear Nuevo Usuario
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/95 rounded-2xl p-6 shadow-xl mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-800">Crear Nuevo Usuario</h3>
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="juan@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Contraseña *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rol *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="user">Usuario</option>
              <option value="guide">Guía</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={createUserMutation.isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
          >
            {createUserMutation.isLoading ? 'Creando...' : 'Crear Usuario'}
          </button>
          
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>

      <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <strong>Nota:</strong> El usuario podrá iniciar sesión inmediatamente con el email y contraseña proporcionados.
        No necesitará confirmar su email.
      </div>
    </div>
  );
};
