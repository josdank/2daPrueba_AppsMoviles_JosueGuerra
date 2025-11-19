// src/application/hooks/useSafeUser.ts
import { useEffect, useState } from 'react';
import { supabase } from '../../infrastructure/supabase/client';
import type { UserProfile } from '../../domain/entities/UserProfile';

export function useSafeUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user?.id) throw new Error('Usuario no autenticado');
        setUserId(user.id);

        const { data: perfil, error: perfilError } = await supabase
          .from('perfiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (perfilError) throw perfilError;
        if (!perfil) throw new Error('Perfil no encontrado');
        setProfile(perfil);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { userId, profile, loading, error };
}
