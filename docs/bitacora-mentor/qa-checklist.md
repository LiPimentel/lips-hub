# Bitácora del Mentor — QA checklist

> Mantenido por el agente QA Lead. Ver también `docs/bitacora-mentor/requerimientos.md` (Casos borde, incluye hallazgos de business-analyst, security-reviewer y qa-lead) y `docs/team-memory.md`.

## 2026-07-24 — Revisión: aislar caché local por user_id (commit `e421ee8`)

**Contexto:** fix del riesgo de mezcla de cuentas (`storageAdapter.get()`/`set()` ahora usan `scopedKey(key, session.user.id)` en vez de la clave bare `ledger-data`). A diferencia de StaffGate/LP-Bag/MyTravel/Gantt, esta app **no** usa una variable `cachedUserId` — pide la sesión fresca (`getSupabaseSession()`) en cada llamada a `get()`/`set()`. Confirmado leyendo el código y en consola (`typeof cachedUserId` → `undefined`, la variable no existe en este archivo). Esto es una desviación real del patrón descrito para las otras 4 apps, no un defecto — de hecho evita la ventana de carrera que sí afecta a las otras 3 apps con `cachedUserId` (documentada por security-reviewer).

Verificado:
- [x] El archivo carga sin errores de consola (`file://bitacora-mentor.html`, tab-7). Confirmado con `read_console_messages` → "No console logs."
- [x] Pantalla de login renderiza correctamente por captura de pantalla real, en desktop y en mobile (375x812) — escena decorativa (avión/elipses verdes), campos correo/contraseña, botón "Entrar" completo, sin overflow.
- [x] `scopedKey('somekey','user-123')` → `'somekey::user-123'` y `scopedKey('somekey', null)` → `'somekey'`, probado en la consola real del navegador sobre la página cargada.
- [x] Sin sesión, `state` en memoria es el objeto vacío por defecto (`mentees:[], sessions:[], groups:[], groupSessions:[], templates:[]`) — no hay datos reales cargados detrás del candado, cumple el invariante "sin sesión = sin datos reales".
- [x] `isSyncKey()` del folder-bridge (prefijo `ledger-data`) revisado línea por línea: exige el delimitador `'::'` inmediatamente después del prefijo, no coincide con claves como `ledger-data-backup` (verificado con la misma lógica reconstruida en consola sobre otra app del hub, ver hallazgo cruzado en `docs/gantt/qa-checklist.md`).
- [x] **Hallazgo propio (no reportado antes):** se encontró un dato huérfano real y verificable — `localStorage.getItem('ledger-data')` (clave vieja sin aislar) todavía contiene un mentee de prueba ("Prueba", sesión del 20/07/2026), de antes de este fix. Con el código nuevo esa clave nunca se vuelve a leer. Documentado como caso borde 13 en `docs/bitacora-mentor/requerimientos.md` con la evidencia completa.
- [ ] **NO verificado end-to-end:** no se pudo iniciar sesión real (sin credenciales de prueba), por lo que no se confirmó en vivo que una cuenta nueva sin fila en la nube efectivamente aísle su caché de otra cuenta ya usada en el mismo navegador — la verificación fue por lectura de código + pruebas de la función pura `scopedKey` en consola, no por dos logins reales distintos.
- [ ] **NO verificado:** persistencia real en Supabase (no hay credenciales de prueba para esta app).

## Histórico
_(sin entradas previas — primera revisión de este agente para esta app)_
