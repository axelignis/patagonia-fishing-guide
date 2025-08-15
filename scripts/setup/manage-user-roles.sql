-- Script para gestionar roles de usuarios fácilmente
-- Copiar y descomentar las secciones que necesites

-- 1. Ver todos los usuarios y sus roles actuales
SELECT 
  u.id,
  u.email,
  u.created_at as user_created,
  up.full_name,
  up.role,
  up.updated_at
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
ORDER BY u.created_at DESC;

-- 2. Cambiar axel.monsalve.ponce@gmail.com a ADMIN
-- UPDATE user_profiles 
-- SET role = 'admin', updated_at = NOW()
-- WHERE email = 'axel.monsalve.ponce@gmail.com';

-- 3. Cambiar otro usuario a GUÍA (ejemplo)
-- UPDATE user_profiles 
-- SET role = 'guide', updated_at = NOW()
-- WHERE email = 'guia@email.com';

-- 4. Cambiar un usuario a USER NORMAL
-- UPDATE user_profiles 
-- SET role = 'user', updated_at = NOW()
-- WHERE email = 'usuario@email.com';

-- 5. Ver estadísticas de roles
SELECT 
  role,
  COUNT(*) as cantidad,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as porcentaje
FROM user_profiles
GROUP BY role
ORDER BY cantidad DESC;
