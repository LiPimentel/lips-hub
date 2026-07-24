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

## 2026-07-24 — Revisión del PR #18 (fondo de login `coins-rain` de LP-Bag, `auth-gate.js`)

**Hallazgo previo a cualquier otra cosa: el PR #18 ya estaba fusionado a `master` (commit `61cd68e` + `41fafdc` encima) cuando empecé esta revisión** — el encargo asumía que aún no se había fusionado. Confirmado con `git fetch origin` + `git rev-parse origin/master`, y corroborado de forma independiente por release-manager y accessibility-reviewer (ver `docs/team-memory.md`). Verifiqué que el `auth-gate.js` del working tree de la rama coincide byte a byte con el de `origin/master` (`git diff HEAD origin/master -- auth-gate.js` sin salida), así que toda la verificación de abajo es válida contra lo que hoy está en producción, no solo contra la rama.

Entorno de prueba: Supabase inalcanzable desde este contenedor, así que serví el repo por HTTP (`python3 -m http.server`) sobre copias de los 6 HTML con `window.supabaseClient` simulado (sesión `null`), siguiendo el método indicado en el encargo. Automatizado con Playwright (Chromium real, no headless_shell) vía el paquete global de npm — permitió tipeo real, clics reales, `getComputedStyle` muestreado en el tiempo, y capturas de pantalla reales, no solo lectura de código.

Verificado (con evidencia directa, no inferencia):
- [x] `.card` mantiene `z-index:4` (auth-gate.js:71) contra `.coin-floor` `z-index:0` y `.coin-rain` `z-index:1` (confirmado con `getComputedStyle` real sobre el shadow DOM) — la tarjeta de login nunca puede quedar tapada por las montañas/monedas, sin importar la altura que alcancen.
- [x] Las monedas caen con animación real, no estática: muestreé `getComputedStyle(...).transform` de una moneda cada 700ms durante 6 muestras — la matriz cambia de forma consistente con caída + rotación simulada (translateY creciente 13→569px, scaleX oscilando entre 1 y -1).
- [x] Conteo de nodos SVG de la escena del piso: **2900-4400** con el PR (5 mediciones a 1280px de ancho) vs **~4380-4440** con la versión de `auth-gate.js` en el `master` anterior a este cambio — no hay explosión de nodos (de hecho, similar o menor). Sin riesgo del patrón de "5x nodos sin que nadie se diera cuenta" ya visto antes en este proyecto.
- [x] Montañas con alturas visiblemente distintas entre sí (captura real, no solo lectura del código en `heightMix`), cumbres separadas, coherente con el pedido "no tienen que tener el mismo tamaño ni ser tantas". No son picos afilados tipo aguja — se leen más como montículos irregulares de monedas apiladas — pero es una diferencia de matiz, no un incumplimiento del pedido.
- [x] Monedas del suelo con canto 3D visible (borde iluminado/sombreado) y cara notablemente más redonda que antes, confirmado visualmente en captura a 1280px y en el detalle recortado de la zona del piso — ya no se leen "aplastadas" a este ancho.
- [x] Viewports probados con captura real: 1280×800, 1280×700, 1280×600, 1920×1080, 375×812 (móvil), 320×700 (angosto), 667×375 (celular en horizontal) — en ninguno la montaña/monedas cubre visualmente la tarjeta (protegido además por z-index, ver arriba).
- [x] Formulario usable: tecleo real en correo y contraseña (Playwright `fill()`, valores confirmados leyendo `.value` después), clic real en "¿Olvidaste tu contraseña?" cambia a modo recuperación (título, botón "Enviar enlace", enlace "Volver a iniciar sesión"), el valor de correo ya escrito se conserva al cambiar de modo.
- [x] Las otras 4 escenas (`interview`/StaffGate, `mentor-people`/Bitácora, `travel-sky`/MyTravel, `gantt-build`/Gantt) y el login del hub sin escena (`index.html`) cargan sin errores de consola atribuibles a `auth-gate.js` y se ven visualmente iguales a lo esperado (captura real de cada una) — el cambio quedó contenido dentro del bloque `AIAPPS_LOGIN_SCENE === 'coins-rain'`, sin fuga hacia los otros bloques (confirmado leyendo el cierre del IIFE en auth-gate.js).
- [x] Errores de consola/página observados (`ERR_CONNECTION_RESET` en Google Fonts, `L is not defined` en MyTravel, `pdfjsLib is not defined` en Gantt) son por CDNs externos inalcanzables desde este contenedor (Leaflet, pdf.js, Google Fonts) — no relacionados con el diff de `auth-gate.js`, reproducibles igual con el `auth-gate.js` de `master` anterior.

Hallazgo nuevo (agregado a Casos borde #15 en `docs/lpbag/requerimientos.md`):
- [ ] **Regresión leve, no bloqueante:** en viewports más angostos de 360px de ancho (ej. 320px), el `viewBox` del SVG del piso se fuerza a un mínimo de 360 unidades pero el contenedor real mide el ancho real de la ventana (320px) con `preserveAspectRatio="none"` — compresión horizontal ~11%, una versión chica del mismo bug de aplastamiento que este PR dice haber corregido. Confirmado con `viewBox` leído del DOM vs `getBoundingClientRect().width` real a 320×700. Visualmente casi imperceptible en la captura tomada, pero técnicamente contradice la explicación del PR.

NO verificado en esta sesión:
- [ ] Persistencia real en Supabase (crear/editar/borrar un gasto y confirmar que sobrevive un reload) — sin credenciales de prueba, red bloqueada hacia Supabase desde este contenedor.
- [ ] Widget de cuenta ("👤 Cuenta") con sesión autenticada — el mock usado solo cubre sesión `null`; no se armó un mock de sesión autenticada esta ronda.
- [ ] La cifra exacta que afirma el PR de destellos ocultos antes/después (31 de 41 vs 2 de 29) — no remedí esto con un análisis de orden de pintado propio; estructuralmente es plausible (los destellos se agregan al final del SVG, así que deberían pintar siempre por encima), pero no lo confirmé con evidencia directa propia.
- [ ] Deploy preview de Netlify / producción real — proxy de este contenedor bloquea `*.netlify.app` (ya documentado por release-manager en `docs/infra-watch.md`).

## Histórico
_(sin entradas previas antes de la revisión de arriba)_
