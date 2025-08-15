import React from 'react';
import { AnimatedCard, ProgressiveImage } from './ui/simple';

interface GuideCardProps {
    id?: string;
    name: string;
    experience?: number;
    age?: number;
    bio?: string;
    location?: string;
    rating?: number;
    total_reviews?: number;
    price_per_day?: number;
    services?: string[];
    specialties?: string[];
    languages?: string[];
    avatar_url?: string;
    cover_url?: string;
    is_active?: boolean;
    onClick?: () => void;
    delay?: number;
}

const GuideCard: React.FC<GuideCardProps> = ({ 
    name, 
    age,
    bio,
    location,
    rating = 0,
    total_reviews = 0,
    price_per_day,
    specialties = [],
    languages = [],
    avatar_url,
    cover_url,
    is_active = true,
    onClick,
    experience
}) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const placeholderImage = '/images/pexels-pixabay-39854.jpg';

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <AnimatedCard
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            onClick={onClick}
        >
            <div 
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden">
                    <ProgressiveImage
                        src={cover_url || placeholderImage}
                        placeholder={placeholderImage}
                        alt={`${name} - Guía de pesca`}
                        className="w-full h-full"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold transform transition-all duration-300 ${
                        isHovered ? 'scale-110' : 'scale-100'
                    } ${
                        is_active 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-500 text-white'
                    }`}>
                        {is_active ? '✅ Disponible' : '❌ No disponible'}
                    </div>

                    {/* Rating Badge */}
                    {rating > 0 && (
                        <div className="absolute top-4 left-4 bg-white/90 px-2 py-1 rounded-lg flex items-center space-x-1 animate-fadeIn">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm font-semibold text-gray-800">
                                {rating.toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-600">
                                ({total_reviews})
                            </span>
                        </div>
                    )}

                    {/* Avatar */}
                    <div className="absolute -bottom-6 left-6 w-12 h-12 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 animate-scaleIn">
                        {avatar_url ? (
                            <img 
                                src={avatar_url} 
                                alt={name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                                {name.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Card Content */}
                <div className="pt-8 p-6">
                    {/* Name and Location */}
                    <div className="mb-3">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 animate-slideInLeft">
                            {name}
                        </h3>
                        {location && (
                            <p className="text-sm text-gray-600 flex items-center animate-slideInLeft animate-delay-100">
                                📍 {location}
                            </p>
                        )}
                        {age && (
                            <p className="text-sm text-gray-500 animate-slideInLeft animate-delay-200">
                                {age} años {experience && `• ${experience} años de experiencia`}
                            </p>
                        )}
                    </div>

                    {/* Bio */}
                    {bio && (
                        <p className="text-gray-700 text-sm mb-4 line-clamp-2 animate-fadeIn animate-delay-300">
                            {bio}
                        </p>
                    )}

                    {/* Specialties */}
                    {specialties.length > 0 && (
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">Especialidades:</p>
                            <div className="flex flex-wrap gap-1">
                                {specialties.slice(0, 3).map((specialty, index) => (
                                    <span
                                        key={index}
                                        className={`px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full animate-scaleIn stagger-item`}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {specialty}
                                    </span>
                                ))}
                                {specialties.length > 3 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full animate-scaleIn animate-delay-300">
                                        +{specialties.length - 3} más
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {languages.length > 0 && (
                        <div className="mb-4 animate-slideInUp animate-delay-200">
                            <p className="text-xs text-gray-500 mb-1">Idiomas:</p>
                            <p className="text-sm text-gray-700">
                                {languages.join(', ')}
                            </p>
                        </div>
                    )}

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 animate-slideInUp animate-delay-300">
                        {price_per_day ? (
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Desde</p>
                                <p className="text-lg font-bold text-green-600">
                                    {formatPrice(price_per_day)}
                                </p>
                                <p className="text-xs text-gray-500">por día</p>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">
                                Consultar precios
                            </div>
                        )}

                        <div className={`text-blue-600 font-semibold text-sm flex items-center transition-transform duration-300 ${
                            isHovered ? 'transform translate-x-2' : ''
                        }`}>
                            Ver detalles →
                        </div>
                    </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`} />
            </div>
        </AnimatedCard>
    );
};

export default GuideCard;
