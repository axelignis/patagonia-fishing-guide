import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { NavigationButton } from '../components/NavigationButton';
import { listGuides, ListGuidesFilters } from '../services/guides';
import { Guide } from '../types';
import { ChileLocationSelector } from '../components/ChileLocationSelector';
import { StaggerContainer, StaggerItem, GuideCardSkeleton, PageTransition } from '../components/ui/simple';
import GuideCard from '../components/GuideCard';

const Guias: React.FC = () => {
    const [guides, setGuides] = useState<Guide[]>([]);
    const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Todos');
    const [locationCodes, setLocationCodes] = useState<{ region?: string; province?: string; commune?: string }>({});
    const [priceRange, setPriceRange] = useState<string>('Todos');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Construir filtros para request al servidor
    const serverFilters: ListGuidesFilters = useMemo(() => ({
        search: search.trim() || undefined,
        region_code: locationCodes.region,
        province_code: locationCodes.province,
        commune_code: locationCodes.commune,
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
                    avatar: g.avatar_url || g.user_profiles?.avatar_url || g.legacy_avatar_url || DEFAULT_AVATAR,
                    coverImage: g.hero_image_url || g.user_profiles?.hero_image_url || g.cover_url || g.avatar_url || g.user_profiles?.avatar_url || DEFAULT_COVER,
                    rating: Number(g.rating ?? 0),
                    totalReviews: Number(g.total_reviews ?? 0),
                    pricePerDay: g.price_per_day ?? 0,
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

        setFilteredGuides(filtered);
    }, [selectedSpecialty, priceRange, guides]);

    // Especialidades dinámicas
    const specialties = useMemo(() => {
        const setVals = new Set<string>();
        guides.forEach(g => (g.specialties || []).forEach(s => setVals.add(s)));
        return ['Todos', ...Array.from(setVals).sort()];
    }, [guides]);

    return (
        <PageTransition>
            <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900">
                {/* Hero Section */}
                <section className="relative h-[42vh] min-h-[300px] overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: 'url(/images/pexels-thomas-svensson-1505611-3004745.jpg)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40" />
                    
                    <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
                        <div className="max-w-4xl">
                            <NavigationButton to="/" label="← Volver al Inicio" />
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
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

                            {/* Ubicación */}
                            <div className="md:col-span-5">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Ubicación</label>
                                <ChileLocationSelector
                                    value={locationCodes}
                                    onChange={setLocationCodes}
                                    variant="dark"
                                />
                            </div>

                            {/* Búsqueda */}
                            <div className="md:col-span-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar guías..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
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

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {Array(6).fill(0).map((_, index) => (
                                    <GuideCardSkeleton key={index} />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                                    <div className="text-red-800 text-lg font-semibold mb-2">Error al cargar guías</div>
                                    <div className="text-red-600 text-sm">{error}</div>
                                    <button 
                                        onClick={() => window.location.reload()}
                                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Reintentar
                                    </button>
                                </div>
                            </div>
                        ) : filteredGuides.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                                    <div className="text-6xl mb-4">🎣</div>
                                    <div className="text-gray-800 text-lg font-semibold mb-2">No se encontraron guías</div>
                                    <div className="text-gray-600 text-sm mb-4">
                                        Intenta ajustar los filtros para encontrar más opciones
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setSelectedSpecialty('Todos');
                                            setLocationCodes({});
                                            setPriceRange('Todos');
                                            setSearch('');
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Limpiar Filtros
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredGuides.map((guide: Guide, index: number) => (
                                    <StaggerItem key={guide.id}>
                                        <GuideCard
                                            id={guide.id}
                                            name={guide.name}
                                            age={guide.age}
                                            bio={guide.bio}
                                            location={guide.location}
                                            rating={guide.rating}
                                            total_reviews={guide.totalReviews}
                                            price_per_day={guide.pricePerDay}
                                            specialties={guide.specialties}
                                            languages={guide.languages || []}
                                            avatar_url={guide.avatar}
                                            cover_url={guide.coverImage}
                                            is_active={true}
                                            experience={guide.experience}
                                            delay={index * 0.1}
                                            onClick={() => window.location.href = `/guia/${guide.id}`}
                                        />
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>
                        )}
                    </div>
                </section>
            </div>
        </PageTransition>
    );
};

export default Guias;
