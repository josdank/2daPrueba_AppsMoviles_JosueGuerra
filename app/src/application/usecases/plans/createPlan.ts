import { PlansRepository } from '../../../infrastructure/supabase/repositories/PlansRepository';
import type { Plan } from '../../../domain/entities/Plan';

export async function createPlan(plan: Omit<Plan, 'id' | 'activo'> & { activo?: boolean }) {
  return PlansRepository.create(plan);
}
