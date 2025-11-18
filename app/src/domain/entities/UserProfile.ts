// src/domain/entities/UserProfile.ts

export type UserProfile = {
  id: string; // UUID del usuario (igual al de auth.users)
  email: string; // Email del usuario
  nombre?: string; // Nombre opcional
  rol: 'usuario_registrado' | 'asesor_comercial'; // Rol definido por RLS
  push_token?: string | null; // Token de notificaciones (Expo)
  created_at?: string; // Fecha de creación (opcional si se usa en UI)
};
