import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { listAllGuideServices, approveService, approveAllPendingServices } from '../../services/guides';
import { NavigationButton } from '../../components/NavigationButton';
import { useAuth } from '../../hooks/useAuth';

export default function AllServicesAdmin(): JSX.Element {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [flash, setFlash] = useState<{type:'success'|'error'; message:string}|null>(null);
  useEffect(()=>{ if(flash){ const t=setTimeout(()=>setFlash(null),4000); return ()=>clearTimeout(t);} },[flash]);

  const { data: services, isLoading } = useQuery(['all-services', filter], () => listAllGuideServices({ approved: filter }), { enabled: isAdmin });

  const approveMutation = useMutation((id: string) => approveService(id), {
    onSuccess: () => queryClient.invalidateQueries(['all-services', filter])
  });
  const approveAllMutation = useMutation(() => approveAllPendingServices(), {
    onSuccess: (count:number) => {
      queryClient.invalidateQueries(['all-services', filter]);
      setFlash({ type:'success', message: count>0 ? `${count} servicio(s) aprobados.` : 'No había pendientes.' });
    },
    onError: (e:any)=> setFlash({ type:'error', message: e?.message || 'Error al aprobar todos' })
  });

  if (!isAdmin) return <div className="p-8 text-red-500">Acceso solo para administradores</div>;

  const pendingCount = (services || []).filter((s: any) => !s.approved).length;
  const approvedCount = (services || []).filter((s: any) => s.approved).length;

  const filtered = useMemo(() => {
    let list: any[] = services || [];
    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(s => (s.title || '').toLowerCase().includes(term) || (s.guide_name || '').toLowerCase().includes(term));
    }
    return list;
  }, [services, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <NavigationButton to="/admin/guides" label="← Volver a guías" />
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">Servicios de Todos los Guías</h1>
          <div className="flex gap-2">
            <input
              value={search}
              onChange={e=>{setSearch(e.target.value); setPage(1);}}
              placeholder="Buscar servicio o guía..."
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
            {(['pending','approved','all'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter===f ? 'bg-emerald-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>{f==='pending' ? `Pendientes (${pendingCount})` : f==='approved' ? `Aprobados (${approvedCount})` : 'Todos'}</button>
            ))}
          </div>
        </div>
        {isLoading ? (
          <div className="text-white">Cargando...</div>
        ) : services && services.length === 0 ? (
          <div className="text-slate-300 bg-white/5 rounded-xl p-8 text-center">No hay servicios.</div>
        ) : (
          <div className="space-y-4">
            {pageItems.map(s => (
              <div key={s.id} className={`border rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 ${s.approved ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-white/90'}`}>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="font-semibold text-slate-800">{s.title}</h3>
                    {s.approved ? <span className="px-2 py-1 bg-emerald-600 text-white text-xs rounded-full">Aprobado</span> : <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">Pendiente</span>}
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">{s.difficulty}</span>
                  </div>
                  <div className="text-sm text-slate-600 mb-1">Guía: <span className="font-medium">{s.guide_name || s.guide_id}</span></div>
                  {s.price && <div className="text-sm text-slate-600">Precio: ${s.price.toLocaleString()} CLP</div>}
                  {s.description && <p className="text-slate-600 mt-1 text-sm">{s.description}</p>}
                </div>
                <div className="flex gap-2">
                  {!s.approved && (
                    <button onClick={() => approveMutation.mutate(s.id)} disabled={approveMutation.isLoading} className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition disabled:opacity-50">Aprobar</button>
                  )}
                  <button
                    onClick={() => approveAllMutation.mutate()}
                    disabled={approveAllMutation.isLoading || pendingCount===0}
                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-40"
                  >{approveAllMutation.isLoading ? 'Aprobando...' : 'Aprobar Pendientes'}</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {flash && (
          <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium border ${flash.type==='success' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-100' : 'bg-red-600/20 border-red-500 text-red-100'}`}>{flash.message}</div>
        )}
        {filtered.length > pageSize && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white">
            <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 rounded bg-white/10 disabled:opacity-30">«</button>
            <span>Página {page} / {totalPages}</span>
            <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-3 py-1 rounded bg-white/10 disabled:opacity-30">»</button>
          </div>
        )}
      </div>
    </div>
  );
}
