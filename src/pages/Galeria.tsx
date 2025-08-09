import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavigationButton } from '../components/NavigationButton';
import WhatsAppButton from '../components/WhatsAppButton';

interface ImageData {
  id: number;
  src: string;
  alt: string;
  category: string;
}

export default function Galeria() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const observer = useRef<IntersectionObserver>();

  // Base de datos de imágenes (repetimos las existentes para tener 100)
  const allImages: ImageData[] = [
    { id: 1, src: "/images/silueta-de-un-hombre-pescando-en-la-playa-al-atardecer.jpg", alt: "Atardecer Patagónico", category: "Paisajes" },
    { id: 2, src: "/images/hombre-pescando-en-el-rio.jpg", alt: "Pesca en río", category: "Acción" },
    { id: 3, src: "/images/pexels-cottonbro-4830248.jpg", alt: "Equipo de pesca", category: "Equipos" },
    { id: 4, src: "/images/pexels-gasparzaldo-11250845.jpg", alt: "Paisaje patagónico", category: "Paisajes" },
    { id: 5, src: "/images/pexels-pixabay-39854.jpg", alt: "Lago cristalino", category: "Paisajes" },
    { id: 6, src: "/images/pexels-gasparzaldo-11315286.jpg", alt: "Montañas nevadas", category: "Paisajes" },
    { id: 7, src: "/images/pexels-pixabay-301738.jpg", alt: "Trucha capturada", category: "Capturas" },
    { id: 8, src: "/images/hombre-mayor-pesca-por-un-lago.jpg", alt: "Experiencia guiada", category: "Acción" },
    { id: 9, src: "/images/pexels-thomas-svensson-1505611-3004745.jpg", alt: "Técnica de pesca", category: "Acción" },
    { id: 10, src: "/images/pexels-d123x-848737.jpg", alt: "Pesca nocturna", category: "Paisajes" },
    { id: 11, src: "/images/pexels-arch-1165125.jpg", alt: "Río serpenteante", category: "Paisajes" },
    { id: 12, src: "/images/pexels-martin-que-243128669-30179791.jpg", alt: "Amanecer en el lago", category: "Paisajes" },
    { id: 13, src: "/images/pexels-lum3n-44775-294674.jpg", alt: "Pesca desde embarcación", category: "Acción" },
    { id: 14, src: "/images/pexels-szafran-18894390.jpg", alt: "Vista panorámica", category: "Paisajes" },
  ];

  // Generar 100 imágenes repitiendo las existentes
  const generateImageDatabase = () => {
    const imageDatabase: ImageData[] = [];
    for (let i = 0; i < 100; i++) {
      const baseImage = allImages[i % allImages.length];
      imageDatabase.push({
        ...baseImage,
        id: i + 1,
      });
    }
    return imageDatabase;
  };

  const imageDatabase = generateImageDatabase();

  // Simular carga de imágenes
  const loadMoreImages = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const startIndex = (page - 1) * 20;
    const endIndex = startIndex + 20;
    const newImages = imageDatabase.slice(startIndex, endIndex);
    
    if (newImages.length > 0) {
      setImages(prev => [...prev, ...newImages]);
      setPage(prev => prev + 1);
    }
    
    if (endIndex >= imageDatabase.length) {
      setHasMore(false);
    }
    
    setLoading(false);
  }, [page, loading, hasMore, imageDatabase]);

  // Ref para el último elemento
  const lastImageElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreImages();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMoreImages]);

  // Cargar imágenes iniciales
  useEffect(() => {
    loadMoreImages();
  }, []);

  // Filtros de categoría
  const [activeFilter, setActiveFilter] = useState('Todas');
  const categories = ['Todas', 'Paisajes', 'Acción', 'Capturas', 'Equipos'];

  const filteredImages = activeFilter === 'Todas' 
    ? images 
    : images.filter(img => img.category === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-600/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-cyan-600/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative z-10 pt-20 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Navegación */}
            <div className="flex items-center justify-between mb-8">
              <a href="/" className="inline-flex items-center text-emerald-300 hover:text-emerald-200 transition-colors group">
                <svg className="w-5 h-5 mr-2 transform transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver al inicio
              </a>
              
              <div className="flex space-x-4">
                <a href="/testimonios" className="text-gray-300 hover:text-emerald-300 transition-colors">
                  Testimonios
                </a>
                <a href="/#contacto" className="text-gray-300 hover:text-emerald-300 transition-colors">
                  Contacto
                </a>
              </div>
            </div>
            
            {/* Título */}
            <div className="text-center">
              <NavigationButton to="/" label="Volver al inicio" />
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  Galería de Experiencias
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
                Descubre la belleza de la Patagonia a través de nuestra colección de momentos capturados durante las expediciones de pesca.
              </p>
              
              {/* Estadísticas */}
              <div className="flex flex-wrap justify-center gap-8 text-center">
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 border border-white/20">
                  <div className="text-2xl font-bold text-emerald-300">{images.length}</div>
                  <div className="text-sm text-gray-400">Imágenes Cargadas</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 border border-white/20">
                  <div className="text-2xl font-bold text-cyan-300">{categories.length - 1}</div>
                  <div className="text-sm text-gray-400">Categorías</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 border border-white/20">
                  <div className="text-2xl font-bold text-teal-300">{imageDatabase.length}</div>
                  <div className="text-sm text-gray-400">Total Disponibles</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeFilter === category
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Galería con Masonry Layout */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-max">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                ref={index === filteredImages.length - 1 ? lastImageElementRef : null}
                className="group cursor-pointer transform transition-all duration-500 hover:scale-105 animate-fadeInUp"
                style={{
                  animationDelay: `${(index % 20) * 50}ms`,
                  animationFillMode: 'both'
                }}
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-shadow duration-500">
                  <div className={`${index % 3 === 0 ? 'aspect-[4/5]' : index % 5 === 0 ? 'aspect-square' : 'aspect-[3/4]'}`}>
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-lg mb-1">{image.alt}</h3>
                      <span className="inline-block px-3 py-1 bg-emerald-500/80 rounded-full text-xs text-white font-medium">
                        {image.category}
                      </span>
                    </div>
                  </div>

                  {/* Efecto de zoom */}
                  <div className="absolute top-4 right-4 bg-black/50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Spinner de carga */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full opacity-80 animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {/* Mensaje de fin */}
          {!hasMore && !loading && (
            <div className="text-center py-16">
              <div className="inline-flex items-center px-6 py-3 bg-white/10 rounded-full backdrop-blur-md">
                <svg className="w-5 h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 font-medium">Has visto todas nuestras experiencias</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal de imagen ampliada */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md rounded-xl p-4">
              <h3 className="text-white font-semibold text-xl mb-2">{selectedImage.alt}</h3>
              <span className="inline-block px-3 py-1 bg-emerald-500 rounded-full text-sm text-white font-medium">
                {selectedImage.category}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante de WhatsApp */}
      <WhatsAppButton />
    </div>
  );
}
