# Configuración de Supabase para Magic Links

## Pasos para configurar correctamente los Magic Links:

### 1. Configurar Site URL y Redirect URLs en Supabase Dashboard

Ve a tu proyecto de Supabase → Settings → Authentication → URL Configuration:

**Site URL:**
```
http://localhost:3002
```

**Redirect URLs (añadir estas URLs):**
```
http://localhost:3002/admin/auth/callback
http://localhost:3002/admin
http://localhost:3002/
```

### 2. Configurar Email Templates (opcional)

Ve a Settings → Authentication → Email Templates:

- **Magic Link**: Personalizar el template del magic link
- **Asegurar que el enlace apunte a**: `{{ .SiteURL }}/admin/auth/callback`

### 3. Verificar Rate Limiting

Ve a Settings → Authentication → Rate Limiting:

- **Email sending rate**: Ajustar si es necesario (recomendado: 3 por hora para desarrollo)

### 4. Ejecutar el script SQL

Ejecuta el contenido del archivo `fix-rls-policies.sql` en Supabase SQL Editor para arreglar las políticas RLS.

### 5. Verificar funcionamiento

1. Ve a `/admin/login`
2. Ingresa un email y haz clic en "Enviar Magic Link"
3. Revisa tu email
4. Haz clic en el enlace
5. Deberías ser redirigido a `/admin/auth/callback` y luego a `/admin`

### 6. Solución de problemas comunes

**Error "otp_expired":**
- El magic link tiene un tiempo de expiración (por defecto 1 hora)
- Solicita un nuevo enlace

**Error "access_denied":**
- Verifica que las Redirect URLs estén configuradas correctamente
- Asegúrate de que el dominio coincida exactamente

**Error "invalid_request":**
- El enlace puede haber sido usado ya
- Los magic links son de un solo uso

### 7. Testing en producción

Cuando despliegues a producción, actualiza:

**Site URL:**
```
https://tu-dominio.com
```

**Redirect URLs:**
```
https://tu-dominio.com/admin/auth/callback
https://tu-dominio.com/admin
https://tu-dominio.com/
```
