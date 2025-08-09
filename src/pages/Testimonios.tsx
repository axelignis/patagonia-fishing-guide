import React, { useState } from 'react';
import { NavigationButton } from '../components/NavigationButton';
import { Star, Quote, CheckCircle, Camera } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';

export default function Testimonios() {
  const testimoniosData = [
    {
      id: 1,
      nombre: "Juan P.",
      ciudad: "Buenos Aires",
      imagen: "/images/pexels-cottonbro-4830248.jpg",
      testimonio: "Una experiencia inolvidable, la Patagonia es mágica y el guía hizo todo perfecto. Los paisajes son de otro mundo.",
      rating: 5,
      fecha: "Marzo 2024",
      servicio: "Pesca con Mosca",
      color: "emerald"
    },
    {
      id: 2,
      nombre: "María L.",
      ciudad: "Córdoba",
      imagen: "/images/pexels-gasparzaldo-11250845.jpg",
      testimonio: "Pescar en estos paisajes fue un sueño hecho realidad. ¡La atención al detalle es increíble! Volveré sin dudas.",
      rating: 5,
      fecha: "Febrero 2024",
      servicio: "Expedición de Pesca",
      color: "cyan"
    },
    {
      id: 3,
      nombre: "Carlos R.",
      ciudad: "Mendoza",
      imagen: "/images/hombre-pescando-en-el-rio.jpg",
      testimonio: "Profesionalismo de primera. Conoce cada rincón y sabe exactamente dónde están los mejores peces. Recomendado 100%",
      rating: 5,
      fecha: "Enero 2024",
      servicio: "Guía Personalizada",
      color: "teal"
    },
    {
      id: 4,
      nombre: "Ana S.",
      ciudad: "Rosario",
      imagen: "/images/pexels-martin-que-243128669-30179791.jpg",
      testimonio: "Mi primera vez pescando con mosca y no pudo haber sido mejor. El guía me enseñó todo con mucha paciencia y capturé mi primera trucha.",
      rating: 5,
      fecha: "Abril 2024",
      servicio: "Curso de Pesca con Mosca",
      color: "purple"
    },
    {
      id: 5,
      nombre: "Roberto M.",
      ciudad: "La Plata",
      imagen: "/images/hombre-mayor-pesca-por-un-lago.jpg",
      testimonio: "Años pescando y nunca había tenido una experiencia tan completa. La combinación de paisajes, técnica y resultados fue perfecta.",
      rating: 5,
      fecha: "Diciembre 2023",
      servicio: "Expedición Avanzada",
      color: "blue"
    },
    {
      id: 6,
      nombre: "Lucía F.",
      ciudad: "Santa Fe",
      imagen: "/images/pexels-arch-1165125.jpg",
      testimonio: "Vinimos en familia y todos pudimos disfrutar. El guía adaptó la experiencia para que mis hijos de 12 y 15 años también participaran.",
      rating: 5,
      fecha: "Noviembre 2023",
      servicio: "Pesca Familiar",
      color: "green"
    },
    {
      id: 7,
      nombre: "Diego A.",
      ciudad: "Tucumán",
      imagen: "/images/pexels-lum3n-44775-294674.jpg",
      testimonio: "La organización fue impecable desde el primer contacto. Transporte, equipos, comida, todo de primera calidad.",
      rating: 5,
      fecha: "Octubre 2023",
      servicio: "Paquete Completo",
      color: "indigo"
    },
    {
      id: 8,
      nombre: "Patricia L.",
      ciudad: "Salta",
      imagen: "/images/pexels-szafran-18894390.jpg",
      testimonio: "Como fotógrafa, quedé maravillada con los lugares que visitamos. Las truchas fueron un bonus, pero los paisajes... increíbles.",
      rating: 5,
      fecha: "Septiembre 2023",
      servicio: "Tour Fotográfico + Pesca",
      color: "pink"
    },
    {
      id: 9,
      nombre: "Martín K.",
      ciudad: "Neuquén",
      imagen: "/images/pexels-pixabay-39854.jpg",
      testimonio: "Local de la zona, pero nunca había pescado con un guía profesional. Descubrí lugares que no conocía y técnicas nuevas.",
      rating: 5,
      fecha: "Agosto 2023",
      servicio: "Guía Técnica Local",
      color: "orange"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      emerald: "border-emerald-400/50 text-emerald-300",
      cyan: "border-cyan-400/50 text-cyan-300",
      teal: "border-teal-400/50 text-teal-300",
      purple: "border-purple-400/50 text-purple-300",
      blue: "border-blue-400/50 text-blue-300",
      green: "border-green-400/50 text-green-300",
      indigo: "border-indigo-400/50 text-indigo-300",
      pink: "border-pink-400/50 text-pink-300",
      orange: "border-orange-400/50 text-orange-300"
    };
    return colors[color] || "border-emerald-400/50 text-emerald-300";
  };

  const getStarColor = (color: string) => {
    const colors: { [key: string]: string } = {
      emerald: "text-emerald-400",
      cyan: "text-cyan-400",
      teal: "text-teal-400",
      purple: "text-purple-400",
      blue: "text-blue-400",
      green: "text-green-400",
      indigo: "text-indigo-400",
      pink: "text-pink-400",
      orange: "text-orange-400"
    };
    return colors[color] || "text-emerald-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-600/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-cyan-600/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative z-10 pt-20 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <NavigationButton to="/" label="Volver al inicio" />
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Testimonios
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Descubre las experiencias de nuestros clientes en la Patagonia
            </p>
          </div>
        </div>
      </div>

      {/* Testimonios Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimoniosData.map((testimonio) => (
              <div key={testimonio.id} className="group h-full">
                <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col">
                  {/* Header del testimonio */}
                  <div className="flex items-center mb-6">
                    <img 
                      src={testimonio.imagen} 
                      alt={testimonio.nombre} 
                      className={`w-16 h-16 rounded-full object-cover border-4 ${getColorClasses(testimonio.color).split(' ')[0]}`} 
                    />
                    <div className="ml-4 flex-grow">
                      <h4 className={`font-bold text-lg ${getColorClasses(testimonio.color).split(' ')[1]}`}>
                        {testimonio.nombre}
                      </h4>
                      <p className="text-gray-300 text-sm">{testimonio.ciudad}</p>
                      <p className="text-gray-400 text-xs">{testimonio.fecha}</p>
                    </div>
                  </div>

                  {/* Servicio */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300 font-medium">
                      {testimonio.servicio}
                    </span>
                  </div>

                  {/* Testimonio */}
                  <p className="text-gray-200 text-lg leading-relaxed italic flex-grow mb-6">
                    "{testimonio.testimonio}"
                  </p>

                  {/* Rating */}
                  <div className="flex">
                    {[...Array(testimonio.rating)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${getStarColor(testimonio.color)} fill-current`} viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              ¿Listo para tu próxima aventura?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Únete a estos pescadores satisfechos y vive tu propia experiencia inolvidable en la Patagonia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/#contacto" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-full shadow-lg hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105">
              Reservar Experiencia
            </a>
            <a href="/" className="inline-flex items-center px-8 py-4 border-2 border-emerald-400 text-emerald-300 font-semibold rounded-full hover:bg-emerald-400 hover:text-slate-900 transition-all duration-300">
              Ver Servicios
            </a>
          </div>
        </div>
      </section>

      {/* Botón flotante de WhatsApp */}
      <WhatsAppButton />
    </div>
  );
}
