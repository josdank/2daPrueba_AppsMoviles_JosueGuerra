# SQL FIX - Tabla No Existía

## Problema
Error: `relation "public.perfiles" does not exist`

## Causa
El script SQL anterior intentaba crear políticas RLS en tablas que no existían. Las tablas no se habían creado manualmente en Supabase.

## Solución
He actualizado `SUPABASE_FINAL.sql` para incluir la **creación de todas las tablas** como primer paso:

### Tablas Creadas (PASO 0)

1. **perfiles**
   - id: UUID (FK a auth.users)
   - email, nombre, rol, created_at
   - Rol: 'usuario_registrado' o 'asesor_comercial'

2. **planes_moviles**
   - id: UUID (auto-generado)
   - nombre_comercial, precio, segmento, publico_objetivo
   - Características: datos_moviles, minutos_voz, sms, velocidad_4g, velocidad_5g, redes_sociales, whatsapp, llamadas_internacionales, roaming
   - imagen_url, activo, created_at, updated_at

3. **contrataciones**
   - id: UUID (auto-generado)
   - plan_id: FK a planes_moviles
   - user_id: FK a perfiles
   - estado: 'pendiente', 'aprobado', 'rechazado'
   - created_at, updated_at

4. **mensajes_chat**
   - id: UUID (auto-generado)
   - contratacion_id: FK a contrataciones
   - sender_id: FK a perfiles
   - contenido: text
   - created_at

## Próximos Pasos

1. **Copia NUEVAMENTE el script completo de `SUPABASE_FINAL.sql`**
2. **Ve a Supabase → SQL Editor → New Query**
3. **Pega todo el contenido**
4. **Presiona RUN**

Esta vez debería funcionar sin errores.

## Validación

Si ves estos resultados en las consultas de verificación, todo está bien:

✅ 4 tablas creadas (perfiles, planes_moviles, contrataciones, mensajes_chat)
✅ 4 políticas RLS por cada tabla
✅ 3 planes de ejemplo insertados
✅ Trigger automático para crear perfil al registrarse

## Si Hay Más Errores

Ejecuta estas consultas individualmente en SQL Editor para debuggear:

```sql
-- Ver todas las tablas públicas
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Ver políticas de una tabla específica
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'perfiles';

-- Ver planes insertados
SELECT nombre_comercial, precio FROM public.planes_moviles;
```
