import { AuthRepository } from '../../../infrastructure/supabase/repositories/AuthRepository';

export async function resetPassword(email: string) {
  return AuthRepository.resetPassword(email);
}
