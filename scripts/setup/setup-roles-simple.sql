-- Script completo para configurar sistema de roles
-- Ejecutar en Supabase SQL Editor

-- 1. Limpiar cualquier configuración previa
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 2. Crear tabla user_profiles
CREATE TABLE user_profiles (
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

-- 4. Políticas simples (sin recursión)
CREATE POLICY "Enable read access for own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- 5. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Trigger para updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Ver usuarios existentes
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

-- 8. IMPORTANTE: Después de crear usuarios, ejecutar uno de estos:

-- Para hacer alguien ADMIN (reemplaza con email real):
-- UPDATE user_profiles SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';

-- Para hacer alguien GUÍA (reemplaza con email real):
-- UPDATE user_profiles SET role = 'guide' WHERE email = 'guia@ejemplo.com';

-- Para ver todos los perfiles:
-- SELECT * FROM user_profiles ORDER BY created_at DESC;
