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

## 2026-08-02 — revisión del commit `64fc5b6` (CR-01 a CR-04 + correcciones de accesibilidad)

Servidor real `http://localhost:8791/`, worktree `claude/hourglass-app` fusionado con `master`.
Verificado contra `git diff 195c205..64fc5b6` real (no la descripción del encargo). Candado
quitado con el script de bypass dado en el encargo; nota de método: ese script sobreescribe
`Element.prototype.setAttribute` para bloquear `inert` — hay que **restaurarlo** (tomando un
`setAttribute` nativo de un `<iframe>` desechable) antes de poder probar el propio `inert` de la
app (`lockBehindModal`/`unlockBehindModal`), si no cualquier prueba de "el panel queda bloqueado
por el modal" da negativo por el propio bypass, no por un bug de la app. Ver también el aviso más
abajo sobre no mutar `document.body.children` (childList) mientras el candado original sigue sin
desconectar su `MutationObserver` — reaparece `inert` en todo el body si se hace.

Verificado y funcionando (ejecución real: funciones invocadas en vivo, clics/`dispatchEvent`
reales sobre DOM ya renderizado, `getBoundingClientRect`/`elementFromPoint` reales, no lectura de
código salvo donde se diga lo contrario):

- [x] Las 5 apps + el hub siguen con el candado de `auth-gate.js` funcionando tras este cambio:
      `hourglass.html`, `bitacora-mentor.html`, `StaffGate.html`, `lpbag.html`,
      `mytravel-pro-v4.html`, `generador_gantt_2.html`, `index.html` — overlay/formulario
      presentes en las 5 apps, formulario de login presente en el hub, 0 errores de consola en
      las 7 páginas. El diff de `auth-gate.js` es el mismo desde `3ff7445` (el commit de
      correcciones de accesibilidad `64fc5b6` no vuelve a tocar ese archivo, confirmado con
      `git diff 3ff7445..64fc5b6 --stat -- auth-gate.js` sin salida).
- [x] **CR-02, doble contabilidad (el riesgo #1 del encargo): confirmado que NO existe, con datos
      inyectados reales.** `relojMin`/`brutoMin` de `summarize()` excluyen los bloques fijos en
      todos los caminos probados (overload, filtros de Registros vía `filteredEntries()`, vista
      Año vía `summarizeYear()`); `chartDonut()`/`porSeccion.fijos` sí los incluyen, por una vía de
      cálculo separada (`indiceFijos()`), no reutilizando los segmentos de `allEntries()`.
      `blockHours()` y `blockHoursFrom(indiceFijos(),...)` dieron el mismo valor en todas las
      pruebas. Ver caso borde 26 en `requerimientos.md` para el detalle completo con cifras.
- [x] **CR-02, generación de bloques fijos:** primera vez solo genera "hoy" (no reescribe el
      pasado, por diseño); simulando 40 días sin abrir la app, el "ponerse al día" genera
      exactamente los 31 días más recientes (62 entradas), sin duplicar en una segunda llamada el
      mismo día. Cambiar el valor por defecto no reescribe un día ya generado; `setHorasFijas()`
      edita un día puntual sin tocar el otro bloque de ese mismo día.
- [x] **CR-03, rendimiento de la vista Año (el riesgo #2 del encargo): medido con 1095 y 5110
      registros reales, escala linealmente, no cuadrática.** `summarizeYear()` ≈129ms/≈525ms,
      `renderPanel()` en Año ≈130-150ms/≈548ms respectivamente; filtros de Registros con 5110
      registros responden en ≈77-78ms tanto por función como por evento `input` real sobre el
      campo ya renderizado. Ver caso borde 22 en `requerimientos.md`.
- [x] **CR-04, vista Año:** un mes con sobrecarga en sus 28 días de datos sale `sostenida:true`;
      un mes con carga ligera sale `verde`/`sostenida:false`; la tabla "Mes a mes" y el texto
      "sobrecarga sostenida" aparecen en el DOM real, no solo en el objeto devuelto por la función.
- [x] **CR-03, tabla "Día por día" acotada a 62 filas (cierra el caso borde 21 pendiente para
      `qa-lead`):** confirmado con un rango personalizado de ~200 días — 62 filas de datos
      exactas + aviso de recorte en el DOM. Ver caso borde 21 (actualizado) en `requerimientos.md`.
- [x] **Contraste del heatmap corregido y confirmado en el DOM renderizado, no solo en el CSS
      fuente:** el color de texto de las celdas sin datos en el SVG real es `#5C6670`, ya no
      `#9AA29B` (el que fallaba AA). Cierra el caso borde 20 de `accessibility-reviewer`.
- [x] **Regresión funcional (el riesgo #3 del encargo), repetida con el commit final:**
      solapamiento (bruto 240/reloj 180 con 2 registros de 2h solapados 1h), cruce de medianoche
      (120/120 repartido entre los dos días), pausas descontadas (`activeMinutes` 105 de 120 con
      15 min de pausa), `normalize()` descarta una entry con duración absurda (`MAX_ENTRY_DAYS`).
      Pop-up de cronómetro olvidado probado de punta a punta con un clic real en "Detener todos
      ahora": modal se cierra, entry se crea, cambia a la pestaña Cronómetros, región `aria-live`
      anuncia "Cronómetros detenidos". Aviso de "detener sin nada que guardar" (cronómetro cuyo
      tiempo entero quedó en pausa) probado con un clic real en "⏹ Detener y guardar": no crea
      ningún registro y el mensaje visible dice explícitamente "NO se guardó ningún registro" —
      confirma que el fix del caso borde 14 (business-analyst, 2026-07-30) sigue intacto.
- [x] **El riesgo #5 del encargo — panel flotante junto al pop-up de cronómetro olvidado:**
      confirmado con `inert` real (no simulado) que mientras el modal está abierto, `#float-host`
      queda `inert:true` (igual que `header`/`nav`/`main`), un intento de `.focus()` sobre el asa
      del panel NO mueve el foco ahí, y `modal-host` (el contenedor del propio modal) se queda sin
      `inert`, como debe ser. Al cerrar el modal (clic real en los 3 botones, en pruebas
      separadas), todo vuelve a `inert:false`. `#float-host` efectivamente se movió antes de
      `<main>` en este commit (confirmado por lectura del HTML), y de hecho **mejora el orden de
      Tab real**: con un cronómetro activo y la vista Registros abierta (antes la más costosa de
      recorrer), el asa del panel es ahora el 3er elemento enfocable de la página (después del
      enlace "volver al hub" y la pestaña activa), en vez de tener que recorrer toda la tabla y
      sus filtros — confirmado con una lista real de elementos enfocables del DOM, no una
      suposición. Cierra el caso borde 18 de `accessibility-reviewer`.

**Hallazgo nuevo, confirmado con interacción real (no solo lectura de código) — eleva el caso
borde 17 de `accessibility-reviewer` de "determinista por código" a "reproducido con clic
bloqueado medido":**

- **El panel flotante SÍ puede taparse con la barra de pestañas en móvil, y un toque real ahí no
  llegaría a la pestaña.** A 375×812px, enfocando el asa y disparando 20 `keydown` reales de
  `Shift+ArrowUp` (arrastre por teclado a máxima velocidad — uso normal, no manipulación de datos),
  el panel queda con **13.330 px² de solape real** sobre `<nav class="tabs">`
  (`getBoundingClientRect` de ambos). Peor todavía: `document.elementFromPoint()` en el centro
  exacto de la barra de pestañas devuelve un nodo del panel (`#fp-acts`), no la pestaña — un toque
  real en un teléfono en ese punto no llega al control de abajo. La tecla `Home` (agregada en este
  commit) sí lo recupera, pero no hay ninguna pista en la interfaz de que existe ese atajo cuando
  el panel tapa algo. No bloqueante (nada queda inalcanzable por teclado), pero si el objetivo del
  panel es "acceso rápido sin estorbar", en móvil sí puede estorbar. Ver caso borde 23 en
  `requerimientos.md`.

**Hallazgo nuevo, de bajo riesgo, no bloqueante:**

- **La posición/minimizado del panel flotante (`localStorage` clave `hourglass_float_panel`) no
  está aislada por usuario**, a diferencia del resto de datos de la app (que sí usan
  `scopedKey()`). Es una decisión de diseño documentada en el propio código ("NO se sincroniza con
  la nube"), de bajo impacto (una posición en píxeles y un booleano), pero en un navegador
  compartido entre dos cuentas de la misma usuaria (escenario ya real en este proyecto, no
  hipotético) se filtra entre cuentas. Ver caso borde 25 en `requerimientos.md`.

**Nota de proceso sobre la herramienta de esta sesión, para quien la retome:** a diferencia de
las dos revisiones anteriores de `accessibility-reviewer` sobre esta misma app (2026-07-30 y
2026-08-02), en esta sesión **`computer{action:"javascript_exec"}` funcionó de forma consistente
durante toda la revisión** (no solo un uso puntual) — se pudo instrumentar el código en vivo,
medir tiempos reales con `performance.now()`, y disparar eventos de teclado/clic reales sobre el
DOM. `screenshot` sí falló siempre ("the Browser pane is not displayed"), igual que en las
sesiones anteriores — ninguna captura visual fue posible, toda la verificación de esta sesión se
apoyó en medición programática real, no en inspección visual.

## 2026-08-02 — revisión del commit `e59d03c` ("el cronómetro puede salir a una ventana propia")

Servidor propio del worktree levantado con un `HttpListener` de PowerShell (`.claude/static-server.ps1`
+ `.claude/launch.json`, ambos sin trackear, no tocan código de la app) porque `http://localhost:8791/`
no respondía al iniciar esta sesión y no había `node`/`python`/`npx` reales disponibles (los alias de
`python`/`python3` en `WindowsApps` solo abren la Microsoft Store). Confirmado `location.href` antes de
cada bloque de pruebas. Candado quitado con el script del encargo + restauración de `setAttribute`
nativo vía `iframe` descartable, como dejó anotado `qa-lead` el 2026-08-02 anterior.

**Aviso de herramienta nuevo esta sesión, confirmado con un control limpio:** `computer{action:
"left_click"}` (por coordenada o por `ref`) **no entregó ningún clic real a la página** — ni al botón
⧉ de verdad, ni a un `<button>` recién creado en el light DOM sin ningún otro listener ni reposicionamiento,
con un listener de `click` fresco que nunca se disparó (0 de 2 intentos, confirmado con `window.__testClicks`
vacío tras el clic). `document.elementFromPoint()` en las coordenadas del botón de control devolvió `BODY`,
no el botón, pese a que su `getBoundingClientRect()` confirmaba que ocupaba ese punto — consistente con que
`screenshot`/`zoom` fallan con "the Browser pane is not displayed, so the page is not compositing frames"
en esta misma sesión: si el panel no compone frames, los clics por coordenada tampoco tienen un layout real
contra el cual resolverse. Además, en un punto de la sesión un `screenshot` fallido dejó la pestaña
navegada de vuelta a `http://localhost:8791/` (la URL inicial de `preview_start`) en vez de quedarse en
`hourglass.html` — hay que revalidar `location.href` después de cualquier intento de `screenshot`, no
asumirlo. Toda la interacción real de esta sesión se hizo con `javascript_exec` (invocación directa de
funciones y `dispatchEvent`/`.click()` reales sobre nodos ya renderizados), igual que las dos sesiones
anteriores de `qa-lead` sobre esta misma app.

**Lo que el encargo pedía verificar como propio y aparte del reporte del tech lead — confirmado con
ejecución real:**

- [x] El botón ⧉ solo existe cuando `pipDisponible()` es verdadero y solo aparece con al menos un
      cronómetro activo (vive dentro del `if(!n)` temprano de `renderFloatPanel()`); en este navegador
      `documentPictureInPicture` sí existe (`!!window.documentPictureInPicture === true`).
- [x] La llamada real a `requestWindow()` **confirmada inalcanzable en esta sesión, con evidencia
      directa, no solo por el argumento teórico del encargo**: invocada sin envoltorio, el propio
      Chrome/Edge real de este entorno la rechaza con `NotAllowedError: "...Document PiP requires user
      activation"` y `navigator.userActivation.isActive:false` — y confirmado aparte que ningún clic de
      `computer` genera esa activación (ver aviso de herramienta arriba), así que no había forma de
      generar el gesto real necesario en esta sesión, ni para mí ni para nadie que reintente con las
      mismas herramientas.
- [x] Mensajes de error distintos por causa, ambos ejercitados de verdad: `NotAllowedError` real (de la
      llamada sin envoltorio de arriba, capturada por la propia `abrirVentanaFlotante()`) deja el mensaje
      "El navegador no dejó abrir la ventana aparte..."; `InvalidStateError` simulado (mock de
      `requestWindow` que rechaza con ese nombre) deja "Ya tienes otra ventana flotante abierta...". Los
      dos textos son distintos entre sí y coinciden con lo que describe el commit.
- [x] Con `pipWin` sustituido por el `contentWindow` de un `iframe` del mismo origen (mismo método que
      usó el propio commit para verificarse): la ventana recibe la lista real (proyecto, sección,
      cronómetro con clase `paused` correcta), pausar/reanudar/detener desde los botones **de la ventana
      aparte** modifican `state.activeTrackers`/`state.entries` de verdad y refrescan ambas ventanas; el
      latido de 1 s (`docsConPanel()`) actualiza el tiempo en vivo en la ventana simulada (confirmado
      con un `setTimeout` real de 2,2 s, 00:03:59 → 00:04:03); la copia de estilos deja exactamente 1
      `<style>` en la ventana nueva sin ningún error ni duplicado en `document.styleSheets` de la página
      principal tras 3 ciclos de abrir/cerrar seguidos (se mantiene en 1 todo el tiempo); en la página
      solo queda el recordatorio (sin lista duplicada), con su propio botón "Devolver a la página".
- [x] Abrir/cerrar **secuencialmente** 3 veces seguidas (no en carrera): `pipActivo()` acierta en los 6
      pasos (`true` tras abrir, `false` tras el `pagehide` simulado de cierre), `pipWin` queda en `null`
      cada vez, sin arrastrar ningún estado de la apertura anterior.
- [x] El panel normal (arrastre por teclado con flechas/`Shift`, tecla Inicio, minimizar/expandir con
      persistencia en `localStorage`, cambio de vista, vista Año, gráficos, bloques fijos) no mostró
      ningún error de consola al recorrer las 5 pestañas + modo Año con datos reales inyectados
      (proyecto, entry, cronómetro activo). `wireFloatPanel()` con el marcado del recordatorio (sin
      botón de minimizar/"ir") no lanzó ninguna excepción al engancharse — los 3 controles que le
      faltan (`toggle`, `ir`, `data-act` vacío) están todos protegidos con `if(...)` antes de
      `addEventListener`, confirmado leyendo el código y ejercitado en vivo sin error.
- [x] A 375×812px, el recordatorio (el marcado nuevo y más pequeño que muestra la página cuando la
      ventana aparte está abierta) arrastrado al tope con 20 pulsaciones reales de `Shift+ArrowUp` **no
      solapa** `<nav class="tabs">` (0px² de solape, `clampFloat()` lo detiene en y:165 con el nav
      terminando en 159) — a diferencia del panel completo (caso borde 17/23, con 13.330px² de solape
      medido por la sesión anterior), este marcado más chico no reproduce esa colisión, porque usa el
      mismo `clampFloat()`/`limiteSuperiorFlotante()` ya corregido.
- [x] Las 5 apps + el hub: **no verificado de nuevo en esta sesión, por indicación explícita del tech
      lead a mitad de tarea** ("ignora el punto 5... este commit no puede afectar a bitácora-mentor,
      StaffGate, lpbag, mytravel ni al hub", tras confirmar con `git show --name-only` que el commit
      solo toca `hourglass.html` y la nota de versión). Antes de recibir esa corrección sí llegué a
      cargar `index.html` y `bitacora-mentor.html` en pestañas separadas y confirmar candado presente
      + 0 errores de consola en ambas — coincide con lo que la corrección del tech lead esperaba
      encontrar (nada roto, porque nada compartido cambió), así que queda como reconfirmación
      redundante, no contradicha.

**2 hallazgos nuevos, confirmados con ejecución real, ninguno bloqueante — ver casos borde 35-37 en
`requerimientos.md` para el detalle completo:**

- **Caso 35 — eleva la severidad que le dio `security-reviewer` al caso 34.** `security-reviewer` asumió
  (por lectura de código, sin probarlo) que un doble clic rápido sobre ⧉ sería rechazado solo por el
  navegador real con `InvalidStateError`, sin consecuencia. Lo probé con dos promesas de `requestWindow`
  pendientes de verdad (no una asunción): **las dos se resuelven**, porque el único guard que existe en
  la app (`if(pipActivo())`) no distingue "ya hay una petición en camino" de "no hay ninguna ventana
  todavía" — ambas dan `false` mientras la primera sigue pendiente. Confirmado que `pipWin` termina
  apuntando solo a la segunda, la primera queda huérfana, y cerrar la huérfana (con `pagehide`) anula la
  referencia a la segunda aunque siga abierta — un escenario más severo que "un mensaje de más". No se
  pudo confirmar contra el `requestWindow()` real de Chrome (mismo límite de activación de toda la
  sesión), así que **no queda demostrado que esto ocurra en producción**, solo que el código de la app
  no lo impide por sí solo — es la discrepancia más importante de esta revisión frente a lo que el
  reporte anterior daba por descartado, y se reporta como tal, no se concilia en silencio.
- **Caso 36 — nuevo, no reportado por nadie más.** El aviso de "cronómetro olvidado" bloquea la página
  con `inert` pero no alcanza la ventana aparte (otro `document`): confirmado que detener el cronómetro
  desde los botones de la ventana aparte mientras el aviso está abierto en la página deja el aviso
  mostrando un texto que ya no es cierto, y si se completa desde ahí igual, el mensaje final dice
  "0 cronómetro(s) detenido(s)..." — confuso pero sin pérdida ni duplicado de datos.
- **Caso 37 — brecha de verificación explícita, no un bug confirmado.** El regreso automático del panel
  al cerrar la ventana aparte depende enteramente de que el navegador dispare `pagehide` al llamar
  `.close()` sobre una ventana real — comportamiento documentado de la propia API, pero que ni esta
  sesión ni la del propio commit pudieron observar con una ventana real (el sustituto de `iframe` no
  dispara `pagehide` solo con `.close()`, hubo que simularlo a mano). Queda anotado como confirmación
  pendiente, no como fallo.

## 2026-08-03 — revisión del PR #40 (commit `8801b2f`, "la ventana flotante aparece y desaparece sola")

Servidor propio del worktree (`.claude/static-server.ps1` + `.claude/launch.json`, recreados en esta
sesión porque no existían al empezar — ambos sin trackear). Candado quitado con el script del encargo.
`document.visibilityState` y `window.innerWidth/innerHeight` verificados reales antes de cada bloque
(mismos dos artefactos de entorno que el tech lead advirtió el 2026-08-02, reconfirmados presentes en
esta sesión también: con el panel oculto, `visibilityState` da `'hidden'` y por sí solo hace que la app
abra la ventana estando en Cronómetros — no es un bug, y se usó
`Object.defineProperty(document,'visibilityState',{get:()=>...})` para simular visibilidad real antes de
medir el comportamiento genuino). `window.documentPictureInPicture.requestWindow` sustituido por un mock
que resuelve con el `contentWindow` de un `iframe` del mismo origen, anidado dentro de `<main>` (no como
hijo directo de `<body>`, para no reactivar el `MutationObserver` del candado tras quitarlo a mano).
Proyecto y cronómetro creados con clics/`dispatchEvent` reales sobre el DOM ya renderizado (no
inyectados directo en `state`), confirmando que `computer{action:"left_click"/"type"}` no entrega
interacción real en esta sesión (mismo patrón ya documentado varias veces por este equipo) — toda la
interacción real se hizo con `.click()`/`dispatchEvent()` vía `javascript_exec`.

**Retando las 13 comprobaciones que el tech lead dio por hechas — confirmado con ejecución real:**

- [x] En Cronómetros, con visibilidad real (`'visible'`) y vista `'trackers'`, no se dibuja nada
      flotante: `abrirVentanaSiCorresponde()` invocada en vivo no abre ninguna ventana
      (`requestWindowCalls` se queda en 0), `float-host` queda vacío.
- [x] Arrancar un cronómetro real (clic real en "▶ Iniciar" con un proyecto creado por la UI) estando en
      Cronómetros no abre la ventana — coincide con lo esperado.
- [x] Salir a Panel (`switchView('panel')`) con visibilidad real SÍ abre la ventana sola
      (`requestWindowCalls` sube, `pipActivo():true`, recordatorio visible en `float-host`).
- [x] Volver a Cronómetros (`switchView('trackers')`) SÍ la cierra sola (`pipActivo():false`,
      `float-host` vacío).
- [x] Ida y vuelta de pestaña del navegador (`visibilitychange` real vía el mock de visibilidad):
      recalcula según la vista — estando en Cronómetros, ocultar y volver a mostrar la pestaña no abre
      nada; estando en otra vista, no duplica la apertura si ya estaba abierta (confirmado que
      `requestWindowCalls` no sube de más en un ciclo oculto→visible con la petición ya resuelta).
- [x] Preferencia `autoVentanaFlotante` apagada (clic real en el checkbox de Ajustes + clic real en
      "Guardar preferencias"): 4 cambios de vista seguidos (`trackers`→`panel`→`ajustes`→`registros`) no
      abren la ventana ninguna vez (`requestWindowCalls` se queda en 0). Reactivada del mismo modo con
      clic real, y el checkbox refleja el valor persistido al volver a entrar a Ajustes.
- [x] El listener de "primer gesto" tras "recargar" (simulado invocando `armarAperturaEnPrimerGesto()`
      directamente, ya que no hay sesión de Supabase de prueba disponible para persistir un cronómetro
      activo a través de un `reload()` real de la página — ver nota de alcance más abajo): sin gesto no
      abre nada; el primer `keydown` real (`dispatchEvent`) la abre exactamente una vez; un segundo
      `keydown` y un `pointerdown` posteriores no vuelven a llamar `requestWindow` — los listeners se
      quitan de verdad tras dispararse.
- [x] Móvil (375×812, con `innerWidth` real vía `resize_window`, no 0): el recordatorio no solapa
      `<nav class="tabs">` ni en su posición por defecto ni arrastrado al tope con 20 `Shift+ArrowUp`
      reales (0px² de solape en ambos casos) — coincide con lo que ya había confirmado la sesión
      anterior para este marcado más chico.
- [x] Resto de Hourglass sin regresión: crear proyecto, iniciar/detener cronómetro (crea 1 entry real),
      vista Año (`switchView` a modo `anio` sin error), Registros muestra el entry nuevo — 0 errores de
      consola en toda la sesión.

**Hallazgo que ESTA revisión eleva de "deducido por lectura de código" a CONFIRMADO CON EJECUCIÓN
REAL, más amplio de lo descrito — la discrepancia más importante de esta revisión, ver caso 37/38 en
`requerimientos.md` para el detalle completo con el mecanismo línea por línea:**

- **La carrera entre el gesto/cambio de vista y el `await` de `requestWindow()` es real, no
  hipotética, y NO se autocorrige con el paso del tiempo — solo con la siguiente interacción.**
  Reproducida con 2 `switchView()` sucesivos sin esperar entre sí (`'panel'` → `'trackers'`, el mismo
  patrón que produce el escenario descrito por `security-reviewer` para un clic sobre la pestaña
  Cronómetros): la promesa de apertura sigue pendiente cuando la vista ya volvió a `'trackers'`, y al
  resolver deja `pipActivo():true` con el recordatorio "⧉ En ventana aparte" **visible en el DOM real de
  la vista de Cronómetros** — viola literalmente "en Cronómetros no se dibuja nada flotante". Confirmado
  además que ningún temporizador de la app (ni el latido de 1s ni el refresco de 60s) llama a
  `ajustarVentanaSegunVista()`/`renderFloatPanel()` para repararlo solo — si la usuaria se queda mirando
  Cronómetros sin volver a interactuar, el recordatorio fantasma (y la ventana real, en un navegador
  real) puede quedar así indefinidamente, no solo una fracción de segundo. No bloqueante (recuperable
  con una interacción más, sin pérdida de datos), coincide con la severidad baja que ya le dio
  `security-reviewer`, pero la escala del riesgo es mayor de lo que "se autocorrige en el siguiente
  cambio de vista" sugiere.

**Hallazgo nuevo de esta sesión, para triage con la usuaria, no reportado como bug — ver caso 39 en
`requerimientos.md`:**

- Cerrar la ventana a mano (simulado con `pagehide`) no "pega": el siguiente cambio de vista la reabre
  sola sin distinguir "nunca se abrió" de "la usuaria la cerró a propósito". Coincide con la letra del
  encargo tal como está escrita, así que se anota como decisión de producto a confirmar, no como
  defecto.

**Brecha de alcance explícita, no una debilidad oculta:** no se pudo probar el escenario real de
"recargar la página con un cronómetro corriendo" con una recarga de navegador genuina — sin sesión de
Supabase de prueba, `load()` retorna antes de leer nada de `localStorage` (código existente, no de este
PR: `if(!session) return;`), así que cualquier `state` inyectado en memoria se pierde en una recarga
real. Se probó la función `armarAperturaEnPrimerGesto()` invocándola directamente con datos ya
inyectados (equivalente funcional al momento exacto en que correría tras un `reload()` real), pero **no
es lo mismo que una recarga de navegador de punta a punta** — si el equipo consigue credenciales de
prueba de Supabase para esta app, valdría la pena repetir este punto con una recarga real. Tampoco se
pudo disparar `requestWindow()` real (exige gesto humano genuino, no disponible con
`computer{action:"left_click"}` en esta sesión, mismo límite ya documentado varias veces por este
equipo) — toda la verificación se hizo con el mock de `iframe` ya usado en revisiones anteriores de
esta misma app.

