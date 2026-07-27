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

## 2026-07-27 — Revisión: agregar `<meta name="viewport">` (commit `bdf722a`, rama `claude/bitacora-meta-viewport`)

**Contexto:** cambio de una sola línea en `bitacora-mentor.html` (`<meta name="viewport" content="width=device-width, initial-scale=1.0">` justo después de `<meta charset>`) + nota de versión. El propio commit cita y corrige el hallazgo de qa-lead del 2026-07-24 (ver `docs/team-memory.md`, entrada "2026-07-24 (qa-lead, revisando el cambio STAGED..."), y además hace una autocorrección explícita sobre un hallazgo previo suyo ("la cordillera se solapaba con la tarjeta" — falso, ya resuelto por otra vía). Verifiqué ambas afirmaciones de forma independiente, no solo la lectura del commit.

Metodología: comparé dos copias sin trackear del propio tech lead (`_vpX-antes.html` = `origin/master` byte a byte, confirmado con `diff`; `_vpX-despues.html` = HEAD, confirmado con `diff`) sirviéndolas desde `http://localhost:8792/`, en la misma pestaña (`tab-8`), verificando `location.href` en cada medición para descartar navegación cruzada de otra sesión. `computer{action:"screenshot"}` falló todo el tiempo ("Browser pane is not displayed") — limitación de entorno ya documentada, no de la app — así que toda la verificación de layout/overflow se hizo con `getBoundingClientRect`/`getComputedStyle`/`matchMedia` medidos en vivo, no por inspección visual ni por lectura de código.

**1. ¿Las mediciones del 38% y del 981 son correctas?** SÍ, reproducidas de forma independiente:
- [x] `_vpX-antes.html` a 375×812: `innerWidth` = **981** (no 375). `visualViewport.scale` = **0.3826** ≈ 38.3% (medido directo, no inferido del ratio 375/981 — coincide con él pero es una propiedad del navegador, más fuerte que el cálculo).
- [x] `_vpX-despues.html` a 375×812, mismo tab, recarga limpia: `innerWidth` = **375**, `visualViewport.scale` = **1**, `docScrollWidth` = **375** (sin overflow horizontal).
- [x] Las 3 media queries pasan de `false`→`true` al pasar de antes→después a 375px: `(max-width:420px)`, `(max-width:720px)`, `(max-width:900px)` (esta última es la de `auth-gate.js` que oculta `.growth-scene`) — confirmado con `matchMedia(...).matches` en vivo, no leyendo el CSS.

**2. ¿Rompe algo que hoy se ve bien?** Revisé la app completa a 375px, no solo el login, usando las funciones globales reales de la app (`currentTab='...'; render();` y `modal='group'; renderModal();` — invocadas en consola sobre la página cargada, no simulación fuera de contexto) para forzar cada vista sin necesitar login real (sin credenciales de prueba disponibles para esta app):
  - [x] Login: `.card` (shadow DOM de `auth-gate.js`) mide 345×443, `left:0 right:345` dentro de 375px, 0 elementos (input/button/a/label/h1/h2/p) desbordan el viewport. `.growth-scene` queda `0×0` (oculta por el `max-width:900px` que ahora sí aplica) — sin solape porque no se renderiza.
  - [x] Pestaña "Mentoría": `.sidebar` pasa a `flex-direction:column` (100% ancho), los dos `.export-block` (CSV/Excel, Backup/Importar) pasan a columna con botones a ancho completo (339px) — sin desbordar.
  - [x] Pestaña "Base de datos": la tabla (`table.db-table`, 980px de ancho real) desborda su contenedor inmediato `.db-table-wrap`, pero ese contenedor tiene `overflow-x:auto` explícito (confirmado con `getComputedStyle`) y `document.documentElement.scrollWidth` se queda en 375 — es scroll horizontal **contenido y con scrollbar propio**, no un desbordamiento de página. `.db-filters` pasa a 1 columna (`gridTemplateColumns:"335px"`), `.pagination` hace wrap.
  - [x] Pestaña "Reportes": `.rep-grid` pasa a 1 columna (`gridTemplateColumns:"335px"`), sin elementos desbordados salvo los botones de pestaña (mismo caso de scroll contenido que abajo).
  - [x] Pestañas (`.tabs`): mismo patrón — `overflow-x:auto` propio (confirmado), `scrollWidth` 470 vs `width` 339, contenido, no rompe la página.
  - [x] Modal ("Nuevo grupo de mentoría", forzado con `modal='group'; renderModal();`): mide 335×447 dentro del viewport, botones "Cancelar"/"Crear grupo" en columna a ancho completo (295px, `flex-direction:column-reverse` activo) — sin desbordar.
  - [x] `document.documentElement.scrollWidth === innerWidth (375)` en las 5 vistas probadas (login, Mentoría, Base de datos, Reportes, modal) — ninguna genera scroll de página.
  - [x] 0 errores de consola en carga limpia de `_vpX-despues.html` a 375×812 (`read_console_messages` → "No console logs"), incluso después de forzar las 5 vistas por consola.
  - **Ningún "se ve peor que antes" encontrado en ninguna pantalla revisada.**

**3. ¿Las media queries de 420/720px hacen algo sensato al activarse por primera vez?** SÍ, confirmado con valores reales, no solo con que la regla existe: `.app{flex-direction:column}`, `.sidebar{width:100%}`, `.tabs{overflow-x:auto}`, `.rep-grid{grid-template-columns:1fr}` (420px), `.modal-actions{flex-direction:column-reverse}` y `.export-block{flex-direction:column}` — todas verificadas con `getComputedStyle`/`getBoundingClientRect` en vivo, produciendo layouts usables, no rotos ni vacíos.

**4. ¿Se ve bien en tablet (768px) y escritorio (1280px)?** SÍ, y además confirmé algo que no estaba en el encargo: **a 768px y 1280px, `_vpX-antes.html` (sin el meta tag) YA reportaba el `innerWidth` real** (768 y 1280 respectivamente, no 981) — el bug de "página cree ser de 981px" solo se manifiesta en la emulación de móvil real (375×812) de esta herramienta, no al redimensionar a anchos de escritorio/tablet. O sea: el cambio no tiene ningún efecto medible en tablet/desktop porque ahí nunca hubo bug que corregir. Confirmado explícitamente: `_vpX-despues.html` a 1280px da exactamente los mismos `innerWidth`/`docScrollWidth` (1280/1265) que `_vpX-antes.html` a ese mismo ancho, y a 1280px la escena (`sceneRect.right=675`) y la tarjeta (`cardRect.left=786.6`) no se solapan (gap ~111px) — coincide con lo ya resuelto por `59031e3` según el histórico de `team-memory.md`. A 768px la escena da `0×0` (oculta por el corte de 900px, sin relación con este commit) y la tarjeta (376px) cabe sin desbordar.

**5. ¿Afecta a alguna de las otras 5 apps?** Confirmado por `git diff origin/master bdf722a` que el commit toca únicamente `bitacora-mentor.html` (1 línea) y `release-notes/2026-07-27-bitacora-meta-viewport.md` (archivo nuevo) — ningún archivo compartido (`auth-gate.js`, `supabase-client*.js`). Cargué `StaffGate.html` en la misma sesión como control: carga sin errores de consola, overlay de login presente (`#aiapps-auth-gate`) — sin cambios de comportamiento.

**Hallazgo propio, no mencionado en el encargo:** todos los `<input>`/`<select>`/`<textarea>` de la app tienen `font-size` entre 12.5px y 13.5px (confirmado por grep: `.search-wrap input`, `.field input,.field select,.field textarea`, `.tpl-item-row input`, `.checklist-q input`, `.db-filters input,.db-filters select`). Por debajo del umbral de 16px, Safari en iOS hace zoom automático al enfocar el campo cuando la página tiene un `<meta name="viewport">` real — comportamiento que **antes de este commit no podía ocurrir** (la página nunca tenía viewport real en móvil). No se pudo verificar en vivo en esta sesión (el navegador de prueba es Chromium, no reproduce el auto-zoom-on-focus específico de WebKit/iOS Safari) — documentado como caso borde nuevo en `docs/bitacora-mentor/requerimientos.md` en vez de darlo por confirmado o descartado.

**Mobile 375×812:** cubierto arriba, en las 5 vistas de la app + login.

**Conteo de nodos:** no aplica — el cambio no genera elementos dinámicamente (es un `<meta>` estático).

**Round-trip de datos reales:** NO verificado — sin credenciales de prueba para esta app (mismo estado que la revisión del 2026-07-24). Las 5 vistas se forzaron con las funciones globales de la app (`render()`/`renderModal()`) sin sesión real, sobre el `state` vacío por defecto.

**Veredicto: APROBADO.** El cambio hace exactamente lo que dice, con evidencia medida (no inferida) para las 5 preguntas del encargo; no encontré ninguna pantalla que se vea peor que antes a 375/768/1280px; el único hallazgo nuevo (zoom-on-focus de iOS por `font-size<16px`) es una consecuencia real y no trivial de corregir el bug, pero no es un defecto de este commit — es una superficie que nunca se había ejercitado en producción y que ahora sí, por primera vez, puede exponerse en un iPhone real.

## Histórico
_(sin entradas previas — primera revisión de este agente para esta app)_
