import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Users, CreditCard, CheckCircle, Star, Clock, Fish, ChevronRight, X, User } from 'lucide-react';
import { Guide, Service } from '../types';
import guidesData from '../data/guides.json'; // fallback local
import { getGuideById, listServicesByGuide } from '../services/guides';

interface BookingData {
    guideId: string;
    serviceId: string;
    date: string;
    time: string;
    people: number;
    totalPrice: number;
    paymentMethod: string;
    customerInfo: {
        name: string;
        email: string;
        phone: string;
        specialRequests: string;
    };
}

const Reservar: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [guide, setGuide] = useState<Guide | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [bookingData, setBookingData] = useState<BookingData>({
        guideId: id || '',
        serviceId: '',
        date: '',
        time: '',
        people: 1,
        totalPrice: 0,
        paymentMethod: '',
        customerInfo: {
            name: '',
            email: '',
            phone: '',
            specialRequests: ''
        }
    });

    const searchParams = new URLSearchParams(window.location.search);
    const serviceParam = searchParams.get('service');

    useEffect(() => {
        async function loadGuide() {
            if (!id) return;
            setLoading(true);
            try {
                // 1. Intentar Supabase
                const g: any = await getGuideById(id);
                if (g) {
                    // Cargar servicios dinámicos
                    const servicesRaw = await listServicesByGuide(g.id);
                    const servicesMapped: Service[] = servicesRaw.map((s: any) => ({
                        id: s.id,
                        title: s.title,
                        description: s.description ?? '',
                        price: s.price ?? 0,
                        duration: s.duration ?? '',
                        difficulty: (s.difficulty as any) || 'Intermedio',
                        maxPeople: s.max_people ?? 1,
                        includes: s.includes ?? []
                    }));
                    const DEFAULT_AVATAR = '/images/pexels-pixabay-301738.jpg';
                    const DEFAULT_COVER = '/images/pexels-gasparzaldo-11250845.jpg';
                    const mapped: Guide = {
                        id: g.id,
                        name: g.name,
                        age: g.age ?? 0,
                        experience: 0,
                        specialties: g.specialties ?? [],
                        location: g.location ?? 'Patagonia',
                        bio: g.bio ?? '',
                        // Avatar prioridad: vista/avatar_url -> user_profiles.avatar_url -> legacy -> default
                        avatar: (g as any).avatar_url || (g as any).user_profiles?.avatar_url || (g as any).legacy_avatar_url || DEFAULT_AVATAR,
                        // Cover prioridad: hero_image_url -> user_profiles.hero_image_url -> cover_url -> avatar -> default
                        coverImage: (g as any).hero_image_url || (g as any).user_profiles?.hero_image_url || (g as any).cover_url || (g as any).avatar_url || (g as any).user_profiles?.avatar_url || DEFAULT_COVER,
                        rating: Number(g.rating ?? 0),
                        totalReviews: Number(g.total_reviews ?? 0),
                        // price removed
                        languages: g.languages ?? [],
                        certifications: [],
                        services: servicesMapped,
                        availability: {},
                        gallery: [],
                        contactInfo: undefined,
                    };
                    setGuide(mapped);
                    if (serviceParam) {
                        const svc = servicesMapped.find(s => s.id === serviceParam);
                        if (svc) {
                            setBookingData(prev => ({ ...prev, serviceId: svc.id, totalPrice: svc.price }));
                        }
                    }
                    return;
                }
                // 2. Fallback dataset estático (ids cortas tipo "1")
                const foundGuide = (guidesData as any as Guide[]).find(gd => gd.id === id);
                if (foundGuide) {
                    setGuide(foundGuide);
                    if (serviceParam) {
                        const svc = foundGuide.services?.find(s => s.id === serviceParam);
                        if (svc) setBookingData(prev => ({ ...prev, serviceId: svc.id, totalPrice: svc.price }));
                    }
                } else {
                    setGuide(null);
                }
            } catch (e:any) {
                console.warn('[Reservar] Error cargando guía, fallback estático:', e.message);
                const foundGuide = (guidesData as any as Guide[]).find(gd => gd.id === id);
                setGuide(foundGuide || null);
            } finally {
                setLoading(false);
            }
        }
        loadGuide();
    }, [id, serviceParam]);

    const nextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleServiceSelect = (serviceId: string) => {
        const selectedService = guide?.services?.find(s => s.id === serviceId);
        if (selectedService) {
            setBookingData(prev => ({
                ...prev,
                serviceId,
                totalPrice: selectedService.price * prev.people
            }));
        }
    };

    const handleParticipantsChange = (people: number) => {
        const selectedService = guide?.services?.find(s => s.id === bookingData.serviceId);
        setBookingData(prev => ({
            ...prev,
            people,
            totalPrice: selectedService ? selectedService.price * people : 0
        }));
    };

    const handleConfirmBooking = async () => {
        if (!termsAccepted) {
            alert('Debes aceptar los términos y condiciones para continuar');
            return;
        }

        setShowSuccessAnimation(true);
        
        // Simular procesamiento del pago
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Aquí iría la lógica para procesar la reserva
        console.log('Booking confirmed:', bookingData);
    };

    const selectedService = guide?.services?.find(s => s.id === bookingData.serviceId);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Cargando información del guía...</p>
                </div>
            </div>
        );
    }

    if (!guide) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900 flex items-center justify-center">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Guía no encontrado</h1>
                    <p className="text-gray-300 mb-8">No pudimos encontrar la información del guía solicitado.</p>
                    <button 
                        onClick={() => navigate('/guias')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver a Guías
                    </button>
                </div>
            </div>
        );
    }

    // Success Animation
    if (showSuccessAnimation) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-green-800 via-green-700 to-green-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                            <CheckCircle className="w-16 h-16 text-white" />
                        </div>
                        <div className="absolute inset-0 w-32 h-32 bg-green-400 rounded-full mx-auto animate-ping opacity-20"></div>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4 animate-pulse">¡Felicidades!</h1>
                    <p className="text-green-100 text-xl mb-8">Tu reserva ha sido confirmada exitosamente</p>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto mb-8">
                        <h3 className="text-lg font-semibold text-white mb-2">Detalles de tu reserva:</h3>
                        <p className="text-green-100">Guía: {guide.name}</p>
                        <p className="text-green-100">Servicio: {selectedService?.title}</p>
                        <p className="text-green-100">Fecha: {bookingData.date}</p>
                        <p className="text-green-100">Personas: {bookingData.people}</p>
                        <p className="text-green-100 font-semibold">Total: ${bookingData.totalPrice.toLocaleString()}</p>
                    </div>
                    <button 
                        onClick={() => navigate('/guias')}
                        className="bg-white text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                    >
                        Volver a Guías
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900">
            {/* Header */}
            <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => navigate(`/guia/${guide?.id || id}`)}
                                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Volver al Perfil
                            </button>
                            <button 
                                onClick={() => navigate('/guias')}
                                className="hidden md:inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm"
                            >
                                Lista de Guías
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            {[1, 2, 3, 4].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                        step <= currentStep 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-600 text-gray-300'
                                    }`}>
                                        {step}
                                    </div>
                                    {step < 4 && (
                                        <div className={`w-8 h-0.5 ${
                                            step < currentStep ? 'bg-blue-600' : 'bg-gray-600'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Step 1: Service Selection (single pre-selected) */}
                        {currentStep === 1 && selectedService && (
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Fish className="w-6 h-6 text-blue-400" />
                                    Servicio seleccionado
                                </h2>
                                <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-500/10">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white mb-2">{selectedService.title}</h3>
                                            <p className="text-gray-300 text-sm mb-3">{selectedService.description}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {selectedService.duration}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    Max {selectedService.maxPeople} personas
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-green-400">${selectedService.price.toLocaleString()}</div>
                                            <div className="text-sm text-gray-400">por persona</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-xs text-gray-400">
                                        (La selección de servicio ocurre en el perfil del guía)
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Date & Time */}
                        {currentStep === 2 && (
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <CalendarDays className="w-6 h-6 text-blue-400" />
                                    Fecha y hora
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Fecha de expedición</label>
                                        <input
                                            type="date"
                                            value={bookingData.date}
                                            onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Hora de inicio</label>
                                        <select
                                            value={bookingData.time}
                                            onChange={(e) => setBookingData(prev => ({ ...prev, time: e.target.value }))}
                                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        >
                                            <option value="">Selecciona una hora</option>
                                            <option value="06:00">06:00 AM - Salida temprana</option>
                                            <option value="08:00">08:00 AM - Mañana</option>
                                            <option value="10:00">10:00 AM - Media mañana</option>
                                            <option value="14:00">02:00 PM - Tarde</option>
                                            <option value="16:00">04:00 PM - Media tarde</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Número de participantes</label>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleParticipantsChange(Math.max(1, bookingData.people - 1))}
                                                className="w-10 h-10 bg-slate-700 border border-slate-600 rounded-lg text-white hover:bg-slate-600 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="text-xl font-semibold text-white min-w-[2rem] text-center">
                                                {bookingData.people}
                                            </span>
                                            <button
                                                onClick={() => handleParticipantsChange(Math.min(selectedService?.maxPeople || 10, bookingData.people + 1))}
                                                className="w-10 h-10 bg-slate-700 border border-slate-600 rounded-lg text-white hover:bg-slate-600 transition-colors"
                                            >
                                                +
                                            </button>
                                            <span className="text-gray-400 ml-4">
                                                Máximo {selectedService?.maxPeople} personas
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Customer Info */}
                        {currentStep === 3 && (
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <User className="w-6 h-6 text-blue-400" />
                                    Información de contacto
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Nombre completo *</label>
                                        <input
                                            type="text"
                                            value={bookingData.customerInfo.name}
                                            onChange={(e) => setBookingData(prev => ({
                                                ...prev,
                                                customerInfo: { ...prev.customerInfo, name: e.target.value }
                                            }))}
                                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            placeholder="Ingresa tu nombre completo"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Correo electrónico *</label>
                                        <input
                                            type="email"
                                            value={bookingData.customerInfo.email}
                                            onChange={(e) => setBookingData(prev => ({
                                                ...prev,
                                                customerInfo: { ...prev.customerInfo, email: e.target.value }
                                            }))}
                                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Teléfono *</label>
                                        <input
                                            type="tel"
                                            value={bookingData.customerInfo.phone}
                                            onChange={(e) => setBookingData(prev => ({
                                                ...prev,
                                                customerInfo: { ...prev.customerInfo, phone: e.target.value }
                                            }))}
                                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            placeholder="+56 9 1234 5678"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Solicitudes especiales</label>
                                        <textarea
                                            value={bookingData.customerInfo.specialRequests}
                                            onChange={(e) => setBookingData(prev => ({
                                                ...prev,
                                                customerInfo: { ...prev.customerInfo, specialRequests: e.target.value }
                                            }))}
                                            rows={4}
                                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            placeholder="Menciona cualquier necesidad especial, experiencia previa en pesca, etc."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Payment */}
                        {currentStep === 4 && (
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <CreditCard className="w-6 h-6 text-blue-400" />
                                    Método de pago
                                </h2>
                                <div className="space-y-4 mb-6">
                                    <div 
                                        onClick={() => setBookingData(prev => ({ ...prev, paymentMethod: 'credit-card' }))}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                            bookingData.paymentMethod === 'credit-card'
                                                ? 'border-blue-500 bg-blue-500/10'
                                                : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-6 h-6 text-blue-400" />
                                            <div>
                                                <h3 className="text-white font-semibold">Tarjeta de Crédito</h3>
                                                <p className="text-gray-400 text-sm">Visa, Mastercard, American Express</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div 
                                        onClick={() => setBookingData(prev => ({ ...prev, paymentMethod: 'webpay' }))}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                            bookingData.paymentMethod === 'webpay'
                                                ? 'border-blue-500 bg-blue-500/10'
                                                : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">W</span>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">WebPay Chile</h3>
                                                <p className="text-gray-400 text-sm">Pago seguro con WebPay Plus</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Terms and Conditions */}
                                <div className="border-t border-slate-600 pt-6">
                                    <div className="flex items-start gap-3 mb-4">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            checked={termsAccepted}
                                            onChange={(e) => setTermsAccepted(e.target.checked)}
                                            className="mt-1 w-4 h-4 text-blue-600 border-slate-600 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="terms" className="text-gray-300 text-sm">
                                            Acepto los{' '}
                                            <button 
                                                onClick={() => setShowTermsModal(true)}
                                                className="text-blue-400 hover:text-blue-300 underline"
                                            >
                                                términos y condiciones
                                            </button>
                                            {' '}y las{' '}
                                            <button 
                                                onClick={() => setShowCancelModal(true)}
                                                className="text-blue-400 hover:text-blue-300 underline"
                                            >
                                                políticas de cancelación
                                            </button>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                                    currentStep === 1
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'bg-slate-700 text-white hover:bg-slate-600'
                                }`}
                            >
                                Anterior
                            </button>
                            {currentStep < 4 ? (
                                <button
                                    onClick={nextStep}
                                    disabled={
                                        (currentStep === 1 && !bookingData.serviceId) ||
                                        (currentStep === 2 && (!bookingData.date || !bookingData.time)) ||
                                        (currentStep === 3 && (!bookingData.customerInfo.name || !bookingData.customerInfo.email || !bookingData.customerInfo.phone))
                                    }
                                    className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                                        (currentStep === 1 && !bookingData.serviceId) ||
                                        (currentStep === 2 && (!bookingData.date || !bookingData.time)) ||
                                        (currentStep === 3 && (!bookingData.customerInfo.name || !bookingData.customerInfo.email || !bookingData.customerInfo.phone))
                                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    Siguiente
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleConfirmBooking}
                                    disabled={!bookingData.paymentMethod || !termsAccepted}
                                    className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                                        !bookingData.paymentMethod || !termsAccepted
                                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                                >
                                    Confirmar Reserva
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Guide Card */}
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                                <div className="flex items-center gap-4 mb-4">
                                    <img 
                                        src={guide.avatar} 
                                        alt={guide.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{guide.name}</h3>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-yellow-400 font-semibold">{guide.rating}</span>
                                            <span className="text-gray-400">({guide.totalReviews} reseñas)</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-300 text-sm">{guide.bio}</p>
                            </div>

                            {/* Booking Summary */}
                            {selectedService && (
                                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                                    <h3 className="text-lg font-semibold text-white mb-4">Resumen de reserva</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Servicio:</span>
                                            <span className="text-white font-semibold">{selectedService.title}</span>
                                        </div>
                                        {bookingData.date && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">Fecha:</span>
                                                <span className="text-white">{bookingData.date}</span>
                                            </div>
                                        )}
                                        {bookingData.time && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">Hora:</span>
                                                <span className="text-white">{bookingData.time}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Participantes:</span>
                                            <span className="text-white">{bookingData.people}</span>
                                        </div>
                                        <div className="border-t border-slate-600 pt-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">Precio por persona:</span>
                                                <span className="text-white">${selectedService.price.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-bold">
                                                <span className="text-white">Total:</span>
                                                <span className="text-green-400">${bookingData.totalPrice.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Terms Modal */}
            {showTermsModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Términos y Condiciones</h2>
                            <button onClick={() => setShowTermsModal(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="text-gray-300 space-y-4">
                            <p>Al reservar nuestros servicios de guía de pesca, usted acepta los siguientes términos:</p>
                            <h3 className="text-white font-semibold">1. Condiciones del Servicio</h3>
                            <p>- El servicio incluye guía especializado, equipo de pesca básico y transporte según se especifique.</p>
                            <p>- Los horarios pueden variar según condiciones climáticas.</p>
                            <h3 className="text-white font-semibold">2. Responsabilidad</h3>
                            <p>- Los participantes deben seguir todas las instrucciones de seguridad.</p>
                            <p>- La empresa no se hace responsable por accidentes debido a negligencia del cliente.</p>
                            <h3 className="text-white font-semibold">3. Equipamiento</h3>
                            <p>- Se recomienda traer ropa adecuada para las condiciones climáticas.</p>
                            <p>- El equipo de pesca básico está incluido, equipo especializado tiene costo adicional.</p>
                        </div>
                        <button 
                            onClick={() => setShowTermsModal(false)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mt-6"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {/* Cancellation Policy Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Políticas de Cancelación</h2>
                            <button onClick={() => setShowCancelModal(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="text-gray-300 space-y-4">
                            <h3 className="text-white font-semibold">Cancelación por parte del Cliente</h3>
                            <p>- <strong>Más de 48 horas antes:</strong> Reembolso completo (100%)</p>
                            <p>- <strong>24-48 horas antes:</strong> Reembolso del 50%</p>
                            <p>- <strong>Menos de 24 horas:</strong> Sin reembolso</p>
                            
                            <h3 className="text-white font-semibold">Cancelación por Condiciones Climáticas</h3>
                            <p>- En caso de condiciones climáticas adversas, se ofrecerá reprogramación sin costo.</p>
                            <p>- Si no es posible reprogramar, se reembolsará el 100% del pago.</p>
                            
                            <h3 className="text-white font-semibold">Proceso de Reembolso</h3>
                            <p>- Los reembolsos se procesan en 5-7 días hábiles.</p>
                            <p>- Se reembolsará al mismo método de pago utilizado.</p>
                        </div>
                        <button 
                            onClick={() => setShowCancelModal(false)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mt-6"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reservar;
