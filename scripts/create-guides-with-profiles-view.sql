-- Crea o reemplaza la vista combinando guías con imágenes de perfil
CREATE OR REPLACE VIEW public.guides_with_profiles AS
SELECT 
  g.id,
  g.user_id,
  g.name,
  g.age,
  g.bio,
  g.location,
  g.price_per_day,
  g.rating,
  g.total_reviews,
  g.languages,
  g.specialties,
  g.is_active,
  g.created_at,
  g.region_code,
  g.province_code,
  g.commune_code,
  -- Campos de imágenes (pueden no existir en guides directamente)
  up.avatar_url,
  up.hero_image_url,
  -- Mantener cover_url / avatar_url originales si existían
  g.cover_url,
  g.avatar_url AS legacy_avatar_url
FROM public.guides g
LEFT JOIN public.user_profiles up ON up.user_id = g.user_id;

-- Permisos básicos (si usas RLS en guides, la vista hereda; si no, abrir SELECT público según necesidad)
GRANT SELECT ON public.guides_with_profiles TO anon, authenticated;

-- Nota: Si RLS está habilitado en guides o user_profiles y deseas exponer campos públicos,
-- asegúrate de tener políticas SELECT adecuadas allí. Las vistas solo reflejan lo permitido.
