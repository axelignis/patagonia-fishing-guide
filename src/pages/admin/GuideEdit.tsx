import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getGuideById as fetchGuideById, upsertGuide, listServicesByGuide } from '../../services/guides';
import { NavigationButton } from '../../components/NavigationButton';
import { ChileLocationSelector } from '../../components/ChileLocationSelector';
import { useAuth } from '../../hooks/useAuth';
import { useQueryClient } from 'react-query';
import { ImageService } from '../../services/imageService';
import { Camera } from 'lucide-react';

export default function GuideEdit(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    location: '',
    bio: '',
    region_code: '',
    province_code: '',
    commune_code: '',
  age: '',
  languages: [] as string[],
  specialties: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [guideProfile, setGuideProfile] = useState<{ user_id?: string; avatar_url?: string|null; hero_image_url?: string|null }>({});
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const coverInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const isNew = id === 'new';
  useEffect(() => {
  if (!isNew && id) {
      fetchGuideById(id).then(async (g: any) => {
        if (g) {
          setForm({
            name: g.name || '',
            location: g.location || '',
            bio: g.bio || '',
            region_code: g.region_code || '',
            province_code: g.province_code || '',
            commune_code: g.commune_code || '',
            age: g.age || '',
            languages: g.languages || [],
            specialties: g.specialties || [],
          });
          setGuideProfile({
            user_id: g.user_id,
            avatar_url: g.avatar_url || g.user_profiles?.avatar_url || null,
            hero_image_url: g.hero_image_url || g.user_profiles?.hero_image_url || null,
          });
          // Si la vista no entrega imágenes, intentar fetch directo del perfil
          if ((!g.avatar_url && !g.user_profiles?.avatar_url) || (!g.hero_image_url && !g.user_profiles?.hero_image_url)) {
            try {
              const supabase = (await import('../../services/supabase')).getSupabaseClient();
              const { data: up } = await supabase.from('user_profiles').select('avatar_url, hero_image_url').eq('user_id', g.user_id).maybeSingle();
              if (up) setGuideProfile(p => ({ ...p, avatar_url: p.avatar_url || up.avatar_url, hero_image_url: p.hero_image_url || up.hero_image_url }));
            } catch {}
          }
        }
      }).catch(() => {});
      // Cargar conteo de pendientes
      listServicesByGuide(id).then(svcs => {
        const pending = (svcs || []).filter((s: any) => s.approved !== true).length;
        setPendingCount(pending);
      }).catch(()=>{});
    }
  }, [id, isNew]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Auto construir location si está vacío pero hay códigos
      const locationAuto = !form.location && form.region_code ? `${form.region_code}${form.province_code ? ' - '+form.province_code : ''}${form.commune_code ? ' - '+form.commune_code : ''}` : form.location;
      await upsertGuide({
        id: isNew ? undefined : id,
        name: form.name,
        location: locationAuto,
        bio: form.bio,
        age: form.age ? Number(form.age) : null,
        languages: form.languages,
        specialties: form.specialties,
        region_code: form.region_code || null,
        province_code: form.province_code || null,
        commune_code: form.commune_code || null,
      } as any);
      navigate('/admin/guides');
    } catch (err: any) {
      alert(`Error: ${err?.message || 'No se pudo guardar'}`);
    } finally {
      setLoading(false);
    }
  }

  const handleImageFile = async (file: File | null, kind: 'avatar' | 'hero') => {
    if (!file || !guideProfile?.user_id) return;
    try {
      if (kind === 'avatar') setUploadingAvatar(true); else setUploadingCover(true);
      // Validar y redimensionar
      const validation = ImageService.validateImageFile(file, { maxSizeMB: kind === 'avatar' ? 5 : 10 });
      if (!validation.isValid) {
        alert(validation.error || 'Archivo inválido');
        return;
      }
      let fileToUpload = file;
      if (file.size > 1024 * 1024) {
        fileToUpload = await ImageService.resizeImage(file, kind === 'avatar' ? 400 : 1200, kind === 'avatar' ? 400 : 600);
      }
      const bucket = kind === 'avatar' ? 'avatars' : 'hero-images';
      const url = await ImageService.uploadImage({ bucket, userId: guideProfile.user_id, file: fileToUpload });
      await ImageService.updateProfileImageUrl(guideProfile.user_id, kind === 'avatar' ? 'avatar_url' : 'hero_image_url', url);
      setGuideProfile(p => ({ ...p, [kind === 'avatar' ? 'avatar_url' : 'hero_image_url']: url }));
      // Invalidar queries relevantes para forzar refetch en otros lugares
      queryClient.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'guides' });
      queryClient.invalidateQueries(['current-user-guide']);
      // Confirmar persistencia: fetch rápido del perfil
      try {
        const supabase = (await import('../../services/supabase')).getSupabaseClient();
        const { data: up } = await supabase.from('user_profiles').select('avatar_url, hero_image_url').eq('user_id', guideProfile.user_id).maybeSingle();
        if (up) setGuideProfile(p => ({ ...p, avatar_url: up.avatar_url, hero_image_url: up.hero_image_url }));
      } catch {}
    } catch (err: any) {
      alert(err?.message || 'Error al subir imagen');
    } finally {
      if (kind === 'avatar') setUploadingAvatar(false); else setUploadingCover(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-850 to-slate-800">
      {/* HEADER REESTRUCTURADO */}
      <div className="relative w-full">
        {/* Cover */}
        <div className="h-64 md:h-80 w-full overflow-hidden bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 relative">
          {guideProfile?.hero_image_url && (
            <img
              src={guideProfile.hero_image_url}
              alt="Portada"
              className="w-full h-full object-cover object-center"
            />
          )}
          {/* Botón editar cover */}
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="absolute bottom-4 right-4 z-40 flex items-center gap-2 bg-white/85 hover:bg-white text-slate-800 px-3 py-1.5 rounded-md text-xs font-medium shadow group"
            disabled={uploadingCover}
          >
            <Camera className="w-4 h-4" /> {uploadingCover ? 'Subiendo...' : 'Cambiar portada'}
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleImageFile(e.target.files?.[0] || null, 'hero')}
          />
          {/* Gradientes superpuestos para dar profundidad y fade inferior */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/90" />
          <div className="absolute top-3 left-3 z-20">
            <NavigationButton to="/admin/guides" label="← Volver a guías" />
          </div>
        </div>
        {/* Avatar + Meta */}
        <div className="absolute inset-x-0 bottom-0 translate-y-1/2 z-30">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row md:items-end gap-6">
            <div className="flex items-end gap-4">
              <div className="relative group">
                <div className="w-36 h-36 md:w-40 md:h-40 rounded-full ring-4 ring-white shadow-2xl overflow-hidden bg-slate-300 flex items-center justify-center text-slate-500 text-xs font-medium relative">
                  {guideProfile?.avatar_url ? (
                    <img
                      src={guideProfile.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover object-center"
                    />
                  ) : 'Sin foto'}
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute inset-0 bg-black/0 hover:bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition"
                    disabled={uploadingAvatar}
                    title="Cambiar avatar"
                  >
                    <div className="flex flex-col items-center text-xs font-medium">
                      <Camera className="w-5 h-5 mb-1" />
                      {uploadingAvatar ? 'Subiendo...' : 'Cambiar'}
                    </div>
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => handleImageFile(e.target.files?.[0] || null, 'avatar')}
                  />
                </div>
              </div>
              <div className="pb-4 md:pb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm tracking-tight">
                  {form.name || 'Guía sin nombre'}
                </h1>
                <p className="mt-1 text-sm md:text-base text-slate-200 flex flex-wrap gap-x-4 gap-y-1">
                  <span>{form.location || 'Ubicación no definida'}</span>
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">Edición de Perfil del Guía</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Espaciador para el overlap */}
      <div className="h-32 md:h-36" />
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <h1 className="text-3xl font-bold text-white mb-8 mt-2">{isNew ? 'Nuevo Guía' : 'Editar Guía'}</h1>
        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.35)] space-y-5 border border-white/10">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input className="w-full px-4 py-2 border rounded-lg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Edad</label>
            <input
              type="number"
              min={18}
              className="w-full px-4 py-2 border rounded-lg"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              placeholder="Ej: 34"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación (Códigos oficiales)</label>
            <ChileLocationSelector
              value={{
                region: form.region_code || '',
                commune: form.commune_code || '',
              }}
              onChange={(val: { region?: string; commune?: string }) => {
                setForm({
                  ...form,
                  region_code: val.region || '',
                  commune_code: val.commune || '',
                  province_code: '' // limpiamos porque se oculta
                });
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
            <textarea className="w-full px-4 py-2 border rounded-lg" rows={5} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          {/* Idiomas y Especialidades (chips) */}
          <LanguagesAndSpecialties
            languages={form.languages}
            specialties={form.specialties}
            onChange={(langs, specs) => setForm({ ...form, languages: langs, specialties: specs })}
          />
          <div className="flex flex-wrap items-center gap-3 pt-2">
          <button disabled={loading} type="submit" className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl shadow hover:shadow-lg transition">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          {!isNew && (
            <Link
              to={`/admin/guides/${id}/services`}
              className="relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition inline-block"
            >
              Gestionar Servicios
              {pendingCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                  {pendingCount}
                </span>
              )}
            </Link>
          )}
          </div>
        </form>
      </div>
    </div>
  );
}

async function handleImageFile(file: File | null, kind: 'avatar' | 'hero') {
  if (!file) return;
  // This function will be replaced at runtime inside component (closure not needed here)
}

// Añadimos implementación dentro del componente usando asignación prototípica
// (workaround: definimos después para acceder a hook vars)
GuideEdit.prototype = {} as any;

// Sub-componente reutilizable para chips (evita inflar el principal)
function LanguagesAndSpecialties({
  languages,
  specialties,
  onChange
}: {
  languages: string[];
  specialties: string[];
  onChange: (languages: string[], specialties: string[]) => void;
}) {
  const [langInput, setLangInput] = useState('');
  const [specInput, setSpecInput] = useState('');

  const commit = (field: 'lang' | 'spec') => {
    const value = field === 'lang' ? langInput.trim() : specInput.trim();
    if (!value) return;
    if (field === 'lang') {
      if (!languages.includes(value)) onChange([...languages, value], specialties);
      setLangInput('');
    } else {
      if (!specialties.includes(value)) onChange(languages, [...specialties, value]);
      setSpecInput('');
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>, field: 'lang' | 'spec') => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit(field);
    } else if (e.key === 'Backspace') {
      const current = field === 'lang' ? langInput : specInput;
      if (current === '') {
        if (field === 'lang' && languages.length) onChange(languages.slice(0, -1), specialties);
        if (field === 'spec' && specialties.length) onChange(languages, specialties.slice(0, -1));
      }
    }
  };

  const removeIdx = (field: 'lang' | 'spec', idx: number) => {
    if (field === 'lang') onChange(languages.filter((_, i) => i !== idx), specialties);
    else onChange(languages, specialties.filter((_, i) => i !== idx));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Idiomas</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {languages.map((l, i) => (
            <span key={i} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {l}
              <button type="button" onClick={() => removeIdx('lang', i)} className="text-blue-600 hover:text-blue-900">×</button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Añade y presiona Enter o coma"
          className="w-full px-4 py-2 border rounded-lg"
          value={langInput}
          onChange={e => setLangInput(e.target.value)}
          onKeyDown={e => handleKey(e, 'lang')}
          onBlur={() => commit('lang')}
        />
        <p className="mt-1 text-xs text-slate-500">Ej: Español, Inglés</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Especialidades</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {specialties.map((s, i) => (
            <span key={i} className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">
              {s}
              <button type="button" onClick={() => removeIdx('spec', i)} className="text-emerald-600 hover:text-emerald-900">×</button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Añade y presiona Enter o coma"
          className="w-full px-4 py-2 border rounded-lg"
          value={specInput}
          onChange={e => setSpecInput(e.target.value)}
          onKeyDown={e => handleKey(e, 'spec')}
          onBlur={() => commit('spec')}
        />
        <p className="mt-1 text-xs text-slate-500">Ej: Pesca con mosca, Spinning</p>
      </div>
    </div>
  );
}


