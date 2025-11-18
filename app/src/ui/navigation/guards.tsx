// src/ui/navigation/guards.tsx
import { useEffect, useState } from 'react';
import { AuthRepository } from '../../infrastructure/supabase/repositories/AuthRepository';

export function useAuthRole() {
  const [role, setRole] = useState<'guest'|'usuario_registrado'|'asesor_comercial'>('guest');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const profile = await AuthRepository.getProfile();
        setRole(profile?.rol ?? 'guest');
      } finally { setLoading(false); }
    })();
  }, []);
  return { role, loading };
}
