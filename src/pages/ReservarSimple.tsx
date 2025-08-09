import React from 'react';
import { useParams } from 'react-router-dom';

const ReservarSimple: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    
    console.log('ReservarSimple component rendered with id:', id);
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-white mb-8">Reservar con Guía {id}</h1>
                <div className="bg-white rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Página de Reservas Funcionando</h2>
                    <p className="text-slate-600">
                        Esta es la página de reservas para el guía con ID: <strong>{id}</strong>
                    </p>
                    <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p className="text-emerald-700">
                            ✅ El componente React se está renderizando correctamente
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservarSimple;
