import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import guidesData from '../data/guides.json';
import reviewsData from '../data/reviews.json';
import { Guide } from '../types';
import WhatsAppButton from '../components/WhatsAppButton';

interface Review {
    id: string;
    guideId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    date: string;
    photos: string[];
    verified: boolean;
}

const GuiaPerfil: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [guide, setGuide] = useState<Guide | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [selectedService, setSelectedService] = useState<number>(0);
    const [showAllReviews, setShowAllReviews] = useState(false);

    useEffect(() => {
        if (id) {
            const foundGuide = guidesData.find((g: any) => g.id === id) as Guide;
            setGuide(foundGuide || null);
            
            const guideReviews = reviewsData.filter((r: any) => r.guideId === id) as Review[];
            setReviews(guideReviews);
        }
    }, [id]);

    if (!guide) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🎣</div>
                    <h2 className="text-3xl font-bold text-white mb-4">Guía no encontrado</h2>
                    <Link 
                        to="/guias" 
                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300"
                    >
                        Ver Todos los Guías
                    </Link>
                </div>
            </div>
        );
    }

    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900">
            {/* Hero Section con imagen de portada */}
            <section className="relative h-96 overflow-hidden">
                <img
                    src={guide.coverImage || guide.avatar}
                    alt={guide.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Información básica superpuesta */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-end gap-6">
                            <img
                                src={guide.avatar}
                                alt={guide.name}
                                className="w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover"
                            />
                            <div className="text-white">
                                <h1 className="text-4xl md:text-5xl font-bold mb-2">{guide.name}</h1>
                                <div className="flex items-center gap-4 text-lg">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        {guide.location}
                                    </div>
                                    <div className="flex items-center text-amber-500 font-semibold">
                                        ⭐ {guide.rating} ({guide.totalReviews} reseñas)
                                    </div>
                                    <div>{guide.experience} años de experiencia</div>
                                    {guide.languages && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm text-slate-600">
                                                Idiomas: {guide.languages.join(', ')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Columna principal */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Biografía */}
                        <section className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                            <h2 className="text-3xl font-bold text-slate-800 mb-6">Sobre {guide.name}</h2>
                            <p className="text-slate-600 leading-relaxed text-lg">{guide.bio}</p>
                            
                            {/* Especialidades */}
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold text-slate-800 mb-4">Especialidades</h3>
                                <div className="flex flex-wrap gap-3">
                                    {guide.specialties.map((specialty: string, index: number) => (
                                        <span key={index} className="px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full text-sm font-medium text-emerald-700 border border-emerald-200">
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Certificaciones */}
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold text-slate-800 mb-4">Certificaciones</h3>
                                <div className="space-y-2">
                                    {guide.certifications.map((cert: string, index: number) => (
                                        <div key={index} className="flex items-center text-slate-600">
                                            <svg className="w-5 h-5 text-emerald-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {cert}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Idiomas */}
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold text-slate-800 mb-4">Idiomas</h3>
                                <div className="flex gap-3">
                                    {guide.languages.map((language: string, index: number) => (
                                        <span key={index} className="px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-700">
                                            {language}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Servicios */}
                        <section className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                            <h2 className="text-3xl font-bold text-slate-800 mb-6">Servicios Disponibles</h2>
                            
                            {/* Tabs de servicios */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {guide.services?.map((service: any, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedService(index)}
                                        className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                                            selectedService === index
                                                ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {service.title}
                                    </button>
                                ))}
                            </div>

                            {/* Detalles del servicio seleccionado */}
                            {guide.services && guide.services[selectedService] && (
                                <div className="border border-emerald-200 rounded-2xl p-6 bg-gradient-to-r from-emerald-50 to-cyan-50">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-800">{guide.services[selectedService].title}</h3>
                                            <p className="text-slate-600 mt-2">{guide.services[selectedService].description}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-emerald-600">
                                                ${guide.services[selectedService].price.toLocaleString()}
                                            </div>
                                            <div className="text-sm text-slate-600">por servicio</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="flex items-center text-slate-600">
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                            {guide.services[selectedService].duration}
                                        </div>
                                        <div className="flex items-center text-slate-600">
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                            </svg>
                                            Máx. {guide.services[selectedService].maxPeople} personas
                                        </div>
                                        <div className="flex items-center text-slate-600">
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 2L3 8v10a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 002 2h4a2 2 0 002-2V8l-7-6z" clipRule="evenodd" />
                                            </svg>
                                            {guide.services[selectedService].difficulty}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-slate-800 mb-3">Incluye:</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {guide.services[selectedService].includes?.map((item: string, idx: number) => (
                                                <div key={idx} className="flex items-center text-slate-600">
                                                    <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <Link
                                            to={`/reservar/${guide.id}?service=${selectedService}`}
                                            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105"
                                        >
                                            Reservar Este Servicio
                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Reseñas */}
                        <section className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-slate-800">Reseñas ({reviews.length})</h2>
                                <div className="flex items-center">
                                    <div className="text-3xl font-bold text-emerald-600 mr-2">{guide.rating}</div>
                                    <div className="text-amber-400 text-xl">⭐⭐⭐⭐⭐</div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {displayedReviews.map((review: Review) => (
                                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                                                {review.userName.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="font-semibold text-slate-800">{review.userName}</h4>
                                                    <div className="flex text-amber-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i} className={i < review.rating ? 'text-amber-400' : 'text-gray-300'}>⭐</span>
                                                        ))}
                                                    </div>
                                                    {review.verified && (
                                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Verificada</span>
                                                    )}
                                                    <span className="text-sm text-slate-500">{new Date(review.date).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {reviews.length > 3 && (
                                <div className="text-center mt-6">
                                    <button
                                        onClick={() => setShowAllReviews(!showAllReviews)}
                                        className="px-6 py-3 border border-emerald-600 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-all duration-300"
                                    >
                                        {showAllReviews ? 'Ver Menos' : `Ver Todas las Reseñas (${reviews.length})`}
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Card de contacto */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl sticky top-8">
                            <h3 className="text-2xl font-bold text-slate-800 mb-4">Contactar a {guide.name}</h3>
                            
                            <div className="space-y-4 mb-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-emerald-600">
                                        ${guide.pricePerDay.toLocaleString()}
                                    </div>
                                    <div className="text-slate-600">por día</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link
                                    to={`/reservar/${guide.id}`}
                                    className="block w-full text-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105"
                                >
                                    Reservar Ahora
                                </Link>
                                
                                <a
                                    href={`https://wa.me/${guide.contactInfo?.whatsapp?.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-500 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.18 1.6 6.02L0 24l6.18-1.62A12.07 12.07 0 0 0 12 24c6.63 0 12-5.37 12-12c0-3.21-1.25-6.23-3.48-8.52zM12 22c-1.85 0-3.63-.5-5.18-1.44l-.37-.22l-3.67.96l.98-3.58l-.24-.37A9.98 9.98 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10s-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9c-.25-.09-.43-.14-.61.14c-.18.28-.7.9-.86 1.08c-.16.18-.32.2-.6.07c-.28-.14-1.18-.44-2.25-1.4c-.83-.74-1.39-1.65-1.55-1.93c-.16-.28-.02-.43.12-.57c.13-.13.28-.34.42-.51c.14-.17.18-.29.28-.48c.09-.19.05-.36-.02-.5c-.07-.14-.61-1.47-.84-2.01c-.22-.53-.45-.46-.61-.47c-.16-.01-.35-.01-.54-.01c-.19 0-.5.07-.76.34c-.26.27-1 1-1 2.43c0 1.43 1.03 2.81 1.18 3c.15.19 2.03 3.1 5.02 4.23c.7.24 1.25.38 1.68.48c.71.15 1.36.13 1.87.08c.57-.06 1.65-.67 1.89-1.32c.23-.65.23-1.2.16-1.32c-.07-.12-.25-.19-.53-.33z"/>
                                        </svg>
                                        WhatsApp
                                    </div>
                                </a>

                                <a
                                    href={`mailto:${guide.contactInfo?.email}`}
                                    className="block w-full text-center px-6 py-3 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-all duration-300"
                                >
                                    Enviar Email
                                </a>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="text-sm text-slate-600 space-y-2">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Respuesta rápida
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Guía certificado
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Cancelación flexible
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Estadísticas */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Estadísticas</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Expediciones realizadas</span>
                                    <span className="font-semibold text-slate-800">{guide.totalReviews * 2}+</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Años de experiencia</span>
                                    <span className="font-semibold text-slate-800">{guide.experience}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Rating promedio</span>
                                    <span className="font-semibold text-slate-800">{guide.rating} ⭐</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Tasa de respuesta</span>
                                    <span className="font-semibold text-emerald-600">98%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <WhatsAppButton />
        </div>
    );
};

export default GuiaPerfil;
