import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { NavigationButton } from '../components/NavigationButton';
import { listGuides, ListGuidesFilters } from '../services/guides';
import { Guide } from '../types';
import { ChileLocationSelector } from '../components/ChileLocationSelector';

const Guias: React.FC = () => {
    const [guides, setGuides] = useState<Guide[]>([]);
    const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Todos');
    const [locationCodes, setLocationCodes] = useState<{ region?: string; province?: string; commune?: string }>({});
    const [priceRange, setPriceRange] = useState<string>('Todos');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Construir filtros para request al servidor (evita traer todos los guías si hay filtros de ubicación o búsqueda)
    const serverFilters: ListGuidesFilters = useMemo(() => ({
        search: search.trim() || undefined,
        region_code: locationCodes.region,
        province_code: locationCodes.province,
        commune_code: locationCodes.commune,
        // is_active y requires_service se quitaron para evitar lista vacía cuando los seeds no tienen servicios ni is_active=true
    }), [search, locationCodes]);

    useEffect(() => {
        let cancelled = false;
        async function fetchGuides() {
            setLoading(true);
            setError(null);
            try {
                const dbGuides = await listGuides(serverFilters);
                if (cancelled) return;
                const DEFAULT_AVATAR = '/images/pexels-pixabay-301738.jpg';
                const DEFAULT_COVER = '/images/pexels-gasparzaldo-11250845.jpg';
                const mapped: Guide[] = (dbGuides || []).map((g: any) => ({
                    id: g.id,
                    name: g.name,
                    age: g.age ?? 0,
                    experience: 0,
                    specialties: g.specialties ?? [],
                    location: g.location ?? 'Patagonia',
                    bio: g.bio ?? '',
                    // Orden de prioridad: vista (hero/avatar) -> user_profiles -> legacy -> default
                    avatar: g.avatar_url || g.user_profiles?.avatar_url || g.legacy_avatar_url || DEFAULT_AVATAR,
                    coverImage: g.hero_image_url || g.user_profiles?.hero_image_url || g.cover_url || g.avatar_url || g.user_profiles?.avatar_url || DEFAULT_COVER,
                    rating: Number(g.rating ?? 0),
                    totalReviews: Number(g.total_reviews ?? 0),
                    // price removed
                    languages: g.languages ?? [],
                    certifications: [],
                    services: [],
                    availability: {},
                    gallery: [],
                    contactInfo: undefined,
                }));
                setGuides(mapped);
            } catch (err: any) {
                if (!cancelled) setError(err?.message || 'Error cargando guías');
                setGuides([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchGuides();
        return () => { cancelled = true; };
    }, [serverFilters]);

    useEffect(() => {
        let filtered = guides;

        // Filtro por especialidad
        if (selectedSpecialty !== 'Todos') {
            filtered = filtered.filter(guide => 
                guide.specialties.includes(selectedSpecialty)
            );
        }

    // Filtro adicional por precio se maneja abajo (ubicación ya viene filtrada desde el servidor)

        // Filtro por rango de precio
    // price filtering removed

        setFilteredGuides(filtered);
    }, [selectedSpecialty, priceRange, guides]);

    // Especialidades dinámicas (a partir de datos cargados)
    const specialties = useMemo(() => {
        const setVals = new Set<string>();
        guides.forEach(g => (g.specialties || []).forEach(s => setVals.add(s)));
        return ['Todos', ...Array.from(setVals).sort()];
    }, [guides]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900">
            {/* Hero Section */}
            <section className="relative h-[42vh] min-h-[300px] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/images/pexels-cottonbro-4830248.jpg"
                        alt="Guías de Pesca Patagónica"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-800/60"></div>
                </div>
                
                {/* Botón volver dentro del hero, esquina superior izquierda */}
                <div className="absolute z-20 top-6 left-6">
                    <NavigationButton 
                        to="/" 
                        label="Volver al inicio" 
                        className="inline-flex items-center text-emerald-300 hover:text-emerald-200 transition-colors"
                    />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Nuestros 
                            <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent ml-4">
                                Guías Expertos
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Conoce a los mejores guías de pesca de la Patagonia. Cada uno con su especialidad única y años de experiencia en aguas locales.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filtros */}
                        <section className="py-8 bg-white/5 backdrop-blur-sm">
                            <div className="max-w-6xl mx-auto px-4">
                                <form
                                    onSubmit={(e) => { e.preventDefault(); }}
                                    className="grid gap-6 md:grid-cols-12 items-end"
                                >
                                    {/* Especialidad */}
                                    <div className="md:col-span-3">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Especialidad</label>
                                        <select
                                            value={selectedSpecialty}
                                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            {specialties.map(s => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
                                        </select>
                                    </div>

                                    {/* Ubicación (3 selects) */}
                                    <div className="md:col-span-5">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Ubicación</label>
                                        <ChileLocationSelector
                                            value={{ region: locationCodes.region, commune: locationCodes.commune }}
                                            onChange={(v: any) => setLocationCodes({ region: v.region, commune: v.commune })}
                                            variant="dark"
                                        />
                                    </div>

                                    {/* Precio */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Rango de Precio</label>
                                        <select
                                            value={priceRange}
                                            onChange={(e) => setPriceRange(e.target.value)}
                                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="Todos" className="bg-slate-800">Todos</option>
                                            <option value="budget" className="bg-slate-800">Hasta $20,000</option>
                                            <option value="mid" className="bg-slate-800">$20,000 - $27,000</option>
                                            <option value="premium" className="bg-slate-800">Más de $27,000</option>
                                        </select>
                                    </div>

                                    {/* Buscar */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Nombre o bio..."
                                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>

                                    {/* Limpiar */}
                                    <div className="md:col-span-12 flex flex-wrap gap-4 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => { setSelectedSpecialty('Todos'); setLocationCodes({}); setPriceRange('Todos'); setSearch(''); }}
                                            className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-medium rounded-lg hover:from-emerald-500 hover:to-cyan-500 transition-all"
                                        >
                                            Limpiar Filtros
                                        </button>
                                        {loading && <span className="text-xs text-gray-400 self-center">Cargando...</span>}
                                        {error && <span className="text-xs text-red-400 self-center">{error}</span>}
                                    </div>
                                </form>
                            </div>
                        </section>

            {/* Grid de Guías */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="mb-8">
                        <p className="text-gray-300 text-lg">
                            Mostrando {filteredGuides.length} guía{filteredGuides.length !== 1 ? 's' : ''} disponible{filteredGuides.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredGuides.map((guide: Guide) => (
                            <div key={guide.id} className="group bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-400 border border-white/30 h-full flex flex-col">
                                <div className="relative">
                                    <img
                                        src={guide.avatar}
                                        alt={guide.name}
                                        className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Badge container */}
                                    <div className="absolute inset-x-0 top-0 flex justify-between items-start px-4 pt-4 pointer-events-none select-none">
                                        <div className="flex gap-2">
                                            <span className="inline-flex items-center gap-1 px-3 h-7 rounded-full bg-slate-900/70 backdrop-blur text-white text-xs font-medium shadow">
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 01.894.553l2.382 4.83 5.332.774a1 1 0 01.554 1.705l-3.857 3.757.91 5.305A1 1 0 0114.25 20L10 17.347 5.75 20a1 1 0 01-1.455-1.055l.91-5.305L1.348 9.862a1 1 0 01.554-1.705l5.332-.774L9.106 2.553A1 1 0 0110 2z"/></svg>
                                                {guide.experience} años exp.
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="inline-flex items-center gap-1 px-3 h-7 rounded-full bg-amber-500/95 text-white text-xs font-semibold shadow">
                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z"/></svg>
                                                {guide.rating.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Gradient overlay subtle */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/0 to-slate-900/0" />
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-emerald-800 transition-colors">
                                        {guide.name}
                                    </h3>
                                    <p className="text-emerald-600 font-medium mb-3 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        {guide.location}
                                    </p>

                                    <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-grow">
                                        {guide.bio.substring(0, 120)}...
                                    </p>

                                    {/* Especialidades */}
                                    <div className="flex flex-wrap gap-2 mb-5 min-h-[2.25rem]">
                                        {guide.specialties.slice(0, 3).map((specialty: string, index: number) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 h-8 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100 shadow-sm"
                                            >
                                                {specialty}
                                            </span>
                                        ))}
                                        {guide.specialties.length > 3 && (
                                            <span className="inline-flex items-center px-3 h-8 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                                +{guide.specialties.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    {/* Reviews (precio removido) */}
                                    <div className="flex justify-end items-end mb-6">
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-slate-700">{guide.totalReviews} reseña{guide.totalReviews!==1?'s':''}</div>
                                            <div className="text-[11px] text-slate-400">Calificación promedio</div>
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="space-y-3 mt-auto">
                                        <Link
                                            to={`/guia/${guide.id}`}
                                            className="block w-full text-center px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow hover:shadow-md hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                                        >
                                            Ver Perfil Completo
                                        </Link>
                                        <Link
                                            to={`/reservar/${guide.id}`}
                                            className="block w-full text-center px-6 py-3 rounded-xl font-semibold border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 bg-white transition shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                        >
                                            Reservar Ahora
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredGuides.length === 0 && (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">🎣</div>
                            <h3 className="text-2xl font-bold text-white mb-4">No se encontraron guías</h3>
                            <p className="text-gray-300 mb-8">Intenta ajustar los filtros para encontrar el guía perfecto para ti.</p>
                            <button
                                onClick={() => {
                                    setSelectedSpecialty('Todos');
                                    setLocationCodes({});
                                    setPriceRange('Todos');
                                    setSearch('');
                                }}
                                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300"
                            >
                                Limpiar Todos los Filtros
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Guias;
