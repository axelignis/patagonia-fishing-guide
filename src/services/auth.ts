import { getSupabaseClient, Tables } from './supabase';

export type UserRole = 'admin' | 'guide' | 'user';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  created_at: string | null;
  updated_at: string | null;
  avatar_url?: string | null;
  hero_image_url?: string | null;
}

export async function getCurrentUser() {
  const supabase = getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) throw error;
  return user;
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = getSupabaseClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const sessionUserId = sessionData?.session?.user?.id;
    
    if (!sessionUserId) {
      return null;
    }


    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', sessionUserId)
      .limit(1);
    
    if (error) {
      console.error('Error al obtener perfil:', error);
      
      // Si no existe el perfil, crear uno por defecto
      if (error.code === 'PGRST116') {
        return await createDefaultUserProfile(sessionUserId);
      }
      throw error;
    }
    
    if (!data || data.length === 0) {
      return await createDefaultUserProfile(sessionUserId);
    }

    return data[0];
  } catch (error) {
    console.error('Error en getCurrentUserProfile:', error);
    return null;
  }
}

export async function createDefaultUserProfile(userId: string): Promise<UserProfile> {
  try {
    const supabase = getSupabaseClient();
    const user = await getCurrentUser();
    
    const profileData = {
      user_id: userId,
      email: user?.email || null,
      full_name: user?.user_metadata?.full_name || null,
      role: 'user' as UserRole, // Por defecto todos son usuarios normales
    };


    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profileData)
      .select()
      .single();
    
    if (error) {
      console.error('Error al crear perfil:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error en createDefaultUserProfile:', error);
    throw error;
  }
}

export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  const supabase = getSupabaseClient();
  
  // Solo admins pueden cambiar roles
  const currentProfile = await getCurrentUserProfile();
  if (!currentProfile || currentProfile.role !== 'admin') {
    throw new Error('No tienes permisos para cambiar roles');
  }

  const { error } = await supabase
    .from('user_profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
  
  if (error) throw error;
}

export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile) return false;
    
    // Admin tiene acceso a todo
    if (profile.role === 'admin') return true;
    
    // Verificar el rol específico
    return profile.role === requiredRole;
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  return await hasRole('admin');
}

export async function isGuide(): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  return profile?.role === 'guide' || profile?.role === 'admin';
}

export async function canAccessAdmin(): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  return profile?.role === 'admin' || profile?.role === 'guide';
}
