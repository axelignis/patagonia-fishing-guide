import React from 'react';
import { Link } from 'react-router-dom';

const GuiaPractica: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/images/pexels-cottonbro-4830248.jpg"
                        alt="Guía práctica de pesca"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-800/60"></div>
                </div>
                
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Guía Práctica
                        <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent block">
                            para Reservar
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Todo lo que necesitas saber para reservar tu aventura de pesca perfecta en la Patagonia
                    </p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
                {/* Paso 1 */}
                <section className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            1
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">Elige tu Guía Ideal</h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                Explora nuestros guías expertos y encuentra el que mejor se adapte a tus necesidades. 
                                Cada guía tiene especialidades únicas y diferentes niveles de experiencia.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center text-slate-600">
                                    <svg className="w-5 h-5 text-emerald-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Revisa las especialidades de cada guía
                                </div>
                                <div className="flex items-center text-slate-600">
                                    <svg className="w-5 h-5 text-emerald-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Lee las reseñas de otros pescadores
                                </div>
                                <div className="flex items-center text-slate-600">
                                    <svg className="w-5 h-5 text-emerald-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Compara precios y servicios
                                </div>
                                <div className="flex items-center text-slate-600">
                                    <svg className="w-5 h-5 text-emerald-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Verifica la ubicación y accesibilidad
                                </div>
                            </div>
                            <Link 
                                to="/guias" 
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300"
                            >
                                Ver Todos los Guías
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Paso 2 */}
                <section className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            2
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">Selecciona tu Experiencia</h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                Cada guía ofrece diferentes tipos de servicios. Desde clases para principiantes hasta 
                                expediciones avanzadas de varios días.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="border border-emerald-200 rounded-2xl p-4 bg-emerald-50">
                                    <div className="text-emerald-600 font-semibold mb-2">🎣 Principiante</div>
                                    <div className="text-sm text-slate-600">
                                        Clases básicas, pesca desde costa, equipamiento incluido
                                    </div>
                                </div>
                                <div className="border border-cyan-200 rounded-2xl p-4 bg-cyan-50">
                                    <div className="text-cyan-600 font-semibold mb-2">🚤 Intermedio</div>
                                    <div className="text-sm text-slate-600">
                                        Pesca embarcada, técnicas avanzadas, spots exclusivos
                                    </div>
                                </div>
                                <div className="border border-teal-200 rounded-2xl p-4 bg-teal-50">
                                    <div className="text-teal-600 font-semibold mb-2">🏔️ Avanzado</div>
                                    <div className="text-sm text-slate-600">
                                        Expediciones remotas, camping, pesca de trofeos
                                    </div>
                                </div>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                <div className="flex items-start">
                                    <svg className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <div className="font-semibold text-yellow-800">Consejo</div>
                                        <div className="text-yellow-700">
                                            Si es tu primera vez, te recomendamos empezar con servicios para principiantes. 
                                            Los guías adaptarán la experiencia a tu nivel.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Paso 3 */}
                <section className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            3
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">Elige Fecha y Hora</h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                La pesca tiene sus mejores momentos. Nuestros guías te ayudarán a elegir el momento 
                                perfecto según las condiciones climáticas y la actividad de los peces.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="font-semibold text-slate-800 mb-3">🌅 Mejores horarios</h4>
                                    <ul className="space-y-2 text-slate-600">
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Amanecer (6:00 - 8:00 AM): Pesca más activa
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Atardecer (17:00 - 19:00 PM): Truchas activas
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Días nublados: Excelente actividad todo el día
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 mb-3">📅 Mejores épocas</h4>
                                    <ul className="space-y-2 text-slate-600">
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Nov - Mar: Temporada alta, truchas grandes
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Abr - May: Menos turistas, pesca tranquila
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Sep - Oct: Inicio de temporada, peces hambrientos
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Paso 4 */}
                <section className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            4
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">Completa tu Información</h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                Proporciona tus datos de contacto y nivel de experiencia para que el guía pueda 
                                preparar la mejor experiencia personalizada para ti.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="font-semibold text-slate-800 mb-3">📋 Información requerida</h4>
                                    <ul className="space-y-2 text-slate-600">
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Nombre completo
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Email de contacto
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Teléfono/WhatsApp
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Nivel de experiencia
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 mb-3">💡 Consejos útiles</h4>
                                    <ul className="space-y-2 text-slate-600">
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Menciona alergias alimentarias
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Indica necesidades especiales
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Preferencias de pesca
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Objetivos de aprendizaje
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Paso 5 */}
                <section className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            5
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">Confirma y Paga</h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                Revisa todos los detalles de tu reserva y elige tu método de pago preferido. 
                                Ofrecemos flexibilidad para que puedas pagar como más te convenga.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="font-semibold text-slate-800 mb-3">💳 Opciones de pago</h4>
                                    <ul className="space-y-2 text-slate-600">
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Transferencia bancaria
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Efectivo en el lugar
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            MercadoPago (próximamente)
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 mb-3">🔒 Política de cancelación</h4>
                                    <ul className="space-y-2 text-slate-600">
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Cancelación gratuita hasta 48hs antes
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Reprogramación por clima sin costo
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Confirmación inmediata por WhatsApp
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Preguntas Frecuentes</h2>
                    <div className="space-y-6">
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">¿Qué incluye el precio?</h3>
                            <p className="text-slate-600">
                                Todos nuestros servicios incluyen el equipamiento básico de pesca, guía experto, 
                                y almuerzo (en servicios de día completo). Los detalles específicos varían según el servicio elegido.
                            </p>
                        </div>
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">¿Qué debo llevar?</h3>
                            <p className="text-slate-600">
                                Ropa cómoda de abrigo, calzado antideslizante, gorra, protector solar, 
                                cámara fotográfica y ganas de disfrutar. El guía te enviará una lista detallada al confirmar.
                            </p>
                        </div>
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">¿Puedo reservar para un grupo?</h3>
                            <p className="text-slate-600">
                                ¡Por supuesto! Cada servicio tiene un máximo de participantes. Para grupos grandes, 
                                podemos coordinar múltiples guías o servicios especiales.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">¿Qué pasa si llueve?</h3>
                            <p className="text-slate-600">
                                Los días nublados suelen ser excelentes para pescar. En caso de mal tiempo severo, 
                                ofrecemos reprogramación sin costo adicional.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Final */}
                <section className="text-center">
                    <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-3xl p-8 text-white">
                        <h2 className="text-3xl font-bold mb-4">¿Listo para tu Aventura?</h2>
                        <p className="text-xl mb-8 opacity-90">
                            Comienza ahora y reserva tu experiencia de pesca en la Patagonia
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link 
                                to="/guias" 
                                className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                            >
                                Ver Guías Disponibles
                            </Link>
                            <a 
                                href="https://wa.me/5490000000000"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-emerald-600 transition-all duration-300"
                            >
                                Consultar por WhatsApp
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default GuiaPractica;
