/*
 * Node script: crea 20 guías ficticios sin avatar/cover (frontend usará fallback).
 * Uso:
 *   SEED_OWNER_EMAIL=owner@patagonia.local node scripts/seed-20-guides.js
 * Requiere SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY en entorno (.env.local o export).
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const FALLBACK_AVATAR = null; // frontend hará fallback
const FALLBACK_COVER = null;

const GUIDES = [
  { name: 'Matías Fuentes', age: 34, location: 'San Pedro de Atacama, El Loa, Antofagasta', bio: 'Guía especializado en lagos cordilleranos del norte de Chile.', languages:['español','inglés'], specialties:['pesca con mosca'] },
  { name: 'Valentina Rojas', age: 29, location: 'Talca, Talca, Maule', bio: 'Apasionada por los ríos rápidos del Maule y técnicas ultralivianas.', languages:['español'], specialties:['ultraliviana'] },
  { name: 'Ignacio Herrera', age: 41, location: 'Puerto Natales, Última Esperanza, Magallanes', bio: 'Experto en fiordos y clima extremo, énfasis en seguridad y conservación.', languages:['español','inglés'], specialties:['pesca embarcada','trolling'] },
  { name: 'Carolina Méndez', age: 37, location: 'Chillán, Diguillín, Ñuble', bio: 'Zonas de desove y educación ambiental para principiantes.', languages:['español'], specialties:['iniciación','educativa'] },
  { name: 'Rodrigo Salazar', age: 45, location: 'Pucón, Cautín, La Araucanía', bio: 'Más de 20 años en lagos de la Araucanía; estrategias de mosca seca.', languages:['español','portugués'], specialties:['mosca seca','catch & release'] },
  { name: 'Fernanda Álvarez', age: 32, location: 'Coyhaique, Coyhaique, Aysén', bio: 'Corrientes claras y lectura de insectos.', languages:['español','inglés'], specialties:['entomología','mosca seca'] },
  { name: 'Patricio León', age: 50, location: 'Los Ángeles, Biobío, Biobío', bio: 'Cuenca del Río Bio-Bío; enfoque en conservación.', languages:['español'], specialties:['conservación','flotadas'] },
  { name: 'Sofía Guzmán', age: 27, location: 'Valdivia, Valdivia, Los Ríos', bio: 'Pesca responsable para jóvenes y familias.', languages:['español','inglés'], specialties:['familiar','principiantes'] },
  { name: 'Esteban Araya', age: 39, location: 'Concón, Valparaíso, Valparaíso', bio: 'Estuarios y mareas en la zona central.', languages:['español'], specialties:['estuario','spinning'] },
  { name: 'Daniela Pino', age: 31, location: 'San Fabián, Punilla, Ñuble', bio: 'Trekking ligero con experiencias de pesca en altura.', languages:['español'], specialties:['trekking','alta montaña'] },
  { name: 'Gonzalo Vera', age: 43, location: 'Futrono, Ranco, Los Ríos', bio: 'Streamer en ríos caudalosos.', languages:['español'], specialties:['streamer','grandes truchas'] },
  { name: 'Camila Donoso', age: 36, location: 'San José de Maipo, Cordillera, Metropolitana', bio: 'Experiencias personalizadas en lagunas altoandinas.', languages:['español','inglés'], specialties:['altiplano','personalizadas'] },
  { name: 'Felipe Contreras', age: 48, location: 'Aysén, Aysén, Aysén', bio: 'Pesca de salmón Chinook en la Patagonia.', languages:['español'], specialties:['salmón','drift'] },
  { name: 'María José Palma', age: 28, location: 'La Serena, Elqui, Coquimbo', bio: 'Experiencias cortas para viajeros express.', languages:['español','inglés'], specialties:['half-day','urbana'] },
  { name: 'Hernán Sepúlveda', age: 52, location: 'Temuco, Cautín, La Araucanía', bio: 'Relatos culturales y pesca recreativa.', languages:['español'], specialties:['cultural','histórica'] },
  { name: 'Josefina Vidal', age: 33, location: 'Puerto Varas, Llanquihue, Los Lagos', bio: 'Grupos pequeños y fotografía.', languages:['español','inglés'], specialties:['fotografía','grupos pequeños'] },
  { name: 'Mauricio Ortega', age: 38, location: 'Lonquimay, Malleco, La Araucanía', bio: 'Ninfas europeas en aguas cristalinas.', languages:['español'], specialties:['euro nymphing'] },
  { name: 'Antonia Ibáñez', age: 26, location: 'Puerto Aysén, Aysén, Aysén', bio: 'Aprendizaje rápido para principiantes.', languages:['español','inglés'], specialties:['bootcamp','principiantes'] },
  { name: 'Luis Farías', age: 47, location: 'Quellón, Chiloé, Los Lagos', bio: 'Pesca embarcada y ecosondas.', languages:['español'], specialties:['embarcada','sonar'] },
  { name: 'Paula Reyes', age: 35, location: 'Castro, Chiloé, Los Lagos', bio: 'Itinerarios premium con enfoque gastronómico.', languages:['español','inglés'], specialties:['premium','gastronómica'] }
];

async function ensureOwner(client, email) {
  let userId = null;
  const list = await client.auth.admin.listUsers({ page:1, perPage:1000 });
  userId = list.data.users.find(u=>u.email===email)?.id || null;
  if (!userId) {
    const created = await client.auth.admin.createUser({ email, email_confirm: true });
    userId = created.data.user?.id || null;
  }
  if (!userId) throw new Error('No se pudo crear/obtener usuario owner');
  return userId;
}

async function run() {
  const url = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) throw new Error('Faltan variables SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  const client = createClient(url, service);
  const ownerEmail = process.env.SEED_OWNER_EMAIL || 'owner+seed20@patagonia.local';
  const ownerId = await ensureOwner(client, ownerEmail);

  for (const g of GUIDES) {
    const payload = { user_id: ownerId, name: g.name, age: g.age, avatar_url: FALLBACK_AVATAR, cover_url: FALLBACK_COVER, bio: g.bio, location: g.location, languages: g.languages, specialties: g.specialties };
    const { error } = await client.from('guides').insert(payload);
    if (error && !error.message.includes('duplicate')) console.error('Error insert', g.name, error.message); else console.log('Inserted', g.name);
  }
  console.log('Listo.');
}

run().catch(e=>{ console.error(e); process.exit(1); });
