# 🚀 INICIO RÁPIDO - 6 PASOS PARA ENTREGAR

**Deadline:** Martes 18 Nov, 16:00  
**Tiempo estimado:** 30-45 minutos

---

## PASO 1️⃣: Supabase SQL (5 min) - CRÍTICO ⚠️

```
1. Abre: https://supabase.com/dashboard
2. Ve a "SQL Editor" → "New query"
3. Abre SUPABASE_FINAL.sql (en tu proyecto)
4. COPIA TODO y PEGA en Supabase
5. Presiona RUN (botón verde arriba)
```

**Verifica que funcionó:**
```sql
SELECT * FROM public.planes_moviles LIMIT 1;
```
Deberías ver 3 planes.

---

## PASO 2️⃣: Storage Bucket (2 min)

```
Supabase → Storage → "Create a new bucket"
Nombre: planes-imagenes
Marcar: "Public bucket"
Crear ✓
```

---

## PASO 3️⃣: .env (2 min)

En la raíz del proyecto crea `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://XXXX.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**Donde conseguir:** Supabase → Settings → API (copiar URL y anon key)

---

## PASO 4️⃣: Instalar y Probar (10 min)

```bash
npm install
npm start -- --clear
```

Escanea el QR con Expo Go o presiona `a` para Android.

**Flujo de prueba:**
1. Registra: `user@test.com` / `Pass123!` (Usuario)
2. Deberías llegar a Home (catálogo)
3. Haz clic en un plan → "Contratar"
4. Ve a "Mis Contrataciones" → "Abrir Chat"
5. Escribe un mensaje

✅ Si esto funciona, continúa.

---

## PASO 5️⃣: Build APK (15 min)

### Opción A: EAS (si tienes cuenta)
```bash
eas build --platform android --profile preview
```
Descarga cuando esté listo.

### Opción B: Local
```bash
npx expo prebuild --clean --platform android
cd android
./gradlew assembleRelease
```
APK en: `android/app/build/outputs/apk/release/app-release.apk`

### Opción C: Desarrollo (más rápido para probar)
```bash
npm start
# Presiona 'a' para Android
```

---

## PASO 6️⃣: Enviar (5 min)

**Crea PDF con:**
```
Nombre: [TU NOMBRE]
GitHub: [LINK DEL REPO]
Arquitectura: Clean Architecture (Domain/Application/Infrastructure/UI)
Stack: Expo + React Native + Supabase

Características:
✓ Auth con roles (Usuario/Asesor)
✓ CRUD de Planes
✓ Sistema de Contrataciones
✓ Chat en Tiempo Real
✓ Perfiles de Usuario
✓ RLS Policies + Trigger automático

Estado: Probado y funcionando
```

**Sube a la plataforma antes de 16:00 martes 18 Nov**

---

## ⚠️ ERRORES COMUNES

| Error | Solución |
|-------|----------|
| "RLS policies not found" | Ejecuta SUPABASE_FINAL.sql |
| "Auth user not found" | Espera 2-3 seg después de registrarse |
| "Metro Bundler not found" | `npm start -- --clear` |
| "APK no instala" | `adb uninstall com.tigoconecta.app` primero |
| "Plan no aparece" | Recarga la app o verifica `activo = true` en DB |

---

## ✅ VALIDACIÓN FINAL

Antes de enviar, verifica:

- [ ] Registro funciona (tanto Usuario como Asesor)
- [ ] Login funciona
- [ ] Ves el catálogo de planes
- [ ] Puedes contratar un plan
- [ ] Chat funciona en tiempo real
- [ ] Como Asesor, puedes crear un plan
- [ ] Como Asesor, puedes aprobar contrataciones
- [ ] Profiles muestran datos correctos
- [ ] Cierre de sesión funciona

---

## 📁 ARCHIVOS IMPORTANTES

```
proyecto/
├── DEPLOYMENT.md          ← Guía completa
├── AUDIT_SUMMARY.md       ← Lo que se corrigió
├── SUPABASE_FINAL.sql     ← Ejecutar en Supabase
├── .env                   ← Configuración (crear)
├── package.json
├── app.json
└── app/src/
    ├── ui/screens/
    │   ├── advisor/PlanForm.tsx      ← FIJO ✓
    │   └── user/Chat.tsx             ← FIJO ✓
    └── ...
```

---

## 🎯 RESUMEN RÁPIDO

| Tarea | Tiempo | Estado |
|-------|--------|--------|
| SQL Supabase | 5 min | ⚠️ **MUST DO** |
| Storage | 2 min | Necesario |
| .env | 2 min | Necesario |
| npm install | 5 min | Necesario |
| Test local | 10 min | Recomendado |
| Build APK | 15 min | Necesario |
| Enviar | 5 min | **DEADLINE 16:00** |

**Total: ~45 minutos**

---

**¡ÉXITO! 🎉 Proyecto listo para entregar.**

Todas las correcciones están hechas. Solo sigue estos 6 pasos en orden.
