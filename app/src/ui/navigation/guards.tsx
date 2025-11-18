// src/ui/navigation/guards.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../../infrastructure/supabase/client';
import { AuthRepository } from '../../infrastructure/supabase/repositories/AuthRepository';

export function useAuthRole() {
  const [role, setRole] = useState<'guest'|'usuario_registrado'|'asesor_comercial'>('guest');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const checkRole = async () => {
      try {
        // Verificar si hay usuario autenticado
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRole('guest');
          return;
        }
        
        // Si hay usuario, obtener su perfil
        try {
          const profile = await AuthRepository.getProfile();
          if (profile?.rol) {
            setRole(profile.rol);
          } else {
            setRole('guest');
          }
        } catch (error) {
          console.warn('Error getting profile:', error);
          setRole('guest');
        }
      } catch (error) {
        console.warn('Error checking auth:', error);
        setRole('guest');
      }
    };
    
    checkRole();
    setLoading(false);
    
    // Escuchar cambios de autenticación en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async () => {
      await checkRole();
    });
    
    // También chequear periódicamente por si acaso
    interval = setInterval(checkRole, 3000);
    
    return () => {
      subscription?.unsubscribe();
      clearInterval(interval);
    };
  }, []);
  
  return { role, loading };
}
