# Generador de Gantt — QA checklist

> Mantenido por el agente QA Lead. Ver también `docs/gantt/requerimientos.md` (Casos borde) y `docs/team-memory.md`.

## 2026-07-24 — Revisión: persistencia nueva Supabase + caché local + folder-bridge (commit `65ad3e7`)

**Contexto:** primera vez que esta app persiste algo — antes todo vivía solo en la variable `rows`. Verificación más profunda que el resto por ser funcionalidad nueva, no solo un fix.

Verificado:
- [x] El archivo carga sin errores de consola (`file://generador_gantt_2.html`, tab-1). Confirmado con `read_console_messages` → "No console logs."
- [x] Pantalla de login renderiza correctamente por captura de pantalla real, en desktop y en mobile (375x812) — escena decorativa de barras de Gantt de fondo, campos correo/contraseña completos.
- [x] Sin sesión, `rows` en memoria es `[]` y `localStorage.getItem('gantt_v1')` es `null` — no hay datos reales cargados ni cacheados de antes detrás del candado (a diferencia de bitacora-mentor, aquí no se encontró ningún dato huérfano de pruebas previas).
- [x] `cloudSyncReady` es `true` tras el arranque `(async () => { await load(); cloudSyncReady = true; renderTable(); })()` — confirmado en consola, la secuencia de boot corrió completa sin colgarse ni lanzar error, incluso sin sesión.
- [x] `scopedKey('somekey','user-123')` → `'somekey::user-123'` y `scopedKey('somekey', null)` → `'somekey'`, probado en consola real.
- [x] **Round-trip `serializeRows`/`deserializeRows` probado en consola con datos reales:** un arreglo con un `Date` real de inicio/fin y una fila con `ini`/`fin` en `null` pasado por `serializeRows` → `deserializeRows` devuelve objetos `Date` reales (`instanceof Date` true, `getTime()` idéntico al original, fecha válida) para la fila con fechas, y `null` exacto (no `undefined`, no `0`, no string vacío) para la fila sin fechas.
- [x] **Caso borde adicional probado (no pedido explícitamente, iniciativa propia):** `deserializeRows` sobre un valor `ini` malformado (`"not-a-date"`) no lanza error ni lo descarta — produce silenciosamente un objeto `Date` inválido (`instanceof Date` true, pero `getTime()` es `NaN`). Si algún dato corrupto llegara a Supabase/localStorage por otra vía, esa fila renderizaría con una fecha inválida sin ningún aviso. No se confirmó si esto rompe visualmente el dibujo de la barra (no se pudo generar un Gantt real con esa fila sin sesión), pero es una ruta sin validar. Documentado como parte del caso borde 12 existente en `docs/gantt/requerimientos.md` — se recomienda que quede anotado explícitamente si no lo está ya.
- [x] **Los 5 puntos de mutación esperados llaman a `save()`, confirmado por grep + lectura de código:** `mergeRows()` (línea 545, cubre merge/pegar/subir archivo — verificado que las 5 rutas que llaman a `mergeRows` lo hacen: `loadSample`, pegar texto, y 3 rutas de carga de archivo), el handler de clic en `.del` (línea 562), el handler de `blur` en celdas editables (línea 573), `addRow` (línea 592) y `clearAll` (línea 599). Ningún punto de mutación esperado quedó sin `save()`.
- [x] `isSyncKey()` del folder-bridge (prefijo `gantt_v1`) probado directamente en consola reconstruyendo la lógica exacta del archivo: coincide con `gantt_v1` y `gantt_v1::user-123`, **no** coincide falsamente con `gantt_v1_backup`, `gantt_v1x::abc`, `other_gantt_v1::abc` ni `mytravel_v4` — el delimitador `'::'` exigido evita falsos positivos.
- [x] Badge del folder-bridge visible y en estado correcto sin conexión ("📁 Conectar carpeta de datos").
- [x] Ventana de carrera de `save()`/`cachedUserId` ya documentada por security-reviewer (`docs/gantt/requerimientos.md` caso borde 12) — coincide con lo leído en el código.
- [ ] **NO verificado end-to-end:** no hay credenciales de prueba; no se pudo confirmar en vivo un guardado real en Supabase ni recargar la página tras editar una fila real.
- [ ] **NO verificado:** comportamiento visual real de `renderTable()`/dibujo de barras (requiere datos cargados, que requieren sesión o carga manual de archivo — no se intentó cargar un archivo de muestra en esta revisión por estar detrás del candado).

## 2026-07-24 — Revisión: barras escalonadas lila/amarillo/púrpura + logo animado del login (commit `7e6dac5`, rama `hub-header-apps-label-lp-logo`, antes de fusionar a master)

**Contexto de aislamiento:** en el momento de esta revisión había otro hilo de Claude trabajando en paralelo en la misma carpeta con cambios SIN commitear en `auth-gate.js` y `mytravel-pro-v4.html` (logo de avión, `scatterCells()`, escena `travel-sky`). Para no depender de ese estado sin commitear, esta revisión se hizo contra copias limpias extraídas con `git show 7e6dac5:auth-gate.js` y `git show 7e6dac5:generador_gantt_2.html`, cargadas vía `file://` con nombres temporales (`_qa2-auth-gate.js` / `_qa2-gantt.html`, borrados al terminar). El diff real revisado fue `git diff 3bfae3d 7e6dac5 -- auth-gate.js generador_gantt_2.html`.

Verificado:
- [x] **"Escalada" = ancho creciente, todas las barras arrancan del borde izquierdo (no "cada barra empieza donde termina la anterior").** Confirmado con `getBoundingClientRect`/inline style real de las 9 `.gantt-bar`: anchos `--w` medidos 31.5%, 38.6%, 46.8%, 53.9%, 62.3%, 67.4%, 75.6%, 83.4%, 93.2% — monotónicamente creciente. Confirmado en CSS que `.gantt-bar{position:absolute;left:0}`, es decir todas parten del borde izquierdo. Coincide exactamente con el dibujo con marcas rojas de la usuaria. El jitter aleatorio (±1.5) nunca puede invertir el orden porque el paso entre escalones (7.75 puntos porcentuales) es mayor que el jitter máximo combinado (3 puntos) — matemáticamente no puede salir una barra más corta que la anterior.
- [x] **Tres colores en las barras del fondo, ciclo lila→amarillo→púrpura, confirmado por clase real en las 9 barras** (`c-lila`, `c-amarillo`, `c-purpura` repitiendo). Verde/teal (`c-brass`/`c-teal`) ya no existen en ningún archivo del repo (grep global, cero resultados) — coincide con lo que dijo el tech lead.
- [x] **Banderitas sin cambios:** el array `flagColors` no aparece tocado en el diff línea por línea; se confirmó visualmente vía DOM que `.gantt-flag` sigue presente sin cambios de clase.
- [x] **`c-brass`/`c-teal` no se usan en ningún otro lado:** confirmado por grep en todo el repo (no solo en las 5 apps) — cero coincidencias.
- [x] **`AIAPPS_LOGO_BARS` solo se activa en `generador_gantt_2.html`:** confirmado por grep — ningún otro archivo declara esa variable.
- [x] **StaffGate y Bitácora del Mentor cargados en vivo con la versión limpia de `auth-gate.js` de este commit:** ambos renderizan su `.brand-mark` original (emoji 🎯 / 📖 + nombre, sin `.logo-bars`, sin `.gantt-bar`), cero errores de consola (`read_console_messages` → "No console logs." en ambos). El cambio compartido no rompió ninguna de las dos.
- [x] **El SVG del logo no rompe el layout de `.brand-mark`:** medido con `getBoundingClientRect` en desktop (1280px) y mobile (375px) — el SVG mide 1.7em (≈40.8px en desktop) tal como se declaró, `brandMark.scrollWidth === clientWidth` (sin overflow ni scroll horizontal) en ambos anchos. En mobile el `.brand-mark` completo mide 289px de los 345px de la tarjeta, sin desbordar.
- [x] **`transform-box:fill-box` sobre `<rect>` SÍ funciona en el navegador de prueba (motor Chromium):** `getComputedStyle(rect).transformBox` devuelve `"fill-box"` y `transformOrigin` se resuelve en coordenadas relativas al propio `<rect>` (`2.5px 16px` = centro-abajo de una caja de 5×16), como se pidió (`transform-origin:center bottom`). **No verificado en otros motores** (Firefox/Safari) — esta sesión solo tiene acceso a un navegador Chromium.
- [x] **La animación del logo SÍ anima de verdad (no es un `animation` declarado pero estático):** usando `getAnimations()` y forzando `currentTime` en 5 puntos del ciclo de 2.2s, el `transform` computado de `.lb-1` cambió realmente: `scaleY` 0.42 → 0.71 → 1 → 0.71 → 0.42. Confirmado con valores reales, no solo por la existencia de la regla CSS.
- [x] `prefers-reduced-motion:reduce` tiene una regla explícita que fija `animation:none` con transforms estáticos — buena práctica no pedida explícitamente pero correcta.
- [x] Sin errores de consola al cargar `generador_gantt_2.html` (versión limpia del commit) en desktop ni tras cambiar a mobile.
- [x] `AIAPPS_APP_EMOJI='📊'` sigue declarado en el script tag de `generador_gantt_2.html` aunque ya no se usa en el login (lo tapa la rama `AIAPPS_LOGO_BARS`, que se evalúa antes). Confirmado que `index.html` (el hub) no lee `AIAPPS_APP_EMOJI` de ninguna otra app — no hay ningún acoplamiento entre ese valor "muerto" y el hub. Inofensivo.

**Hallazgos que NO coinciden con lo esperado (reportados también en `docs/gantt/requerimientos.md`, Casos borde #13 y #14):**
- [ ] ⚠️ **El logo usa 3 colores (lila `#B79BE0`, amarillo `#F0C550`, púrpura `#8C6BC8`), no los 2 que pidió la usuaria ("en lila y amarillo") para el logo específicamente.** Confirmado con `getComputedStyle` real sobre `.lb-3`. Ver caso borde 13.
- [ ] ⚠️ **En mobile (375px) la escena decorativa completa (`.gantt-scene`, las barras escalonadas nuevas) queda 100% tapada detrás de la tarjeta de login opaca** — medido con `getBoundingClientRect`, sin superposición a 1280px pero superposición total a 375px. No es una regresión de este commit (el posicionamiento no cambió), pero anula visualmente el trabajo de esta tarea en teléfono. Ver caso borde 14.

**No verificado en esta sesión:**
- [ ] Verificación visual por captura de pantalla real — la herramienta de captura falló por timeout ("the Browser pane is not displayed, so the page is not compositing frames"), limitación de sesión ya documentada en `docs/team-memory.md`. Toda la verificación de este ciclo se hizo con `getBoundingClientRect`, `getComputedStyle` y `getAnimations()`/`currentTime` reales sobre el DOM, no por lectura de código.
- [ ] Comportamiento en Firefox/Safari real (`transform-box:fill-box` en SVG) — esta sesión solo tiene un navegador Chromium disponible.
- [ ] Round-trip de datos con credenciales reales — no aplica a este cambio (es puramente decorativo/login, no toca persistencia).

## 2026-07-26 — Revisión: commit `40c43f5`, fixes de `prefers-reduced-motion` en `auth-gate.js` (compartido)

Cambio ajeno a esta app (solo `auth-gate.js`), probado explícitamente en la escena `gantt-build` como parte de la ronda de 6 escenas. Con la preferencia activa, confirmado con `getAnimations()` que `shadow.getAnimations({subtree:true}).length === 0` (0 animaciones vivas, contra 39 con la preferencia apagada como sanity check) y que el resplandor del cursor sigue moviéndose mientras la inclinación 3D de la tarjeta queda fija en plano. Sin fuga de listeners (`host._aiappsCleanups`). Detalle completo y veredicto en `docs/staffgate/qa-checklist.md` ("2026-07-26 — Revisión: commit `40c43f5`").

## 2026-07-28 — Revisión: rama `claude/widget-cuenta-y-botones-mentor` (4 commits: `bbeeac1`, `62e7128`, `3a778ca`, `ac591c7`)

**Contexto:** escena de login (`.gantt-scene`) ensanchada de `min(38%,420px)` a `min(62%,1200px,max(130px,calc(86vw-416px)))`; barras del cronograma en cápsula (`border-radius:999px`) + paleta pastel `--c1..--c8`; se quita "PES"/"Opción 1" de la data de prueba; widget de Cuenta reposicionado (compartido, ver `docs/lpbag/qa-checklist.md` para el detalle transversal).

- [x] **Ancho del `.gantt-scene` vs `.card` del login, medido con `getBoundingClientRect` en los 5 anchos pedidos: 960, 1280, 1440, 1600, 1920px — SIN solape en ninguno**, con huelgo de 40px (960-1600px) creciendo a 84.8px (1920px). Card confirmado en 376px de ancho total (`box-sizing:content-box`, 320px + padding 28×2 — el mismo dato ya conocido de la corrección anterior de Bitácora, no repetido aquí como error).
- [ ] ⚠️ **Pero SÍ hay solape real en un rango no pedido explícitamente (~500-589px de ancho), y en un tamaño de dispositivo real (568×320, iPhone SE horizontal).** Ver caso borde 17 en `docs/gantt/requerimientos.md` para el detalle completo con las 4 mediciones (585px: -2.9px; 500px: -76px; 568×320: -17.5px). No es una regresión nueva (la fórmula vieja solapaba aún más en ese mismo rango), pero el objetivo explícito de "no debe solapar en ningún ancho" no queda cumplido fuera del rango de 960-1920px que se pidió verificar.
- [x] Sample data (`loadSample`/"Cargar data de prueba", ítem renombrado desde "Cargar ejemplo (Opción 1 — Odoo PES)"): confirmado con clic real (`btn.click()`, sin sesión, función pura de UI) que carga 16 filas (`rows.length===16`), mensaje de estado correcto ("Data de prueba cargada: 16 filas..."), y **generación real del cronograma** al hacer clic en "Generar Gantt" (`document.getElementById('generate').click()`): 16 `.gantt-bar` renderizados, `border-radius:999px` confirmado por `getComputedStyle`, colores computados `rgb(127,200,174)`/`rgb(154,147,224)` = `#7FC8AE`/`#9A93E0` (coinciden exactamente con `--c1`/`--c2` de la paleta pastel nueva).
- [x] Confirmado por `document.body.textContent` que no queda ninguna mención a "PES" ni "Opción 1" en ningún lugar de la página tras cargar la data de prueba.
- [x] Sin errores de consola en ningún punto (carga, cambios de viewport, carga de sample data, generación del Gantt).
- [x] Widget de Cuenta / insignia de carpeta: mismo patrón de verificación que las otras 4 apps (clon del CSS literal), 14.5px de separación sin overlap a 1280px.
- [ ] **NO verificado end-to-end con sesión real:** sin credenciales de prueba; no se confirmó que la data de prueba sobreviva un reload con sesión autenticada real (solo se confirmó el estado en memoria y el DOM renderizado).

## 2026-07-28 — Reverificación: commit `228043a` (corrección del RECHAZADO anterior)

**Contexto:** corrige el piso de `130px` de `.gantt-scene` (`width:min(62%,1200px,max(130px,calc(86vw-416px)))` → piso `0px`) que causaba solape con `.card` entre ~500 y 589px. Servidor real `http://localhost:8796/`, medición con `getBoundingClientRect` real sobre el shadow DOM del overlay de login (`#aiapps-auth-gate`), no aritmética sobre el CSS.

Fórmula de solape usada: `overlap = max(0, min(card.right, scene.right) - max(card.left, scene.left))` — la fórmula de la ronda anterior (`scene.right - card.left`) daba falsos positivos cuando `scene.width===0` (la escena colapsada a un punto no es un solape visual real); esta corrección de método se aplicó a todas las mediciones de abajo.

Verificado con evidencia medida en vivo (no lectura de código, no aritmética sola):
- [x] **Barrido real en el navegador de 320 a 1920px, con foco denso en el rango antes roto (480-600px):** 320, 480, 490, 500, 550, 568×320 (iPhone SE horizontal, el caso puntual que antes daba -17.5px), 585 (antes -2.9px), 700, 1100, 1280, 1920 — **overlap = 0px en los 11 anchos**, incluidos los dos puntos exactos que la ronda anterior había reportado con solape negativo.
- [x] **La escena deja de tener ancho (`scene.width===0`) por debajo de ~490-500px** en vez de invadir la tarjeta — confirma el comportamiento descrito ("se encoge hasta desaparecer") con datos reales, no solo con la fórmula.
- [x] **Anchos grandes conservan el ancho amplio de antes:** a 1920px, `.gantt-scene` mide 1190.4px (cerca del tope de 1200px); a 1280px, 684.8px — coincide con el valor ya medido en la ronda del 2026-07-28 anterior (el piso solo afecta el rango angosto, no debía cambiar nada arriba de ~590px, y en efecto no cambió).
- [x] Sin errores de consola en ningún punto del barrido.
- [ ] Captura de pantalla real: intentada y fallida (`"the Browser pane is not displayed, so the page is not compositing frames"`), trampa de entorno ya confirmada — toda la verificación de arriba es por geometría real (`getBoundingClientRect`), no por inspección visual.

**Veredicto: el punto 2 del encargo (solape del login de Gantt) queda CERRADO — 0 anchos con solape visible en un barrido real de 11 puntos, incluidos los dos que antes fallaban exactamente. Se levanta la parte de RECHAZADO de esta app.**

## Histórico
_(sin entradas previas — primera revisión de este agente para esta app)_
