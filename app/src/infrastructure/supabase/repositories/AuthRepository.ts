// src/infrastructure/supabase/repositories/AuthRepository.ts
import { supabase } from '../client';
import type { UserProfile } from '../../../domain/entities/Plan';

export const AuthRepository = {
  async register(email: string, password: string, nombre?: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    const user = data.user;
    if (!user) throw new Error('No user created');
    const { error: e2 } = await supabase.from('perfiles').insert({
      id: user.id, email, nombre, rol: 'usuario_registrado',
    });
    if (e2) throw e2;
    return user;
  },

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'tigoconecta://reset',
    });
    if (error) throw error;
  },

  async getProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase.from('perfiles').select('*').eq('id', user.id).single();
    if (error) throw error;
    return data as UserProfile;
  },

  async updateProfile(partial: Partial<UserProfile>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No auth');
    const { data, error } = await supabase
      .from('perfiles')
      .update(partial)
      .eq('id', user.id)
      .select()
      .single();
    if (error) throw error;
    return data as UserProfile;
  },

  async logout() { await supabase.auth.signOut(); }
};
