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

## Histórico
_(sin entradas previas — primera revisión de este agente para esta app)_
