-- Script para limpiar perfiles duplicados de guías
-- Ejecutar en Supabase SQL Editor

-- 1. Ver todos los perfiles de guía del usuario actual
SELECT id, name, user_id, created_at 
FROM guides 
WHERE user_id = (
  SELECT auth.uid()::text
)
ORDER BY created_at DESC;

-- 2. Eliminar perfiles duplicados (mantener solo el más reciente)
-- ⚠️ CUIDADO: Esto eliminará los perfiles más antiguos
DELETE FROM guides 
WHERE user_id = (SELECT auth.uid()::text)
AND id NOT IN (
  SELECT id 
  FROM guides 
  WHERE user_id = (SELECT auth.uid()::text)
  ORDER BY created_at DESC 
  LIMIT 1
);

-- 3. Verificar que solo quede un perfil
SELECT 'DESPUÉS DE LIMPIEZA:' as info, id, name, user_id, created_at 
FROM guides 
WHERE user_id = (SELECT auth.uid()::text)
ORDER BY created_at DESC;
