# Scripts del Proyecto

Este directorio contiene scripts organizados para el mantenimiento y configuración del proyecto.

## 📁 Estructura

### `/setup`
Scripts de configuración inicial de la base de datos:
- `setup-final.sql` - Configuración completa de tablas y políticas RLS
- `setup-storage.sql` - Configuración de almacenamiento de archivos  
- `setup-roles-simple.sql` - Configuración de roles de usuario

### `/seed`
Scripts para poblar la base de datos con datos de prueba:
- `seed-guides.js` - Genera guías de pesca con datos reales
- `seed-20-guides.js` - Versión reducida para testing rápido

### `/utils`
Utilidades y scripts de mantenimiento:
- `fetch-chile-dpa.js` - Descarga datos de División Política Administrativa de Chile

## 🚀 Uso

```bash
# Poblar base de datos con guías
node scripts/seed/seed-guides.js

# Actualizar datos de Chile
node scripts/utils/fetch-chile-dpa.js

# Setup inicial de BD (ejecutar en Supabase SQL Editor)
# Copiar contenido de scripts/setup/setup-final.sql
```

## ⚠️ Notas

- Los scripts de setup (.sql) deben ejecutarse en el SQL Editor de Supabase
- Los scripts de Node.js requieren variables de entorno configuradas
- Mantener siempre respaldo antes de ejecutar scripts de seed
