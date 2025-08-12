import { getSupabaseClient } from './supabase';
import type { UploadImageOptions } from '../types';

/**
 * Servicio para manejo de imágenes en Supabase Storage
 */
export class ImageService {
  /**
   * Sube una imagen a Supabase Storage
   */
  static async uploadImage({ bucket, userId, file }: UploadImageOptions): Promise<string> {
    try {
      const supabase = getSupabaseClient();
      
      // Generar nombre único para el archivo
      const fileExtension = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${userId}/image_${timestamp}.${fileExtension}`;

      // Eliminar imagen anterior si existe
      await this.deleteExistingImage(bucket, userId);

      // Subir nueva imagen
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Error uploading image:', error);
        throw new Error(`Error al subir imagen: ${error.message}`);
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    }
  }

  /**
   * Elimina imagen existente del usuario
   */
  private static async deleteExistingImage(bucket: string, userId: string): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      
      // Listar archivos existentes del usuario
      const { data: files, error } = await supabase.storage
        .from(bucket)
        .list(userId);

      if (error) {
        console.warn('Error listing existing files:', error);
        return;
      }

      if (files && files.length > 0) {
        // Eliminar archivos existentes
        const filesToDelete = files.map((file: any) => `${userId}/${file.name}`);
        const { error: deleteError } = await supabase.storage
          .from(bucket)
          .remove(filesToDelete);

        if (deleteError) {
          console.warn('Error deleting existing files:', deleteError);
        }
      }
    } catch (error) {
      console.warn('Error in deleteExistingImage:', error);
    }
  }

  /**
   * Valida el archivo de imagen
   */
  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Formato no válido. Solo se permiten archivos JPEG, PNG y WebP.'
      };
    }

    // Validar tamaño (5MB para avatar, 10MB para hero)
    const maxSize = 5 * 1024 * 1024; // 5MB por defecto
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `El archivo es demasiado grande. Máximo ${maxSize / (1024 * 1024)}MB permitidos.`
      };
    }

    return { isValid: true };
  }

  /**
   * Redimensiona imagen usando Canvas API
   */
  static async resizeImage(
    file: File, 
    maxWidth: number, 
    maxHeight: number, 
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspect ratio
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir a blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Error al redimensionar imagen'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Error al cargar imagen'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Actualiza URL de imagen en el perfil del usuario
   */
  static async updateProfileImageUrl(
    userId: string, 
    imageType: 'avatar_url' | 'hero_image_url', 
    imageUrl: string
  ): Promise<void> {
    const supabase = getSupabaseClient();
    
    // La relación estable usa user_id como referencia al auth.user
    const { error } = await supabase
      .from('user_profiles')
      .update({ [imageType]: imageUrl })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating profile image URL:', error);
      throw new Error(`Error al actualizar ${imageType}: ${error.message}`);
    }
  }
}
