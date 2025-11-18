// src/infrastructure/notifications/Notifications.ts
import * as Notifications from 'expo-notifications';
import { supabase } from '../supabase/client';

export async function registerForPush() {
  const settings = await Notifications.getPermissionsAsync();
  let status = settings.status;
  if (status !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  if (status !== 'granted') return null;

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  const { data: { user } } = await supabase.auth.getUser();
  if (user) await supabase.from('perfiles').update({ push_token: token }).eq('id', user.id);
  return token;
}
