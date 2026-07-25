# Mudanza de Netlify a Cloudflare Pages

Guía para publicar LIPS-HUB en Cloudflare Pages. Escrita para seguirse paso a paso, sin conocimiento técnico previo. Lo que ya está listo en el repo está marcado como hecho; lo que requiere entrar a un panel web lo tiene que hacer una persona.

## Por qué se mueve

Netlify **no** pausa sitios estáticos por inactividad, así que el sitio en sí no estaba en riesgo. La razón de la mudanza es el plan gratuito de Cloudflare Pages: tráfico ilimitado (Netlify limita a 100 GB al mes y, si se pasa, pide plan de pago), sin límite de compilaciones que importe para este proyecto, y sin tarjeta de crédito.

**Lo que de verdad se degrada en este proyecto es Supabase**, no el hosting: el plan gratuito pausa el proyecto después de 7 días sin actividad y restaurarlo es manual. Eso lo cubre la tarea programada `.github/workflows/supabase-keepalive.yml`, que le hace una consulta a la base dos veces por semana. Cambiar de hosting no habría resuelto eso.

## Lo que ya quedó listo en el repo

- **`build.sh`** — arma la carpeta `dist/` con lo único que el sitio necesita: las 6 páginas HTML y los 3 archivos JS compartidos. Hoy en Netlify se publica la raíz del repo tal cual, lo que significa que `docs/` y `release-notes/` (incluidas las notas internas del equipo de agentes) **están accesibles públicamente en el sitio actual**. Con `build.sh` dejan de estarlo: verificado que `/docs/team-memory.md` responde 404 en el sitio construido.
- **`_headers`** — cabeceras de seguridad, en el formato que Cloudflare Pages y Netlify entienden igual. Bloquea que el login se pueda embeber en un iframe de otro sitio (clickjacking), desactiva permisos de navegador que ninguna app usa, y evita que el navegador guarde en caché el HTML y los JS (así un cambio publicado se ve de inmediato, sin "sigo viendo la versión vieja").
- **`.github/workflows/supabase-keepalive.yml`** — la tarea anti-pausa de Supabase.

Verificado antes de subir: las 6 páginas cargan con esas cabeceras puestas sin una sola violación de política de seguridad.

## Pasos en el panel de Cloudflare

1. Crear cuenta en https://dash.cloudflare.com/sign-up (gratis, no pide tarjeta).
2. En el menú lateral: **Workers & Pages** → **Create** → pestaña **Pages** → **Connect to Git**.
3. Autorizar el acceso a GitHub y elegir el repositorio `LiPimentel/lips-hub`.
4. En la configuración de compilación, poner exactamente:
   - **Framework preset:** `None`
   - **Build command:** `bash build.sh`
   - **Build output directory:** `dist`
   - **Production branch:** `master`
5. **Save and Deploy.** Al terminar da una dirección tipo `lips-hub.pages.dev`.

## Verificación después del primer despliegue

Abrir en el navegador, sobre la dirección nueva:

- Las 6 páginas: `/index.html`, `/lpbag.html`, `/StaffGate.html`, `/bitacora-mentor.html`, `/mytravel-pro-v4.html`, `/generador_gantt_2.html`. En cada una debe aparecer la pantalla de inicio de sesión.
- Iniciar sesión de verdad en una app y confirmar que los datos cargan (eso prueba que Supabase sigue conectado desde el dominio nuevo).
- `/docs/team-memory.md` debe dar **404**. Si carga el archivo, la configuración de compilación quedó mal (probablemente el output directory no es `dist`).

## Paso obligatorio en Supabase (si no, se rompe recuperar contraseña)

El correo de "recuperar contraseña" apunta a la dirección que Supabase tenga configurada, no a la que se esté usando. Si queda apuntando a Netlify y el sitio de Netlify se borra, ese enlace deja de funcionar.

En el panel de Supabase: **Authentication** → **URL Configuration**:
- **Site URL:** la dirección nueva de Cloudflare.
- **Redirect URLs:** agregar la dirección nueva. Conviene dejar también la de Netlify mientras se mantenga como respaldo.

Después de cambiarlo, probar el flujo completo: "¿Olvidaste tu contraseña?" → recibir el correo → abrir el enlace → cambiar la contraseña.

## Qué hacer con Netlify

Dejarlo prendido una semana como respaldo. Cuando la dirección nueva esté probada (incluido el flujo de recuperar contraseña), borrar el sitio en Netlify. Al borrarlo, la dirección `dapper-sunflower-c4c010.netlify.app` deja de existir: hay que actualizar los marcadores del navegador y cualquier acceso directo del teléfono.

## Vistas previas de cada cambio

Cloudflare Pages construye una vista previa por cada rama y cada PR, igual que Netlify, sin configurar nada. La dirección aparece como comentario en el PR una vez que se autoriza la integración con GitHub.

## Notas para el futuro

- **Todo archivo nuevo que el sitio necesite hay que agregarlo a `build.sh`**, o no llegará al sitio publicado. Si son imágenes o CSS propios, ponerlos en una carpeta `assets/` y se copian solos.
- GitHub desactiva las tareas programadas de un repo público después de **60 días sin ningún commit**. Mientras el proyecto tenga movimiento no aplica; si se deja quieto dos meses, hay que reactivar la tarea a mano desde la pestaña **Actions** del repositorio.
- **La CSP quedó a medias a propósito.** Hoy solo bloquea embebido en iframes, plugins y cambios de ruta base — cosas que ninguna app usa, así que no puede romper nada. Restringir de dónde se cargan scripts y estilos (unpkg, cdnjs, jsdelivr, fonts.googleapis) requiere probar cada app **con sesión real y ejercitando sus funciones** (generar PDF, abrir el mapa, exportar Excel), porque una CSP mal puesta rompe justo esas funciones y no se nota al abrir la pantalla de login. Es trabajo pendiente, no un olvido.
- **RLS sin verificar.** Las llaves de Supabase que viajan en el código son las públicas (`anon`), lo correcto para un repo público, pero eso solo es seguro si las políticas RLS de las tablas están activas. No se pudo comprobar desde el entorno de trabajo (el proxy bloquea `supabase.co`). Vale la pena confirmarlo en el panel de Supabase: **Table Editor** → cada tabla debe mostrar "RLS enabled".
