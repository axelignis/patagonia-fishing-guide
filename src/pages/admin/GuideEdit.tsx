import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getGuideById as fetchGuideById, upsertGuide, listServicesByGuide } from '../../services/guides';
import { NavigationButton } from '../../components/NavigationButton';
import { ChileLocationSelector } from '../../components/ChileLocationSelector';

export default function GuideEdit(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    location: '',
    bio: '',
    price_per_day: 0,
    region_code: '',
    province_code: '',
    commune_code: '',
  });
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const isNew = id === 'new';
  useEffect(() => {
    if (!isNew && id) {
      fetchGuideById(id).then((g: any) => {
        if (g) {
          setForm({
            name: g.name || '',
            location: g.location || '',
            bio: g.bio || '',
            price_per_day: g.price_per_day || 0,
            region_code: g.region_code || '',
            province_code: g.province_code || '',
            commune_code: g.commune_code || '',
          });
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
        price_per_day: form.price_per_day,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <NavigationButton to="/admin/guides" label="← Volver a guías" />
        <h1 className="text-3xl font-bold text-white mb-8">{isNew ? 'Nuevo Guía' : 'Editar Guía'}</h1>
        <form onSubmit={handleSubmit} className="bg-white/90 rounded-2xl p-6 shadow-2xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input className="w-full px-4 py-2 border rounded-lg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
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
            <p className="mt-2 text-xs text-slate-500">
              Se guardan los códigos. Puedes escribir una descripción libre si deseas sobreescribir:
            </p>
            <input
              className="mt-2 w-full px-4 py-2 border rounded-lg"
              placeholder="Descripción libre ej: Región X / Provincia Y / Comuna Z"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
            <textarea className="w-full px-4 py-2 border rounded-lg" rows={5} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Precio por día</label>
            <input type="number" className="w-full px-4 py-2 border rounded-lg" value={form.price_per_day} onChange={(e) => setForm({ ...form, price_per_day: Number(e.target.value) })} />
          </div>
          <button disabled={loading} type="submit" className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          
          {!isNew && (
            <Link
              to={`/admin/guides/${id}/services`}
              className="relative ml-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:scale-[1.02] transition inline-block"
            >
              Gestionar Servicios
              {pendingCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                  {pendingCount}
                </span>
              )}
            </Link>
          )}
        </form>
      </div>
    </div>
  );
}


