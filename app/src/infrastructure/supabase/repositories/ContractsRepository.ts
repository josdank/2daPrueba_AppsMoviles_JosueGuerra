// infrastructure/supabase/repositories/ContractsRepository.ts
import { supabase } from '../client';
import type { Contract } from '../../../domain/entities/Plan';

function isValidUuid(v: unknown) {
  return typeof v === 'string' && v.length === 36 && /^[0-9a-fA-F-]{36}$/.test(v);
}

export const ContractsRepository = {
  // Crea una nueva contratación para el plan y devuelve la fila creada
  async create(planId: string): Promise<Contract> {
    if (!planId) throw new Error('ContractsRepository.create: planId is required');
    if (planId === 'undefined') throw new Error('ContractsRepository.create: planId is "undefined"');
    if (!isValidUuid(planId)) throw new Error(`ContractsRepository.create: planId is not a valid UUID: "${planId}"`);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) throw new Error('ContractsRepository.create: no authenticated user');

    // Insert usando el user autenticado como user_id; la política RLS debe permitirlo
    const { data, error } = await supabase
      .from('contrataciones')
      .insert([{ plan_id: planId, user_id: user.id, estado: 'pendiente' }])
      .select()
      .single();

    if (error) {
      // Añadir contexto opcional al error para debugging
      (error as any).context = { planId, userId: user.id };
      throw error;
    }
    return data as Contract;
  },

  // Lista las contrataciones del usuario autenticado
  async listMine(): Promise<Contract[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) throw new Error('ContractsRepository.listMine: no authenticated user');

    const { data, error } = await supabase
      .from('contrataciones')
      .select('id, estado, created_at, plan_id, user_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as Contract[];
  },

  // Lista contrataciones pendientes (para asesores). Puede devolver 0 filas.
  async listPending(): Promise<any[]> {
    const { data, error } = await supabase
      .from('contrataciones')
      .select('id, estado, created_at, planes_moviles(nombre_comercial), perfiles(email)')
      .eq('estado', 'pendiente')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  // Actualiza el estado de una contratación y devuelve la fila actualizada
  async updateEstado(id: string, estado: 'pendiente' | 'aprobado' | 'rechazado'): Promise<Contract> {
    if (!id) throw new Error('ContractsRepository.updateEstado: id is required');
    if (id === 'undefined') throw new Error('ContractsRepository.updateEstado: id is "undefined"');
    if (!isValidUuid(id)) throw new Error(`ContractsRepository.updateEstado: id is not a valid UUID: "${id}"`);

    const { data, error } = await supabase
      .from('contrataciones')
      .update({ estado, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Contract;
  },

  // Opcional: busca o crea contratación pendiente para el usuario y plan (útil antes de abrir chat)
  async findOrCreateForUser(planId: string): Promise<Contract> {
    if (!planId) throw new Error('ContractsRepository.findOrCreateForUser: planId is required');
    if (!isValidUuid(planId)) throw new Error(`ContractsRepository.findOrCreateForUser: invalid planId "${planId}"`);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) throw new Error('ContractsRepository.findOrCreateForUser: no authenticated user');

    // Buscar una contratación pendiente existente
    const { data: existing, error: selErr } = await supabase
      .from('contrataciones')
      .select('*')
      .eq('plan_id', planId)
      .eq('user_id', user.id)
      .eq('estado', 'pendiente')
      .limit(1)
      .maybeSingle();

    if (selErr) throw selErr;
    if (existing) return existing as Contract;

    // Si no existe, crearla
    return this.create(planId);
  },
};
