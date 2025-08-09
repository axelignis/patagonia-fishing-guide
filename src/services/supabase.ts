import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL as string | undefined;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY as string | undefined;

let internalClient: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
  internalClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // eslint-disable-next-line no-console
  console.warn('Supabase no configurado. Define REACT_APP_SUPABASE_URL y REACT_APP_SUPABASE_ANON_KEY');
}

export function getSupabaseClient(): SupabaseClient {
  if (!internalClient) {
    throw new Error('Supabase no configurado. Define REACT_APP_SUPABASE_URL y REACT_APP_SUPABASE_ANON_KEY');
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


