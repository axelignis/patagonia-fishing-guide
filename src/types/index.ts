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
    pricePerDay?: number;
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

// User Profile types for Supabase
export interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    role: 'admin' | 'guide' | 'user';
    created_at: string;
    updated_at: string;
    avatar_url?: string | null;
    hero_image_url?: string | null;
    // Guide-specific fields
    bio?: string | null;
    location?: string | null;
    experience_years?: number | null;
    specialties?: string[] | null;
    languages?: string[] | null;
    certifications?: string[] | null;
    phone?: string | null;
    whatsapp?: string | null;
}

// Image upload types
export interface ImageUpload {
    file: File;
    preview: string;
}

export interface UploadImageOptions {
    bucket: 'avatars' | 'hero-images';
    userId: string;
    file: File;
}

// --- Chile Administrative Division Types ---
export interface ChileRegion {
    codigo: string; // e.g. '01'
    nombre: string; // e.g. 'Tarapacá'
}

export interface ChileProvince {
    codigo: string; // e.g. '011'
    nombre: string; // Province name
    regionCodigo: string; // parent region code
}

export interface ChileCommune {
    codigo: string; // e.g. '01101'
    nombre: string; // Commune name
    regionCodigo: string; // parent region code
    provinciaCodigo: string; // parent province code
}

export interface ChileLocationsData {
    regions: ChileRegion[];
    provinces: ChileProvince[];
    communes: ChileCommune[];
    fetchedAt: number; // timestamp for cache invalidation
}