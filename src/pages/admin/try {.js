try {
  console.log('Registrando usuario:', email);

  // 1. Registrar usuario en Supabase Auth
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  });

  if (authError) {
    console.error('Error de registro:', authError);
    setError(authError.message);
    return;
  }

  if (data.user) {
    console.log('Usuario registrado:', data.user);

    // 2. Crear perfil del usuario (rol por defecto: 'user')
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([
        {
          user_id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          role: 'user' // Rol por defecto
        }
      ]);

    if (profileError) {
      console.error('Error creando perfil:', profileError);
      setError('Usuario creado pero error al crear perfil: ' + profileError.message);
      return;
    }

    console.log('Perfil creado exitosamente');
    setSuccess('Usuario registrado exitosamente! Revisa tu email para confirmar tu cuenta.');
    
    // Limpiar formulario
    setEmail('');
    setPassword('');
    setFullName('');
    
    // Redirigir al login después de 3 segundos
    setTimeout(() => {
      navigate('/admin/login');
    }, 3000);
  }
} catch (err) {
  console.error('Error inesperado:', err);
  setError('Error inesperado al registrar usuario');
} finally {
  setLoading(false);
}