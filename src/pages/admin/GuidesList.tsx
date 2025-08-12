import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { listGuides, ListGuidesFilters, GuideWithPending } from '../../services/guides';
import { Link } from 'react-router-dom';
import { NavigationButton } from '../../components/NavigationButton';
import { ChileLocationSelector } from '../../components/ChileLocationSelector';

export default function GuidesList(): JSX.Element {
  const [search, setSearch] = useState('');
  const [locationCodes, setLocationCodes] = useState<{ region?: string; commune?: string }>({});
  const [onlyActive, setOnlyActive] = useState(true); // Activos = con al menos un servicio disponible

  // Filtro: ahora "activos" significa que tengan al menos un servicio (aprobado si existe alguno aprobado)
  const filters: ListGuidesFilters = {
    search: search.trim() || undefined,
    region_code: locationCodes.region,
    province_code: undefined,
    commune_code: locationCodes.commune,
    // is_active eliminado: el criterio de actividad se redefine a disponibilidad de servicios
    requires_service: onlyActive ? true : undefined,
  };

  const { data, isLoading, error } = useQuery(['guides', filters], () => listGuides(filters));
  const [pulseOff, setPulseOff] = useState(false);
  useEffect(()=>{ const t = setTimeout(()=> setPulseOff(true), 2000); return ()=> clearTimeout(t); }, [data]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <NavigationButton to="/admin" label="← Volver al panel" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>Guías</span>
          </h1>
          <Link to="/admin/guides/new" className="inline-flex items-center gap-2 px-5 h-11 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-xl text-sm font-semibold shadow hover:shadow-lg hover:brightness-110 active:scale-[.98] transition focus:outline-none focus:ring-2 focus:ring-emerald-500/40">
            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-white/15 ring-1 ring-white/20">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/></svg>
            </span>
            <span className="leading-none whitespace-nowrap">Agregar nuevo guía</span>
          </Link>
        </div>
        <div className="bg-white/95 rounded-2xl p-6 shadow-2xl">
          <form className="space-y-6 pb-4 mb-6 border-b border-slate-200/70">
            <fieldset className="grid gap-4 md:gap-5 md:grid-cols-12">
              <legend className="sr-only">Filtros</legend>
              {/* Buscar */}
              <div className="md:col-span-4 flex flex-col">
                <label className="text-[11px] font-semibold tracking-wide text-slate-600 mb-1 uppercase">Buscar</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 103.473 9.8l3.863 3.864a.75.75 0 101.06-1.06l-3.864-3.863A5.5 5.5 0 009 3.5zM5 9a4 4 0 118 0 4 4 0 01-8 0z" clipRule="evenodd"/></svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Nombre o bio..."
                    className="w-full pl-9 pr-3 h-11 border border-slate-300 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 rounded-lg text-sm bg-white placeholder:text-slate-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              {/* Región / Comuna (sin encabezado contenedor para alinear verticalmente) */}
              <div className="md:col-span-6 flex flex-col justify-end">
                <ChileLocationSelector
                  value={{ region: locationCodes.region, commune: locationCodes.commune }}
                  onChange={(v: any) => setLocationCodes({ region: v.region, commune: v.commune })}
                  className="pt-[2px]"
                />
              </div>
              {/* Estado */}
              <div className="md:col-span-2 flex flex-col">
                <label className="text-[11px] font-semibold tracking-wide text-slate-600 mb-1 uppercase">Estado</label>
                <label htmlFor="onlyActive" className="relative inline-flex items-center justify-start gap-2 h-11 px-3 rounded-lg bg-white border border-slate-300 hover:border-emerald-400 cursor-pointer select-none text-sm font-medium text-slate-600 hover:text-slate-800 focus-within:ring-2 focus-within:ring-emerald-500/40">
                  <input
                    id="onlyActive"
                    type="checkbox"
                    className="peer sr-only"
                    checked={onlyActive}
                    onChange={(e) => setOnlyActive(e.target.checked)}
                  />
                  <span className="flex items-center justify-center w-5 h-5 rounded border border-slate-300 peer-checked:border-transparent peer-checked:bg-emerald-600 text-transparent peer-checked:text-white transition">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0L3.296 9.922a1 1 0 011.408-1.42l3.045 3.018 6.545-6.545a1 1 0 011.41 0z" clipRule="evenodd"/></svg>
                  </span>
                  <span className="whitespace-nowrap">Solo activos</span>
                </label>
              </div>
              {/* Toggle vista */}
              <div className="md:col-span-12 flex justify-end gap-2 pt-2">
                <div className="inline-flex rounded-lg overflow-hidden border border-slate-300 bg-white shadow-sm">
                  <button type="button" aria-label="Vista tarjetas" onClick={()=> setViewMode('grid')} className={`px-3 py-2 flex items-center gap-1 text-xs font-medium transition ${viewMode==='grid' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M3 3h4v4H3V3zm0 6h4v4H3V9zm6-6h4v4H9V3zm0 6h4v4H9V9z"/></svg>
                    <span className="hidden sm:inline">Tarjetas</span>
                  </button>
                  <button type="button" aria-label="Vista lista" onClick={()=> setViewMode('list')} className={`px-3 py-2 flex items-center gap-1 text-xs font-medium border-l border-slate-300 transition ${viewMode==='list' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2z"/></svg>
                    <span className="hidden sm:inline">Lista</span>
                  </button>
                </div>
              </div>
            </fieldset>
          </form>
          {isLoading && <div>Cargando...</div>}
          {error && <div className="text-red-600">Error al cargar</div>}
          <div className={viewMode==='grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col divide-y divide-slate-200'}>
            {data?.map((g: GuideWithPending) => {
              const pending = g.pending_services_count || 0;
              if (viewMode === 'grid') {
                return (
                  <Link key={g.id} to={`/admin/guides/${g.id}`} className="relative border border-emerald-200 rounded-xl p-4 hover:bg-emerald-50 bg-white/80 backdrop-blur transition shadow-sm hover:shadow">
                    {pending ? (
                      <span className={`absolute -top-2 -right-2 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow bg-red-600 ${!pulseOff ? 'animate-pulse' : ''}`} title={`${pending} servicio(s) pendiente(s) de aprobación`}>{pending}</span>
                    ) : null}
                    <div className="font-semibold text-slate-800 flex items-center gap-2">{g.name}</div>
                    <div className="text-sm text-slate-600">{g.location}</div>
                  </Link>
                );
              }
              // list view
              return (
                <Link key={g.id} to={`/admin/guides/${g.id}`} className="group relative px-2 sm:px-3 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 hover:bg-emerald-50/40 transition">
                  {pending ? (
                    <span className={`absolute top-1 right-2 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow bg-red-600 ${!pulseOff ? 'animate-pulse' : ''}`}>{pending}</span>
                  ) : null}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-800 truncate">{g.name}</div>
                    <div className="text-xs text-slate-500 truncate">{g.location}</div>
                  </div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400 hidden sm:block">Ver</div>
                </Link>
              );
            })}
          </div>
          {!isLoading && data && data.length === 0 && (
            <div className="mt-6 text-sm text-slate-500">No hay guías para los filtros seleccionados.</div>
          )}
        </div>
      </div>
    </div>
  );
}


