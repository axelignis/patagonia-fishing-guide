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
  static validateImageFile(file: File, options?: { maxSizeMB?: number }): { isValid: boolean; error?: string } {
    const { maxSizeMB = 5 } = options || {};
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Formato no válido. Solo se permiten archivos JPEG, PNG y WebP.' };
    }
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { isValid: false, error: `El archivo es demasiado grande. Máximo ${maxSizeMB}MB permitidos.` };
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

    // Sincronizar también con columnas legacy en guides (avatar_url / cover_url) para mantener compatibilidad
    // cover_url se usaba como "hero" en varias vistas antiguas.
    try {
      if (imageType === 'avatar_url') {
        await supabase
          .from('guides')
          .update({ avatar_url: imageUrl })
          .eq('user_id', userId);
      } else {
        // hero_image_url => guides.cover_url (legacy)
        await supabase
          .from('guides')
          .update({ cover_url: imageUrl })
          .eq('user_id', userId);
      }
    } catch (e) {
      // No bloquear flujo si falla (puede ser RLS en estado transitorio); solo log
      console.warn('Sync guides legacy image fields fallo:', (e as any)?.message);
    }
  }

  /** Elimina imagen (avatar o hero) y limpia campo en user_profiles */
  static async removeProfileImage(userId: string, imageType: 'avatar_url' | 'hero_image_url'): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      // Listar carpeta y eliminar todo
      const bucket = imageType === 'avatar_url' ? 'avatars' : 'hero-images';
      const { data: files } = await supabase.storage.from(bucket).list(userId);
      if (files && files.length > 0) {
        await supabase.storage.from(bucket).remove(files.map(f => `${userId}/${f.name}`));
      }
      await supabase.from('user_profiles').update({ [imageType]: null }).eq('user_id', userId);
    } catch (e) {
      console.warn('removeProfileImage error', (e as any)?.message);
      throw e;
    }
  }
}
