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
  -- Imagen de avatar final priorizando perfil; si RLS bloquea user_profiles cae a guides.avatar_url
  COALESCE(up.avatar_url, g.avatar_url) AS avatar_url,
  -- Imagen de hero/cover final priorizando hero del perfil, luego cover_url (legacy), luego avatar para evitar vacío
  COALESCE(up.hero_image_url, g.cover_url, up.avatar_url, g.avatar_url) AS hero_image_url,
  -- Campos legacy expuestos para depuración
  g.cover_url AS legacy_cover_url,
  g.avatar_url AS legacy_avatar_url
FROM public.guides g
LEFT JOIN public.user_profiles up ON up.user_id = g.user_id;

-- Permisos básicos (si usas RLS en guides, la vista hereda; si no, abrir SELECT público según necesidad)
GRANT SELECT ON public.guides_with_profiles TO anon, authenticated;

-- Nota: Con COALESCE se evita perder la imagen sincronizada en guides si RLS impide leer user_profiles.
-- Asegura tener políticas SELECT en guides para columnas avatar_url/cover_url si quieres mostrarlas públicamente.
