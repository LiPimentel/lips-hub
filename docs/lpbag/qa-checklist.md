# LP-Bag — QA checklist

> Mantenido por el agente QA Lead. Ver también `docs/lpbag/requerimientos.md` (Casos borde) y `docs/team-memory.md`.

## 2026-07-24 — Revisión: aislar caché local por user_id (commit `e421ee8`)

Verificado:
- [x] El archivo carga sin errores de consola (`file://lpbag.html`, tab-5). Confirmado con `read_console_messages` → "No console logs."
- [x] Pantalla de login renderiza correctamente por captura de pantalla real, en desktop y en mobile (375x812) — escena decorativa de monedas cayendo, campos correo/contraseña completos, sin overflow ni recorte.
- [x] `scopedKey('somekey','user-123')` → `'somekey::user-123'` y `scopedKey('somekey', null)` → `'somekey'`, probado en la consola real del navegador sobre la página cargada.
- [x] Sin sesión, `appData` en memoria es el objeto por defecto (`rate:59, rateDate:'', categories:[...5 por defecto], expenses:[]`) — no hay datos reales cargados detrás del candado.
- [x] `cachedUserId` existe como variable (a diferencia de bitacora-mentor) y vale `null` sin sesión, tal como se esperaba.
- [x] No se encontró ninguna clave vieja huérfana real (`localStorage.getItem('LPBag_db')` → `null` en este perfil de navegador), a diferencia de lo encontrado en bitacora-mentor — no se puede confirmar ni descartar el mismo riesgo de migración con evidencia directa aquí, pero la lógica de código es idéntica (ver caso borde nuevo en `docs/bitacora-mentor/requerimientos.md` #13, aplica en teoría a esta app también).
- [x] Ventana de carrera de `save()`/`cachedUserId` ya documentada por security-reviewer (`docs/lpbag/requerimientos.md` caso borde 9) — no se repite el análisis aquí, solo se confirma que coincide con lo leído en el código durante esta revisión.
- [ ] **NO verificado end-to-end:** no hay credenciales de prueba para esta app; no se pudo confirmar en vivo el aislamiento con dos cuentas reales distintas.
- [ ] **NO verificado:** persistencia real en Supabase.

## Histórico
_(sin entradas previas — primera revisión de este agente para esta app)_
