# Infra Watch — Supabase (plan gratuito) y Netlify

Mantenido por release-manager. Objetivo: que nadie descubra por sorpresa que el proyecto de Supabase se auto-pausó (bloquearía el login de las 5 apps del hub) o que se agotó algún límite del plan gratuito de Netlify.

**Este archivo no existía hasta hoy (2026-07-24).** Es la primera entrada; no hay historial previo de monitoreo que consultar.

## Supabase — estado y riesgo de auto-pausa

- **Proyecto:** `mkliirscqulfrutmjncu.supabase.co` (ref tomado de `supabase-client.js` / `supabase-client-app.js`, compartido por las 5 apps).
- **Plan:** gratuito → se auto-pausa tras ~1 semana sin actividad (login, query, etc.). Una vez pausado, las 5 apps del hub dejan de poder autenticar hasta que alguien lo reanude manualmente desde el dashboard de Supabase.
- **Última evidencia de actividad conocida: 2026-07-23.** No es una verificación directa mía — es un hallazgo de `business-analyst` (ver `docs/team-memory.md`, sección "⚠️ Requiere atención") que encontró una **sesión real ya autenticada** en la pestaña de producción de MyTravel Agent Pro ese día. Una sesión de Supabase Auth activa en el navegador implica que hubo tráfico real contra el proyecto ese día (carga de sesión / refresh de token como mínimo).
- **Verificación directa intentada hoy (2026-07-24) y bloqueada por el entorno:** intenté `curl` contra `https://mkliirscqulfrutmjncu.supabase.co/auth/v1/health` y `/rest/v1/` para confirmar el estado actual del proyecto. Ambas fallaron con `curl: (56) CONNECT tunnel failed, response 403` — el proxy de este contenedor bloquea la salida a `supabase.co` (confirmado también contra `$HTTPS_PROXY/__agentproxy/status`, que registra el rechazo). **No puedo confirmar hoy, desde este entorno, si el proyecto sigue activo o ya se pausó.** Esto no es una suposición de que está bien — es una limitación de herramienta que dejo explícita.
- **Cálculo de riesgo:** con la última actividad conocida el 2026-07-23 y una ventana de auto-pausa de ~7 días, el riesgo de pausa por inactividad empezaría a ser real alrededor del **2026-07-30** si nadie inicia sesión en ninguna de las 5 apps entre hoy y esa fecha. Hoy (2026-07-24) no hay riesgo inminente, pero **nadie ha estado monitoreando esto de forma continua** — este archivo es el primer registro.
- **Recomendación al tech lead:** confirmar el estado actual con un método que si funcione en este entorno — por ejemplo, pedirle al usuario que abra cualquiera de las 5 apps y confirme que el login carga (no hace falta iniciar sesión con datos reales, solo que la pantalla de login se sirva sin error de conexión), o revisar el dashboard de Supabase directamente. Si se confirma que el proyecto ya está pausado o muy cerca de pausarse sin que haya un plan de uso regular, ese es exactamente el tipo de hallazgo que va en el formato de alerta roja hacia el usuario (requiere reanudación manual, y potencialmente estar más atentos si esto se vuelve recurrente).

## Otros límites del plan gratuito a vigilar (sin datos propios verificados aún)

- **Netlify — minutos de build / ancho de banda:** no se verificó en esta ronda (el proxy también bloquea `*.netlify.app`, ver más abajo). Pendiente de una ronda futura con acceso a la API de Netlify o al dashboard.
- **Supabase — filas / almacenamiento:** las 5 apps guardan todo en una sola tabla `app_data` (una fila por `user_id` + `app_id`) según lo documentado en `docs/lpbag/requerimientos.md` y equivalentes; el volumen esperado es bajo (uso personal, no multiusuario masivo), por lo que el límite de filas del plan gratuito no es un riesgo probable a corto plazo. No hay verificación directa de uso actual.

## Netlify — acceso bloqueado desde este entorno (hallazgo de hoy, ver `docs/release-log.md`)

El proxy de este contenedor devolvió `403` (`CONNECT tunnel failed`) tanto para `https://mkliirscqulfrutmjncu.supabase.co` como para `https://deploy-preview-18--dapper-sunflower-c4c010.netlify.app`. Confirmado contra `$HTTPS_PROXY/__agentproxy/status`, que registra los rechazos (`connect_rejected`, `"gateway answered 403 to CONNECT (policy denial or upstream failure)"`) para ambos hosts. Cualquier agente que necesite abrir un deploy preview de Netlify o pegarle directo a la API de Supabase desde este entorno debe esperar el mismo bloqueo y decirlo explícitamente en su reporte, no asumir que "debería funcionar".

## Historial de rondas

- **2026-07-24 (release-manager, verificación previa al merge de PR #18):** ver arriba. Sin cambios de infraestructura hechos — solo lectura/monitoreo.
