# Hourglass — checklist de QA

Servidor real usado: `http://localhost:8791/` (worktree `claude/hourglass-app`, `hourglass.html`
todavía sin commitear). Candado quitado manualmente en consola (sin credenciales de prueba,
`window.save=function(){}` para no escribir a la nube) — todo lo probado abajo es ejecución real
(datos inyectados en `state`, funciones globales invocadas directamente, eventos reales
`dispatchEvent`/`.click()` sobre el DOM), no lectura de código, salvo donde se diga lo contrario.

## 2026-07-30 — primera revisión (app nueva)

Verificado y funcionando:

- [x] Candado (`auth-gate.js`) bloquea `hourglass.html`: overlay presente, `shadowRoot` con
      formulario visible, los 6 hijos del `<body>` quedan `inert` salvo el propio overlay
      (incluido el badge de carpeta local, que en revisiones previas del hub se había escapado
      del bloqueo inicial — aquí sale `inert:true` desde el primer render).
- [x] Escena de login `hourglass-time`: 6 relojes de arena + reloj de manecillas + gato, **27
      animaciones reales** confirmadas con `getAnimations({subtree:true})` (no solo la regla CSS),
      imagen `assets/cheshire.png` carga con éxito (`naturalWidth:447`, `complete:true`), 61 nodos
      en la escena (comparable a las otras 5: 21-65 según el histórico del equipo, sin explosión).
      Sin superposición escena/tarjeta medida en 568×320, 899, 901, 950, 1024 y 1280px (0px en
      todos), y la escena se oculta completa por debajo de 900px.
- [x] Las 5 apps existentes + el hub siguen con el candado funcionando tras el cambio de
      `auth-gate.js`/`supabase-client-app.js`: `bitacora-mentor.html`, `StaffGate.html`,
      `lpbag.html`, `mytravel-pro-v4.html`, `generador_gantt_2.html` — overlay presente, formulario
      visible, 0 errores de consola en cada una. El hub (`index.html`) muestra la tarjeta nueva de
      Hourglass bajo "Apps personales" con el enlace correcto (`./hourglass.html`).
- [x] **Sobrecarga con tiempo de reloj real, no suma bruta (PRD §8.2):** 2 registros que se
      solapan 1h (2h + 2h con 1h en común) dan `brutoMin=240`, `relojMin=180` — confirmado con
      `summarize()` real.
- [x] **Registro que cruza medianoche se reparte solo al calcular (decisión 2):** entry de 4h que
      cruza la medianoche de America/Santo_Domingo se reparte 120/120 min entre los dos días en
      `byDay`, y el `inicio`/`fin` guardado no cambia.
- [x] **Dos cronómetros del mismo proyecto (decisión 3):** confirmado con 2 trackers reales del
      mismo proyecto, uno iniciado 1h antes que el otro: `relojMin` fusiona a la unión real (60
      min), `brutoMin` del proyecto suma ambos (~91 min). Repetido también cruzando medianoche con
      trackers en vivo (no solo entries manuales): mismo reparto correcto.
- [x] **Aviso de cronómetro olvidado es un pop-up centrado (decisión 5):** confirmado con
      `getComputedStyle` real (`position:fixed`, `inset:0px`, `display:flex`,
      `justify/align-items:center`), no un banner. `Escape` cierra el modal (confirmado con
      `dispatchEvent` real).
- [x] **Rango personalizado acotado a un año (decisión 8):** elegir "hasta" en otro año ajusta
      automáticamente a 31-dic del año de "desde" y muestra el aviso — confirmado disparando los
      eventos `change` reales sobre los campos de fecha. `resolveRange()` también intercambia
      correctamente `desde`/`hasta` si llegan invertidos.
- [x] **Meta de horas por proyecto completa en v1, con plan vs. real (decisión 1):** proyecto con
      meta de 10h/semana + 3h reales en la semana muestra "−7 h" y "30%" en la tabla de Metas,
      confirmado renderizando la vista real (`renderPanel()`), no solo leyendo el HTML generado en
      abstracto. El factor de ajuste al periodo (7 días → "1,00 semanas") es correcto.
- [x] **Filtros transversales (requisito de la usuaria):** confirmado con eventos reales
      (`dispatchEvent('input'/'change')`, no solo cambiando `ui.*Filter` a mano):
      - Registros: filtro por proyecto (3→1 registros) y por texto en la nota (3→1) funcionan.
      - Proyectos: filtro por estado "archivado" y por texto ("gam" → 1 de 3) funcionan.
      - Panel: filtro por sección/proyecto ya se ejercitó indirectamente en la prueba de metas
        (`ui.panelFilter`), sin errores.
      Ajustes (filtro de excepciones por rango) y Cronómetros (filtro por proyecto) se verificaron
      por lectura de código, consistentes con el mismo patrón `bind()` ya probado en vivo arriba —
      no se repitió la prueba en vivo para estos dos por tiempo, no porque fallaran.
- [x] **Las pausas no cuentan como tiempo trabajado (claim 8):** entry de 2h con una pausa de 15
      min da `duracionMin=105`, confirmado con `activeMinutes()` real.
- [x] **Sin escritura a Supabase por segundo con un cronómetro corriendo (riesgo PRD §7):**
      instrumenté `syncToCloud` para contar invocaciones, dejé un tracker corriendo ~20 segundos
      reales (confirmado con `trackerElapsed`, no solo un `setTimeout` nominal) sin ninguna acción
      de start/pause/resume/stop, y el contador se quedó en **0** durante todo ese lapso. El texto
      en pantalla (`[data-elapsed]`) no se refrescó durante la espera porque la pestaña de prueba
      quedó con `visibilityState:'hidden'`/`document.hasFocus():false` (pestaña de fondo en este
      entorno de prueba, no un bug de la app) — se confirmó el dato real por el lado del cálculo
      (`trackerElapsed`), no por el refresco visual del segundero.
- [x] **`normalize()` resiste JSON corrupto/manipulado:** probé 13 variantes (null, `undefined`,
      string, número, array, objeto vacío, `projects` no-array, `entries` con `null`/número/objetos
      incompletos, colores/nombres con intento de XSS, `activeTrackers` malformados,
      `fixedBlockOverrides` con `tipo` inválido o fecha inválida, `settings` con tipos incorrectos)
      — ninguna lanza excepción, todas caen a valores por defecto seguros. El intento de XSS en
      `color`/`nombre` de un proyecto se sanea (`color` cae al color por defecto de la paleta,
      `nombre` se guarda tal cual pero sale escapado al pintarse — `esc()` de esta app SÍ escapa
      comillas, a diferencia del defecto encontrado en `bitacora-mentor.html` el 2026-07-29).
- [x] **Eliminar un proyecto con registros y cronómetros en curso:** confirmado con datos reales
      (1 proyecto, 1 entry, 1 tracker activo, todos del mismo proyecto) + `confirm()` auto-aceptado
      — tras eliminar, los 3 arreglos quedan en 0, sin registros huérfanos ni error de consola. El
      diálogo de confirmación (leído en código) avisa explícitamente cuántos registros/cronómetros
      se perderán y sugiere "Archivar" como alternativa no destructiva.
- [x] **Zona horaria:** `Europe/Madrid` (UTC+2 en julio, con DST) reparte correctamente un cruce de
      medianoche local (30/30 min). Una zona horaria inválida (`"Not/AZone"`) no revienta la app:
      cae al desfase del navegador (`-240`, coincide con el offset real de este entorno) y deja un
      `console.warn` una sola vez por defecto (no un loop de errores).
- [x] Doble/triple clic rápido en "Agregar registro" e "Iniciar cronómetro" (3 `.click()`
      sintéticos consecutivos, sin esperar entre ellos): en ambos casos se creó **1 solo**
      registro/cronómetro, no 3. Ver caso borde nuevo abajo sobre el motivo real (no es un guardia
      explícito).
- [x] Tabs del hub interno: `ArrowRight` sobre la pestaña activa mueve el foco y cambia la vista
      real (confirmado con `dispatchEvent(KeyboardEvent)` + lectura de `ui.view`/`aria-selected`
      tras el evento).
- [x] Viewport móvil (375×812): sin desborde horizontal de página en Panel ni Registros; la tabla
      de Registros desborda dentro de su propio `.tablewrap` (`overflow-x:auto`, 479px de contenido
      en 317px de hueco) sin empujar la página.
- [x] 0 errores de consola durante toda la sesión (login, las 6 apps, todas las pruebas de arriba).

## Hallazgos que ESTA revisión confirma o eleva (no solo repite lo ya anotado)

- **Confirmado con ejecución real (no solo lectura de código) el hallazgo de `security-reviewer`
  (2026-07-30) sobre `segmentsOf()` sin tope de iteraciones — y la severidad medida es mayor a lo
  que sugiere una lectura estática.** Con una entry `inicio:"2026-01-01"` / `fin:"9999-01-01"`
  (fecha absurda pero con la misma forma que cualquier fecha válida — pasa `isIso()` sin problema),
  `segmentsOf()` genera **2.912.079 segmentos** y bloquea el hilo principal **14.58 segundos
  reales** (medido con `performance.now()`, tres cifras significativas, no una estimación). Como
  `renderPanel()` (la vista por defecto al abrir la app) llama `summarize()` sobre **todas** las
  entries vía `allEntries()`, una sola entry así de corrupta congela la interfaz completa ~15s
  cada vez que se carga la app o se vuelve a la pestaña Panel, sin ningún mensaje que explique por
  qué. No queda "rota" permanentemente: la pestaña Registros no llama `summarize()` (usa
  `duracionMin` ya calculado), así que se puede navegar ahí y borrar la entry ofensiva para
  recuperar el uso normal — pero la primera experiencia es indistinguible de un cuelgue real de la
  app. Ver caso borde 5 en `docs/hourglass/requerimientos.md` para el detalle completo y la
  recomendación de fix.

