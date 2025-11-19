import { supabase } from "../../../infrastructure/supabase/client";
export function subscribeTyping(contratacionId: string, onTyping: (payload: any) => void) {
  return supabase.channel(`typing:${contratacionId}`).on('broadcast', { event: 'typing' }, (p) => onTyping(p.payload)).subscribe();
}
export async function emitTyping(contratacionId: string, isTyping: boolean) {
  await supabase.channel(`typing:${contratacionId}`).send({ type: 'broadcast', event: 'typing', payload: { isTyping } });
}
