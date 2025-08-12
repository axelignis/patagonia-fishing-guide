-- Verificar el rol del usuario joker.kgb@gmail.com
SELECT 
  u.id,
  u.email,
  u.created_at as user_created,
  up.id as profile_id,
  up.full_name,
  up.role,
  up.created_at as profile_created
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.email = 'joker.kgb@gmail.com'
ORDER BY u.created_at DESC;

-- Si el usuario tiene rol 'user', cambiarlo a 'admin' para poder acceder
UPDATE user_profiles 
SET role = 'admin' 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'joker.kgb@gmail.com'
);

-- Verificar el cambio
SELECT 
  u.email,
  up.role,
  up.updated_at
FROM auth.users u
JOIN user_profiles up ON u.id = up.user_id
WHERE u.email = 'joker.kgb@gmail.com';
