import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { getSupabaseClientNullable } from '../services/supabase';

type AuthContextValue = {
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue>({ session: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const supabase = getSupabaseClientNullable();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo(() => ({ session, loading }), [session, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}


