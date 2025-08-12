-- Script para arreglar las políticas RLS definitivamente
-- Ejecutar este script completo en Supabase SQL Editor

-- 1. Verificar usuarios existentes
SELECT 
  u.id,
  u.email,
  u.created_at as user_created,
  up.id as profile_id,
  up.role,
  CASE 
    WHEN up.id IS NULL THEN 'SIN PERFIL' 
    ELSE 'CON PERFIL' 
  END as status
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
ORDER BY u.created_at DESC;

-- 2. Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "profiles_select_policy" ON user_profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON user_profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert access for profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable update access for profiles" ON user_profiles;

-- 3. Crear políticas más permisivas

-- Política para lectura: cualquier usuario autenticado puede leer su perfil
-- TAMBIÉN permitir a usuarios anónimos leer (para casos especiales)
CREATE POLICY "allow_profile_read" ON user_profiles
    FOR SELECT USING (
        auth.uid() = user_id OR
        auth.role() = 'anon'
    );

-- Política para inserción: solo el propio usuario puede insertar su perfil
-- TAMBIÉN permitir a usuarios anónimos insertar (para registro inicial)
CREATE POLICY "allow_profile_insert" ON user_profiles
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        auth.role() = 'anon'
    );

-- Política para actualización: solo el propio usuario puede actualizar su perfil
CREATE POLICY "allow_profile_update" ON user_profiles
    FOR UPDATE USING (
        auth.uid() = user_id
    );

-- 4. Alternativamente, DESHABILITAR RLS temporalmente para debug
-- ¡¡¡ SOLO PARA DESARROLLO - NO USAR EN PRODUCCIÓN !!!
-- ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 5. Verificar políticas actuales
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 6. Verificar RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'user_profiles';
