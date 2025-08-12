/*
  Descarga el dataset completo (regiones, provincias, comunas) desde la API pública DPA
  y genera un archivo estático en public/chile/all.json que el frontend puede cargar
  sin problemas de CORS. Ejecutar bajo demanda cuando se quiera refrescar datos.

  Uso:
    npm run fetch:chile
  o  node scripts/fetch-chile-dpa.js
*/
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const BASE = 'https://apis.digital.gob.cl/dpa';

async function safeGet(url) {
  try { return (await axios.get(url)).data; } catch (e) { console.warn('Error GET', url, e.message); return []; }
}

async function main() {
  console.log('Descargando regiones...');
  const regions = (await safeGet(`${BASE}/regiones`)).map(r => ({ codigo: r.codigo, nombre: r.nombre }));
  const provinces = [];
  const communes = [];

  for (const region of regions) {
    console.log('Provincias región', region.codigo);
    const provs = (await safeGet(`${BASE}/regiones/${region.codigo}/provincias`))
      .map(p => ({ codigo: p.codigo, nombre: p.nombre, regionCodigo: region.codigo }));
    provinces.push(...provs);
    for (const prov of provs) {
      console.log('  Comunas provincia', prov.codigo);
      const coms = (await safeGet(`${BASE}/provincias/${prov.codigo}/comunas`))
        .map(c => ({ codigo: c.codigo, nombre: c.nombre, regionCodigo: region.codigo, provinciaCodigo: prov.codigo }));
      communes.push(...coms);
    }
  }

  const payload = { regions, provinces, communes, fetchedAt: Date.now() };
  const outDir = path.join(process.cwd(), 'public', 'chile');
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, 'all.json');
  fs.writeFileSync(file, JSON.stringify(payload, null, 2));
  console.log('Generado', file, `Regiones=${regions.length} Provincias=${provinces.length} Comunas=${communes.length}`);
}

main().catch(e => { console.error(e); process.exit(1); });
