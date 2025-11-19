import { PlansRepository } from '../../../infrastructure/supabase/repositories/PlansRepository';

export async function listActivePlans() {
  return PlansRepository.listActive();
}
