import { ContractsRepository } from '../../../infrastructure/supabase/repositories/ContractsRepository';

export async function listUserContracts() {
  return ContractsRepository.listMine();
}
