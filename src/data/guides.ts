import { Guide, Review, Specialty } from '../types';

export const specialties: Specialty[] = [
  {
    id: 'spinning',
    name: 'Spinning',
    description: 'Técnica versátil con señuelos artificiales para truchas y salmones',
    icon: '🎣',
    difficulty: 'Principiante'
  },
  {
    id: 'fly-fishing',
    name: 'Pesca con Mosca',
    description: 'Arte tradicional de pesca con moscas artificiales en ríos cristalinos',
    icon: '🪶',
    difficulty: 'Intermedio'
  },
  {
    id: 'trolling',
    name: 'Pesca Embarcada',
    description: 'Pesca desde embarcación en lagos profundos y fiordos',
    icon: '⛵',
    difficulty: 'Principiante'
  },
  {
    id: 'salmon',
    name: 'Salmones',
    description: 'Especialización en captura de salmones en temporada',
    icon: '🐟',
    difficulty: 'Avanzado'
  },
  {
    id: 'trout',
    name: 'Truchas',
    description: 'Experto en truchas marrones, arcoíris y de arroyo',
    icon: '🌈',
    difficulty: 'Intermedio'
  },
  {
    id: 'sea-fishing',
    name: 'Pesca Marina',
    description: 'Pesca en fiordos y costas patagónicas',
    icon: '🌊',
    difficulty: 'Intermedio'
  },
  {
    id: 'ice-fishing',
    name: 'Pesca en Hielo',
    description: 'Técnica invernal en lagos congelados',
    icon: '❄️',
    difficulty: 'Avanzado'
  }
];

export const guides: Guide[] = [
  {
    id: 'carlos-mendoza',
    name: 'Carlos Mendoza',
    age: 45,
    experience: 22,
    specialties: ['Pesca con Mosca', 'Truchas', 'Salmones'],
    location: 'San Carlos de Bariloche',
    bio: 'Maestro de la pesca con mosca con más de dos décadas explorando los ríos patagónicos. Especialista en truchas marrones de gran tamaño y técnicas avanzadas de presentación. Ha guiado a pescadores de todo el mundo y es reconocido por su paciencia y conocimiento profundo de la entomología acuática.',
    avatar: '/images/pexels-cottonbro-4830248.jpg',
    coverImage: '/images/silueta-de-un-hombre-pescando-en-la-playa-al-atardecer.jpg',
    rating: 4.9,
    totalReviews: 127,
    pricePerDay: 25000,
    languages: ['Español', 'Inglés'],
    certifications: ['Guía Profesional de Pesca', 'Primeros Auxilios', 'Navegación Fluvial'],
    services: [
      {
        id: 'fly-basic',
        title: 'Iniciación Pesca con Mosca',
        description: 'Curso básico para principiantes en técnicas de pesca con mosca',
        duration: '8 horas',
        difficulty: 'Principiante',
        maxPeople: 4,
        price: 18000,
        includes: ['Equipo completo', 'Almuerzo', 'Transporte', 'Moscas y materiales']
      },
      {
        id: 'trout-master',
        title: 'Maestría en Truchas',
        description: 'Expedición avanzada para captura de truchas trofeo',
        duration: '2 días',
        difficulty: 'Avanzado',
        maxPeople: 2,
        price: 45000,
        includes: ['Alojamiento', 'Todas las comidas', 'Equipo premium', 'Transporte 4x4']
      }
    ],
    availability: {}
  },
  {
    id: 'maria-rodriguez',
    name: 'María Rodríguez',
    age: 38,
    experience: 15,
    specialties: ['Spinning', 'Pesca Embarcada', 'Pesca Marina'],
    location: 'Puerto Madryn',
    bio: 'Primera mujer guía certificada en la región, especialista en pesca embarcada y técnicas de spinning. Conoce como nadie los secretos de los fiordos patagónicos y las mejores zonas para salmones en temporada. Su enfoque amigable y profesional la ha convertido en la guía preferida de familias.',
    avatar: '/images/pexels-gasparzaldo-11250845.jpg',
    coverImage: '/images/pexels-lum3n-44775-294674.jpg',
    rating: 4.8,
    totalReviews: 89,
    pricePerDay: 22000,
    languages: ['Español', 'Inglés', 'Portugués'],
    certifications: ['Capitán de Yate', 'Guía de Turismo', 'Buceo Certificado'],
    services: [
      {
        id: 'boat-fishing',
        title: 'Pesca Embarcada en Fiordos',
        description: 'Aventura en embarcación por los fiordos más espectaculares',
        duration: '10 horas',
        difficulty: 'Principiante',
        maxPeople: 6,
        price: 28000,
        includes: ['Embarcación equipada', 'Almuerzo gourmet', 'Equipo de pesca', 'Combustible']
      }
    ],
    availability: {}
  },
  {
    id: 'jorge-silva',
    name: 'Jorge Silva',
    age: 52,
    experience: 28,
    specialties: ['Salmones', 'Pesca con Mosca', 'Pesca Marina'],
    location: 'Tierra del Fuego',
    bio: 'Leyenda viviente de la pesca patagónica. Jorge conoce cada río, cada lago y cada fiordo desde Neuquén hasta Tierra del Fuego. Especialista en salmones king y chinook, ha establecido varios récords regionales. Su experiencia es invaluable para pescadores que buscan la captura de su vida.',
    avatar: '/images/hombre-mayor-pesca-por-un-lago.jpg',
    coverImage: '/images/pexels-thomas-svensson-1505611-3004745.jpg',
    rating: 5.0,
    totalReviews: 203,
    pricePerDay: 35000,
    languages: ['Español', 'Inglés'],
    certifications: ['Guía Master', 'Instructor de Pesca', 'Conservación Marina'],
    services: [
      {
        id: 'salmon-expedition',
        title: 'Expedición Salmones King',
        description: 'La experiencia definitiva para capturar salmones gigantes',
        duration: '3 días',
        difficulty: 'Avanzado',
        maxPeople: 3,
        price: 85000,
        includes: ['Lodge exclusivo', 'Chef privado', 'Equipo profesional', 'Transporte aéreo']
      }
    ],
    availability: {}
  },
  {
    id: 'ana-gutierrez',
    name: 'Ana Gutiérrez',
    age: 31,
    experience: 8,
    specialties: ['Truchas', 'Spinning', 'Pesca con Mosca'],
    location: 'El Calafate',
    bio: 'Joven promesa de la pesca patagónica, Ana combina técnicas tradicionales con enfoques modernos. Especialista en truchas arcoíris y técnicas de ninfa. Su energía y conocimiento de la tecnología moderna la convierten en la guía ideal para jóvenes pescadores.',
    avatar: '/images/pexels-arch-1165125.jpg',
    coverImage: '/images/pexels-gasparzaldo-11315286.jpg',
    rating: 4.7,
    totalReviews: 54,
    pricePerDay: 20000,
    languages: ['Español', 'Inglés', 'Francés'],
    certifications: ['Guía Junior', 'Fotografía de Naturaleza'],
    services: [
      {
        id: 'youth-fishing',
        title: 'Pesca para Jóvenes',
        description: 'Programa especial diseñado para pescadores de 12-25 años',
        duration: '6 horas',
        difficulty: 'Principiante',
        maxPeople: 8,
        price: 15000,
        includes: ['Equipo adaptado', 'Snacks', 'Fotografías', 'Certificado']
      }
    ],
    availability: {}
  },
  {
    id: 'roberto-fernandez',
    name: 'Roberto Fernández',
    age: 44,
    experience: 19,
    specialties: ['Pesca en Hielo', 'Truchas', 'Spinning'],
    location: 'San Martín de los Andes',
    bio: 'Único especialista certificado en pesca en hielo de la región. Roberto ha desarrollado técnicas especiales para la pesca invernal que atraen pescadores de todo el mundo. Su conocimiento del comportamiento de los peces en condiciones extremas es incomparable.',
    avatar: '/images/pexels-pixabay-39854.jpg',
    coverImage: '/images/pexels-d123x-848737.jpg',
    rating: 4.6,
    totalReviews: 71,
    pricePerDay: 27000,
    languages: ['Español', 'Inglés', 'Alemán'],
    certifications: ['Supervivencia en Hielo', 'Rescate Acuático', 'Guía de Montaña'],
    services: [
      {
        id: 'ice-fishing',
        title: 'Pesca en Hielo',
        description: 'Experiencia única de pesca invernal en lagos congelados',
        duration: '8 horas',
        difficulty: 'Avanzado',
        maxPeople: 4,
        price: 32000,
        includes: ['Equipo térmico', 'Refugio calefaccionado', 'Bebidas calientes', 'Equipo especializado']
      }
    ],
    availability: {}
  },
  {
    id: 'luis-morales',
    name: 'Luis Morales',
    age: 39,
    experience: 16,
    specialties: ['Pesca Embarcada', 'Salmones', 'Pesca Marina'],
    location: 'Puerto Natales',
    bio: 'Capitán experimentado con licencia para navegar en aguas internacionales. Luis se especializa en expediciones de varios días por los canales fueguinos en busca de salmones chinook. Su embarcación está equipada con la última tecnología para localización de cardúmenes.',
    avatar: '/images/pexels-martin-que-243128669-30179791.jpg',
    coverImage: '/images/pexels-szafran-18894390.jpg',
    rating: 4.9,
    totalReviews: 98,
    pricePerDay: 30000,
    languages: ['Español', 'Inglés'],
    certifications: ['Capitán de Altura', 'Radar y GPS', 'Pesca Deportiva Avanzada'],
    services: [
      {
        id: 'channels-expedition',
        title: 'Expedición Canales Fueguinos',
        description: 'Navegación de 5 días por los canales más remotos',
        duration: '5 días',
        difficulty: 'Intermedio',
        maxPeople: 4,
        price: 120000,
        includes: ['Camarotes privados', 'Chef a bordo', 'Todas las comidas', 'Equipo profesional']
      }
    ],
    availability: {}
  },
  {
    id: 'patricia-lopez',
    name: 'Patricia López',
    age: 35,
    experience: 12,
    specialties: ['Pesca con Mosca', 'Truchas', 'Spinning'],
    location: 'Villa La Angostura',
    bio: 'Bióloga marina convertida en guía de pesca, Patricia aporta un enfoque científico único a la experiencia. Su conocimiento sobre el comportamiento de los peces y ecosistemas acuáticos enriquece cada expedición con información fascinante sobre la naturaleza patagónica.',
    avatar: '/images/pexels-pixabay-301738.jpg',
    coverImage: '/images/hombre-pescando-en-el-rio.jpg',
    rating: 4.8,
    totalReviews: 76,
    pricePerDay: 24000,
    languages: ['Español', 'Inglés', 'Italiano'],
    certifications: ['Biología Marina', 'Guía Naturalista', 'Conservación Acuática'],
    services: [
      {
        id: 'eco-fishing',
        title: 'Pesca Ecológica Educativa',
        description: 'Combina pesca deportiva con educación ambiental',
        duration: '8 horas',
        difficulty: 'Principiante',
        maxPeople: 6,
        price: 21000,
        includes: ['Charla educativa', 'Material didáctico', 'Almuerzo orgánico', 'Certificado de conservación']
      }
    ],
    availability: {}
  },
  {
    id: 'diego-ramirez',
    name: 'Diego Ramírez',
    age: 41,
    experience: 18,
    specialties: ['Spinning', 'Pesca Marina', 'Salmones'],
    location: 'Comodoro Rivadavia',
    bio: 'Especialista en pesca desde costa y spinning pesado. Diego conoce todos los secretos de la pesca marina patagónica, desde pejerreyes hasta róbalos. Su técnica de spinning para salmones desde costa es legendaria entre los pescadores locales.',
    avatar: '/images/pexels-cottonbro-4828253.jpg',
    coverImage: '/images/pexels-pixabay-39854.jpg',
    rating: 4.7,
    totalReviews: 112,
    pricePerDay: 23000,
    languages: ['Español', 'Inglés'],
    certifications: ['Pesca Deportiva Marina', 'Navegación Costera', 'Meteorología'],
    services: [
      {
        id: 'shore-fishing',
        title: 'Pesca desde Costa',
        description: 'Técnicas de spinning pesado desde acantilados y playas',
        duration: '10 horas',
        difficulty: 'Intermedio',
        maxPeople: 5,
        price: 19000,
        includes: ['Transporte 4x4', 'Equipo pesado', 'Almuerzo de campo', 'Carnada especializada']
      }
    ],
    availability: {}
  },
  {
    id: 'sebastian-torres',
    name: 'Sebastián Torres',
    age: 29,
    experience: 7,
    specialties: ['Truchas', 'Pesca con Mosca', 'Spinning'],
    location: 'Junín de los Andes',
    bio: 'Guía joven pero con gran talento, Sebastián representa la nueva generación de pescadores patagónicos. Combina técnicas ancestrales mapuches con métodos modernos. Su especialidad son las truchas de arroyo en ríos de montaña de difícil acceso.',
    avatar: '/images/pexels-thomas-svensson-1505611-3004745.jpg',
    coverImage: '/images/pexels-gasparzaldo-11250845.jpg',
    rating: 4.5,
    totalReviews: 43,
    pricePerDay: 19000,
    languages: ['Español', 'Inglés', 'Mapudungun'],
    certifications: ['Guía de Montaña', 'Cultura Mapuche', 'Trekking'],
    services: [
      {
        id: 'mountain-streams',
        title: 'Arroyos de Montaña',
        description: 'Trekking y pesca en arroyos vírgenes de altura',
        duration: '12 horas',
        difficulty: 'Avanzado',
        maxPeople: 3,
        price: 26000,
        includes: ['Trekking guiado', 'Equipo de montaña', 'Almuerzo energético', 'Primeros auxilios']
      }
    ],
    availability: {}
  },
  {
    id: 'elena-vasquez',
    name: 'Elena Vásquez',
    age: 47,
    experience: 21,
    specialties: ['Pesca Embarcada', 'Truchas', 'Pesca Marina'],
    location: 'Ushuaia',
    bio: 'Pionera en pesca femenina profesional y propietaria de su propia flota de embarcaciones. Elena ha navegado desde el Estrecho de Magallanes hasta el Cabo de Hornos. Su experiencia en aguas subantárticas y conocimiento de las mareas fueguinas es único en la región.',
    avatar: '/images/pexels-gasparzaldo-11315286.jpg',
    coverImage: '/images/silueta-de-un-hombre-pescando-en-la-playa-al-atardecer.jpg',
    rating: 4.9,
    totalReviews: 134,
    pricePerDay: 32000,
    languages: ['Español', 'Inglés', 'Noruego'],
    certifications: ['Capitán Profesional', 'Navegación Polar', 'Rescate Marítimo'],
    services: [
      {
        id: 'beagle-channel',
        title: 'Canal Beagle Profundo',
        description: 'Pesca en las aguas más australes del continente',
        duration: '2 días',
        difficulty: 'Intermedio',
        maxPeople: 6,
        price: 58000,
        includes: ['Embarcación con camarotes', 'Comidas gourmet', 'Equipo polar', 'Guía histórico']
      }
    ],
    availability: {}
  }
];

export const reviews: Review[] = [
  {
    id: '1',
    guideId: 'carlos-mendoza',
    userName: 'Juan Pérez',
    userAvatar: '/images/pexels-cottonbro-4830248.jpg',
    rating: 5,
    comment: 'Carlos es un maestro de la pesca con mosca. Su paciencia para enseñar y conocimiento de los ríos es incomparable. Capturé mi primera trucha de 5kg gracias a él.',
    date: '2024-07-15',
    photos: ['/images/pexels-pixabay-301738.jpg', '/images/hombre-pescando-en-el-rio.jpg'],
    verified: true
  },
  {
    id: '2',
    guideId: 'maria-rodriguez',
    userName: 'Sarah Johnson',
    rating: 5,
    comment: 'Amazing experience with María! Her knowledge of the fjords is incredible and she made our family feel safe and welcome. Highly recommended!',
    date: '2024-07-08',
    photos: ['/images/pexels-lum3n-44775-294674.jpg'],
    verified: true
  },
  {
    id: '3',
    guideId: 'jorge-silva',
    userName: 'Roberto García',
    rating: 5,
    comment: 'Jorge es una leyenda. 28 años de experiencia se notan en cada detalle. La expedición de salmones fue épica, capturamos un chinook de 12kg.',
    date: '2024-06-28',
    photos: ['/images/pexels-thomas-svensson-1505611-3004745.jpg', '/images/pexels-d123x-848737.jpg'],
    verified: true
  }
];

export const mockBookings = [
  {
    id: '1',
    guideId: 'carlos-mendoza',
    serviceId: 'fly-basic',
    date: '2024-08-15',
    status: 'confirmed' as const,
    customerName: 'Ana Martínez',
    totalPrice: 18000
  },
  {
    id: '2',
    guideId: 'maria-rodriguez',
    serviceId: 'boat-fishing',
    date: '2024-08-20',
    status: 'pending' as const,
    customerName: 'Carlos López',
    totalPrice: 28000
  }
];
