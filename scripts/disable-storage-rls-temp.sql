-- SOLUCIÓN TEMPORAL: Desactivar RLS en Storage para testing
-- ⚠️ SOLO PARA DESARROLLO - NO USAR EN PRODUCCIÓN

-- Verificar estado actual de RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- Desactivar RLS temporalmente
-- NOTA: Esto permite acceso completo a todos los archivos
-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Para volver a activar más tarde:
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
