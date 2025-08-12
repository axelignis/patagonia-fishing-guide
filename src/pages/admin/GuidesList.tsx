import React from 'react';
import { useQuery } from 'react-query';
import { listGuides } from '../../services/guides';
import { Link } from 'react-router-dom';
import { NavigationButton } from '../../components/NavigationButton';

export default function GuidesList(): JSX.Element {
  const { data, isLoading, error } = useQuery(['guides'], listGuides);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <NavigationButton to="/admin" label="← Volver al panel" />
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Guías</h1>
          <Link to="/admin/guides/new" className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl">Nuevo</Link>
        </div>
        <div className="bg-white/90 rounded-2xl p-6 shadow-2xl">
          {isLoading && <div>Cargando...</div>}
          {error && <div className="text-red-600">Error al cargar</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.map((g: { id: string; name: string; location: string | null }) => (
              <Link key={g.id} to={`/admin/guides/${g.id}`} className="border border-emerald-200 rounded-xl p-4 hover:bg-emerald-50">
                <div className="font-semibold text-slate-800">{g.name}</div>
                <div className="text-sm text-slate-600">{g.location}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


