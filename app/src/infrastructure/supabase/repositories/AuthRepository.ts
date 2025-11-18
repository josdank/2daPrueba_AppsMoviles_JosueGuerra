import { supabase } from '../client';
import type { UserProfile } from '../../../domain/entities/Plan';

export const AuthRepository = {
  async register(email: string, password: string, nombre?: string, rol: 'usuario_registrado' | 'asesor_comercial' = 'usuario_registrado') {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    const user = data.user;
    if (!user) throw new Error('No user created');

    let hasSession = false;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) hasSession = true;
      else {
        try {
          await supabase.auth.signInWithPassword({ email, password });
          const { data: sessionData2 } = await supabase.auth.getSession();
          if (sessionData2?.session) hasSession = true;
        } catch (signinErr) {

        }
      }
    } catch (_) {

    }
    try {
      const { createProfileUrl } = (await import('../../config/env')).env;
      if (createProfileUrl) {
        fetch(createProfileUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.id, email, nombre, rol })
        }).catch(e => console.warn('Failed calling createProfileUrl:', e));
      } else {
        console.log('Profile creation deferred to first login (no server endpoint configured)');
      }
    } catch (_) {
      console.log('Profile creation deferred to first login (env import failed)');
    }
    
    try {
      const { createProfileUrl } = (await import('../../config/env')).env;
      if (!hasSession && createProfileUrl) {
        fetch(createProfileUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.id, email, nombre, rol })
        }).catch(e => console.warn('Failed calling createProfileUrl:', e));
      }
    } catch (_) {

    }

    return user;
  },

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const user = data.user;


    if (user) {
      try {
        const { data: existing, error: selErr } = await supabase.from('perfiles').select('id').eq('id', user.id).maybeSingle();
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
      const { data, error } = await supabase.from('perfiles').select('*').eq('id', user.id).maybeSingle();
      if (error) {
        console.warn('Error fetching profile (might be RLS):', error);
        return null;
      }
      return data as UserProfile | null;
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
      .single();
    if (error) throw error;
    return data as UserProfile;
  },

  async logout() { await supabase.auth.signOut(); }
};
