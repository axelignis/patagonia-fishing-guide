import React, { useState, useEffect } from 'react';
import { useChileLocations } from '../hooks/useChileLocations';

interface ChileLocationSelectorValue { region?: string; province?: string; commune?: string }
interface ChileLocationSelectorProps {
  value?: ChileLocationSelectorValue;
  onChange: (value: ChileLocationSelectorValue) => void;
  disabled?: boolean;
  className?: string;
  variant?: 'light' | 'dark';
  hideProvince?: boolean; // futuro toggle si se quiere reactivar
}

export const ChileLocationSelector: React.FC<ChileLocationSelectorProps> = ({ value, onChange, disabled, className, variant='light', hideProvince = true }) => {
  const { regions, allCommunes, getProvinces, getCommunes, isLoading, error } = useChileLocations();
  const [region, setRegion] = useState(value?.region || '');
  const [province, setProvince] = useState(value?.province || '');
  const [commune, setCommune] = useState(value?.commune || '');

  useEffect(() => { onChange({ region, province, commune }); }, [region, province, commune]);
  useEffect(() => { setRegion(value?.region || ''); }, [value?.region]);
  useEffect(() => { setProvince(value?.province || ''); }, [value?.province]);
  useEffect(() => { setCommune(value?.commune || ''); }, [value?.commune]);

  const provinces = region ? getProvinces(region) : [];
  // Si ocultamos provincia, filtramos comunas por región directamente
  const communes = hideProvince
    ? (region ? allCommunes.filter(c => c.regionCodigo === region) : [])
    : (province ? getCommunes(province) : []);

  if (error) return <div className="text-red-600 text-sm">Error cargando localidades</div>;

  const baseSelect = variant === 'dark'
    ? 'w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50'
    : 'w-full rounded border border-slate-300 p-2 text-sm bg-white';
  const labelCls = variant === 'dark'
    ? 'block text-sm font-medium text-gray-300 mb-2'
    : 'block text-xs font-semibold text-slate-600 mb-1';

  return (
    <div className={className}>
      {isLoading && <div className={variant==='dark' ? 'text-xs text-gray-400 mb-2' : 'text-sm text-slate-500'}>Cargando regiones...</div>}
      <div className={hideProvince ? 'grid gap-4 sm:grid-cols-2' : 'grid gap-4 sm:grid-cols-3'}>
        <div>
          <label className={labelCls}>Región</label>
          <select
            className={baseSelect}
            value={region}
            disabled={disabled || isLoading}
            onChange={e => { setRegion(e.target.value); setProvince(''); setCommune(''); }}
          >
            <option value="">Selecciona región</option>
            {regions.map(r => <option key={r.codigo} value={r.codigo} className={variant==='dark' ? 'bg-slate-800' : ''}>{r.nombre}</option>)}
          </select>
        </div>
        {!hideProvince && (
          <div>
            <label className={labelCls}>Provincia</label>
            <select
              className={baseSelect}
              value={province}
              disabled={disabled || !region || isLoading}
              onChange={e => { setProvince(e.target.value); setCommune(''); }}
            >
              <option value="" className={variant==='dark' ? 'bg-slate-800' : ''}>{region ? 'Selecciona provincia' : 'Primero región'}</option>
              {provinces.map(p => <option key={p.codigo} value={p.codigo} className={variant==='dark' ? 'bg-slate-800' : ''}>{p.nombre}</option>)}
            </select>
          </div>
        )}
        <div>
          <label className={labelCls}>Comuna</label>
          <select
            className={baseSelect}
            value={commune}
            disabled={disabled || !region || ( !province && !hideProvince ) || isLoading}
            onChange={e => setCommune(e.target.value)}
          >
            <option value="" className={variant==='dark' ? 'bg-slate-800' : ''}>{region ? 'Selecciona comuna' : 'Primero región'}</option>
            {communes.map(c => <option key={c.codigo} value={c.codigo} className={variant==='dark' ? 'bg-slate-800' : ''}>{c.nombre}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};
