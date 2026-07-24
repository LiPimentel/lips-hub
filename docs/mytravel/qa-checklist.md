# MyTravel Agent Pro — QA checklist

> Mantenido por el agente QA Lead. Ver también `docs/mytravel/requerimientos.md` (Casos borde, business-analyst) y `docs/team-memory.md`.

## 2026-07-23 — Revisión: fix de validación de presupuesto negativo en `guardarViaje()`

**Contexto:** fix sobre el caso borde 1 de `requerimientos.md` (el modal de "Nuevo viaje" no está dentro de un `<form>`, por lo que `min="0"` en `#v-pres` nunca se valida nativamente, permitiendo guardar presupuestos negativos). Diff revisado: `git diff --cached`, 1 línea agregada (~1180) dentro de `guardarViaje()`.

Verificado:
- [x] El archivo carga sin errores de consola (`file://mytravel-pro-v4.html`, tab-4). Confirmado con `read_console_messages` → "No console logs."
- [x] Pantalla de login con la escena decorativa "travel-sky" (aviones, nubes, horizonte) renderiza correctamente por captura de pantalla real, tanto a 507x1179 como a 375x812 (mobile) — sin problemas de layout visibles en ninguno de los dos tamaños.
- [x] `pres` se define en la línea 1173 como `parseFloat(document.getElementById('v-pres').value)||0` **antes** del nuevo check (línea 1180) — siempre es un número real, nunca `NaN`/`undefined`, cuando se compara con `<0`. Confirmado leyendo el código y también simulando en consola del navegador con casos `'-500'`, `'-0.01'`, `'0'`, `''`, `'abc'`, `'500'`: todos los negativos quedan `blocked:true`, todos los demás `blocked:false` — coincide exactamente con el comportamiento esperado.
- [x] El nuevo check está antes de `db.viajes.push(...)` (línea 1184) — un presupuesto negativo no puede llegar nunca a los datos guardados.
- [x] Cadena de validación completa en `guardarViaje()` revisada: ciudad/país/lat/lon → fecha fin antes de inicio → presupuesto negativo (nuevo) → escalas → aviso no bloqueante de país duplicado → push. El nuevo check sigue el mismo patrón (`toast(...,'err');return;`) que los dos anteriores, sin romper el orden ni el resto de la función.
- [x] Revisado el resto de usos de `v.pres` en el archivo (tabla, tarjetas móviles, popup del mapa, cálculo de totales, CSV) — todos son de solo lectura/suma; ninguno necesitaba cambios y ninguno se ve afectado por el fix.
- [ ] **NO verificado end-to-end:** no se pudo completar el flujo real "abrir modal → escribir -500 en Presupuesto → clic en Guardar → ver el toast de error" en vivo, porque la app exige sesión de Supabase y no hay credenciales de prueba (la pantalla de login bloquea el acceso real, confirmado por captura de pantalla). El árbol de accesibilidad (`read_page`) mostró un estado de dashboard ya cargado que no coincidía con la captura real (login activo) — se interpreta como el mismo problema de herramienta ya documentado en `docs/team-memory.md` (desincronía entre accesibilidad/interacción y el DOM visual real en `file://`), no como un bug de la app.
- [ ] **NO verificado:** persistencia real en Supabase (no hay credenciales de prueba para esta app).

## 2026-07-24 — Revisión: aislar caché local por user_id (commit `e421ee8`)

- [x] El archivo sigue cargando sin errores de consola (`file://mytravel-pro-v4.html`, tab-4).
- [x] Pantalla de login re-confirmada por captura de pantalla real (viewport quedó en 375x812 al momento de la captura) — escena "travel-sky" intacta, sin overflow.
- [x] Esta vez la captura real coincidió con lo esperado (login, no dashboard) — no se repitió la desincronía `read_page`/pantalla real ya documentada la vez anterior, aunque sí se repitió en otra pestaña de esta misma sesión (bitacora-mentor, tab-7) el patrón de que `read_page`/`javascript_tool` mostró el DOM del dashboard subyacente mientras la captura real mostraba el login — mismo comportamiento de herramienta, no de la app (confirmado cruzando con `getComputedStyle`/`getBoundingClientRect` del overlay del candado: `position:fixed`, cubre el 100% del viewport, `z-index` máximo, `opacity:1`).
- [x] Sin sesión, `db` en memoria es `{viajes:[], deseos:[]}` — no hay datos reales detrás del candado.
- [x] `cachedUserId` existe, vale `null` sin sesión.
- [x] `scopedKey('somekey','user-123')` → `'somekey::user-123'` y `scopedKey('somekey', null)` → `'somekey'`, probado en consola real.
- [x] No se encontró clave vieja huérfana real en este perfil de navegador (`mytravel_v4` → `null`).
- [x] Ventana de carrera de `save()`/`cachedUserId` ya documentada por security-reviewer (caso borde 11 en `requerimientos.md`) — confirmada por lectura de código.
- [ ] **NO verificado end-to-end:** sigue sin credenciales de prueba disponibles.

## Histórico
_(sin entradas previas antes de 2026-07-23)_
