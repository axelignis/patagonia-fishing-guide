import { getSupabaseClient, Tables } from './supabase';

export async function listGuides(): Promise<Tables['guides']['Row'][]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getGuideById(id: string): Promise<Tables['guides']['Row'] | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
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
      price_per_day: payload.price_per_day ?? null,
      user_id: sessionUserId,
    } as Partial<Tables['guides']['Row']>;

    const { data, error } = await supabase
      .from('guides')
      .insert(insertPayload)
      .select()
      .single();
    if (error) throw new Error(error.message || 'No se pudo crear el guía');
    return data as Tables['guides']['Row'];
  }

  // Update explícito por id (evita que upsert intente insertar y dispare NOT NULL)
  const updatePayload = {
    name: payload.name,
    location: payload.location,
    bio: payload.bio,
    price_per_day: payload.price_per_day,
  } as Partial<Tables['guides']['Row']>;

  const { data, error } = await supabase
    .from('guides')
    .update(updatePayload)
    .eq('id', payload.id as string)
    .select()
    .single();
  if (error) throw new Error(error.message || 'No se pudo actualizar el guía');
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
  const { data, error } = await supabase
    .from('guide_services')
    .select('*')
    .eq('guide_id', guideId)
    .order('title');
  if (error) throw error;
  return data ?? [];
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

import { Guide } from '../types';
import guidesData from '../data/guides.json';

export const guides: Guide[] = guidesData as Guide[];
