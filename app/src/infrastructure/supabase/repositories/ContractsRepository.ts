import { supabase } from '../client';
import type { Contract } from '../../../domain/entities/Plan';
export const ContractsRepository = {
  async create(planId: string): Promise<Contract> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No auth');
    const { data, error } = await supabase
      .from('contrataciones')
      .insert({ plan_id: planId, user_id: user.id })
      .select()
      .single();
    if (error) throw error;
    return data as Contract;
  },

  async listMine(): Promise<Contract[]> {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('contrataciones')
      .select('id, estado, created_at, plan_id, user_id')
      .eq('user_id', user?.id);
    if (error) throw error;
    return data as Contract[];
  },

  async listPending(): Promise<any[]> {
    const { data, error } = await supabase
      .from('contrataciones')
      .select('id, estado, created_at, planes_moviles(nombre_comercial), perfiles(email)')
      .eq('estado', 'pendiente');
    if (error) throw error;
    return data ?? [];
  },

  async updateEstado(id: string, estado: 'pendiente'|'aprobado'|'rechazado'): Promise<Contract> {
    const { data, error } = await supabase
      .from('contrataciones')
      .update({ estado })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Contract;
  },
};
