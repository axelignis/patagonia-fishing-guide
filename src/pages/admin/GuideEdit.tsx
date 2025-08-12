import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getGuideById, reassignGuideOwner, upsertGuide } from '../../services/guides';
import { NavigationButton } from '../../components/NavigationButton';

export default function GuideEdit(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', location: '', bio: '', price_per_day: 0 });
  const [loading, setLoading] = useState(false);
  const isNew = id === 'new';

  useEffect(() => {
    if (!isNew && id) {
      getGuideById(id).then((g) => {
        if (g) {
          setForm({
            name: g.name || '',
            location: g.location || '',
            bio: g.bio || '',
            price_per_day: g.price_per_day || 0,
          });
        }
      });
    }
  }, [id, isNew]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await upsertGuide({ id: isNew ? undefined : id, ...form } as any);
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación</label>
            <input className="w-full px-4 py-2 border rounded-lg" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
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
            <>
              <Link
                to={`/admin/guides/${id}/services`}
                className="ml-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:scale-[1.02] transition inline-block"
              >
                Gestionar Servicios
              </Link>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await reassignGuideOwner(id!);
                    alert('Propiedad reasignada a tu usuario. Ahora puedes guardar.');
                  } catch (err: any) {
                    alert(`Error: ${err?.message || 'No se pudo reasignar'}`);
                  }
                }}
                className="ml-3 px-6 py-3 border-2 border-emerald-600 text-emerald-700 rounded-xl hover:bg-emerald-50"
              >
                Reasignar propiedad
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}


