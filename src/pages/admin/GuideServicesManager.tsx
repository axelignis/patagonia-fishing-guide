import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { listServicesByGuide, upsertService, deleteService } from '../../services/guides';
import { NavigationButton } from '../../components/NavigationButton';
import { Tables } from '../../services/supabase';

type Service = Tables['guide_services']['Row'];

export default function GuideServicesManager(): JSX.Element {
  const { id: guideId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    description: '',
    duration: '',
    difficulty: 'Principiante',
    max_people: 1,
    price: 0,
    includes: []
  });

  // Query para obtener servicios
  const { data: services, isLoading } = useQuery(
    ['guide-services', guideId],
    () => listServicesByGuide(guideId!),
    { enabled: !!guideId }
  );

  // Mutation para crear/actualizar servicio
  const upsertMutation = useMutation(
    (serviceData: Partial<Service>) => upsertService({ ...serviceData, guide_id: guideId! }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['guide-services', guideId]);
        resetForm();
      },
      onError: (error: any) => {
        alert(`Error: ${error?.message || 'No se pudo guardar el servicio'}`);
      }
    }
  );

  // Mutation para eliminar servicio
  const deleteMutation = useMutation(
    (serviceId: string) => deleteService(serviceId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['guide-services', guideId]);
      },
      onError: (error: any) => {
        alert(`Error: ${error?.message || 'No se pudo eliminar el servicio'}`);
      }
    }
  );

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      difficulty: 'Principiante',
      max_people: 1,
      price: 0,
      includes: []
    });
    setIsEditing(null);
    setShowForm(false);
  };

  const handleEdit = (service: Service) => {
    setFormData({
      id: service.id,
      title: service.title,
      description: service.description || '',
      duration: service.duration || '',
      difficulty: service.difficulty || 'Principiante',
      max_people: service.max_people || 1,
      price: service.price || 0,
      includes: service.includes || []
    });
    setIsEditing(service.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert('El título es obligatorio');
      return;
    }
    upsertMutation.mutate(formData);
  };

  const handleDelete = (serviceId: string, title: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el servicio "${title}"?`)) {
      deleteMutation.mutate(serviceId);
    }
  };

  const handleIncludesChange = (value: string) => {
    const includesArray = value.split('\n').filter(item => item.trim() !== '');
    setFormData({ ...formData, includes: includesArray });
  };

  if (!guideId) {
    return <div className="text-red-600">ID de guía no válido</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <NavigationButton to={`/admin/guides/${guideId}`} label="← Volver al guía" />
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Servicios del Guía</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:scale-[1.02] transition"
          >
            + Nuevo Servicio
          </button>
        </div>

        {/* Formulario de servicio */}
        {showForm && (
          <div className="bg-white/90 rounded-2xl p-6 shadow-2xl mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              {isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Título *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duración</label>
                  <input
                    type="text"
                    placeholder="ej: 4 horas, Día completo"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Dificultad</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    value={formData.difficulty || 'Principiante'}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                  >
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Máx. personas</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    value={formData.max_people || 1}
                    onChange={(e) => setFormData({ ...formData, max_people: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Precio (CLP)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Incluye (uno por línea)
                </label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  rows={4}
                  placeholder="Transporte&#10;Almuerzo&#10;Equipo de pesca"
                  value={formData.includes?.join('\n') || ''}
                  onChange={(e) => handleIncludesChange(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={upsertMutation.isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl hover:scale-[1.02] transition disabled:opacity-50"
                >
                  {upsertMutation.isLoading ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de servicios */}
        <div className="bg-white/90 rounded-2xl p-6 shadow-2xl">
          {isLoading ? (
            <div className="text-center py-8 text-slate-600">Cargando servicios...</div>
          ) : services?.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              No hay servicios registrados.
              <button
                onClick={() => setShowForm(true)}
                className="block mx-auto mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Crear primer servicio
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {services?.map((service) => (
                <div key={service.id} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-slate-800 text-lg">{service.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          service.difficulty === 'Principiante' ? 'bg-green-100 text-green-800' :
                          service.difficulty === 'Intermedio' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {service.difficulty}
                        </span>
                      </div>
                      
                      {service.description && (
                        <p className="text-slate-600 mb-3">{service.description}</p>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {service.duration && (
                          <div>
                            <span className="font-medium text-slate-700">Duración:</span>
                            <div className="text-slate-600">{service.duration}</div>
                          </div>
                        )}
                        {service.max_people && (
                          <div>
                            <span className="font-medium text-slate-700">Máx. personas:</span>
                            <div className="text-slate-600">{service.max_people}</div>
                          </div>
                        )}
                        {service.price && (
                          <div>
                            <span className="font-medium text-slate-700">Precio:</span>
                            <div className="text-slate-600">${service.price.toLocaleString()} CLP</div>
                          </div>
                        )}
                      </div>
                      
                      {service.includes && service.includes.length > 0 && (
                        <div className="mt-3">
                          <span className="font-medium text-slate-700">Incluye:</span>
                          <ul className="list-disc list-inside text-slate-600 text-sm mt-1">
                            {service.includes.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(service)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(service.id, service.title)}
                        disabled={deleteMutation.isLoading}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
