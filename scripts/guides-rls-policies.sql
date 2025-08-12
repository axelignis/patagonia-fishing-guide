-- Políticas RLS para tabla guides
-- Ejecutar en Supabase SQL Editor si la lista de guías aparece vacía por RLS.

-- Verificar si RLS está activado
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname = 'guides';

-- (Opcional) Activar RLS si aún no está (solo si quieres control granular)
-- ALTER TABLE guides ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas previas
DROP POLICY IF EXISTS "guides_public_select" ON guides;
DROP POLICY IF EXISTS "guides_authenticated_select" ON guides;
DROP POLICY IF EXISTS "guides_owner_mod" ON guides;
DROP POLICY IF EXISTS "guides_insert_authenticated" ON guides;
DROP POLICY IF EXISTS "guides_owner_delete" ON guides;

-- Política de lectura pública (usuarios ven guías activas o sin flag)
CREATE POLICY "guides_public_select" ON guides
  FOR SELECT USING ( is_active IS DISTINCT FROM FALSE );

-- Política para que el dueño pueda actualizar su propio registro
CREATE POLICY "guides_owner_mod" ON guides
  FOR UPDATE USING ( auth.uid() = user_id )
  WITH CHECK ( auth.uid() = user_id );

-- Política para permitir INSERT al usuario autenticado creando su propio guía
CREATE POLICY "guides_insert_authenticated" ON guides
  FOR INSERT WITH CHECK ( auth.uid() = user_id );

-- Política para que el dueño pueda eliminar su guía
CREATE POLICY "guides_owner_delete" ON guides
  FOR DELETE USING ( auth.uid() = user_id );

-- Verificar políticas
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'guides'
ORDER BY policyname;

-- Probar conteo visible (ejecutar autenticado y no autenticado)
SELECT count(*) FROM guides;
