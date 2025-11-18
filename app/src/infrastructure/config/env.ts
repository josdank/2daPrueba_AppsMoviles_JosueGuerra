// src/infrastructure/config/env.ts
type Env = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  scheme: string;
};

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const env: Env = {
  supabaseUrl: required('EXPO_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: required('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
  scheme: 'tigoconecta',
};
