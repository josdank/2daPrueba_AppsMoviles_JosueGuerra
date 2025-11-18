// infrastructure/supabase/repositories/AuthRepository.ts
import { supabase } from '../client';
import type { UserProfile } from '../../../domain/entities/Plan';

export const AuthRepository = {
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async register(
    email: string,
    password: string,
    nombre?: string,
    rol: 'usuario_registrado' | 'asesor_comercial' = 'usuario_registrado'
  ) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    const user = data.user;
    if (!user) throw new Error('No user created');

    // Intenta garantizar sesión: si no hay sesión, intenta login
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        await supabase.auth.signInWithPassword({ email, password });
      }
    } catch (e) {
      // no bloqueamos el registro por fallos de sesión automáticos
      console.warn('Session follow-up after signUp failed:', e);
    }

    // Llamada a endpoint para crear perfil si existe (opcional); no bloqueante
    try {
      const { createProfileUrl } = (await import('../../config/env')).env;
      if (createProfileUrl) {
        fetch(createProfileUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.id, email, nombre, rol }),
        }).catch(e => console.warn('Failed calling createProfileUrl:', e));
      } else {
        console.log('Profile creation deferred to first login (no server endpoint configured)');
      }
    } catch (e) {
      console.warn('Profile creation deferred (env import failed):', e);
    }

    return user;
  },

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const user = data.user;

    if (user) {
      try {
        const { data: existing, error: selErr } = await supabase
          .from('perfiles')
          .select('id')
          .eq('id', user.id)
          .limit(1)
          .maybeSingle();
        if (selErr) {
          console.warn('Error checking existing profile:', selErr);
        }
        if (!existing) {
          const { error: e2 } = await supabase.from('perfiles').insert({ id: user.id, email });
          if (e2) console.warn('Error creating profile after login:', e2);
        }
      } catch (e) {
        console.warn('Error verifying/creating profile after login:', e);
      }
    }

    return user;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'tigoconecta://reset',
    });
    if (error) throw error;
  },

  async getProfile(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', user.id)
        .limit(1)
        .maybeSingle();
      if (error) {
        console.warn('Error fetching profile (might be RLS):', error);
        return null;
      }
      return (data as UserProfile) ?? null;
    } catch (e) {
      console.warn('Unexpected error getting profile:', e);
      return null;
    }
  },

  async updateProfile(partial: Partial<UserProfile>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No auth');
    const { data, error } = await supabase
      .from('perfiles')
      .update(partial)
      .eq('id', user.id)
      .select()
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data as UserProfile;
  },

  async getAdvisorId(): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('id')
        .eq('rol', 'asesor_comercial')
        .limit(1)
        .maybeSingle();
      if (error) {
        console.warn('Error fetching advisor profile:', error);
        return null;
      }
      return data?.id ?? null;
    } catch (e) {
      console.warn('Unexpected error getting advisor ID:', e);
      return null;
    }
  },
};
