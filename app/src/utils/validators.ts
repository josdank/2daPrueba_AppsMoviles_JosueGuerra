import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export const planSchema = z.object({
  nombre_comercial: z.string().min(3),
  precio: z.number().positive(),
  segmento: z.string().min(3),
});
