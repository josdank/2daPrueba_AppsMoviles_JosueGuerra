import { PlansRepository } from '../../../infrastructure/supabase/repositories/PlansRepository';
import type { Plan } from '../../../domain/entities/Plan';

export async function updatePlan(id: string, partial: Partial<Plan>) {
  return PlansRepository.update(id, partial);
}
