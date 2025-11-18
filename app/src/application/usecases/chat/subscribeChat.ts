// src/application/usecases/chat/subscribeChat.ts
import { ChatRepository } from '../../../infrastructure/supabase/repositories/ChatRepository';
import type { ChatMessage } from '../../../domain/entities/ChatMessage';

export function listMessages(contratacionId: string) {
  return ChatRepository.listMessages(contratacionId);
}

export function subscribeChat(contratacionId: string, callback: (message: ChatMessage) => void) {
  return ChatRepository.subscribe(contratacionId, callback);
}
