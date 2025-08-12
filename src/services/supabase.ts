import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Permitir ambas variantes (con y sin prefijo) para reutilizar claves en scripts Node
const supabaseUrl = (process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL) as string | undefined;
const supabaseAnonKey = (process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY) as string | undefined;

// Diagnóstico: CRA (react-scripts) solo inyecta variables que comienzan con REACT_APP_.
// Si llegas aquí sin valores, probablemente:
// 1) Editaste .env.example pero NO creaste .env.local
// 2) Creaste .env.local después de arrancar el dev server (reinicia)
// 3) Escribiste mal el prefijo (debe ser exactamente REACT_APP_SUPABASE_URL / _ANON_KEY)
// 4) El archivo .env.local no está en la raíz del proyecto (misma carpeta que package.json)
// 5) Usas otro tooling (Vite/Next) pero sigues con react-scripts (no aplica aquí)
if (!supabaseUrl || !supabaseAnonKey) {
  // Log seguro (no expone secretos). Muestra primeros 8 chars si existe.
  // eslint-disable-next-line no-console
  console.debug('[supabase env diag]', {
    hasReactAppUrl: !!process.env.REACT_APP_SUPABASE_URL,
    hasReactAppAnon: !!process.env.REACT_APP_SUPABASE_ANON_KEY,
    hasAltUrl: !!process.env.SUPABASE_URL,
    hasAltAnon: !!process.env.SUPABASE_ANON_KEY,
    sampleUrl: process.env.REACT_APP_SUPABASE_URL?.slice(0, 8) || null,
  });
}

let internalClient: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
  internalClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
} else {
  // eslint-disable-next-line no-console
  console.warn('Supabase no configurado. Define REACT_APP_SUPABASE_URL y REACT_APP_SUPABASE_ANON_KEY (o variables sin prefijo SUPABASE_URL / SUPABASE_ANON_KEY).');
}

export function getSupabaseClient(): SupabaseClient {
  if (!internalClient) {
    throw new Error('Supabase no configurado. Crea .env.local con REACT_APP_SUPABASE_URL y REACT_APP_SUPABASE_ANON_KEY');
  }
  return internalClient;
}

export function getSupabaseClientNullable(): SupabaseClient | null {
  return internalClient;
}

export type Tables = {
  guides: {
    Row: {
      id: string;
      user_id: string;
      name: string;
      age: number | null;
      avatar_url: string | null;
      cover_url: string | null;
      bio: string | null;
      location: string | null;
      price_per_day: number | null;
      rating: number | null;
      total_reviews: number | null;
      languages: string[] | null;
      specialties: string[] | null;
      is_active: boolean | null;
      created_at: string | null;
  region_code?: string | null;
  province_code?: string | null;
  commune_code?: string | null;
    };
  };
  user_profiles: {
    Row: {
      id: string;
      user_id: string;
      email: string | null;
      full_name: string | null;
      role: 'admin' | 'guide' | 'user';
      created_at: string | null;
      updated_at: string | null;
    };
  };
  guide_services: {
    Row: {
      id: string;
      guide_id: string;
      title: string;
      description: string | null;
      duration: string | null;
      difficulty: 'Principiante' | 'Intermedio' | 'Avanzado' | null;
      max_people: number | null;
      price: number | null;
      includes: string[] | null;
    };
  };
  guide_availability: {
    Row: {
      id: string;
      guide_id: string;
      date: string;
      start_time: string;
      end_time: string;
      capacity: number | null;
      status: 'available' | 'blocked' | 'booked';
      notes: string | null;
    };
  };
};


