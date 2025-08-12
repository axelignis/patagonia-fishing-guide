import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getSupabaseClient } from '../../services/supabase';
import { useAuth } from '../../hooks/useAuth';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, loading, profile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = getSupabaseClient();
      
      // Verificar si hay errores en la URL
      const errorCode = searchParams.get('error_code');
      const errorDescription = searchParams.get('error_description');
      
      if (errorCode) {
        let errorMessage = 'Error de autenticación';
        
        switch (errorCode) {
          case 'otp_expired':
            errorMessage = 'El enlace de acceso ha expirado. Solicita uno nuevo.';
            break;
          case 'access_denied':
            errorMessage = 'Acceso denegado. Verifica tu enlace de acceso.';
            break;
          case 'invalid_request':
            errorMessage = 'Enlace de acceso inválido. Solicita uno nuevo.';
            break;
          default:
            errorMessage = errorDescription || 'Error de autenticación desconocido';
        }
        
        setError(errorMessage);
        setIsProcessing(false);
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);
        
        return;
      }

      // Si hay fragmentos de hash en la URL (tokens de Supabase)
      if (window.location.hash) {
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            setError('Error al procesar la autenticación: ' + error.message);
            setTimeout(() => navigate('/admin/login'), 3000);
            return;
          }

          if (data.session) {
            // Limpiar la URL de fragmentos
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Esperar a que se cargue el perfil
            setTimeout(() => {
              setIsProcessing(false);
            }, 1000);
          } else {
            setError('No se pudo establecer la sesión');
            setTimeout(() => navigate('/admin/login'), 3000);
          }
        } catch (err) {
          setError('Error al procesar la autenticación');
          setTimeout(() => navigate('/admin/login'), 3000);
        }
      } else {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate]);

  // Una vez que el usuario está autenticado y tenemos su perfil, redirigir
  useEffect(() => {
    console.log('AuthCallback - Estado:', { loading, isProcessing, hasSession: !!session, hasProfile: !!profile });
    
    if (!loading && !isProcessing && session) {
      // Si hay sesión pero no hay perfil, crear uno
      if (!profile) {
        console.log('Sesión activa pero sin perfil, esperando creación automática...');
        // Dar más tiempo para que se cargue o cree el perfil
        const timeout = setTimeout(() => {
          // Si después de 5 segundos seguimos sin perfil, redirigir al home
          if (!profile) {
            console.log('Perfil no se creó automáticamente, redirigiendo al home');
            navigate('/?message=profile_creation_pending');
          }
        }, 5000);
        
        return () => clearTimeout(timeout);
      }
      
      // Si ya tenemos perfil, redirigir según el rol
      if (profile) {
        console.log('Perfil cargado:', profile);
        if (profile.role === 'admin' || profile.role === 'guide') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    }
  }, [loading, isProcessing, session, profile, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error de Autenticación</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-sm text-gray-500">Serás redirigido al login automáticamente...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Procesando Autenticación</h2>
          <p className="text-gray-600">Estamos verificando tu acceso...</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
