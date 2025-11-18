import { AuthRepository } from '../../../infrastructure/supabase/repositories/AuthRepository';

export async function loginUser(email: string, password: string) {
  return AuthRepository.login(email, password);
}
