-- Script para debuggear y arreglar políticas de Storage
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar buckets existentes
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets;

-- 2. Verificar políticas existentes en storage.objects
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- 3. Eliminar políticas existentes para recrearlas correctamente
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own hero image" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own hero image" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own hero image" ON storage.objects;
DROP POLICY IF EXISTS "Public can view hero images" ON storage.objects;

-- 4. Crear políticas simplificadas y más permisivas para avatares

-- Política para INSERT (upload) de avatares
CREATE POLICY "Users can upload avatar" ON storage.objects
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated'
  );

-- Política para UPDATE de avatares  
CREATE POLICY "Users can update avatar" ON storage.objects
  FOR UPDATE 
  USING (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated'
  )
  WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated'
  );

-- Política para DELETE de avatares
CREATE POLICY "Users can delete avatar" ON storage.objects
  FOR DELETE 
  USING (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated'
  );

-- Política para SELECT (view) de avatares - pública
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'avatars');

-- 5. Crear políticas para hero-images

-- Política para INSERT (upload) de hero images
CREATE POLICY "Users can upload hero image" ON storage.objects
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'hero-images' AND 
    auth.role() = 'authenticated'
  );

-- Política para UPDATE de hero images
CREATE POLICY "Users can update hero image" ON storage.objects
  FOR UPDATE 
  USING (
    bucket_id = 'hero-images' AND 
    auth.role() = 'authenticated'
  )
  WITH CHECK (
    bucket_id = 'hero-images' AND 
    auth.role() = 'authenticated'
  );

-- Política para DELETE de hero images
CREATE POLICY "Users can delete hero image" ON storage.objects
  FOR DELETE 
  USING (
    bucket_id = 'hero-images' AND 
    auth.role() = 'authenticated'
  );

-- Política para SELECT (view) de hero images - pública
CREATE POLICY "Anyone can view hero images" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'hero-images');

-- 6. Verificar que RLS está habilitado en storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 7. Verificar las nuevas políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;
