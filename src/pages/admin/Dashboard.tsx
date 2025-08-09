import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Administración</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/guides" className="bg-white/90 rounded-2xl p-6 shadow-2xl hover:scale-[1.01] transition">
            <div className="text-slate-800 font-bold text-xl mb-2">Guías</div>
            <div className="text-slate-600">Crear, editar y eliminar guías</div>
          </Link>
          <Link to="/mi-cuenta" className="bg-white/90 rounded-2xl p-6 shadow-2xl hover:scale-[1.01] transition">
            <div className="text-slate-800 font-bold text-xl mb-2">Panel del Guía</div>
            <div className="text-slate-600">Editar perfil y disponibilidad</div>
          </Link>
        </div>
      </div>
    </div>
  );
}


