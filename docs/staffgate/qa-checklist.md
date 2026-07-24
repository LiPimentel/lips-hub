# StaffGate — QA checklist

> Mantenido por el agente QA Lead. Ver también `docs/staffgate/requerimientos.md` (Casos borde, business-analyst) y `docs/team-memory.md`.

## 2026-07-23 — Revisión: fix de color de veredicto en exportación PDF/Word

**Contexto:** fix sobre el caso borde 1 de `requerimientos.md` (color gris incorrecto en exportaciones para candidatos aprobados/reprobados). Diff revisado: `git diff --cached` en rama `custom-login-scenes-per-app`, 2 líneas cambiadas (~1944 y ~2159), sin cambios en ningún otro lugar de `exportPDF()`/`exportWord()`.

Verificado:
- [x] El archivo carga sin errores de consola (`file://StaffGate.html`, tab-6). Confirmado con `read_console_messages` → "No console logs."
- [x] Pantalla de login/candado sigue visible y renderiza correctamente (captura de pantalla real tomada), tanto en desktop (507x1179) como implícitamente compatible con el resto de apps del hub — no se tocó `auth-gate.js`.
- [x] Los 4 labels reales que devuelve `getVerdict()` (línea 1134-1140) son exactamente: `'Sin evaluar aún'`, `'Candidato aprobado ✓'`, `'Candidato reprobado ✗'`, `'Evaluar con cuidado ~'`. Confirmado leyendo el código.
- [x] Lógica `.includes('aprobado')` / `.includes('cuidado')` / `.includes('reprobado')` probada contra las 4 strings reales en la consola del navegador (`javascript_tool` sobre tab-6 con la página real cargada, no una simulación aislada): resultado GREEN / RED / AMBER / GRAY_DEFAULT respectivamente — los 4 casos distintos, ningún falso gris para aprobado/reprobado.
- [x] Confirmado por `grep` que no quedan referencias a los strings viejos `'sólido'`/`'flags'` en ningún lugar del archivo tras el fix.
- [ ] **NO verificado end-to-end:** no se pudo generar un PDF/Word real exportado desde un candidato con datos reales (requiere sesión de Supabase autenticada; no hay credenciales de prueba para StaffGate). El color correcto dentro del HTML/XML generado se infiere de la lógica ya probada, no de un archivo exportado abierto visualmente.
- [ ] **NO verificado:** flujo completo de candidatos/plantillas/reportes detrás del login (sin credenciales de prueba).

## 2026-07-24 — Revisión: aislar caché local por user_id (commit `e421ee8`)

Re-verificado lo de la entrada anterior (sigue OK: sin errores de consola, candado visible) y agregado lo específico de este fix:

- [x] El archivo sigue cargando sin errores de consola (`file://StaffGate.html`, tab-6).
- [x] Pantalla de login re-confirmada por captura de pantalla real también en mobile (375x812) esta vez — escena decorativa de iconos (lupa, maletín, birrete, etc.), sin overflow, formulario completo.
- [x] Sin sesión, `candidates` y `templates` en memoria son `[]` — no hay datos reales detrás del candado.
- [x] `cachedUserId` existe como variable, vale `null` sin sesión (como se esperaba).
- [x] `scopedKey('somekey','user-123')` → `'somekey::user-123'` y `scopedKey('somekey', null)` → `'somekey'`, probado en consola real sobre la página cargada.
- [x] No se encontró clave vieja huérfana real en este perfil de navegador (`staffgate_cands_v1`/`staffgate_tpls_v1` → `null`).
- [x] Ventana de carrera de `save()`/`cachedUserId` ya documentada por security-reviewer (caso borde 12 en `requerimientos.md`) — confirmada por lectura de código, no se repite el análisis.
- [ ] **NO verificado end-to-end:** sigue sin credenciales de prueba disponibles.

## Histórico
_(sin entradas previas antes de 2026-07-23)_
