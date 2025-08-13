import { getSupabaseClient, Tables } from './supabase';

export interface ListGuidesFilters {
  region_code?: string;
  province_code?: string;
  commune_code?: string;
  search?: string; // name / bio search
  specialties?: string[]; // contains overlap
  is_active?: boolean;
  requires_service?: boolean; // nuevo: solo con servicios aprobados
}

export interface GuideWithPending extends Record<string, any> {
  pending_services_count?: number;
}

export async function listGuides(filters: ListGuidesFilters = {}): Promise<GuideWithPending[]> {
  const supabase = getSupabaseClient();

  // Si se requiere que tengan al menos un servicio aprobado podemos usar un inner join lateral simple.
  // Método: filtrar posteriormente usando una segunda consulta para performance simple (evita dependencia de vista nueva).

  let base = 'guides_with_profiles';
  let query = supabase.from(base).select('*');
  // Nota: La vista guides_with_profiles idealmente expone hero_image_url / avatar_url provenientes de user_profiles.
  // Si no estuvieran presentes, el frontend hará fallback y la sincronización en ImageService actualizará guides.avatar_url / cover_url.

  if (filters.is_active !== undefined) query = query.eq('is_active', filters.is_active);
  if (filters.region_code) query = query.eq('region_code', filters.region_code);
  if (filters.province_code) query = query.eq('province_code', filters.province_code);
  if (filters.commune_code) query = query.eq('commune_code', filters.commune_code);
  if (filters.search) query = query.or(`name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`);
  if (filters.specialties && filters.specialties.length > 0) query = query.contains('specialties', filters.specialties);
  query = query.order('created_at', { ascending: false });

  let { data, error } = await query;
  if (error) {
    // Si falla la vista (no existe), fallback a tabla base
    console.warn('listGuides: falló vista guides_with_profiles, usando guides. Detalle:', error.message);
    let q2 = supabase.from('guides').select('*');
    if (filters.is_active !== undefined) q2 = q2.eq('is_active', filters.is_active);
    if (filters.region_code) q2 = q2.eq('region_code', filters.region_code);
    if (filters.province_code) q2 = q2.eq('province_code', filters.province_code);
    if (filters.commune_code) q2 = q2.eq('commune_code', filters.commune_code);
    if (filters.search) q2 = q2.or(`name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`);
    if (filters.specialties && filters.specialties.length > 0) q2 = q2.contains('specialties', filters.specialties);
    q2 = q2.order('created_at', { ascending: false });
    const fb = await q2;
    if (fb.error) throw fb.error;
    data = fb.data ?? [];
  }

  // Si no se pide filtrar por servicios, retornar directo
  // Obtener conteo de servicios pendientes para admins (no depende de requires_service)
  try {
    if (data && data.length > 0) {
      const ids = data.map(g => g.id).filter(Boolean);
      if (ids.length) {
        const { data: pendingCounts, error: pcErr } = await supabase
          .from('guide_services')
          .select('guide_id, approved')
          .in('guide_id', ids as any);
        if (!pcErr && pendingCounts) {
          const counter: Record<string, number> = {};
            pendingCounts.forEach((s: any) => {
              // Cuenta como pendiente si approved no es true (false o null)
              if (s.approved !== true) {
                counter[s.guide_id] = (counter[s.guide_id] || 0) + 1;
              }
            });
          data = data.map(g => ({ ...g, pending_services_count: counter[g.id] || 0 }));
        }
      }
    }
  } catch (e) {
    console.warn('listGuides: fallo agregando pending counts', (e as any)?.message);
  }

  if (!filters.requires_service) return data as GuideWithPending[] ?? [];

  if (!data || data.length === 0) return [];

  // Obtener ids
  const ids = data.map(g => g.id).filter(Boolean);
  if (ids.length === 0) return [];

  // Buscar servicios aprobados (se asume columna approved boolean en guide_services)
  // Intentar obtener columna approved; si no existe o no hay ninguna true, usamos cualquier servicio como válido.
  const { data: services, error: svcError } = await supabase
    .from('guide_services')
    .select('id, guide_id, approved')
    .in('guide_id', ids);
  if (svcError) {
    console.warn('listGuides requires_service: error consultando services', svcError.message);
    return [];
  }
  if (!services || services.length === 0) return [];
  const anyApproved = services.some((s: any) => s.approved === true);
  const validIds = new Set(
    services.filter((s: any) => anyApproved ? s.approved === true : true).map((s: any) => s.guide_id)
  );
  return ((data || []).filter(g => validIds.has(g.id))) as GuideWithPending[];
}

export async function getGuideById(id: string): Promise<any> {
  const supabase = getSupabaseClient();
  // Vista primero
  let { data, error } = await supabase
    .from('guides_with_profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.warn('getGuideById: fallback a tabla guides por error vista:', error.message);
    const fb = await supabase.from('guides').select('*').eq('id', id).maybeSingle();
    if (fb.error) throw fb.error;
    return fb.data ?? null;
  }
  return data ?? null;
}

export async function upsertGuide(payload: Partial<Tables['guides']['Row']>): Promise<Tables['guides']['Row']> {
  const supabase = getSupabaseClient();
  const isInsert = !payload.id;

  if (isInsert) {
    // Insert explícito con user_id del usuario actual
    const { data: sessionData } = await supabase.auth.getSession();
    const sessionUserId = sessionData?.session?.user?.id;
    if (!sessionUserId) throw new Error('No hay sesión para crear el guía');

    const insertPayload = {
      name: payload.name ?? '',
      location: payload.location ?? null,
      bio: payload.bio ?? null,
      age: payload.age ?? null,
      languages: payload.languages ?? null,
      specialties: payload.specialties ?? null,
  region_code: (payload as any).region_code ?? null,
  province_code: (payload as any).province_code ?? null,
  commune_code: (payload as any).commune_code ?? null,
      user_id: sessionUserId,
    } as Partial<Tables['guides']['Row']>;


    const { data, error } = await supabase
      .from('guides')
      .insert(insertPayload)
      .select()
      .single();
    if (error) {
      console.error('upsertGuide - insert error:', error);
      throw new Error(error.message || 'No se pudo crear el guía');
    }
    return data as Tables['guides']['Row'];
  }

  // Update explícito por id (evita que upsert intente insertar y dispare NOT NULL)
  const updatePayload = {
    name: payload.name,
    location: payload.location,
    bio: payload.bio,
    age: payload.age,
    languages: payload.languages,
    specialties: payload.specialties,
  region_code: (payload as any).region_code,
  province_code: (payload as any).province_code,
  commune_code: (payload as any).commune_code,
  } as Partial<Tables['guides']['Row']>;


  const { data, error } = await supabase
    .from('guides')
    .update(updatePayload)
    .eq('id', payload.id as string)
    .select()
    .single();
  if (error) {
    console.error('upsertGuide - update error:', error);
    throw new Error(error.message || 'No se pudo actualizar el guía');
  }
  return data as Tables['guides']['Row'];
}

export async function deleteGuide(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('guides')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function reassignGuideOwner(guideId: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const sessionUserId = sessionData?.session?.user?.id;
  if (!sessionUserId) throw new Error('Sin sesión: inicia sesión para reasignar');
  const { error } = await supabase
    .from('guides')
    .update({ user_id: sessionUserId })
    .eq('id', guideId);
  if (error) throw new Error(error.message || 'No se pudo reasignar');
}

export async function listServicesByGuide(guideId: string): Promise<Tables['guide_services']['Row'][]> {
  const supabase = getSupabaseClient();
  const { data, error, count } = await supabase
    .from('guide_services')
    .select('*', { count: 'exact' })
    .eq('guide_id', guideId)
    .order('title');
  if (error) {
    console.warn('[listServicesByGuide] error', { guideId, error: error.message });
    throw error;
  }
  if (!data || data.length === 0) {
    console.info('[listServicesByGuide] vacío', { guideId, count });
    // Sonda adicional para detectar si RLS bloquea columnas: pedir solo id
    const probe = await supabase
      .from('guide_services')
      .select('id', { count: 'exact' })
      .eq('guide_id', guideId);
    if (probe.error) {
      console.warn('[listServicesByGuide] probe error', { guideId, error: probe.error.message });
    } else {
      console.info('[listServicesByGuide] probe result', { guideId, probeCount: probe.count, ids: (probe.data || []).map(r => r.id) });
    }
  } else {
    console.debug('[listServicesByGuide] ok', { guideId, count: data.length });
  }
  return data ?? [];
}

export async function approveService(serviceId: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('guide_services')
    .update({ approved: true })
    .eq('id', serviceId);
  if (error) throw error;
}

export async function updateServiceApproval(serviceId: string, approved: boolean): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('guide_services')
    .update({ approved })
    .eq('id', serviceId);
  if (error) throw error;
}

export async function approveAllServicesForGuide(guideId: string): Promise<number> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('guide_services')
    .update({ approved: true })
    .eq('guide_id', guideId)
    .select('id');
  if (error) throw error;
  return data?.length || 0;
}

// Listar servicios de todos los guías (admin)
export interface ListAllServicesFilters {
  approved?: 'pending' | 'approved' | 'all';
}

export async function listAllGuideServices(filters: ListAllServicesFilters = {}): Promise<any[]> {
  const supabase = getSupabaseClient();
  let query = supabase.from('guide_services').select('*').order('created_at', { ascending: false });
  if (filters.approved === 'pending') query = query.eq('approved', false).or('approved.is.null');
  else if (filters.approved === 'approved') query = query.eq('approved', true);

  const { data, error } = await query;
  if (error) throw error;
  const services = data || [];
  if (services.length === 0) return [];
  const guideIds = Array.from(new Set(services.map(s => s.guide_id).filter(Boolean)));
  const { data: guidesRows, error: guidesErr } = await supabase
    .from('guides')
    .select('id,name')
    .in('id', guideIds);
  if (guidesErr) console.warn('listAllGuideServices: error obteniendo nombres de guías', guidesErr.message);
  const nameMap: Record<string,string> = {};
  (guidesRows||[]).forEach(g => { nameMap[g.id] = g.name; });
  return services.map(s => ({ ...s, guide_name: nameMap[s.guide_id] }));
}

// Aprobar todos los servicios pendientes (global admin)
export async function approveAllPendingServices(): Promise<number> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('guide_services')
    .update({ approved: true })
  .or('approved.eq.false,approved.is.null')
  .select('id');
  if (error) throw error;
  return data?.length || 0;
}

export async function upsertService(payload: Partial<Tables['guide_services']['Row']>): Promise<Tables['guide_services']['Row']> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('guide_services')
    .upsert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as Tables['guide_services']['Row'];
}

export async function deleteService(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('guide_services')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function listAvailabilityByGuide(guideId: string): Promise<Tables['guide_availability']['Row'][]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('guide_availability')
    .select('*')
    .eq('guide_id', guideId)
    .order('date', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function upsertAvailability(payload: Partial<Tables['guide_availability']['Row']>): Promise<Tables['guide_availability']['Row']> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('guide_availability')
    .upsert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as Tables['guide_availability']['Row'];
}

export async function deleteAvailability(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('guide_availability')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function getCurrentUserGuide(): Promise<Tables['guides']['Row'] | null> {
  const supabase = getSupabaseClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const sessionUserId = sessionData?.session?.user?.id;
  
  
  if (!sessionUserId) {
    throw new Error('No hay sesión activa');
  }

  // Cambiar .single() por .limit(1) para obtener solo el más reciente
  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .eq('user_id', sessionUserId)
    .order('created_at', { ascending: false })
    .limit(1);
  
  
  if (error) {
    throw error;
  }
  
  // Retornar el primer resultado o null si no hay ninguno
  return data && data.length > 0 ? data[0] : null;
}

export async function getCurrentUserGuides(): Promise<Tables['guides']['Row'][]> {
  const supabase = getSupabaseClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const sessionUserId = sessionData?.session?.user?.id;
  
  if (!sessionUserId) {
    throw new Error('No hay sesión activa');
  }

  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .eq('user_id', sessionUserId)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data ?? [];
}

import { Guide } from '../types';
import guidesData from '../data/guides.json';

export const guides: Guide[] = guidesData as Guide[];
