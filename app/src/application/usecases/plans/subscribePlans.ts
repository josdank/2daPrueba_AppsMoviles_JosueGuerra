// src/application/usecases/plans/subscribePlans.ts
import { supabase } from "../../../infrastructure/supabase/client";

export function subscribePlans(onChange: () => void) {
  return supabase
    .channel('plans')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'planes_moviles' }, () => onChange())
    .subscribe();
}
