-- Script para configurar Supabase Storage para imágenes de usuarios
-- Ejecutar en Supabase SQL Editor

-- 1. Crear bucket para avatares/fotos de perfil
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true, 
  5242880, -- 5MB en bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 2. Crear bucket para imágenes hero
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hero-images', 
  'hero-images', 
  true, 
  10485760, -- 10MB en bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 3. Políticas de seguridad para avatares
-- Permitir que usuarios autenticados suban sus propios avatares
CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Permitir que usuarios autenticados actualicen sus propios avatares  
CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Permitir que usuarios autenticados eliminen sus propios avatares
CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Permitir lectura pública de avatares
CREATE POLICY "Public can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- 4. Políticas similares para imágenes hero
CREATE POLICY "Users can upload their own hero image" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'hero-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own hero image" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'hero-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own hero image" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'hero-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view hero images" ON storage.objects
  FOR SELECT USING (bucket_id = 'hero-images');

-- 5. Verificar que los buckets se crearon correctamente
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id IN ('avatars', 'hero-images');
