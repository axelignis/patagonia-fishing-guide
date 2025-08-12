import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ImageService } from '../services/imageService';
import type { ImageUpload } from '../types';

interface ImageUploaderProps {
  label: string;
  currentImageUrl?: string | null;
  onImageUploaded: (imageUrl: string) => void;
  bucket: 'avatars' | 'hero-images';
  userId: string;
  maxWidth?: number;
  maxHeight?: number;
  className?: string;
  aspectRatio?: 'square' | 'wide' | 'auto';
  /** Altura mínima del área de upload (px). Default 200 */
  minHeight?: number;
}

export function ImageUploader({
  label,
  currentImageUrl,
  onImageUploaded,
  bucket,
  userId,
  maxWidth = 800,
  maxHeight = 600,
  className = '',
  aspectRatio = 'auto',
  minHeight = 200
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validar archivo
    const validation = ImageService.validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Archivo no válido');
      return;
    }

    try {
      setUploading(true);

      // Crear preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Redimensionar imagen si es necesario
      let fileToUpload = file;
      if (file.size > 1024 * 1024) { // Si es mayor a 1MB, redimensionar
        fileToUpload = await ImageService.resizeImage(file, maxWidth, maxHeight);
      }

      // Subir imagen
      const imageUrl = await ImageService.uploadImage({
        bucket,
        userId,
        file: fileToUpload
      });

      // Actualizar perfil
      const imageType = bucket === 'avatars' ? 'avatar_url' : 'hero_image_url';
      await ImageService.updateProfileImageUrl(userId, imageType, imageUrl);

      // Notificar éxito
      onImageUploaded(imageUrl);
      setPreview(null);

    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Error al subir imagen');
      setPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'wide':
        return 'aspect-[16/9]';
      default:
        return '';
    }
  };

  const displayImage = preview || currentImageUrl;

  // Si no hay userId todavía, mostrar placeholder deshabilitado
  if (!userId) {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-xs text-gray-400">
          Cargando usuario...
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Área de upload */}
    <div className={`relative border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors hover:border-blue-400 ${getAspectRatioClass()}`} style={{ minHeight }}>
        {displayImage ? (
          // Mostrar imagen actual o preview
      <div className="relative w-full h-full">
            <img
              src={displayImage}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            
            {/* Overlay con botones */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Cambiar
              </button>
              
              {preview && (
                <button
                  type="button"
                  onClick={handleRemovePreview}
                  disabled={uploading}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Indicador de carga */}
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-sm font-medium">Subiendo...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Área de drop/click para subir
          <div 
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-500 text-center mb-2">
              Haz clic para subir una imagen
            </p>
            <p className="text-xs text-gray-400 text-center">
              PNG, JPG, WebP hasta {bucket === 'avatars' ? '5MB' : '10MB'}
            </p>
          </div>
        )}

        {/* Input oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Ayuda */}
      <div className="text-xs text-gray-500">
        <p>• Formatos soportados: JPEG, PNG, WebP</p>
        <p>• Tamaño máximo: {bucket === 'avatars' ? '5MB' : '10MB'}</p>
        <p>• Se redimensionará automáticamente si es necesario</p>
      </div>
    </div>
  );
}
