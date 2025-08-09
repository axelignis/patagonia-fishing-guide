import React from 'react';

export default function Footer(): JSX.Element {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-gray-300 border-t border-white/10">
      {/* Accent top border */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 opacity-60" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent tracking-tight">
              Patagonia Fishing Guide
            </h3>
            <p className="mt-4 text-sm text-gray-300 leading-relaxed">
              Conecta con guías expertos y vive experiencias de pesca inolvidables en los lagos y ríos patagónicos.
            </p>
          </div>

          {/* Navegación */}
          <nav aria-label="Footer Navigation" className="grid grid-cols-2 gap-6 sm:col-span-1 lg:col-span-2">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300">Explora</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a className="hover:text-emerald-300 transition-colors" href="/">Inicio</a></li>
                <li><a className="hover:text-emerald-300 transition-colors" href="/guias">Guías</a></li>
                <li><a className="hover:text-emerald-300 transition-colors" href="/galeria">Galería</a></li>
                <li><a className="hover:text-emerald-300 transition-colors" href="/testimonios">Testimonios</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-300">Servicios</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a className="hover:text-cyan-300 transition-colors" href="/marketplace">Marketplace</a></li>
                <li><a className="hover:text-cyan-300 transition-colors" href="/guia-practica">Guía práctica</a></li>
                <li><a className="hover:text-cyan-300 transition-colors" href="/reservar/1">Reservar</a></li>
              </ul>
            </div>
          </nav>

          {/* Contacto / Social */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300">Contacto</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="mailto:info@patagoniafishing.com" className="inline-flex items-center gap-2 hover:text-emerald-300 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2 4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4zm2 0v.01L12 13l8-8.99V4H4zm16 2.41l-7.29 7.3a1 1 0 0 1-1.42 0L4 6.41V20h16V6.41z"/></svg>
                  info@patagoniafishing.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/5490000000000" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-cyan-300 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.18 1.6 6.02L0 24l6.18-1.62A12.07 12.07 0 0 0 12 24c6.63 0 12-5.37 12-12c0-3.21-1.25-6.23-3.48-8.52zM12 22c-1.85 0-3.63-.5-5.18-1.44l-.37-.22l-3.67.96l.98-3.58l-.24-.37A9.98 9.98 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10s-4.48 10-10 10z"/></svg>
                  WhatsApp
                </a>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform text-emerald-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.25a5.25 5.25 0 1 1-5.25 5.25a5.25 5.25 0 0 1 5.25-5.25zm0 1.5a3.75 3.75 0 1 0 3.75 3.75a3.75 3.75 0 0 0-3.75-3.75zm5.25 1.25a1 1 0 1 1-2 0a1 1 0 0 1 2 0z"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform text-cyan-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 2.1c-3.9 0-7 3.1-7 7v2H7v4h3v8h4v-8h3l1-4h-4V9c0-1.1.9-2 2-2h2V3.1c-.7-.1-1.4-.2-2-.2z"/></svg>
              </a>
              <a href="mailto:info@patagoniafishing.com" className="hover:scale-110 transition-transform text-teal-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M2 4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4zm2 0v.01L12 13l8-8.99V4H4zm16 2.41l-7.29 7.3a1 1 0 0 1-1.42 0L4 6.41V20h16V6.41z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} Patagonia Fishing Guide. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-3">
            <a className="hover:text-emerald-300" href="#como-funciona">Cómo funciona</a>
            <span className="text-white/20">•</span>
            <a className="hover:text-cyan-300" href="/marketplace">Servicios</a>
          </div>
        </div>
      </div>
    </footer>
  );
}


