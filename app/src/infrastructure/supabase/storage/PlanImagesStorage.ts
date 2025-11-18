import { supabase } from '../client';
import * as FileSystem from 'expo-file-system';

export async function uploadPlanImage(planId: string, uri: string) {
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) throw new Error('Archivo no existe');
  if ((info.size ?? 0) > 5_000_000) throw new Error('Archivo > 5MB');
  const ext = uri.split('.').pop()?.toLowerCase();
  if (!['jpg', 'jpeg', 'png'].includes(ext ?? '')) throw new Error('Formato no permitido');

  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
  const path = `plans/${planId}.${ext}`;
  const { error } = await supabase.storage
    .from('planes-imagenes')
    .upload(path, Buffer.from(base64, 'base64'), {
      contentType: ext === 'png' ? 'image/png' : 'image/jpeg',
      upsert: true,
    });
  if (error) throw error;

  const { data } = supabase.storage.from('planes-imagenes').getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteOldImage(oldUrl?: string) {
  if (!oldUrl) return;
  const start = oldUrl.indexOf('/object/public/');
  const relative = oldUrl.substring(start + '/object/public/'.length);
  const parts = relative.split('/');
  const bucket = parts[0]; // planes-imagenes
  const key = parts.slice(1).join('/');
  await supabase.storage.from(bucket).remove([key]);
}
