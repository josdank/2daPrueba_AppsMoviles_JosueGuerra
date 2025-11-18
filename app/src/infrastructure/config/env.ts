type Env = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  createProfileUrl?: string;
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
  createProfileUrl: process.env['EXPO_PUBLIC_CREATE_PROFILE_URL'] || undefined,
  scheme: 'tigoconecta',
};
