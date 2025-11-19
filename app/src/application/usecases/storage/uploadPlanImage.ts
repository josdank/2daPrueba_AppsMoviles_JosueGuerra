// src/application/usecases/storage/uploadPlanImage.ts
import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from '../../../infrastructure/supabase/client';

const BUCKET = 'planes-imagenes';
const MAX_BYTES = 5 * 1024 * 1024;

function guessContentType(uri: string) {
  const ext = (uri.split('.').pop() || '').toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
}

export async function uploadPlanImage(nombre: string, uri: string): Promise<string> {
  // Validar existencia/tamaño
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) throw new Error('Archivo de imagen no encontrado');
  if (info.size && info.size > MAX_BYTES) {
    throw new Error('La imagen supera el tamaño máximo permitido (5 MB)');
  }

  // Nombre seguro y único
  const safeName = nombre.replace(/[^a-zA-Z0-9-_]/g, '_').toLowerCase();
  const timestamp = Date.now();
  const contentType = guessContentType(uri);
  const ext = contentType.split('/')[1] || 'jpg';
  const fileName = `${safeName}_${timestamp}.${ext}`;

  // Obtener bytes como ArrayBuffer (en RN funciona, a diferencia de blob)
  const res = await fetch(uri);
  const arrayBuffer = await res.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuffer);

  // Subir al bucket
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, uint8, {
      contentType,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Error al subir imagen: ${uploadError.message}`);
  }

  // URL pública
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  if (!data?.publicUrl) {
    throw new Error('No se pudo obtener la URL pública de la imagen');
  }

  return data.publicUrl;
}
