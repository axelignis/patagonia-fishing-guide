-- Script para agregar campos de imágenes a user_profiles
-- Ejecutar en Supabase SQL Editor

-- Agregar columnas para URLs de imágenes
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS hero_image_url TEXT;

-- Agregar comentarios para documentación
COMMENT ON COLUMN user_profiles.avatar_url IS 'URL de la foto de perfil del usuario almacenada en Supabase Storage';
COMMENT ON COLUMN user_profiles.hero_image_url IS 'URL de la imagen hero del perfil del guía almacenada en Supabase Storage';

-- Verificar la estructura actualizada
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;
