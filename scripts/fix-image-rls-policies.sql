-- Script para arreglar políticas RLS para campos de imagen
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar políticas existentes en user_profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 2. Crear o actualizar política para permitir UPDATE de campos de imagen
-- Primero eliminamos la política existente si existe
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Crear nueva política que permita a los usuarios actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE 
  USING (auth.uid() = user_id::uuid)
  WITH CHECK (auth.uid() = user_id::uuid);

-- 3. Asegurar que los usuarios pueden leer su propio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT 
  USING (auth.uid() = user_id::uuid);

-- 4. Permitir INSERT para nuevos perfiles (necesario para registro)
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id::uuid);

-- 5. Verificar que RLS está habilitado
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 6. Verificar las nuevas políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY policyname;
