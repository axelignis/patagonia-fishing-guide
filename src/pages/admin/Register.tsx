import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '../../services/supabase';
import { NavigationButton } from '../../components/NavigationButton';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cooldownTime, setCooldownTime] = useState(0);
  const navigate = useNavigate();
  const supabase = getSupabaseClient();

  // Efecto para manejar el cooldown
  React.useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime(cooldownTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  // Función para verificar si el usuario ya existe
  const checkUserExists = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('email', email)
        .limit(1);
      
      return data && data.length > 0;
    } catch {
      return false;
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Registrando usuario:', email);

      // Verificar si el usuario ya existe
      const userExists = await checkUserExists(email);
      if (userExists) {
        setError('Este email ya está registrado. Intenta iniciar sesión en su lugar.');
        return;
      }

      // 1. Registrar usuario en Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (authError) {
        console.error('Error de registro:', authError);
        
        // Manejar diferentes tipos de errores específicamente
        if (authError.message.includes('too many requests') || authError.message.includes('429')) {
          setError('Has intentado registrarte demasiadas veces. Espera un momento antes de intentar nuevamente.');
          setCooldownTime(60); // 60 segundos de cooldown
        } else if (authError.message.includes('User already registered')) {
          setError('Este email ya está registrado. Intenta iniciar sesión en su lugar.');
        } else if (authError.message.includes('Invalid email')) {
          setError('El formato del email no es válido.');
        } else if (authError.message.includes('Password')) {
          setError('La contraseña debe tener al menos 6 caracteres.');
        } else {
          setError(`Error de registro: ${authError.message}`);
        }
        return;
      }

      if (data.user) {
        console.log('Usuario registrado:', data.user);

        // 2. Verificar si el perfil se creó automáticamente (via trigger)
        // Si no, crearlo manualmente
        await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
        
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (!existingProfile) {
          console.log('Perfil no existe, creando manualmente...');
          
          // Crear perfil manualmente si el trigger no funcionó
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([
              {
                user_id: data.user.id,
                email: data.user.email,
                full_name: fullName,
                role: 'user'
              }
            ]);

          if (profileError) {
            console.error('Error creando perfil:', profileError);
            setError('Usuario creado pero error al crear perfil: ' + profileError.message);
            return;
          }
          console.log('Perfil creado manualmente');
        } else {
          console.log('Perfil ya existe (creado por trigger)');
        }

        setSuccess('Usuario registrado exitosamente! Revisa tu email para confirmar tu cuenta.');
        
        // Limpiar formulario
        setEmail('');
        setPassword('');
        setFullName('');
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);
      }
    } catch (err) {
      console.error('Error inesperado:', err);
      setError('Error inesperado al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="absolute top-6 left-6">
        <NavigationButton to="/admin/login" label="← Volver al login" />
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crear Cuenta
          </h1>
          <p className="text-gray-600">
            Regístrate para acceder al sistema
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            {cooldownTime > 0 && (
              <div className="mt-2 text-sm">
                Podrás intentar nuevamente en {cooldownTime} segundos.
              </div>
            )}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Tu nombre completo"
              required
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading || cooldownTime > 0}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Creando cuenta...' : 
             cooldownTime > 0 ? `Espera ${cooldownTime}s` :
             'Crear Cuenta'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => navigate('/admin/login')}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
