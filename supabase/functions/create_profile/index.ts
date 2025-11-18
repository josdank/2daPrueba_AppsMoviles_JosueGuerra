declare const Deno: any;

export default async (req: Request) => {
  try {
    const body = await req.json();
    const { id, email, nombre, rol } = body;
    if (!id || !email) return new Response(JSON.stringify({ error: 'missing id or email' }), { status: 400 });

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SUPABASE_URL || !SERVICE_ROLE) return new Response(JSON.stringify({ error: 'server not configured' }), { status: 500 });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/perfiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE,
        'Authorization': `Bearer ${SERVICE_ROLE}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify([{ id, email, nombre: nombre || null, rol: rol || 'usuario_registrado' }])
    });

    const text = await res.text();
    if (!res.ok) return new Response(text, { status: res.status });
    return new Response(text, { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
};
