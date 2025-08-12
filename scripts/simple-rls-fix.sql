-- Script simple para arreglar RLS - ejecutar paso a paso
-- 1. Verificar tabla user_profiles existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'user_profiles';

-- 2. Si no existe, crear la tabla
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'guide', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 3. Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Política simple para lectura (usuarios ven su propio perfil)
DROP POLICY IF EXISTS "profiles_select_policy" ON user_profiles;
CREATE POLICY "profiles_select_policy" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- 5. Política simple para inserción (permitir insertar el propio perfil)
DROP POLICY IF EXISTS "profiles_insert_policy" ON user_profiles;
CREATE POLICY "profiles_insert_policy" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Política simple para actualización (permitir actualizar el propio perfil)
DROP POLICY IF EXISTS "profiles_update_policy" ON user_profiles;
CREATE POLICY "profiles_update_policy" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- 7. Verificar políticas creadas
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_profiles';
