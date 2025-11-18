export type Plan = {
  id: string;
  nombre_comercial: string;
  precio: number;
  segmento: string;
  publico_objetivo?: string;
  datos_moviles?: string;
  minutos_voz?: string;
  sms?: string;
  velocidad_4g?: string;
  velocidad_5g?: string | null;
  redes_sociales?: string;
  whatsapp?: string;
  llamadas_internacionales?: string;
  roaming?: string;
  imagen_url?: string | null;
  activo: boolean;
};

// src/domain/entities/UserProfile.ts
export type UserProfile = {
  id: string;
  email: string;
  nombre?: string;
  rol: 'asesor_comercial' | 'usuario_registrado';
  push_token?: string | null;
};

// src/domain/entities/Contract.ts
export type Contract = {
  id: string;
  plan_id: string;
  user_id: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  created_at: string;
};

// src/domain/entities/ChatMessage.ts
export type ChatMessage = {
  id: string;
  contratacion_id: string;
  sender_id: string;
  contenido: string;
  created_at: string;
};
