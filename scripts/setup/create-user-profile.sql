-- Script para crear manualmente el perfil del usuario autenticado
-- IMPORTANTE: Reemplaza 'joker.kgb@gmail.com' con tu email real

-- 1. Verificar usuarios existentes sin perfil
SELECT 
  u.id,
  u.email,
  u.created_at as user_created,
  up.id as profile_id,
  CASE 
    WHEN up.id IS NULL THEN 'SIN PERFIL' 
    ELSE 'CON PERFIL' 
  END as status
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
ORDER BY u.created_at DESC;

-- 2. Crear perfil para tu usuario específico (CAMBIA EL EMAIL)
INSERT INTO user_profiles (user_id, email, full_name, role)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', 'Usuario Admin'),
  'admin'  -- Cambia a 'user' si quieres que sea usuario normal
FROM auth.users u
WHERE u.email = 'joker.kgb@gmail.com'  -- 🔥 REEMPLAZA ESTE EMAIL CON EL TUYO
AND NOT EXISTS (
  SELECT 1 FROM user_profiles up WHERE up.user_id = u.id
);

-- 3. Verificar que se creó correctamente
SELECT 
  u.id,
  u.email,
  u.created_at as user_created,
  up.full_name,
  up.role,
  up.created_at as profile_created
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.email = 'joker.kgb@gmail.com'  -- 🔥 REEMPLAZA ESTE EMAIL CON EL TUYO
ORDER BY u.created_at DESC;
