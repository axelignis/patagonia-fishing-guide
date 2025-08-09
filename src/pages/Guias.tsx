import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavigationButton } from '../components/NavigationButton';
import { PriceDisplay } from '../components/PriceDisplay';
import { listGuides } from '../services/guides';
import { Guide } from '../types';

const Guias: React.FC = () => {
    const [guides, setGuides] = useState<Guide[]>([]);
    const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Todos');
    const [selectedLocation, setSelectedLocation] = useState<string>('Todas');
    const [priceRange, setPriceRange] = useState<string>('Todos');

    useEffect(() => {
        async function fetchGuides() {
            try {
                const dbGuides = await listGuides();
                const mapped: Guide[] = (dbGuides || []).map((g) => ({
                    id: g.id,
                    name: g.name,
                    age: g.age ?? 0,
                    experience: 0,
                    specialties: g.specialties ?? [],
                    location: g.location ?? 'Patagonia',
                    bio: g.bio ?? '',
                    avatar: g.avatar_url ?? '/images/pexels-pixabay-301738.jpg',
                    coverImage: g.cover_url ?? (g.avatar_url ?? '/images/pexels-pixabay-301738.jpg'),
                    rating: Number(g.rating ?? 0),
                    totalReviews: Number(g.total_reviews ?? 0),
                    pricePerDay: Number(g.price_per_day ?? 0),
                    languages: g.languages ?? [],
                    certifications: [],
                    services: [],
                    availability: {},
                    gallery: [],
                    contactInfo: undefined,
                }));
                setGuides(mapped);
                setFilteredGuides(mapped);
            } catch (err) {
                // fallback vacío
                setGuides([]);
                setFilteredGuides([]);
            }
        }
        fetchGuides();
    }, []);

    useEffect(() => {
        let filtered = guides;

        // Filtro por especialidad
        if (selectedSpecialty !== 'Todos') {
            filtered = filtered.filter(guide => 
                guide.specialties.includes(selectedSpecialty)
            );
        }

        // Filtro por ubicación
        if (selectedLocation !== 'Todas') {
            filtered = filtered.filter(guide => 
                guide.location === selectedLocation
            );
        }

        // Filtro por rango de precio
        if (priceRange !== 'Todos') {
            filtered = filtered.filter(guide => {
                switch (priceRange) {
                    case 'budget':
                        return guide.pricePerDay <= 20000;
                    case 'mid':
                        return guide.pricePerDay > 20000 && guide.pricePerDay <= 27000;
                    case 'premium':
                        return guide.pricePerDay > 27000;
                    default:
                        return true;
                }
            });
        }

        setFilteredGuides(filtered);
    }, [selectedSpecialty, selectedLocation, priceRange, guides]);

    const specialties = ['Todos', 'Pesca con Mosca', 'Spinning', 'Salmones', 'Pesca Marina', 'Truchas', 'Pesca en Ríos', 'Pesca en Lagos', 'Trolling', 'Pesca desde Costa'];
    const locations = ['Todas', 'Puerto Varas, Región de los Lagos', 'Punta Arenas, Región de Magallanes', 'Villa La Angostura, Patagonia Chile'];

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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Filtro por Especialidad */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Especialidad</label>
                            <select
                                value={selectedSpecialty}
                                onChange={(e) => setSelectedSpecialty(e.target.value)}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                {specialties.map(specialty => (
                                    <option key={specialty} value={specialty} className="bg-slate-800">
                                        {specialty}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filtro por Ubicación */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Ubicación</label>
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                {locations.map(location => (
                                    <option key={location} value={location} className="bg-slate-800">
                                        {location}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filtro por Precio */}
                        <div>
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

                        {/* Botón de Limpiar Filtros */}
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSelectedSpecialty('Todos');
                                    setSelectedLocation('Todas');
                                    setPriceRange('Todos');
                                }}
                                className="w-full px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-medium rounded-lg hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300"
                            >
                                Limpiar Filtros
                            </button>
                        </div>
                    </div>
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
                            <div key={guide.id} className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden hover:scale-105 transition-all duration-500 border border-white/20 hover:bg-white/95 hover:shadow-3xl h-full flex flex-col">
                                <div className="relative">
                                    <img 
                                        src={guide.avatar} 
                                        alt={guide.name} 
                                        className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                        ⭐ {guide.rating}
                                    </div>
                                    <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {guide.experience} años exp.
                                    </div>
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
                                    <div className="flex flex-wrap gap-2 mb-4 min-h-[2.5rem]">
                                        {guide.specialties.slice(0, 3).map((specialty: string, index: number) => (
                                            <span key={index} className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full text-xs font-medium text-emerald-700">
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Precio y Reviews */}
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-1">
                                            <PriceDisplay 
                                                price={guide.pricePerDay}
                                                size="md"
                                                showBothCurrencies={false}
                                                className="text-slate-800"
                                            />
                                            <span className="text-sm text-slate-600">/día</span>
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            {guide.totalReviews} reseñas
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="space-y-3 mt-auto">
                                        <Link
                                            to={`/guia/${guide.id}`}
                                            className="block w-full text-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105"
                                        >
                                            Ver Perfil Completo
                                        </Link>
                                        <Link
                                            to={`/reservar/${guide.id}`}
                                            className="block w-full text-center px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-all duration-300"
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
                                    setSelectedLocation('Todas');
                                    setPriceRange('Todos');
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
