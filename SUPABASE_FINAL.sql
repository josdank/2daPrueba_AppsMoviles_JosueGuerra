-- ===============================================
-- SQL COMPLETO Y CORREGIDO PARA SUPABASE
-- ===============================================
-- INSTRUCCIONES:
-- 1. Ve a tu proyecto Supabase: https://supabase.com/dashboard
-- 2. SQL Editor → New Query
-- 3. Copia TODO este contenido
-- 4. Pega en el editor
-- 5. Presiona RUN
-- 6. Espera a que terminen todas las queries
-- ===============================================

-- ===============================================
-- PASO 0: CREAR TABLAS SI NO EXISTEN
-- ===============================================

-- Crear tabla PERFILES (vinculada a auth.users)
CREATE TABLE IF NOT EXISTS public.perfiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  nombre text,
  rol text NOT NULL DEFAULT 'usuario_registrado',
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(email),
  CONSTRAINT valid_rol CHECK (rol IN ('usuario_registrado', 'asesor_comercial'))
);

-- Crear tabla PLANES_MOVILES
CREATE TABLE IF NOT EXISTS public.planes_moviles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_comercial text NOT NULL,
  precio numeric(10, 2) NOT NULL,
  segmento text,
  publico_objetivo text,
  datos_moviles text,
  minutos_voz text,
  sms text,
  velocidad_4g text,
  velocidad_5g text,
  redes_sociales text,
  whatsapp text,
  llamadas_internacionales text,
  roaming text,
  imagen_url text,
  activo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Crear tabla CONTRATACIONES
CREATE TABLE IF NOT EXISTS public.contrataciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.planes_moviles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
  estado text NOT NULL DEFAULT 'pendiente',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT valid_estado CHECK (estado IN ('pendiente', 'aprobado', 'rechazado'))
);

-- Crear tabla MENSAJES_CHAT
CREATE TABLE IF NOT EXISTS public.mensajes_chat (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contratacion_id uuid NOT NULL REFERENCES public.contrataciones(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
  contenido text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- ===============================================
-- PASO 1: LIMPIAR TODO (DROP POLICIES)
-- ===============================================

-- Limpiar políticas de perfiles
DROP POLICY IF EXISTS "Usuarios pueden crear su propio perfil" ON public.perfiles;
DROP POLICY IF EXISTS "Usuarios pueden leer su propio perfil" ON public.perfiles;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.perfiles;
DROP POLICY IF EXISTS perfiles_select_self ON public.perfiles;
DROP POLICY IF EXISTS perfiles_insert_self ON public.perfiles;
DROP POLICY IF EXISTS perfiles_update_self ON public.perfiles;

-- Limpiar políticas de planes
DROP POLICY IF EXISTS planes_public_read ON public.planes_moviles;
DROP POLICY IF EXISTS planes_asesor_insert ON public.planes_moviles;
DROP POLICY IF EXISTS planes_asesor_update ON public.planes_moviles;
DROP POLICY IF EXISTS planes_asesor_delete ON public.planes_moviles;

-- Limpiar políticas de contrataciones
DROP POLICY IF EXISTS contratos_usuario_select ON public.contrataciones;
DROP POLICY IF EXISTS contratos_usuario_insert ON public.contrataciones;
DROP POLICY IF EXISTS contratos_usuario_update_self ON public.contrataciones;
DROP POLICY IF EXISTS contratos_asesor_update ON public.contrataciones;

-- Limpiar políticas de mensajes
DROP POLICY IF EXISTS chat_select ON public.mensajes_chat;
DROP POLICY IF EXISTS chat_insert ON public.mensajes_chat;

-- ===============================================
-- PASO 2: HABILITAR RLS EN TODAS LAS TABLAS
-- ===============================================

ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planes_moviles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contrataciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensajes_chat ENABLE ROW LEVEL SECURITY;

-- ===============================================
-- PASO 3: CREAR POLÍTICAS PARA PERFILES
-- ===============================================

-- Los usuarios pueden VER su propio perfil
CREATE POLICY perfiles_select_self ON public.perfiles
  FOR SELECT 
  USING (auth.uid() = id);

-- Los usuarios pueden INSERTAR su propio perfil (para signup)
CREATE POLICY perfiles_insert_self ON public.perfiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Los usuarios pueden ACTUALIZAR su propio perfil
CREATE POLICY perfiles_update_self ON public.perfiles
  FOR UPDATE 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);

-- ===============================================
-- PASO 3.1: FUNCIONES AUXILIARES Y TRIGGER DE SIGNUP
-- ===============================================

-- Funciones para chequear rol (usadas en políticas)
CREATE OR REPLACE FUNCTION public.is_asesor()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.perfiles p
    WHERE p.id = auth.uid() AND p.rol = 'asesor_comercial'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_usuario()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.perfiles p
    WHERE p.id = auth.uid() AND p.rol = 'usuario_registrado'
  );
$$;

-- Trigger: cuando se crea un usuario en auth.users, crear un perfil mínimo
-- Esto se ejecuta con permisos del esquema y evita errores RLS en el cliente
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfiles (id, email, nombre, rol)
  VALUES (
    NEW.id,
    NEW.email,
    (CASE WHEN NEW.raw_user_meta_data IS NOT NULL THEN (NEW.raw_user_meta_data ->> 'full_name') ELSE NULL END),
    '  '
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
CREATE TRIGGER create_profile_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user();

-- ===============================================
-- PASO 4: CREAR POLÍTICAS PARA PLANES
-- ===============================================

-- TODOS pueden VER los planes activos (públicos)
CREATE POLICY planes_public_read ON public.planes_moviles
  FOR SELECT 
  USING (activo = true);

-- Solo ASESORES pueden INSERTAR planes
CREATE POLICY planes_asesor_insert ON public.planes_moviles
  FOR INSERT 
  TO authenticated 
  WITH CHECK (public.is_asesor());

-- Solo ASESORES pueden ACTUALIZAR planes
CREATE POLICY planes_asesor_update ON public.planes_moviles
  FOR UPDATE 
  TO authenticated 
  USING (public.is_asesor()) 
  WITH CHECK (public.is_asesor());

-- Solo ASESORES pueden ELIMINAR planes
CREATE POLICY planes_asesor_delete ON public.planes_moviles
  FOR DELETE 
  TO authenticated 
  USING (public.is_asesor());

-- ===============================================
-- PASO 5: CREAR POLÍTICAS PARA CONTRATACIONES
-- ===============================================

-- Usuarios ven SUS contrataciones; Asesores ven TODAS
CREATE POLICY contratos_usuario_select ON public.contrataciones
  FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid() OR public.is_asesor());

-- Usuarios solo pueden INSERTAR sus propias contrataciones
CREATE POLICY contratos_usuario_insert ON public.contrataciones
  FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

-- Usuarios solo pueden ACTUALIZAR sus propias contrataciones
CREATE POLICY contratos_usuario_update_self ON public.contrataciones
  FOR UPDATE 
  TO authenticated 
  USING (user_id = auth.uid()) 
  WITH CHECK (user_id = auth.uid());

-- Asesores pueden ACTUALIZAR cualquier contratación
CREATE POLICY contratos_asesor_update ON public.contrataciones
  FOR UPDATE 
  TO authenticated 
  USING (public.is_asesor()) 
  WITH CHECK (public.is_asesor());

-- ===============================================
-- PASO 6: CREAR POLÍTICAS PARA MENSAJES
-- ===============================================

-- Solo participantes en la contratación pueden VER mensajes
CREATE POLICY chat_select ON public.mensajes_chat
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.contrataciones c
      WHERE c.id = mensajes_chat.contratacion_id
      AND (c.user_id = auth.uid() OR public.is_asesor())
    )
  );

-- Solo participantes pueden INSERTAR mensajes
CREATE POLICY chat_insert ON public.mensajes_chat
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    sender_id = auth.uid() 
    AND EXISTS (
      SELECT 1 FROM public.contrataciones c
      WHERE c.id = mensajes_chat.contratacion_id
      AND (c.user_id = auth.uid() OR public.is_asesor())
    )
  );

-- ===============================================
-- PASO 7: VERIFICACIÓN
-- ===============================================

-- Verificar que las tablas se crearon
SELECT 
  tablename
FROM pg_tables
WHERE tablename IN ('perfiles', 'planes_moviles', 'contrataciones', 'mensajes_chat')
ORDER BY tablename;

-- Contar políticas creadas
SELECT 
  tablename,
  COUNT(*) as num_policies
FROM pg_policies 
WHERE tablename IN ('perfiles', 'planes_moviles', 'contrataciones', 'mensajes_chat')
GROUP BY tablename
ORDER BY tablename;

-- ===============================================
-- LISTO ✅
-- ===============================================
-- Si ves 4 filas arriba (una por cada tabla), 
-- todo está configurado correctamente.
-- 
-- Las políticas están:
-- ✅ Sin duplicados
-- ✅ Correctamente configuradas
-- ✅ Permiten signup y CRUD según el rol
-- 
-- Ahora vuelve a intentar registrarte en la app

-- ===============================================
-- PASO 8: INSERTAR DATOS DE DEMO (PLANES)
-- ===============================================
-- Inserta 3 planes de ejemplo para la app con UUIDs generados
INSERT INTO public.planes_moviles (id, nombre_comercial, precio, segmento, publico_objetivo, datos_moviles, minutos_voz, sms, velocidad_4g, velocidad_5g, redes_sociales, whatsapp, llamadas_internacionales, roaming, imagen_url, activo)
VALUES
  (gen_random_uuid(), 'Plan Smart 5GB', 15.99, 'Básico', 'Usuarios casuales, estudiantes, adultos mayores', '5 GB mensuales (4G LTE)', '100 minutos nacionales', 'Ilimitados', 'Hasta 50 Mbps', NULL, 'Consumo normal', 'Incluido', '$0.15/min', 'No incluido', NULL, true);

INSERT INTO public.planes_moviles (id, nombre_comercial, precio, segmento, publico_objetivo, datos_moviles, minutos_voz, sms, velocidad_4g, velocidad_5g, redes_sociales, whatsapp, llamadas_internacionales, roaming, imagen_url, activo)
VALUES
  (gen_random_uuid(), 'Plan Premium 15GB', 29.99, 'Medio', 'Profesionales, usuarios activos de redes sociales', '15 GB mensuales (4G LTE)', '300 minutos nacionales', 'Ilimitados', 'Hasta 100 Mbps', NULL, 'Facebook, Instagram, TikTok GRATIS', 'Ilimitado', '$0.10/min', '500 MB incluidos (Sudamérica)', NULL, true);

INSERT INTO public.planes_moviles (id, nombre_comercial, precio, segmento, publico_objetivo, datos_moviles, minutos_voz, sms, velocidad_4g, velocidad_5g, redes_sociales, whatsapp, llamadas_internacionales, roaming, imagen_url, activo)
VALUES
  (gen_random_uuid(), 'Plan Ilimitado Total', 45.99, 'Premium', 'Power users, gamers, streamers, empresarios', 'ILIMITADOS (4G LTE)', 'ILIMITADOS', 'Ilimitados', 'Hasta 150 Mbps', 'Hasta 300 Mbps', 'Todas ilimitadas', 'Ilimitado', NULL, NULL, NULL, true);

-- ===============================================
-- PASO 9: STORAGE (BUCKET) - instrucciones
-- ===============================================
-- Supabase Storage no se gestiona con SQL en el SQL Editor. Para crear
-- el bucket `planes-imagenes` y configurar las políticas, usa la UI:
-- 1. Dashboard -> Storage -> New bucket -> nombre: planes-imagenes
-- 2. Size limit: configure según tu plan (recomendado 5MB por objeto max en cliente)
-- 3. Policies: Dejar lectura pública para todos, y restringir uploads a asesores
--    mediante RLS/presigned uploads o una Edge Function que use service_role.
-- Ejemplo (opcional) de uso mediante Edge Function: la app sube la imagen a
-- la función que valida rol y luego usa `service_role` para subir al bucket.

-- FIN DEL SCRIPT
