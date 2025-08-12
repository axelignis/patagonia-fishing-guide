-- EJECUTA ESTE SCRIPT EN SUPABASE SQL EDITOR
-- Solución paso a paso sin tocar storage.objects

-- ================================
-- PASO 1: ARREGLAR USER_PROFILES
-- ================================

-- Agregar columnas de imagen
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS hero_image_url TEXT;

-- Eliminar políticas problemáticas
DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON user_profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON user_profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON user_profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON user_profiles;

-- Crear UNA política simple que permita todo para usuarios autenticados
CREATE POLICY "authenticated_users_all_access" ON user_profiles
  FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ================================
-- PASO 2: CREAR BUCKETS
-- ================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('hero-images', 'hero-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ================================
-- PASO 3: CAMBIAR ROLES
-- ================================

-- Cambiar rol a admin
UPDATE user_profiles 
SET role = 'admin', updated_at = NOW()
WHERE email IN ('axel.monsalve.ponce@gmail.com', 'joker.kgb@gmail.com');

-- ================================
-- PASO 4: VERIFICACIONES
-- ================================

-- Ver buckets
SELECT 'BUCKETS:' as tipo, id, name FROM storage.buckets WHERE id IN ('avatars', 'hero-images');

-- Ver admins
SELECT 'ADMINS:' as tipo, email, role FROM user_profiles WHERE role = 'admin';

-- Ver políticas
SELECT 'POLÍTICAS:' as tipo, policyname FROM pg_policies WHERE tablename = 'user_profiles';
