import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { useQuery } from 'react-query';
import { getSupabaseClientNullable } from '../services/supabase';
import { getCurrentUserProfile, UserProfile } from '../services/auth';

type AuthContextValue = {
  session: Session | null;
  loading: boolean;
  profile: UserProfile | null;
  role: string;
  isAdmin: boolean;
  isGuide: boolean;
  canAccessAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue>({ 
  session: null, 
  loading: true,
  profile: null,
  role: 'user',
  isAdmin: false,
  isGuide: false,
  canAccessAdmin: false
});

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const supabase = getSupabaseClientNullable();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Query para obtener el perfil del usuario
  const { data: profile } = useQuery(
    ['user-profile', session?.user?.id],
    () => session?.user?.id ? getCurrentUserProfile() : null,
    {
      enabled: !!session?.user?.id,
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutos
    }
  );

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // 1) Recuperar sesión almacenada (si ya se inició antes)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // 2) Escuchar cambios de auth (incluye cuando se procesa el hash del magic link)
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state change:', event, newSession?.user?.email);
      
      if (event === 'SIGNED_IN' && newSession) {
        console.log('Usuario autenticado exitosamente');
      } else if (event === 'SIGNED_OUT') {
        console.log('Usuario cerró sesión');
      }
      
      setSession(newSession);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo(() => ({
    session,
    loading,
    profile: profile || null,
    role: profile?.role || 'user',
    isAdmin: profile?.role === 'admin',
    isGuide: profile?.role === 'guide' || profile?.role === 'admin',
    canAccessAdmin: profile?.role === 'admin' || profile?.role === 'guide'
  }), [session, loading, profile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
