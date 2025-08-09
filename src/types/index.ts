export interface Guide {
    id: string;
    name: string;
    age: number;
    experience: number; // in years
    specialties: string[];
    location: string;
    bio: string;
    avatar: string;
    coverImage: string;
    rating: number;
    totalReviews: number;
    pricePerDay: number;
    languages: string[];
    certifications: string[];
    services: Service[];
    availability: {
        [key: string]: boolean; // date string as key
    };
    gallery?: string[];
    contactInfo?: {
        phone: string;
        email: string;
        whatsapp: string;
    };
}

export interface Service {
    id: string;
    title: string;
    description: string;
    duration: string;
    difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
    maxPeople: number;
    price: number;
    includes: string[];
}

export interface Product {
    id: string;
    name: string;
    description: string;
    category: 'señuelos' | 'multifilamentos' | 'cañas' | 'accesorios';
    price: number;
    image: string;
    inStock: boolean;
    featured: boolean;
    specifications?: Record<string, string>;
}

export interface Sponsor {
    id: string;
    name: string;
    logo: string;
    website: string;
    category: string;
    description: string;
}

export interface Review {
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

export interface Specialty {
    id: string;
    name: string;
    description: string;
    icon: string;
    difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
}

export interface Booking {
    id: string;
    guideId: string;
    userId: string;
    serviceId: string;
    date: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    totalPrice: number;
    notes?: string;
}