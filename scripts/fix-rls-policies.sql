-- Script para arreglar las políticas RLS y permitir registro de usuarios
-- Ejecutar en Supabase SQL Editor

-- 1. Eliminar políticas existentes
DROP POLICY IF EXISTS "Enable read access for own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert access for own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable update access for own profile" ON user_profiles;

-- 2. Crear políticas mejoradas

-- Política para lectura: usuarios pueden leer su propio perfil, admins pueden leer todos
CREATE POLICY "Enable read access for profiles" ON user_profiles
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );

-- Política para inserción: permitir inserción si el user_id coincide con el usuario autenticado
-- O si no hay usuario autenticado (para permitir registro inicial)
CREATE POLICY "Enable insert access for profiles" ON user_profiles
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        auth.uid() IS NULL
    );

-- Política para actualización: solo el propio usuario o admins
CREATE POLICY "Enable update access for profiles" ON user_profiles
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );

-- 3. Función alternativa: crear perfil automáticamente cuando se registra un usuario
-- Esta función se ejecutará automáticamente cada vez que se cree un usuario en auth.users

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger para ejecutar la función automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Verificar configuración actual
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 6. Verificar usuarios y perfiles existentes
SELECT 
  u.id,
  u.email,
  u.created_at as user_created,
  up.full_name,
  up.role,
  up.created_at as profile_created
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
ORDER BY u.created_at DESC;
