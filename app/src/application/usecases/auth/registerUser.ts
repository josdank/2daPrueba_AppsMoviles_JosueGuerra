// src/application/usecases/auth/registerUser.ts
import { AuthRepository } from '../../../infrastructure/supabase/repositories/AuthRepository';

export async function registerUser(email: string, password: string, nombre?: string) {
  return AuthRepository.register(email, password, nombre);
}
