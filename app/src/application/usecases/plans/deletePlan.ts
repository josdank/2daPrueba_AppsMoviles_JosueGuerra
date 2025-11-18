// src/application/usecases/plans/deletePlan.ts
import { PlansRepository } from '../../../infrastructure/supabase/repositories/PlansRepository';

export async function deletePlan(id: string) {
  return PlansRepository.remove(id);
}
