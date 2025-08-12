import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { getCurrentUserGuide, getCurrentUserGuides, upsertGuide, listServicesByGuide, listAvailabilityByGuide } from '../../services/guides';
import { NavigationButton } from '../../components/NavigationButton';
import { ImageUploader } from '../../components/ImageUploader';
import { Tables, getSupabaseClient } from '../../services/supabase';
import { ChileLocationSelector } from '../../components/ChileLocationSelector';
import { useChileLocations } from '../../hooks/useChileLocations';
import { useAuth } from '../../hooks/useAuth';

type Guide = Tables['guides']['Row'];

export default function GuidePanel(): JSX.Element {
  const queryClient = useQueryClient();
  const { profile, role } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Guide>>({
    name: '',
    location: '',
    bio: '',
    price_per_day: 0,
    age: null,
    languages: [],
    specialties: []
  });
  const { regions, getProvinces, getCommunes } = useChileLocations();
  const [locationCodes, setLocationCodes] = useState<{ region?: string; province?: string; commune?: string }>({});

  // Efecto para obtener el user_id actual
  useEffect(() => {
    async function getCurrentUserId() {
      try {
        const supabase = getSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          setCurrentUserId(session.user.id);
        }
      } catch (error) {
        console.error('Error getting current user ID:', error);
      }
    }
    getCurrentUserId();
  }, []);

  // Query para obtener el guía del usuario actual
  const { data: guide, isLoading, error } = useQuery(['current-user-guide'], getCurrentUserGuide);
  
  // Query para obtener todos los guías del usuario (para mostrar si hay múltiples)
  const { data: allGuides } = useQuery(['current-user-guides'], getCurrentUserGuides);
  
  // Query para obtener servicios del guía
  const { data: services } = useQuery(
    ['guide-services', guide?.id],
    () => listServicesByGuide(guide!.id),
    { enabled: !!guide?.id }
  );

  // Query para obtener disponibilidad del guía
  const { data: availability } = useQuery(
    ['guide-availability', guide?.id],
    () => listAvailabilityByGuide(guide!.id),
    { enabled: !!guide?.id }
  );

  // Mutation para crear/actualizar el perfil
  const upsertMutation = useMutation(
    (guideData: Partial<Guide>) => {
      return upsertGuide(guideData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['current-user-guide']);
        setIsEditing(false);
      },
      onError: (error: any) => {
        console.error('upsertMutation - error:', error);
        alert(`Error: ${error?.message || 'No se pudo guardar el perfil'}`);
      }
    }
  );

  const handleEdit = () => {
    if (guide) {
      setFormData({
        id: guide.id,
        name: guide.name || '',
        location: guide.location || '',
        bio: guide.bio || '',
        price_per_day: guide.price_per_day || 0,
        age: guide.age || null,
        languages: guide.languages || [],
        specialties: guide.specialties || []
      });
      setLocationCodes({
        region: (guide as any).region_code || undefined,
        province: (guide as any).province_code || undefined,
        commune: (guide as any).commune_code || undefined,
      });
    } else {
      // Crear nuevo perfil
  setFormData({
        name: '',
        location: '',
        bio: '',
        price_per_day: 0,
        age: null,
        languages: [],
        specialties: []
      });
  setLocationCodes({});
    }
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    
    // Debug: Verificar que los arrays se están enviando correctamente
    
    // Si no se llenó location manual pero tenemos códigos, construir una cadena amigable
    let finalLocation = formData.location;
    if ((!finalLocation || finalLocation.trim() === '') && locationCodes.region) {
  const regionObj = regions.find((r: any) => r.codigo === locationCodes.region);
  const provinceObj = locationCodes.province ? getProvinces(locationCodes.region).find((p: any) => p.codigo === locationCodes.province) : null;
  const communeObj = locationCodes.commune && locationCodes.province ? getCommunes(locationCodes.province).find((c: any) => c.codigo === locationCodes.commune) : null;
      finalLocation = [communeObj?.nombre, provinceObj?.nombre, regionObj?.nombre].filter(Boolean).join(', ');
    }

    upsertMutation.mutate({
      ...formData,
      location: finalLocation,
      region_code: locationCodes.region,
      province_code: locationCodes.province,
      commune_code: locationCodes.commune,
    } as any);
  };

  const handleLanguagesChange = (value: string) => {
    const languagesArray = value.split(',').map(lang => lang.trim()).filter(lang => lang !== '');
    setFormData({ ...formData, languages: languagesArray });
  };

  const handleSpecialtiesChange = (value: string) => {
    const specialtiesArray = value.split(',').map(spec => spec.trim()).filter(spec => spec !== '');
    setFormData({ ...formData, specialties: specialtiesArray });
  };

  const handleAvatarUpload = (imageUrl: string) => {
    // Recargar el perfil del usuario para obtener la nueva imagen
    queryClient.invalidateQueries(['current-user-guide']);
  };

  const handleHeroImageUpload = (imageUrl: string) => {
    // Recargar el perfil del usuario para obtener la nueva imagen
    queryClient.invalidateQueries(['current-user-guide']);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error al cargar el perfil</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <NavigationButton to="/admin" label="← Volver al panel" />
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">Mi Panel de Guía</h1>
          
          {/* Mensaje según el rol del usuario */}
          {role === 'user' && (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-r-lg mb-4">
              <div className="flex">
                <div>
                  <p className="font-medium">Panel de Usuario</p>
                  <p className="text-sm">
                    Aquí puedes gestionar tu perfil de guía. Como usuario básico, puedes crear y editar tu perfil, 
                    pero necesitas que un administrador active tu cuenta como guía para recibir reservas.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {role === 'guide' && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg mb-4">
              <div className="flex">
                <div>
                  <p className="font-medium">Panel de Guía Activo</p>
                  <p className="text-sm">
                    Tu cuenta está activa como guía. Puedes gestionar tu perfil, servicios y disponibilidad.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {role === 'admin' && (
            <div className="bg-purple-100 border-l-4 border-purple-500 text-purple-700 p-4 rounded-r-lg mb-4">
              <div className="flex">
                <div>
                  <p className="font-medium">Panel de Administrador</p>
                  <p className="text-sm">
                    Como administrador, puedes gestionar tu propio perfil de guía y también acceder a la gestión completa del sistema.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

  {/* Perfil del Guía (primero) */}
        <div className="bg-white/90 rounded-2xl p-6 shadow-2xl mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Mi Perfil</h2>
            {guide && !isEditing && (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Editar Perfil
              </button>
            )}
          </div>

          {!guide && !isEditing ? (
            <div className="text-center py-8">
              <p className="text-slate-600 mb-4">No tienes un perfil de guía creado aún.</p>
              <button
                onClick={handleEdit}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:scale-[1.02] transition"
              >
                Crear Mi Perfil
              </button>
            </div>
          ) : isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                    <span>Ubicación</span>
                    <span className="text-xs text-slate-400">(manual o selector)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Pucón, Cautín, Araucanía"
                    className="w-full mb-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                  <ChileLocationSelector
                    value={{ region: locationCodes.region, commune: locationCodes.commune }}
                    onChange={(v: any) => setLocationCodes({ region: v.region, commune: v.commune })}
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Si dejas el campo manual vacío y seleccionas códigos, se autocompletará al guardar.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Edad</label>
                  <input
                    type="number"
                    min="18"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    value={formData.age || ''}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) || null })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Precio por día (CLP)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    value={formData.price_per_day || ''}
                    onChange={(e) => setFormData({ ...formData, price_per_day: Number(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Biografía</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  rows={4}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Idiomas (separados por comas)
                  </label>
                  <input
                    type="text"
                    placeholder="Español, Inglés, Portugués"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    value={formData.languages?.join(', ') || ''}
                    onChange={(e) => handleLanguagesChange(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Especialidades (separadas por comas)
                  </label>
                  <input
                    type="text"
                    placeholder="Pesca con mosca, Spinning, Trolling"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    value={formData.specialties?.join(', ') || ''}
                    onChange={(e) => handleSpecialtiesChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={upsertMutation.isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:scale-[1.02] transition disabled:opacity-50"
                >
                  {upsertMutation.isLoading ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                
              </div>
            </form>
          ) : guide ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <span className="font-medium text-slate-700">Nombre:</span>
                  <div className="text-slate-900 font-semibold">{guide.name}</div>
                </div>
                {guide.location && (
                  <div>
                    <span className="font-medium text-slate-700">Ubicación:</span>
                    <div className="text-slate-900">{guide.location}</div>
                  </div>
                )}
                {guide.age && (
                  <div>
                    <span className="font-medium text-slate-700">Edad:</span>
                    <div className="text-slate-900">{guide.age} años</div>
                  </div>
                )}
                {guide.price_per_day && (
                  <div>
                    <span className="font-medium text-slate-700">Precio por día:</span>
                    <div className="text-slate-900">${guide.price_per_day.toLocaleString()} CLP</div>
                  </div>
                )}
              </div>

              {guide.bio && (
                <div>
                  <span className="font-medium text-slate-700">Biografía:</span>
                  <p className="text-slate-900 mt-1">{guide.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guide.languages && guide.languages.length > 0 && (
                  <div>
                    <span className="font-medium text-slate-700">Idiomas:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {guide.languages.map((lang, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {guide.specialties && guide.specialties.length > 0 && (
                  <div>
                    <span className="font-medium text-slate-700">Especialidades:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {guide.specialties.map((spec, index) => (
                        <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Sección de gestión de imágenes (ahora debajo de Mi Perfil y más compacta) */}
        {(profile || currentUserId) ? (
          <div className="bg-white/90 rounded-2xl p-5 shadow-xl mb-8 border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Imágenes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploader
                label="Foto de Perfil"
                currentImageUrl={profile?.avatar_url}
                onImageUploaded={handleAvatarUpload}
                bucket="avatars"
                // IMPORTANTE: usar user_id (auth.uid) para cumplir política de Storage
                userId={profile?.user_id || currentUserId || ''}
                maxWidth={400}
                maxHeight={400}
                aspectRatio="square"
                className="w-full"
                minHeight={140}
              />
              <ImageUploader
                label="Imagen de Portada"
                currentImageUrl={profile?.hero_image_url}
                onImageUploaded={handleHeroImageUpload}
                bucket="hero-images"
                userId={profile?.user_id || currentUserId || ''}
                maxWidth={1200}
                maxHeight={600}
                aspectRatio="wide"
                className="w-full"
                minHeight={140}
              />
            </div>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <ul className="text-xs text-blue-600 space-y-1">
                <li><strong>Foto:</strong> imagen cuadrada, buena iluminación.</li>
                <li><strong>Portada:</strong> panorámica representativa.</li>
                <li>Se optimizan automáticamente.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-white/90 rounded-2xl p-5 shadow-xl mb-8 border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Imágenes</h2>
            <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3 mb-2">
              <p className="text-yellow-700 text-sm">
                Cargando perfil para habilitar subida...
              </p>
            </div>
          </div>
        )}

        {/* Alerta múltiple perfiles removida por simplificación */}

        {/* Panel de Gestión - Solo si existe el perfil */}
        {guide && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Servicios */}
            <div className="bg-white/90 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Mis Servicios</h3>
              <div className="space-y-2 mb-4">
                <div className="text-sm text-slate-600">
                  Total: {services?.length || 0} servicios
                </div>
                {services && services.length > 0 ? (
                  <>
                    {services.slice(0, 3).map((service) => (
                      <div key={service.id} className="text-sm border-l-2 border-emerald-500 pl-2">
                        <div className="font-medium text-slate-800">{service.title}</div>
                        <div className="text-slate-600">${service.price?.toLocaleString()} CLP</div>
                      </div>
                    ))}
                    {services.length > 3 && (
                      <div className="text-sm text-slate-500">
                        y {services.length - 3} más...
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-slate-500 italic">
                    No tienes servicios creados aún.
                  </div>
                )}
              </div>
              <Link
                to={`/admin/guides/${guide.id}/services`}
                className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:scale-[1.02] transition"
              >
                Gestionar Servicios
              </Link>
            </div>

            {/* Disponibilidad */}
            <div className="bg-white/90 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Mi Disponibilidad</h3>
              <div className="space-y-2 mb-4">
                <div className="text-sm text-slate-600">
                  Total: {availability?.length || 0} fechas configuradas
                </div>
                {availability && availability.length > 0 ? (
                  <>
                    {availability.slice(0, 3).map((slot) => (
                      <div key={slot.id} className="text-sm border-l-2 border-cyan-500 pl-2">
                        <div className="font-medium text-slate-800">
                          {new Date(slot.date).toLocaleDateString('es-CL')}
                        </div>
                        <div className="text-slate-600">
                          {slot.start_time} - {slot.end_time}
                        </div>
                      </div>
                    ))}
                    {availability.length > 3 && (
                      <div className="text-sm text-slate-500">
                        y {availability.length - 3} más...
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-slate-500 italic">
                    No tienes disponibilidad configurada.
                  </div>
                )}
              </div>
              <button
                disabled
                className="block w-full text-center px-4 py-2 bg-gray-400 text-white rounded-xl cursor-not-allowed"
              >
                Próximamente
              </button>
            </div>

            {/* Reservas */}
            <div className="bg-white/90 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Mis Reservas</h3>
              <div className="space-y-2 mb-4">
                <div className="text-sm text-slate-600">
                  Próximas reservas: 0
                </div>
                <div className="text-sm text-slate-500 italic">
                  Las reservas aparecerán aquí cuando los clientes reserven tus servicios.
                </div>
              </div>
              <button
                disabled
                className="block w-full text-center px-4 py-2 bg-gray-400 text-white rounded-xl cursor-not-allowed"
              >
                Próximamente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
