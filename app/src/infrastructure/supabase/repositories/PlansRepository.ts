import { supabase } from '../client';
import type { Plan } from '../../../domain/entities/Plan';

export const PlansRepository = {
  async listActive(): Promise<Plan[]> {
    const { data, error } = await supabase
      .from('planes_moviles')
      .select('*')
      .eq('activo', true)
      .order('precio', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async listAll(): Promise<Plan[]> {
    const { data, error } = await supabase
      .from('planes_moviles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async create(plan: Omit<Plan,'id'|'activo'> & { activo?: boolean }) {
    const { data: { user } } = await supabase.auth.getUser();
    const payload = { ...plan, activo: plan.activo ?? true, created_by: user?.id };
    const { data, error } = await supabase.from('planes_moviles').insert(payload).select().single();
    if (error) throw error;
    return data as Plan;
  },

  async update(id: string, partial: Partial<Plan>) {
    const { data, error } = await supabase
      .from('planes_moviles')
      .update({ ...partial, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Plan;
  },

  async remove(id: string) {
    const { error } = await supabase.from('planes_moviles').delete().eq('id', id);
    if (error) throw error;
  },
};
