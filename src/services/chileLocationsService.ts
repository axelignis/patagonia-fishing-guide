import axios from 'axios';
import { ChileLocationsData, ChileRegion, ChileProvince, ChileCommune } from '../types';

// Fuente de datos: usamos la API pública de https://apis.digital.gob.cl/dpa
// Documentación: GET /regiones, /regiones/{codigo}/provincias, /provincias/{codigo}/comunas
// Nota: Limitamos concurrencia y agregamos caching localStorage para reducir peticiones.

// Intentamos primero un archivo estático generado (public/chile/all.json). Si no existe, usamos API remota.
const STATIC_DATA_URL = '/chile/all.json';
const BASE_URL = 'https://apis.digital.gob.cl/dpa';
const CACHE_KEY = 'chileLocationsCacheV2';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 días

async function fetchRegions(): Promise<ChileRegion[]> {
  const { data } = await axios.get(`${BASE_URL}/regiones`, { withCredentials: false });
  return data.map((r: any) => ({ codigo: r.codigo, nombre: r.nombre }));
}

async function fetchProvinces(region: ChileRegion): Promise<ChileProvince[]> {
  const { data } = await axios.get(`${BASE_URL}/regiones/${region.codigo}/provincias`, { withCredentials: false });
  return data.map((p: any) => ({ codigo: p.codigo, nombre: p.nombre, regionCodigo: region.codigo }));
}

async function fetchCommunes(province: ChileProvince): Promise<ChileCommune[]> {
  const { data } = await axios.get(`${BASE_URL}/provincias/${province.codigo}/comunas`, { withCredentials: false });
  return data.map((c: any) => ({ codigo: c.codigo, nombre: c.nombre, regionCodigo: province.regionCodigo, provinciaCodigo: province.codigo }));
}

// Fallback mínimo (subset) para uso offline / CORS fail
const FALLBACK_STATIC: ChileLocationsData = {
  regions: [
    { codigo: '01', nombre: 'Región de Tarapacá' },
    { codigo: '02', nombre: 'Región de Antofagasta' },
    { codigo: '03', nombre: 'Región de Atacama' },
    { codigo: '04', nombre: 'Región de Coquimbo' },
    { codigo: '05', nombre: 'Región de Valparaíso' },
    { codigo: '06', nombre: 'Región del Libertador Gral. Bernardo O’Higgins' },
    { codigo: '07', nombre: 'Región del Maule' },
    { codigo: '08', nombre: 'Región del Biobío' },
    { codigo: '09', nombre: 'Región de La Araucanía' },
    { codigo: '10', nombre: 'Región de Los Lagos' },
    { codigo: '11', nombre: 'Región de Aysén' },
    { codigo: '12', nombre: 'Región de Magallanes' },
    { codigo: '13', nombre: 'Región Metropolitana' },
    { codigo: '14', nombre: 'Región de Los Ríos' },
    { codigo: '15', nombre: 'Región de Arica y Parinacota' },
    { codigo: '16', nombre: 'Región de Ñuble' },
  ],
  provinces: [
    { codigo: '011', nombre: 'Iquique', regionCodigo: '01' },
    { codigo: '021', nombre: 'Antofagasta', regionCodigo: '02' },
    { codigo: '031', nombre: 'Copiapó', regionCodigo: '03' },
    { codigo: '041', nombre: 'Elqui', regionCodigo: '04' },
    { codigo: '051', nombre: 'Valparaíso', regionCodigo: '05' },
    { codigo: '061', nombre: 'Cachapoal', regionCodigo: '06' },
    { codigo: '071', nombre: 'Talca', regionCodigo: '07' },
    { codigo: '081', nombre: 'Concepción', regionCodigo: '08' },
    { codigo: '091', nombre: 'Cautín', regionCodigo: '09' },
    { codigo: '101', nombre: 'Llanquihue', regionCodigo: '10' },
    { codigo: '111', nombre: 'Coyhaique', regionCodigo: '11' },
    { codigo: '121', nombre: 'Magallanes', regionCodigo: '12' },
    { codigo: '131', nombre: 'Santiago', regionCodigo: '13' },
    { codigo: '141', nombre: 'Valdivia', regionCodigo: '14' },
    { codigo: '151', nombre: 'Arica', regionCodigo: '15' },
    { codigo: '161', nombre: 'Diguillín', regionCodigo: '16' },
  ],
  communes: [
    { codigo: '01101', nombre: 'Iquique', regionCodigo: '01', provinciaCodigo: '011' },
    { codigo: '02101', nombre: 'Antofagasta', regionCodigo: '02', provinciaCodigo: '021' },
    { codigo: '03101', nombre: 'Copiapó', regionCodigo: '03', provinciaCodigo: '031' },
    { codigo: '04101', nombre: 'La Serena', regionCodigo: '04', provinciaCodigo: '041' },
    { codigo: '05101', nombre: 'Valparaíso', regionCodigo: '05', provinciaCodigo: '051' },
    { codigo: '06101', nombre: 'Rancagua', regionCodigo: '06', provinciaCodigo: '061' },
    { codigo: '07101', nombre: 'Talca', regionCodigo: '07', provinciaCodigo: '071' },
    { codigo: '08101', nombre: 'Concepción', regionCodigo: '08', provinciaCodigo: '081' },
    { codigo: '09101', nombre: 'Temuco', regionCodigo: '09', provinciaCodigo: '091' },
    { codigo: '10101', nombre: 'Puerto Montt', regionCodigo: '10', provinciaCodigo: '101' },
    { codigo: '11101', nombre: 'Coyhaique', regionCodigo: '11', provinciaCodigo: '111' },
    { codigo: '12101', nombre: 'Punta Arenas', regionCodigo: '12', provinciaCodigo: '121' },
    { codigo: '13101', nombre: 'Santiago', regionCodigo: '13', provinciaCodigo: '131' },
    { codigo: '14101', nombre: 'Valdivia', regionCodigo: '14', provinciaCodigo: '141' },
    { codigo: '15101', nombre: 'Arica', regionCodigo: '15', provinciaCodigo: '151' },
    { codigo: '16101', nombre: 'Chillán', regionCodigo: '16', provinciaCodigo: '161' },
  ],
  fetchedAt: 0,
};

function loadCache(): ChileLocationsData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: ChileLocationsData = JSON.parse(raw);
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null; // expiró
    return parsed;
  } catch {
    return null;
  }
}

function saveCache(data: ChileLocationsData) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

export async function getChileLocations(forceRefresh = false): Promise<ChileLocationsData> {
  const cached = !forceRefresh && loadCache();
  if (cached) return cached;

  // 1. Archivo estático si existe
  try {
    const resp = await fetch(STATIC_DATA_URL, { cache: 'no-cache' });
    if (resp.ok) {
      const json = await resp.json();
      saveCache(json);
      return json;
    }
  } catch { /* ignorar */ }

  // 2. API remota (puede fallar por CORS)
  try {
    const regions = await fetchRegions();
    const provincesNested = await Promise.all(regions.map(r => fetchProvinces(r)));
    const provinces = provincesNested.flat();
    const communesNested = await Promise.all(provinces.map(p => fetchCommunes(p)));
    const communes = communesNested.flat();
    const payload: ChileLocationsData = { regions, provinces, communes, fetchedAt: Date.now() };
    saveCache(payload);
    return payload;
  } catch (err) {
    console.warn('[chileLocations] Fallback (sin estático y remoto falló):', (err as any)?.message);
    return FALLBACK_STATIC;
  }
}

// Helpers
export function findRegion(code: string, data: ChileLocationsData): ChileRegion | undefined {
  return data.regions.find(r => r.codigo === code);
}
export function listProvincesByRegion(regionCode: string, data: ChileLocationsData) {
  return data.provinces.filter(p => p.regionCodigo === regionCode);
}
export function listCommunesByProvince(provinceCode: string, data: ChileLocationsData) {
  return data.communes.filter(c => c.provinciaCodigo === provinceCode);
}
