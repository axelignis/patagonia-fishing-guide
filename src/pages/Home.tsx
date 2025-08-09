
import * as React from 'react';
import { Link } from 'react-router-dom';
import VantaCalmSea from '../components/VantaCalmSea';
import WhatsAppButton from '../components/WhatsAppButton';
import { SponsorsSection } from '../components/SponsorsSection';
import guidesData from '../data/guides.json';
import { Guide } from '../types';

const Home: React.FC = () => {
    // Seleccionar los 3 guías mejor calificados para mostrar en home
    const guides = guidesData as Guide[];
    const featuredGuides = guides
        .sort((a: Guide, b: Guide) => b.rating - a.rating)
        .slice(0, 3);

    return (
        <main className="bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900 min-h-screen font-sans">
            {/* Hero Section con nueva paleta */}
            <section className="relative flex flex-col items-center justify-center h-[70vh] text-center overflow-hidden">
                <img
                    src="/images/pexels-cottonbro-4830248.jpg"
                    alt="Pesca en la Patagonia"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
                
                <div className="relative z-20 max-w-4xl mx-auto px-6">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-2xl">
                        Guías de Pesca Patagónica
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                        Conecta con guías expertos especializados en diferentes técnicas de pesca. 
                        Desde principiantes hasta maestros, encuentra tu guía perfecto para la aventura de tu vida.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <Link to="/guias" className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white text-lg font-semibold rounded-full shadow-lg hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 animate-pulse hover:animate-none">
                            Encontrar tu Guía Ideal
                        </Link>
                        <a href="#como-funciona" className="px-8 py-4 border-2 border-emerald-400 text-emerald-300 text-lg font-semibold rounded-full hover:bg-emerald-400 hover:text-slate-900 transition-all duration-300 transform hover:scale-105">
                            Cómo Funciona
                        </a>
                    </div>
                </div>
            </section>

            {/* Cómo Funciona */}
            <section id="como-funciona" className="py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                        <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                            Cómo Funciona
                        </span>
                    </h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl font-bold text-white">1</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Explora Guías</h3>
                            <p className="text-gray-300">Navega por nuestro catálogo de guías especializados y lee sus perfiles detallados.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl font-bold text-white">2</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Elige tu Experiencia</h3>
                            <p className="text-gray-300">Selecciona el tipo de pesca, nivel de dificultad y duración que prefieras.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl font-bold text-white">3</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Reserva Fácil</h3>
                            <p className="text-gray-300">Reserva directamente con el guía y coordina todos los detalles de tu expedición.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl font-bold text-white">4</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Vive la Aventura</h3>
                            <p className="text-gray-300">Disfruta de tu experiencia y comparte tu feedback para ayudar a otros pescadores.</p>
                        </div>
                    </div>
                    
                    {/* Botón Guía Práctica */}
                    <div className="text-center mt-12">
                        <Link 
                            to="/guia-practica" 
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-full shadow-lg hover:from-amber-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105"
                        >
                            📖 Guía Práctica para Reservar
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Guías Destacados */}
            <section id="guias-destacados" className="py-20 relative overflow-hidden">
                <VantaCalmSea />
                <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center relative z-10">
                    <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                        Guías Destacados
                    </span>
                </h2>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-4 relative z-10">
                    {featuredGuides.map((guide: Guide) => (
                        <div key={guide.id} className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden hover:scale-105 transition-all duration-500 border border-white/20 hover:bg-white/95 hover:shadow-3xl">
                            <div className="w-full h-48 overflow-hidden relative">
                                <img 
                                    src={guide.avatar} 
                                    alt={guide.name} 
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                    ⭐ {guide.rating}
                                </div>
                            </div>
                            <div className="p-8 flex flex-col items-center">
                                <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-emerald-800 transition-colors">{guide.name}</h3>
                                <p className="text-emerald-600 font-medium mb-3">{guide.location}</p>
                                <p className="text-slate-600 text-center leading-relaxed group-hover:text-slate-700 transition-colors mb-4 line-clamp-3">
                                    {guide.bio.substring(0, 120)}...
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {guide.specialties.slice(0, 2).map((specialty: string, index: number) => (
                                        <span key={index} className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full text-sm font-medium text-emerald-700">
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                                <div className="text-slate-600 text-sm mb-4">
                                    {guide.experience} años de experiencia • ${guide.pricePerDay.toLocaleString()}/día
                                </div>
                                <Link to={`/guia/${guide.id}`} className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 text-center block">
                                    Ver Perfil
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12 relative z-10">
                    <Link to="/guias" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-full shadow-lg hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105">
                        Ver Todos los Guías
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* Testimonios con colores sobrios */}
            <section className="py-20 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 relative overflow-hidden">
                {/* Efectos de fondo más sutiles */}
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-600/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-cyan-600/10 to-transparent rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center">
                        <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                            Testimonios
                        </span>
                    </h2>
                    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
                        <div className="group h-full">
                            <blockquote className="bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col">
                                <div className="flex items-center mb-6">
                                    <img src="/images/pexels-cottonbro-4830248.jpg" alt="Juan" className="w-16 h-16 rounded-full object-cover border-4 border-emerald-400/50" />
                                    <div className="ml-4">
                                        <h4 className="text-emerald-300 font-bold text-lg">Juan P.</h4>
                                        <p className="text-gray-300 text-sm">Buenos Aires</p>
                                    </div>
                                </div>
                                <p className="text-gray-200 text-lg leading-relaxed italic flex-grow">"Una experiencia inolvidable, la Patagonia es mágica y el guía hizo todo perfecto. Los paisajes son de otro mundo."</p>
                                <div className="flex mt-6">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-emerald-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                        </svg>
                                    ))}
                                </div>
                            </blockquote>
                        </div>
                        
                        <div className="group h-full">
                            <blockquote className="bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col">
                                <div className="flex items-center mb-6">
                                    <img src="/images/pexels-gasparzaldo-11250845.jpg" alt="María" className="w-16 h-16 rounded-full object-cover border-4 border-cyan-400/50" />
                                    <div className="ml-4">
                                        <h4 className="text-cyan-300 font-bold text-lg">María L.</h4>
                                        <p className="text-gray-300 text-sm">Córdoba</p>
                                    </div>
                                </div>
                                <p className="text-gray-200 text-lg leading-relaxed italic flex-grow">"Pescar en estos paisajes fue un sueño hecho realidad. ¡La atención al detalle es increíble! Volveré sin dudas."</p>
                                <div className="flex mt-6">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-cyan-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                        </svg>
                                    ))}
                                </div>
                            </blockquote>
                        </div>

                        <div className="group h-full">
                            <blockquote className="bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col">
                                <div className="flex items-center mb-6">
                                    <img src="/images/hombre-pescando-en-el-rio.jpg" alt="Carlos" className="w-16 h-16 rounded-full object-cover border-4 border-teal-400/50" />
                                    <div className="ml-4">
                                        <h4 className="text-teal-300 font-bold text-lg">Carlos R.</h4>
                                        <p className="text-gray-300 text-sm">Mendoza</p>
                                    </div>
                                </div>
                                <p className="text-gray-200 text-lg leading-relaxed italic flex-grow">"Profesionalismo de primera. Conoce cada rincón y sabe exactamente dónde están los mejores peces. Recomendado 100%"</p>
                                <div className="flex mt-6">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-teal-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                        </svg>
                                    ))}
                                </div>
                            </blockquote>
                        </div>
                    </div>
                    
                    {/* Botón para ver más testimonios */}
                    <div className="text-center mt-12">
                        <Link to="/testimonios" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-full shadow-lg hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                            <span>Ver Más Testimonios</span>
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>
            {/* Galería Collage */}
            <section className="py-24 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                    <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        Galería de Experiencias
                    </span>
                </h2>
                
                <div className="max-w-7xl mx-auto px-6">
                    {/* Grid Collage Masonry */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-max">
                        {/* Imagen Grande Principal */}
                        <div className="col-span-2 row-span-2 group">
                            <div className="relative overflow-hidden rounded-2xl shadow-2xl h-80 transform transition-all duration-500 hover:scale-105 hover:shadow-emerald-500/25">
                                <img src="/images/silueta-de-un-hombre-pescando-en-la-playa-al-atardecer.jpg" alt="Atardecer Patagónico" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-4 left-4 text-white font-semibold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Atardecer Mágico
                                </div>
                            </div>
                        </div>

                        {/* Imagen Vertical */}
                        <div className="col-span-1 row-span-2 group">
                            <div className="relative overflow-hidden rounded-2xl shadow-lg h-80 transform transition-all duration-500 hover:scale-105">
                                <img src="/images/hombre-pescando-en-el-rio.jpg" alt="Pesca en río" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>

                        {/* Imagen Cuadrada */}
                        <div className="col-span-1 row-span-1 group">
                            <div className="relative overflow-hidden rounded-xl shadow-lg h-36 transform transition-all duration-500 hover:scale-105">
                                <img src="/images/pexels-cottonbro-4830248.jpg" alt="Equipo de pesca" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>

                        {/* Imagen Panorámica */}
                        <div className="col-span-2 row-span-1 group">
                            <div className="relative overflow-hidden rounded-xl shadow-lg h-36 transform transition-all duration-500 hover:scale-105">
                                <img src="/images/pexels-gasparzaldo-11250845.jpg" alt="Paisaje patagónico" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>

                        {/* Imagen Pequeña */}
                        <div className="col-span-1 row-span-1 group">
                            <div className="relative overflow-hidden rounded-xl shadow-lg h-36 transform transition-all duration-500 hover:scale-105">
                                <img src="/images/pexels-pixabay-39854.jpg" alt="Lago cristalino" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>

                        {/* Imagen Mediana Horizontal */}
                        <div className="col-span-2 row-span-1 group">
                            <div className="relative overflow-hidden rounded-xl shadow-lg h-36 transform transition-all duration-500 hover:scale-105">
                                <img src="/images/pexels-gasparzaldo-11315286.jpg" alt="Montañas nevadas" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-l from-purple-500/30 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>

                        {/* Imagen Vertical Estrecha */}
                        <div className="col-span-1 row-span-1 group">
                            <div className="relative overflow-hidden rounded-xl shadow-lg h-36 transform transition-all duration-500 hover:scale-105">
                                <img src="/images/pexels-pixabay-301738.jpg" alt="Trucha capturada" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>

                        {/* Imagen Grande Secundaria */}
                        <div className="col-span-2 row-span-1 group">
                            <div className="relative overflow-hidden rounded-xl shadow-lg h-36 transform transition-all duration-500 hover:scale-105">
                                <img src="/images/hombre-mayor-pesca-por-un-lago.jpg" alt="Experiencia guiada" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>

                        {/* Imagen Final */}
                        <div className="col-span-1 row-span-1 group">
                            <div className="relative overflow-hidden rounded-xl shadow-lg h-36 transform transition-all duration-500 hover:scale-105">
                                <img src="/images/pexels-thomas-svensson-1505611-3004745.jpg" alt="Técnica de pesca" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>
                        
                        {/* Imagen adicional para completar el mosaico */}
                        <div className="col-span-1 row-span-1 group">
                            <div className="relative overflow-hidden rounded-xl shadow-lg h-36 transform transition-all duration-500 hover:scale-105">
                                <img src="/images/pexels-d123x-848737.jpg" alt="Pesca nocturna" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Texto descriptivo */}
                    <div className="text-center mt-12">
                        <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed mb-8">
                            Cada expedición es única. Desde amaneceres dorados hasta atardeceres que pintan el cielo de colores impossibles, 
                            la Patagonia ofrece momentos que quedan grabados para siempre en la memoria.
                        </p>
                        
                        {/* Botón para ver galería completa */}
                                                {/* Botón para ver galería completa */}
                        <Link to="/galeria" className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-full shadow-lg hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                            <span className="mr-3">Ver Galería Completa</span>
                            <div className="relative overflow-hidden">
                                <svg className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <svg className="w-5 h-5 absolute top-0 left-0 transform translate-x-8 transition-transform duration-300 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Formulario de Contacto con nueva paleta */}
            <section className="py-20 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
                    <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                        Contáctanos
                    </span>
                </h2>
                <form className="max-w-xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-white/10">
                    <input type="text" placeholder="Nombre" className="p-3 rounded-lg border border-emerald-400/30 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400" />
                    <input type="email" placeholder="Correo electrónico" className="p-3 rounded-lg border border-emerald-400/30 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400" />
                    <textarea placeholder="¿En qué podemos ayudarte?" className="p-3 rounded-lg border border-emerald-400/30 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 min-h-[100px]" />
                    <button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 rounded-lg shadow-lg hover:from-emerald-500 hover:to-teal-500 transition-all duration-500 transform hover:scale-105">Enviar mensaje</button>
                </form>
            </section>

            {/* Sección de Sponsors */}
            <SponsorsSection />

            {/* Redes Sociales con nueva paleta */}
            <section className="py-10 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800">
                <h2 className="text-2xl font-bold text-center mb-6">
                    <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                        Síguenos en redes
                    </span>
                </h2>
                <div className="flex justify-center gap-8 text-4xl">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition-transform duration-300">
                        <svg className="w-10 h-10 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.25a5.25 5.25 0 1 1-5.25 5.25a5.25 5.25 0 0 1 5.25-5.25zm0 1.5a3.75 3.75 0 1 0 3.75 3.75a3.75 3.75 0 0 0-3.75-3.75zm5.25 1.25a1 1 0 1 1-2 0a1 1 0 0 1 2 0z"/></svg>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition-transform duration-300">
                        <svg className="w-10 h-10 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17 2.1c-3.9 0-7 3.1-7 7v2H7v4h3v8h4v-8h3l1-4h-4V9c0-1.1.9-2 2-2h2V3.1c-.7-.1-1.4-.2-2-.2z"/></svg>
                    </a>
                    <a href="https://wa.me/5490000000000" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition-transform duration-300">
                        <svg className="w-10 h-10 text-teal-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.18 1.6 6.02L0 24l6.18-1.62A12.07 12.07 0 0 0 12 24c6.63 0 12-5.37 12-12c0-3.21-1.25-6.23-3.48-8.52zM12 22c-1.85 0-3.63-.5-5.18-1.44l-.37-.22l-3.67.96l.98-3.58l-.24-.37A9.98 9.98 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10s-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9c-.25-.09-.43-.14-.61.14c-.18.28-.7.9-.86 1.08c-.16.18-.32.2-.6.07c-.28-.14-1.18-.44-2.25-1.4c-.83-.74-1.39-1.65-1.55-1.93c-.16-.28-.02-.43.12-.57c.13-.13.28-.34.42-.51c.14-.17.18-.29.28-.48c.09-.19.05-.36-.02-.5c-.07-.14-.61-1.47-.84-2.01c-.22-.53-.45-.46-.61-.47c-.16-.01-.35-.01-.54-.01c-.19 0-.5.07-.76.34c-.26.27-1 1-1 2.43c0 1.43 1.03 2.81 1.18 3c.15.19 2.03 3.1 5.02 4.23c.7.24 1.25.38 1.68.48c.71.15 1.36.13 1.87.08c.57-.06 1.65-.67 1.89-1.32c.23-.65.23-1.2.16-1.32c-.07-.12-.25-.19-.53-.33z"/></svg>
                    </a>
                    <a href="mailto:info@patagoniafishing.com" className="hover:scale-125 transition-transform duration-300">
                        <svg className="w-10 h-10 text-emerald-300" fill="currentColor" viewBox="0 0 24 24"><path d="M2 4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4zm2 0v.01L12 13l8-8.99V4H4zm16 2.41l-7.29 7.3a1 1 0 0 1-1.42 0L4 6.41V20h16V6.41z"/></svg>
                    </a>
                </div>
            </section>

            {/* Botón flotante de WhatsApp */}
            <WhatsAppButton />
        </main>
    );
};

export default Home;