import React from 'react';
import sponsorsData from '../data/sponsors.json';

export const SponsorsSection: React.FC = () => {
  return (
    <section className="py-16 bg-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Nuestros Aliados
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Colaboramos con las mejores marcas y empresas de la Patagonia para ofrecerte 
            una experiencia de pesca excepcional y equipamiento de primera calidad.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {sponsorsData.map((sponsor) => (
            <div 
              key={sponsor.id}
              className="group flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
            >
              <div className="w-24 h-24 mb-4 flex items-center justify-center bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling!.textContent = sponsor.name;
                  }}
                />
                <span className="text-sm font-semibold text-slate-600 text-center hidden">
                  {sponsor.name}
                </span>
              </div>
              
              <h3 className="text-sm font-semibold text-slate-800 text-center mb-1">
                {sponsor.name}
              </h3>
              
              <span className="text-xs text-blue-600 font-medium mb-2">
                {sponsor.category}
              </span>
              
              <p className="text-xs text-slate-500 text-center line-clamp-2">
                {sponsor.description}
              </p>
              
              {sponsor.website && (
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  Visitar sitio →
                </a>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-slate-500 text-sm">
            ¿Interesado en ser nuestro aliado?{' '}
            <a 
              href="/contacto" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
