import React from 'react';

export default function VantaCalmSea() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Fondo base similar a testimonios */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900" />
      
      {/* Efectos de fondo sutiles como en testimonios */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-600/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-cyan-600/10 to-transparent rounded-full blur-3xl"></div>
      
      {/* Montañas de fondo con contraste sutil */}
      <svg className="absolute bottom-0 w-full h-3/4" viewBox="0 0 1920 800" preserveAspectRatio="xMidYMax slice">
        {/* Montaña lejana */}
        <path 
          d="M0,600 L600,350 L1200,400 L1920,380 L1920,800 L0,800 Z" 
          fill="rgba(71, 85, 105, 0.3)" 
        />
        
        {/* Montaña cercana */}
        <path 
          d="M0,700 L800,450 L1400,500 L1920,480 L1920,800 L0,800 Z" 
          fill="rgba(55, 65, 81, 0.4)" 
        />
      </svg>
      
      {/* Extensión hacia abajo para conectar con testimonios */}
      <div className="absolute bottom-0 w-full h-20 bg-gradient-to-b from-transparent to-slate-900/50" style={{ bottom: '-80px' }}></div>
      
      {/* Montañas extendidas que se ven en la siguiente sección */}
      <svg className="absolute w-full h-20" style={{ bottom: '-80px' }} viewBox="0 0 1920 100" preserveAspectRatio="xMidYMax slice">
        <path 
          d="M0,0 L600,0 L1200,20 L1920,15 L1920,100 L0,100 Z" 
          fill="rgba(71, 85, 105, 0.2)" 
        />
        
        <path 
          d="M0,30 L800,10 L1400,25 L1920,20 L1920,100 L0,100 Z" 
          fill="rgba(55, 65, 81, 0.25)" 
        />
      </svg>
    </div>
  );
}
