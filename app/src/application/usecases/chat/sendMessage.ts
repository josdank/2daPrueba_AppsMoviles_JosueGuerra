// src/application/usecases/chat/sendMessage.ts
import { ChatRepository } from '../../../infrastructure/supabase/repositories/ChatRepository';

export async function sendMessage(contratacionId: string, contenido: string) {
  return ChatRepository.send(contratacionId, contenido);
}
