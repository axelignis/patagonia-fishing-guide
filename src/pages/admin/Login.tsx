import React, { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../services/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NavigationButton } from '../../components/NavigationButton';

export default function AdminLogin(): JSX.Element {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useEmailLogin, setUseEmailLogin] = useState(true);
  const [sent, setSent] = useState(false);

  async function handleLogout() {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    window.location.reload();
  }

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = getSupabaseClient();
    const { error: err } = await supabase.auth.signInWithOtp({ 
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin/auth/callback` }
    });
    if (err) setError(err.message);
    else setSent(true);
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const supabase = getSupabaseClient();
      console.log('Intentando login con password para:', email);
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Error de autenticación:', authError);
        setError(authError.message);
        return;
      }

      if (data.user) {
        console.log('Login exitoso:', data.user);
        // No navegamos aquí, el useEffect se encargará
      }
    } catch (err) {
      console.error('Error inesperado:', err);
      setError('Error inesperado al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session) {
      console.log('Sesión detectada, redirigiendo a /admin');
      navigate('/admin', { replace: true });
    }
  }, [session, navigate]);

  // Si ya hay una sesión, mostrar opción de logout
  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Ya tienes una sesión activa
          </h1>
          <p className="text-gray-600 mb-6">
            Parece que ya estás logueado pero no tienes permisos suficientes.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/admin')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Ir al Panel Admin
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Cerrar Sesión y Volver a Loguearse
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="absolute top-6 left-6">
        <NavigationButton to="/" label="← Volver al inicio" />
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Inicia sesión para continuar
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {sent && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            Revisa tu correo para el enlace mágico.
          </div>
        )}

        {/* Selector de método de login */}
        <div className="flex rounded-lg border border-gray-200 mb-6">
          <button
            type="button"
            onClick={() => setUseEmailLogin(true)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-lg transition ${
              useEmailLogin 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Email/Password
          </button>
          <button
            type="button"
            onClick={() => setUseEmailLogin(false)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-lg transition ${
              !useEmailLogin 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Magic Link
          </button>
        </div>

        {useEmailLogin ? (
          <form onSubmit={handlePasswordLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Tu contraseña"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSendLink} className="space-y-6">
            <div>
              <label htmlFor="email-magic" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email-magic"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="tu@email.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Enviar Magic Link
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => navigate('/admin/register')}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Crear cuenta
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}


