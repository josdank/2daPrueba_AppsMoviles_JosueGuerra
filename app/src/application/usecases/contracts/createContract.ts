import { ContractsRepository } from '../../../infrastructure/supabase/repositories/ContractsRepository';

export async function createContract(planId: string) {
  return ContractsRepository.create(planId);
}
