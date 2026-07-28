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

## 2026-07-26 — Revisión: commit `40c43f5`, fixes de `prefers-reduced-motion` en `auth-gate.js` (compartido)

Cambio ajeno a esta app (solo `auth-gate.js`), probado explícitamente en la escena `mentor-people` como parte de la ronda de 6 escenas, incluyendo mobile (375×812 real, `window.innerWidth===375` en el arnés de prueba). Con la preferencia activa: resplandor sigue al cursor, inclinación fija en plano, `shadow.getAnimations({subtree:true}).length === 0`. Ciclo en vivo (activar/desactivar sin recargar) probado en esta escena con éxito en ambos sentidos. Detalle completo y veredicto en `docs/staffgate/qa-checklist.md` ("2026-07-26 — Revisión: commit `40c43f5`").

## 2026-07-28 — Revisión: rama `claude/widget-cuenta-y-botones-mentor` (4 commits: `bbeeac1`, `62e7128`, `3a778ca`, `ac591c7`)

**Contexto:** widget de Cuenta reposicionado (compartido); botones del panel lateral con fondo/borde lila; nuevo logo `AIAPPS_LOGO_READER` (monigote hojeando libro) en el login; distintivo "N pendiente(s)" con texto más descriptivo + negrita/borde. **Aviso de discrepancia con el encargo:** el punto de "N actividades pendientes" (antes "N pendiente(s)") **no estaba en la lista de 10 cambios del encargo recibido**, pero SÍ está en el diff real (commit `3a778ca`, mensaje: "Bitacora - '1 pendiente' no decía de qué: pasa a 'N actividades pendientes'"). Se verificó igual, como cualquier otro cambio del diff — se reporta la discrepancia en el veredicto porque el encargo describía 10 cambios y el diff real trae este 11º sin mencionar.

- [x] **Botones del panel lateral (`.btn-add-mentee`, `.btn-export`) confirmados con `getComputedStyle` real (no solo lectura de CSS): fondo `rgb(233,225,247)`, borde `rgb(124,92,191)`, texto `rgb(91,62,145)`** — tono lila consistente en los 5 elementos verificados (1 `.btn-add-mentee` + 4 `.btn-export`), no solo declarado en el código sino renderizado.
- [x] **"N actividades pendientes" confirmado con datos inyectados reales:** con `state.sessions` conteniendo 2 compromisos sin cumplir para un mentee, `pendingCommitments()` + `render()` produce `<span class="pending-badge">2 actividades pendientes</span>`; con 1 compromiso, `"1 actividad pendiente"` (singular correcto, ambas partes de la frase). Confirmado también el estilo nuevo: `font-weight:600`, `border:1px solid rgb(166,75,58)` — coincide con lo descrito.
- [x] **Widget de Cuenta ya no tapa la pestaña "Reportes":** confirmado con `getBoundingClientRect` real que `.tab-btn[data-tab="reportes"]` (y:22-56) y la insignia de carpeta (y:753.5-786, 1280px de ancho) no se solapan — antes el widget estaba en la misma esquina superior derecha donde vive esa pestaña.
- [x] **Logo `AIAPPS_LOGO_READER` anima de verdad, no es un `animation` declarado pero estático:** usando `getAnimations()[0].currentTime` en 8 puntos del ciclo de 3s sobre `.lr-page` y `.lr-head` reales del login: la página (`scaleX`) va de 1 → 0.06 (a los 1320ms, coincide con el 44% del keyframe `lr-flip`) → vuelve a 1; la cabeza rota de 0° → -5° → 0°. Confirma visualmente el gesto de "pasar la hoja" descrito.
- [x] Sin errores de consola en ningún punto de la sesión.
- [x] **Reconfirmado (no nuevo, ya documentado): `bitacora-mentor.html` sigue sin `<meta name="viewport">`.** A 375px de ancho de ventana, `window.innerWidth` real reporta 981px — el mismo bug preexistente ya cerrado como "no bloqueante en la práctica" el 2026-07-24 porque a ese ancho efectivo el solape escena/tarjeta ya es 0. No es parte de este diff, se re-verifica solo para confirmar que sigue igual (no empeoró ni se resolvió).
- [ ] **NO verificado con sesión real:** sin credenciales de prueba; todo lo de arriba (pending-badge, botones) se probó inyectando `state` directamente en memoria (funciones puras de render), sin pasar por Supabase.
- [ ] **NO verificado:** `prefers-reduced-motion` sobre el logo nuevo (el código añade un bloque `@media` que fija el estado final visible de `.lr-page`/`.lr-head` y del dardo de StaffGate) — esta sesión no tiene forma de forzar la preferencia real del SO en el navegador de prueba.

## 2026-07-28 — Reverificación: commit `228043a`, contraste del distintivo de pendientes

**Contexto:** corrige el hallazgo de `accessibility-reviewer` (4.44:1, bajo el 4.5:1 de AA) — el texto del `.pending-badge` pasa de `var(--rust)` a `#9E4534`, el borde se queda en `--rust`. Servidor real `http://localhost:8796/`. Sin credenciales de prueba para montar el badge real tras un login, se insertó un `<span class="pending-badge">` real (misma clase, mismo CSS ya cargado por la página) con el texto exacto que produce el código (`N actividad(es) pendiente(s)`), y se midió `getComputedStyle` + una función de contraste WCAG propia verificada aparte.

Verificado con evidencia medida en vivo:
- [x] **Contraste texto/fondo confirmado en 4.88:1** (`#9E4534` sobre `--rust-light` `#F3DFDA`) — coincide exactamente con lo que reclama el commit, y supera el 4.5:1 de AA para texto normal.
- [x] Singular/plural confirmados con el texto real que produce el código: `pendCount=1` → `"1 actividad pendiente"`; `pendCount=3` → `"3 actividades pendientes"`.
- [x] `font-weight:600` (negrita) y `border:1px solid` confirmados por `getComputedStyle`, sin cambios de layout.
- [ ] ⚠️ **Discrepancia encontrada, no bloqueante:** el commit afirma que el borde (`--rust` sobre `--rust-light`) da "4.0:1". Medido con la misma función de contraste (verificada primero contra el control negro/blanco → 21.00 exacto, igual que hizo `accessibility-reviewer`): **el valor real es 4.44:1, no 4.0:1.** Tiene sentido matemáticamente — es el mismo color (`--rust`) y el mismo fondo (`--rust-light`) que antes usaba el *texto*, cuyo contraste ya había sido medido en 4.44:1 por `accessibility-reviewer`; el borde no cambió, así que hereda ese mismo número. **No es un bloqueante** — 4.44:1 sigue muy por encima del 3:1 que exige WCAG 1.4.11 para bordes/elementos de interfaz — pero es una cifra que no coincide con lo que el commit dice haber verificado, y por el protocolo de este rol se reporta la discrepancia en sí, no solo el resultado final (que igual aprueba).
- [x] Sin errores de consola.
- [ ] **NO verificado con sesión real:** sin credenciales de prueba; el badge se probó como elemento inyectado con la clase real, no como parte del flujo de datos real de un mentee con compromisos pendientes.

**Veredicto: el punto 3 del encargo (contraste AA del badge) queda CERRADO para el texto (4.88:1, correcto). El borde también cumple (4.44:1 real, sobre el 3:1 exigido), pero el número que el commit reporta para el borde (4.0:1) no coincide con lo medido — ver discrepancia arriba.**

## Histórico
_(sin entradas previas — primera revisión de este agente para esta app)_
