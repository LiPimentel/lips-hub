# Hourglass — notas de accesibilidad

Revisión sobre el worktree `claude/hourglass-app` (rama sin fusionar todavía), cambio: app nueva `hourglass.html` + escena de login nueva `hourglass-time` en `auth-gate.js` (archivo compartido por las 6 páginas).

## Aviso de cobertura de esta revisión — leer antes que el resto

Esta sesión tuvo dos limitaciones de herramienta severas, confirmadas con pruebas concretas, no solo sospechadas:

1. **`computer{action:"screenshot"}` no funcionó en ningún momento** — error literal "the Browser pane is not displayed, so the page is not compositing frames", en dos pestañas distintas (`tab-2`, `tab-3`) y tras `resize_window`. Ninguna captura visual fue posible.
2. **Ninguna interacción sintética (`left_click`, `type`, `key`) produjo ningún efecto real sobre el DOM de la app**, confirmado con la prueba más simple posible: un clic sobre el enlace `<a href="./index.html">← Volver al hub</a>` (línea `hourglass.html:311`) — sin ningún JS de por medio, un clic real habría navegado — no navegó, ni una sola vez en tres intentos. También se probó clic sobre la pestaña "Cronómetros" (sin cambio de panel), clic sobre "Periodo siguiente →" (sin cambio de fecha), y escribir en el campo "Fecha" (sin cambio de valor). `read_page`/`computer` devolvieron además `(empty page)`/`Viewport: 0x0` de forma intermitente en `tab-2`, aunque el título de la pestaña sí coincidía con Hourglass — coherente con la limitación de herramienta ya documentada varias veces por otros agentes en `docs/team-memory.md` (2026-07-24, 2026-07-27), aquí reconfirmada de forma más severa (ni siquiera el clic más simple posible tuvo efecto).
3. Adicionalmente, la pestaña compartida del navegador fue navegada por al menos otra sesión concurrente varias veces durante esta revisión (`tab-1` pasó de Hourglass a "Bitácora del Mentor" a "StaffGate" entre llamadas sucesivas) — mismo patrón de contaminación cruzada ya documentado el 2026-07-26/29 por qa-lead/accessibility-reviewer. Se aisló el trabajo en una pestaña propia (`tab-3`) para reducir el riesgo, con éxito parcial (esa pestaña sí mantuvo el árbol de accesibilidad correcto para lectura, aunque tampoco reaccionó a clics/teclas).
4. **La herramienta de este navegador no expone ningún control para emular `prefers-reduced-motion`** (`resize_window` solo acepta `colorScheme: light/dark`, no hay parámetro de movimiento reducido) — a diferencia de sesiones anteriores del equipo que sí pudieron forzarlo con Playwright (`emulateMedia`) en otro entorno. No hay forma de confirmarlo en vivo desde esta sesión.

**Consecuencia práctica y honesta:** el punto del encargo "recorre y usa la app entera solo con teclado, incluida la tabla de registros y los filtros" **no se pudo verificar en vivo esta sesión** — ni un solo Tab, clic o tecla tuvo efecto confirmable sobre `hourglass.html`. Todo lo que sigue sobre teclado/foco/ARIA está basado en **lectura completa y literal del código fuente** (líneas citadas), contrastada con los patrones ya probados en vivo en las otras 5 apps del hub por revisiones anteriores del equipo (mismo `auth-gate.js`, mismos patrones de `<button>`/`<label>`/`<select>` nativos). No se presenta como "confirmado en vivo" en ningún punto de este documento salvo donde se diga explícitamente lo contrario. Si el tech lead necesita el Tab real antes de fusionar, se recomienda repetir esta prueba con `qa-lead` en una sesión donde el panel del navegador sí componga (o con Playwright fuera de esta herramienta), igual que se resolvió antes para Gantt cuando faltaba servidor local.

Lectura de `get_page_text` (que sí funcionó de forma fiable, no depende de compositing) confirma que la app carga sin datos (sesión de prueba vacía, sin credenciales), y que el árbol de accesibilidad (`read_page` en `tab-3`) expone correctamente `tab`/`tabpanel`/`combobox`/`textbox` con nombres accesibles ("Día", "Fecha") — es decir, el DOM real sí tiene la semántica correcta, aunque no se pudo *operar* con teclado en esta sesión.

## 1. Reduced motion — escena `hourglass-time` (`auth-gate.js`)

**Verificado por lectura completa del CSS, no por emulación en vivo (ver aviso arriba).**

- La escena nueva (`.hg-scene`, `auth-gate.js:490-590`) define 6 relojes de arena (`hg-turn`/`hg-sand-top`/`hg-sand-bot`/`hg-stream`, líneas 535-555), un reloj de manecillas (`hg-spin`, línea 571-574) y el Gato de Cheshire (`hg-cat-fade`, línea 586-590).
- **No tiene su propio bloque `@media (prefers-reduced-motion: reduce)` independiente** — a diferencia de lo que sugiere la descripción del encargo ("tiene su propio bloque"), en realidad sus reglas de movimiento reducido están **fijadas dentro del bloque general compartido** que ya cubre `coins-rain` y `gantt-build` (`auth-gate.js:1197-1218`), específicamente las líneas 1209-1217:
  ```
  .hg-sand-top{ transform:scale(0.45); }
  .hg-sand-bot{ transform:scale(0.55); }
  .hg-stream{ opacity:0.9; }
  .hg-glass-turn{ transform:none; }
  .hg-cat{ opacity:0.92; }
  ```
  Es una diferencia de forma, no de fondo: el efecto es el correcto (nada queda invisible), pero no es literalmente "su propio bloque" como se afirmó — es una extensión del bloque compartido ya existente. Vale la pena que quien escriba la nota de versión no repita esa frase tal cual.
- **Confirmado por lectura de cada `@keyframes` que los valores fijados SÍ corresponden a un estado visible intermedio, no al 0% ni al 100% del ciclo** (que es exactamente la trampa que el equipo ya documentó el 2026-07-25 para las otras 4 escenas): `hg-sand-top` interpola de `scale(1)` a `scale(0)`, y el valor fijado (`0.45`) es un punto intermedio real; lo mismo para `hg-sand-bot` (`0.55`, entre 0 y 1) y `hg-stream` (`opacity:0.9`, que coincide con su meseta `6%-76%{opacity:0.9}`, no con sus extremos en 0); `hg-cat` (`opacity:0.92`) coincide con su meseta `20%-58%{opacity:0.92}`. Las manecillas (`hg-hand-min`/`hg-hand-hour`, animación `hg-spin infinite`) quedan cubiertas por la regla general `.cover *{ animation:none !important; }` (línea 1198) y no tienen ninguna posición fija propia distinta de `rotate(0deg)` — es decir, el reloj de manecillas queda con las manecillas en las 12, un estado visualmente válido de "reloj quieto", no roto.
- **La escena se oculta completa por debajo de 900px de ancho** (`@media (max-width:900px){ .hg-scene{ display:none; } }`, línea 500-502), igual que ya hace `.growth-scene` de Bitácora — esto es correcto según el encargo, y evita el error histórico de Bitácora del 2026-07-24 (viewport meta faltante dejando el corte de 900px inútil): `hourglass.html` sí trae `<meta name="viewport">` desde el primer contenido (línea 184), así que el corte de 900px debería activarse en un teléfono real (no se pudo confirmar `innerWidth` real en vivo por la limitación de herramienta ya explicada, pero el mecanismo en sí — meta tag + media query — está presente y es el mismo patrón que ya se confirmó funcionando en `bdf722a` para Bitácora).
- Las otras escenas (`fly-1`…`fly-6`, `cloud-drift-*`) que aparecen justo después de `hourglass-time` en el archivo **no son parte de esta escena**: pertenecen a `travel-sky` (MyTravel), confirmado leyendo el bloque JS de construcción de cada escena (`auth-gate.js:1431-1477` solo usa `.hg-piece`/`.hg-glass-turn`/`.hg-clock`/`.hg-cat`; los aviones/nubes aparecen en el bloque `travel-sky` que empieza en la línea 1478). No hay confusión de alcance entre ambas escenas.

**Conclusión del punto 1: la afirmación del encargo es correcta en la práctica** (la escena no queda invisible con la preferencia activa) **pero imprecisa en la descripción** (no es un bloque propio, es una extensión del bloque compartido) — corregible con una nota, no bloqueante.

## 2. Ocultamiento bajo 900px

Confirmado por lectura de código (`auth-gate.js:500-502`), ver punto 1. Mismo mecanismo ya usado por Gantt/Bitácora, sin duda de que aplique igual aquí. No verificado con `innerWidth` real en vivo por la limitación de herramienta.

## 3. `<meta name="viewport">` en `hourglass.html`

Confirmado presente (`hourglass.html:184`). `hourglass.html` es un archivo **nuevo, todavía sin commitear** (`git status` lo muestra como *untracked*) — no existe todavía un "primer commit" real en el historial de Git para verificar "desde el primer commit" literalmente, pero como el archivo aún no se ha commiteado nunca, cuando se commitee por primera vez el meta tag ya estará presente desde ese primer commit. Cierra el hallazgo histórico de Bitácora (`bdf722a`) de raíz, no como parche posterior.

## 4. Pestañas (`role="tablist"/"tab"/"tabpanel"`)

Confirmado por lectura de código y por el árbol de accesibilidad real (`read_page` en `tab-3`, que sí devolvió una lectura correcta):

```
tab "Panel" [ref_2]
tab "Cronómetros" [ref_3]
tab "Registros" [ref_4]
tab "Proyectos" [ref_5]
tab "Ajustes" [ref_6]
tabpanel [ref_7]
```

- `hourglass.html:317-322`: `role="tablist"` con `aria-label`, 5 `role="tab"` con `aria-controls`/`aria-selected`, `tabindex="-1"` en los 4 inactivos (patrón correcto de tabindex móvil/roving).
- `hourglass.html:327-331`: 5 `role="tabpanel"` con `aria-labelledby` apuntando al id correcto de su pestaña, y `hidden` en los 4 que no son la vista activa.
- `hourglass.html:1816-1826` (`switchView`): actualiza `aria-selected`/`tabIndex`/`hidden` de forma consistente para las 5 pestañas en cada cambio — no encontré ningún camino donde dos pestañas queden con `aria-selected="true"` a la vez o donde un panel oculto conserve `tabindex=0` (fuente de "fantasma" de tabulación).
- `hourglass.html:1828-1840`: navegación con flechas (`ArrowRight`/`ArrowLeft` con `%`, envuelve correctamente de la última a la primera y viceversa) y `Home`/`End`. El patrón sigue exactamente el WAI-ARIA APG de "manual activation tabs" — `e.preventDefault()` antes de mover el foco, sin fugas de scroll del contenedor.
- **No se pudo confirmar con una tecla real** (ver aviso de cobertura) que `ArrowRight` efectivamente mueva el foco y cambie el panel en este navegador — lo intenté (clic en la pestaña "Panel" + `ArrowRight`) y el panel no cambió, pero dado que **ningún** clic tuvo efecto en esta sesión (ni siquiera un `<a href>` sin JS), no se puede atribuir esto a un bug de la app; es la misma limitación de herramienta, no una segunda confirmación independiente del código.

## 5. Diálogo del cronómetro olvidado (`checkStaleTrackers`)

Confirmado por lectura completa de `hourglass.html:1854-1909`:

- `role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-desc"` (línea 1861) — nombre y descripción accesibles correctamente enlazados.
- Guarda `modalPrevFocus = document.activeElement` antes de pintar el modal (línea 1873) y mueve el foco al primer botón (`focusables()[0].focus()`, línea 1876).
- Trampa de foco real: un solo listener de `keydown` en `.modal` maneja `Escape` (cierra) y `Tab`/`Shift+Tab` en los bordes (primero↔último), líneas 1880-1887. Lógica correcta y estándar.
- `closeModal()` (línea 1905-1909) borra el modal y devuelve el foco a `modalPrevFocus` si sigue siendo enfocable — cierra correctamente el ciclo de foco.
- **Hallazgo nuevo, no cubierto por los 8 puntos del encargo:** el modal **no marca `inert` ni `aria-hidden="true"` en el resto de la página** (`header`, `nav`, `main`) mientras está abierto — solo atrapa la tecla Tab vía JS. `#modal-host` (línea 335) es un `<div>` hermano de `header`/`nav`/`main` en el `<body>`, no un contenedor que envuelva y oculte al resto. Esto significa que un lector de pantalla en modo de cursor virtual (navegación por flechas, no por Tab — el modo por defecto de NVDA/JAWS para leer contenido, no solo controles) **puede seguir leyendo y "entrando" al contenido de fondo** (pestañas, tabla de registros, etc.) mientras el diálogo está técnicamente abierto, porque nada en el DOM le dice al lector de pantalla que ese contenido está temporalmente inerte. Es inconsistente con el patrón ya establecido en este mismo proyecto: el candado de `auth-gate.js` sí aplica `inert` a todos los hermanos del overlay mientras está visible (confirmado por el equipo el 2026-07-24). Recomendación concreta: aplicar `header.inert = nav.inert = main.inert = true` (o `aria-hidden="true"` si se prefiere no depender de `inert`) al abrir el modal, y revertirlo en `closeModal()`. No bloqueante (los usuarios de teclado puro sí quedan correctamente atrapados), pero sí una brecha real para usuarios de lector de pantalla.

## 6. Formularios: labels, live region, alertas

- **Todos los `<input>`/`<select>`/`<textarea>` de la app tienen `<label for="...">` propio, o están envueltos en un `<label>`** (los dos radios de "Hora de fin"/"Duración", `hourglass.html:1325-1327`, usan el patrón de envoltura en vez de `for`, que es igual de válido). Revisé cada aparición de `<input `/`<select `/`<textarea ` en el archivo (más de 25 controles, listados con `grep`) y no encontré ninguno sin nombre accesible.
- Región de anuncios: `<div id="live" class="sr-only" role="status" aria-live="polite">` (línea 334), alimentada por `say(text)` (línea 827) en cada acción relevante (iniciar/pausar/detener cronómetro, guardar registro, crear/editar/archivar/eliminar proyecto, guardar bloques fijos) — cobertura amplia, no until un solo caso de acción importante sin anuncio.
- Mensajes de error: `msgHtml()` (línea 829-832) usa `role="alert"` únicamente para el mensaje mismo (correcto), y no reutiliza `role="status"` para errores como sí le pasó a Bitácora (hallazgo del 2026-07-27, ya corregido aquí desde el diseño original).
- Botones con icono only (`←`/`→` de navegación de periodo) llevan `aria-label="Periodo anterior"`/`"Periodo siguiente"` (línea 956/958). No encontré ningún botón compuesto solo por un ícono/emoji sin nombre accesible en ningún otro punto del archivo.

## 7. Color nunca como única señal

- El indicador de "Estado de carga" (verde/amarillo/rojo, `hourglass.html:250-252` + `717-721`) siempre trae un título de texto explícito ("Carga bajo control"/"Cerca del límite"/"Sobrecarga") además del color — confirmado leyendo `ESTADO_TEXTO` (línea 717-721) y su uso en `renderPanel` (línea 964-965). No hay ningún camino donde se pinte el color sin el texto.
- Los "swatch" de color de proyecto/sección (`hourglass.html:909`, `1014`) siempre van seguidos del nombre del proyecto/sección en texto — nunca es la única forma de identificarlos.
- El punto que late del chip "cronómetro en curso" (`.running-chip .dot`, `hourglass.html:210-212`) es `aria-hidden="true"` (línea 1812) y el chip siempre incluye el conteo en palabras ("N cronómetro(s) en curso · HH:MM:SS") — el color/parpadeo es puramente decorativo, no la única señal.

## 8. El punto del chip deja de latir con `prefers-reduced-motion`

Confirmado por lectura de código: `hourglass.html:293-298`
```
@media (prefers-reduced-motion: reduce){
  .running-chip .dot{animation:none;}
  *{transition:none !important;}
}
```
Correcto y, a diferencia de la escena de login, **este bloque sí está en el propio `hourglass.html`, autocontenido** (no depende de `auth-gate.js`). No se pudo forzar la preferencia en vivo esta sesión (ver aviso de cobertura), pero la regla es directa y sin condición: no hay ningún camino de código donde sobreviva la animación con la preferencia activa.

## Contraste de color — calculado desde los valores reales del CSS (fórmula WCAG de luminancia relativa, no estimación visual)

No se pudo confirmar con `getComputedStyle` en vivo (sin herramienta de JS en esta sesión), pero los valores de origen (hex exactos de `:root` y de cada regla) se tomaron directamente del código, no de memoria ni de una paleta parecida, y el contraste se calculó con la fórmula real de WCAG 2.x (luminancia relativa por canal sRGB, `(L1+0.05)/(L2+0.05)`):

| Par | Valores | Contraste | Umbral | Resultado |
|---|---|---|---|---|
| `--muted` (#5C6670) sobre blanco/`--card` | texto normal 11.5-13px | **5.85:1** | 4.5:1 | Pasa |
| `--muted` sobre `--paper` (#F5F6F4) | ídem | **~5.75:1** | 4.5:1 | Pasa |
| `--teal-text` (#1F6763) sobre blanco | `.panel h2`, `.btn.ghost` | **6.60:1** | 4.5:1 | Pasa |
| blanco sobre `--teal-text` | `.btn` (texto de botón) | **6.60:1** | 4.5:1 | Pasa |
| `--verde-tx` (#1F6B45) sobre `--verde-bg` (#E6F4EC) | `.estado.verde` | **5.70:1** | 4.5:1 | Pasa |
| `--ambar-tx` (#7A5A12) sobre `--ambar-bg` (#FBF1DC) | `.estado.amarillo` | **5.68:1** | 4.5:1 | Pasa |
| `--rojo-tx` (#97362C) sobre `--rojo-bg` (#FBE9E7) | `.estado.rojo`, chip "Lleva mucho tiempo" | **6.21:1** | 4.5:1 | Pasa |
| `.tab` inactivo `#AECDCA` sobre `--dark-2` (#1B3840) | pestañas sobre fondo oscuro | **7.34:1** | 4.5:1 | Pasa |
| `.tab[aria-selected=true]` blanco sobre `--dark-2` | pestaña activa | **12.45:1** | 4.5:1 | Pasa |
| `.chip` texto `#3A444C` sobre `#F2F4F2` | chips de tabla | **9.01:1** | 4.5:1 | Pasa |
| `.running-chip` texto `#CFF0EC` sobre su fondo compuesto (`rgba(63,184,174,.16)` sobre `--dark` #12242A) | chip del header | **9.85:1** | 4.5:1 | Pasa |
| Anillo de foco `--teal` (#2E8C86) sobre blanco | `:focus-visible` de inputs/botones | **4.03:1** | 3:1 (no-texto) | Pasa |
| Anillo de foco `#7FE3DC` sobre `--dark-2` | `:focus-visible` de pestañas | **8.26:1** | 3:1 (no-texto) | Pasa |

**No encontré ninguna combinación de color bajo el umbral AA en esta app** — a diferencia de lo que se ha visto repetidamente en las otras 5 apps del hub (badge de Bitácora en 4.44:1, barras de Gantt en 1.63-2.57:1, etc.), esta paleta nueva pasa en todos los pares revisados, incluidos los que el encargo pidió explícitamente medir. Dicho esto, esto es una limitación real: sin `getComputedStyle` en vivo, no puedo descartar que algún estilo en cascada (por ejemplo, un `opacity` heredado o una regla de estado no vista) cambie el color final renderizado respecto al valor literal del CSS — la tabla de arriba es aritmética correcta sobre el código fuente, no una medición del navegador.

## Hallazgo adicional — foco visible en el `tabpanel`

`hourglass.html:222`: `[role="tabpanel"]:focus{outline:none;}`. Los 5 `tabpanel` tienen `tabindex="0"` (líneas 327-331), es decir, son una parada real en el orden de tabulación entre el botón de pestaña activo y el primer control dentro del panel. Esa regla quita el indicador de foco (con el selector `:focus`, no `:focus-visible` — más agresivo, sin excepción para mouse/teclado) sin sustituirlo por nada. Consecuencia: un usuario de teclado que llegue a esa parada del recorrido (Tab desde la pestaña activa) no ve ningún indicador visual de que el `tabpanel` tiene el foco — incumple WCAG 2.4.7 (Focus Visible) para esa parada puntual. No es grave (el contenido interactivo real dentro del panel sí tiene su propio `:focus-visible`, líneas 219/231), pero es una parada real sin indicador, y una edición de una sola línea (`outline` visible aunque sutil, o quitar el `tabindex="0"` si no se necesita como contenedor de scroll) lo cerraría.

---

## 2026-08-02 — Revisión del commit `3ff7445` ("Hourglass CR-01 a CR-04: panel flotante, bloques fijos reales, dashboard gráfico y vista Año")

Verificado contra `git diff 195c205..3ff7445` (real, no descrito) y contra la app corriendo en `http://localhost:8791/`.

### Aviso de herramienta de esta sesión — leer antes que el resto

- `computer{action:"screenshot"}` **funcionó una sola vez**, al principio de la sesión (confirmó visualmente el candado de login con la escena `hourglass-time` y el foco inicial en "Correo"), y **dejó de componer frames a partir de ahí** ("the Browser pane is not displayed, so the page is not compositing frames") en los intentos siguientes, en 3 pestañas distintas (`tab-1`, `tab-2`, `tab-3` vía `preview_start`) — coincide exactamente con el aviso que se me dio al encargar esta revisión.
- **No tengo ninguna herramienta de evaluación de JavaScript en esta sesión** (no hay `navigate` a `javascript:`, ni consola, ni un tool de "exec"/`evaluate" en mi lista de herramientas) — a diferencia de lo que el encargo describía haber usado ("inyectando en el shadow DOM las mismas declaraciones del bloque `@media` y midiendo `getComputedStyle`"). No pude reproducir esa técnica. Lo dejo explícito en vez de simular una verificación que no hice.
- Reconfirmado el patrón ya documentado por el equipo (qa-lead, 2026-07-23): `get_page_text`/`read_page` **no reflejan el candado de login ni el resto del shadow DOM** — con el candado visualmente en pantalla (confirmado por la única captura que funcionó), ambas herramientas devolvían el contenido completo del Panel con datos reales ("Bloques Fijos 100%", "Sueño 7 h", etc.), como si no hubiera overlay. Cualquier hallazgo de este documento que dependa de `read_page`/`get_page_text` para "ver" el estado de la app está marcado como tal, no como confirmado visualmente.
- Sí pude usar `computer{action:"key", text:"Tab"}` para mover el foco por el formulario de login (confirmado con la única captura real: 1 Tab desde el estado inicial llevó el foco de "Correo" —con foco automático al montar el overlay— a "Contraseña", con el anillo naranja de `:focus-visible` visible). No pude confirmar el resto del recorrido (Entrar, enlace de recuperación, ciclo de vuelta) porque el compositing se cayó justo después.
- **Consecuencia práctica:** los puntos 1 (panel flotante) y 2 (gráficos SVG/heatmap) de este encargo se verifican por **lectura completa y literal del código fuente citado línea por línea**, no por interacción en vivo confirmada — salvo donde se dice explícitamente lo contrario. El punto de `prefers-reduced-motion` también es por lectura de código (trazado de cada regla CSS y de cada `setInterval`/gate en JS), no por `getComputedStyle` real, a diferencia de lo que hizo el tech lead al cerrar el caso 7 del triaje el 2026-07-30 con una herramienta distinta.

### 1. Panel flotante de cronómetros (`hourglass.html:317-2650` aprox.)

**Asa (`fp-grip`) y teclado — correcto, verificado por código:**

- `hourglass.html:2523`: `<span class="fp-grip" tabindex="0" role="button" aria-describedby="fp-drag-help" title="Arrastra para mover. Con el teclado, usa las flechas.">`. El asa **no tiene `aria-label` propio**, pero su nombre accesible se compone de su contenido de texto real: cuando el panel está expandido, el título ("N cronómetro(s)") + el total (`HH:MM:SS`); cuando está minimizado, solo el total (el punto `.dot` dentro de `.fp-pill` es `aria-hidden`, línea 2528). Es decir, un lector de pantalla anuncia algo con sentido real ("2 cronómetros, 01:23:45, botón") y no solo "botón" — cumple el punto del encargo, aunque no sea vía `aria-label` explícito.
- `hourglass.html:2539`: `<span id="fp-drag-help" class="sr-only">Arrastra este panel con el ratón, o muévelo con las flechas del teclado cuando esté enfocado.</span>` — instrucción explícita del comportamiento no estándar (un `role="button"` que en realidad responde a las 4 flechas para moverse, no solo a Enter/Espacio para "activarse"). Es una mitigación razonable a la ambigüedad semántica de usar `role="button"` para este patrón (no hay un rol ARIA estándar para "asa de arrastre movible con teclado"); no es perfecto pero está comunicado.
- `hourglass.html:2614-2628`: el manejador de `keydown` del asa mueve el panel con `ArrowLeft/Right/Up/Down` (paso de 12px, 40px con Shift — confirma "Shift acelera" del encargo), con `e.preventDefault()` y sin llamar a `render()`/`renderFloatPanel()` — el nodo del panel no se destruye ni se reconstruye durante el movimiento, así que **el foco no se pierde** al mover el panel con el teclado (confirmado por lectura de código, no solo supuesto: el handler solo hace `panel.style.left/top = ...`).
- `hourglass.html:2536`: `aria-expanded="' + (fp.min ? 'false' : 'true') + '"` en el botón de minimizar/expandir — semánticamente correcto (`true` = contenido visible/expandido, `false` = minimizado), confirmado en las dos ramas del ternario.
- Botones de pausar/detener (`hourglass.html:2552-2555`): son `<button>` nativos con texto visible ("▶ Reanudar"/"⏸ Pausar"/"⏹ Detener"), alcanzables en el orden del DOM justo después del asa y el botón de minimizar — no encontré ningún control dentro del panel sin nombre accesible.
- **No atrapa el foco**: no hay ningún listener de `Tab`/`Shift+Tab` en `wireFloatPanel()` (a diferencia del modal de cronómetro olvidado, que si tiene uno) — Tab entra y sale del panel con normalidad.
- **No se monta antes que el candado**: `#float-host` (`hourglass.html:432`, `z-index:900` en `#float-panel`, `hourglass.html:322`) queda muy por debajo del candado de `auth-gate.js` (`z-index:2147483647`, `auth-gate.js:191`) y del widget de Cuenta (`z-index:2147483646`) — confirmado por lectura de ambos archivos, sin solape de capas posible mientras el candado esté activo.
- **Convive correctamente con el modal de "cronómetro olvidado" preexistente**: `lockBehindModal()` (`hourglass.html:2739-2746`, código NO tocado por este diff) itera **todos** los hijos de `document.body` sin excepción (salvo el propio host del modal) y les pone `inert` — como `#float-host` es un hijo directo de `<body>` (declarado en el HTML estático desde el principio, `hourglass.html:432`), automáticamente queda `inert` mientras el modal está abierto, sin necesidad de ningún cambio en este commit. Confirmado además el orden de arranque (`hourglass.html:2761-2769`: `render()` — que llena `#float-host` — corre **antes** que `checkStaleTrackers()` — que aplica `inert`), así que no hay ninguna ventana donde el panel ya tenga contenido pero quede sin bloquear.

**Hallazgo nuevo 1 — arrastre sin evitar colisión con controles de la app, y la posición persiste (`hourglass.html:2498-2505`, `clampFloat()`):**

`clampFloat(x, y, el)` solo acota `x`/`y` para que el panel no salga de la ventana (`clamp(x, 6, innerWidth - w - 6)` etc.) — **no hay ninguna lógica que evite que el panel se posicione encima de la barra de pestañas (`<nav class="tabs">`), la cabecera, o cualquier control de la vista activa**. Ni el arrastre con ratón (`pointermove`, línea 2593) ni el movimiento con flechas (línea 2614) consultan la posición de ningún otro elemento antes de mover el panel ahí. Probado por trazado del código, no en vivo (ver aviso de herramienta), pero es determinista: si la usuaria arrastra o empuja el panel (con Shift+flechas, que mueve 40px por pulsación) hasta la franja superior de la pantalla, el panel (posición fija, `z-index:900`) queda **visualmente encima** de la barra de pestañas o de cualquier botón que esté ahí en ese momento, interceptando los clics del ratón sobre esa zona mientras el panel esté ahí (el navegador entrega el clic al elemento de mayor `z-index` en ese punto). El Tab por teclado **no** se ve afectado (el orden de tabulación no depende del apilamiento visual), pero un control tapado que reciba el foco por Tab pierde su indicador visual de foco a la vista de la usuaria — un caso concreto de WCAG 2.4.7 (Focus Visible) roto por ocultamiento, no por ausencia de la regla `:focus-visible` en sí. Agravante real: `fp.x`/`fp.y` se guardan en `localStorage` (`saveFloatPref()`, línea 2490-2493, `FLOAT_PREF_KEY = 'hourglass_float_panel'`, línea 2476) y se restauran en cada carga (`loadFloatPref()`, línea 2479-2489) — si la usuaria deja el panel tapando un control, **queda tapado en todas las visitas siguientes**, no solo en esa sesión, hasta que alguien lo note y lo mueva. No bloqueante (nada quiere decir "inalcanzable", solo "visualmente tapado a veces"), pero es un caso borde real y concreto que vale la pena documentar. Ver Caso borde 17 en `requerimientos.md`.

**Hallazgo nuevo 2 — el panel queda al final del orden de tabulación de toda la página (`hourglass.html:430-432`):**

`<div id="float-host"></div>` está declarado en el HTML justo antes de `<div id="modal-host"></div>`, al final del `<body>`, después de `<header>`, `<nav>` y los 5 `<div role="tabpanel">` de `<main>`. Como el orden de tabulación del navegador sigue el orden del DOM (no el apilamiento visual/`z-index`), una usuaria de teclado que quiera pausar o detener un cronómetro desde el panel flotante — que está **visible en todo momento sobre cualquier pestaña** — tiene que recorrer con Tab **todos** los controles de la pestaña que esté viendo en ese momento (que en Registros/Proyectos puede ser una tabla larga con filtros, según ya documentó `qa-lead`/`accessibility-reviewer` en revisiones previas) antes de llegar al asa del panel. No es un defecto de accesibilidad en el sentido estricto (todo sigue siendo alcanzable, en orden lógico dentro de cada sección), pero contradice la propia razón de ser del panel — "acceso rápido a los cronómetros sin cambiar de pestaña" — para quien navega solo con teclado. No verificado en vivo (el compositing se cayó antes de poder confirmar el recorrido completo de Tab), pero es una consecuencia directa y determinista de la posición del nodo en el DOM. Ver Caso borde 18 en `requerimientos.md`.

### 2. Los 5 gráficos SVG nuevos (`hourglass.html:1464-1657`)

Los 5 (`overloadRing`, `chartStackedDays`, `chartDonut`, `chartWeeklyTrend`, `chartHeatmap`) llevan `role="img"` con `aria-label` armado con `esc(...)` (nunca HTML sin escapar) y un resumen en palabras del dato — confirmado en las 5 funciones, `hourglass.html:1480, 1530, 1572, 1610, 1648`. Todos menos uno pasan la pregunta del encargo ("¿el resumen es de verdad suficiente, o algo queda solo en el color?"):

- **Anillo (`overloadRing`)**: el color del arco (verde/ámbar/rojo) es puramente redundante — el mismo dato (porcentaje, estado) está en el propio `aria-label` y, fuera del SVG, en el título de texto adyacente (`<h3>{estado.titulo}</h3>`, `hourglass.html:1299`). Correcto.
- **Dona (`chartDonut`)**: cada sección tiene su color de relleno, pero la leyenda (`<ul class="donut-legend">`, línea 1568-1570) repite nombre + porcentaje + horas en texto para cada una — nunca solo color. Correcto.
- **Barras apiladas (`chartStackedDays`)**: mismo patrón, con leyenda de nombres+color debajo (línea 1314). El detalle exacto por día vive además en la tabla plegable "Día por día" (ver abajo). Correcto.
- **Heatmap (`chartHeatmap`, `hourglass.html:1621-1657`) — el caso señalado por el encargo, confirmado real pero matizado:** cada celda usa color de relleno (`TONO`) + color de borde (`BORDE`) para decir "verde/ámbar/rojo/sin datos" (líneas 1638-1642), y el único texto dentro de la celda es el número del día (no el estado). El `aria-label` del `<svg>` (línea 1649) da un resumen agregado ("N día(s) en rojo, N en amarillo, N en verde"), y debajo hay una leyenda con los mismos 3 conteos (líneas 1652-1656) — ninguno de los dos dice **qué día específico** es cuál. La alternativa accesible real, por día, es la tabla plegable "Día por día (detalle)" (`hourglass.html:1444-1458`, ver más abajo) que **sí está presente y sí se muestra siempre que el heatmap se muestra** (el heatmap solo aparece en modo "Mes", `hourglass.html:1316`, y la tabla se excluye solo en modo "Año", `hourglass.html:1444` — nunca coinciden ambas condiciones de forma que el heatmap quede sin su alternativa). Es decir: la información SÍ está disponible en texto, tal como pide WCAG 1.4.1, pero requiere abrir un `<details>` colapsado — no es "de un vistazo" como el resto del panel. No es una violación de la norma (que no exige que la alternativa esté en el mismo lugar), pero si el objetivo de este gráfico es "verlo de reojo y saber qué día estuvo mal" sin abrir nada, ese objetivo no se cumple para quien no puede distinguir el color. Documentado como observación, no como hallazgo bloqueante.
- **Tendencia semanal (`chartWeeklyTrend`, `hourglass.html:1580-1618`) — hallazgo real, no señalado por el encargo:** cada punto de la línea de "tiempo de reloj" se pinta con el mismo esquema de color de estado (verde/ámbar/rojo según `statusOf(w.relojMin, w.availMin)`, línea 1598-1600), **pero el `aria-label` del gráfico (línea 1610-1612) solo da la dirección general** ("la carga va subiendo/bajando/estable... de X la primera semana a Y la última") **y no dice el estado de cada semana individual** — a diferencia del anillo/dona/barras, aquí el color de cada punto es la única forma de saber "¿esta semana en concreto estuvo en rojo?". Esto no importa cuando el gráfico se muestra junto con la tabla "Día por día" (modo Mes/Personalizado corto), porque ahí sí se puede reconstruir el estado semana a semana sumando 7 filas — tedioso pero posible. **Pero en la vista Año (`ui.range.mode === 'anio'`) esta tendencia también se muestra** (se activa con `sum.days.length > 8`, línea 1319, y un año tiene 365 días) **y la tabla "Día por día" está deliberadamente apagada para "anio"** (`hourglass.html:1444`, reemplazada por la tabla "Mes a mes de {año}" que es mensual, no semanal). Resultado: en la vista Año, el estado semana a semana de la línea de tendencia **quiere decir algo solo por color, sin ninguna tabla ni texto en ningún lugar de la interfaz que lo repita por semana**. Es un hallazgo concreto de WCAG 1.4.1 (Uso del color), acotado a una combinación específica (vista Año + gráfico de tendencia), no a los otros 4 gráficos. Ver Caso borde 19 en `requerimientos.md`.

### 3. Tabla "Día por día (detalle)" — `<details>` (`hourglass.html:1444-1458`)

- Es un `<details class="panel">`/`<summary>` nativo — teclado gratis por la plataforma (Enter/Espacio sobre el `<summary>` enfocado alterna abierto/cerrado; comportamiento del navegador, no de la app, ya confirmado por el propio equipo en revisiones anteriores del patrón equivalente del hub). `summary:focus-visible` tiene `outline` propio (`hourglass.html:226`), y el marcador `::before` (`▸`/`▾`) es contenido CSS generado, no un elemento con su propio foco.
- Contiene la tabla con Día/Reloj/Bruto/Disponible/**Estado** (columna de texto, no solo color: `<span class="chip" ...>{estado.titulo}</span>`, línea 1456) — buena alternativa textual completa, un dato por fila, sin recorte de filas (a diferencia del historial de Registros, que sí tiene un tope de 300 documentado en requerimiento 38). **Nota de proceso, no de accesibilidad**: para un rango "Personalizado" largo (hasta 366 días dentro de un mismo año), esta tabla no tiene ningún tope de filas — es un caso borde de rendimiento/usabilidad para `qa-lead`, no del ámbito de este agente, lo dejo anotado en "Casos borde" para que quede en la lista compartida.

### 4. `prefers-reduced-motion` — verificado por lectura de código, no por `getComputedStyle` en vivo (ver aviso de herramienta)

**Panel flotante (`hourglass.html:389-396`):**
```
@media (prefers-reduced-motion: reduce){
  .running-chip .dot, .fp-pill .dot{animation:none;}
  *{transition:none !important;}
}
```
El punto que late del panel minimizado (`.fp-pill .dot`, línea 2528, `animation:pulse 1.8s ease-in-out infinite` definida en `hourglass.html:344`) queda cubierto explícitamente junto al del chip de cabecera ya existente. Correcto y completo — no encontré ningún otro elemento animado nuevo en `hourglass.html` fuera de este selector.

**Escena de login `hourglass-time` — extendida por este commit (relojes de arena que se voltean, manecillas, dos puntos que parpadean, salto del gato):**

- El bloque general compartido (`auth-gate.js:1298-1325`, no es un bloque nuevo — extiende el mismo bloque que ya cubría `coins-rain`/`gantt-build`) agrega, para esta escena: `.hg-sand-top{transform:scale(0.45)}`, `.hg-sand-bot{transform:scaleY(0.55)}`, `.hg-stream{opacity:0.85}`, `.hg-glass-turn{transform:none}` (relojes de arena — valores intermedios reales de sus respectivos `@keyframes`, no extremos en 0, igual que ya lo hacía la versión anterior), y **dos reglas nuevas de este commit**: `.hg-cat{opacity:0.94}` (el gato se queda visible, posado) y, agregadas junto a los saltos nuevos, `.hg-cat-hop{transition:none}` + `.hg-cat-arc{transform:none;opacity:1}` (`auth-gate.js:1321-1324`) — cubren tanto la transición CSS de `left`/`top` (que mueve al gato de un reloj a otro) como la animación `hg-cat-jump` del arco (el salto en sí). Confirmado por lectura de cada regla que ninguna deja al gato invisible u oculto.
- Las manecillas del reloj analógico (`.hg-hand-hour`/`.hg-hand-min`/`.hg-hand-sec`, animación `hg-spin infinite`) no tienen una regla propia dentro del bloque de reducción — **pero no la necesitan**: quedan cubiertas por la regla general de apertura del bloque, `.cover *{ animation:none !important; }` (`auth-gate.js:1299`), y su posición de reposo (sin `transform`, es decir `rotate(0deg)`) es un estado visualmente completo (las 3 manecillas apuntando hacia arriba desde el centro), no una manecilla desaparecida ni fuera de escala.
- **Los dos puntos del reloj digital**: `.hg-dig-colon{ animation:hg-blink 2s step-end infinite; }` (`auth-gate.js:203`) queda cubierto por `.hg-dig-colon{opacity:1;}` dentro del mismo bloque (`auth-gate.js:1324`) — los dos puntos quedan encendidos de forma fija, ninguno desaparece.
- **Apagado también desde JS, confirmado por lectura de `hourglassScene()` (`auth-gate.js:2039-2075`, función nueva de este commit):** el `setInterval` que repinta los relojes digitales cada segundo (línea 2027) solo se arranca `if(!reduce())` (línea 2026, `reduce()` lee `tiltQuery.matches` — el mismo `matchMedia` compartido que ya usaba la inclinación 3D de la tarjeta) — con la preferencia activa, el reloj pinta su hora una sola vez al montar (`paint()` corre siempre antes del `if`, línea 2025) y se queda fijo ahí, sin seguir contando. El salto del gato (`startHops()`/`stopHops()`, líneas 2059-2070) solo arranca su propio `setInterval` si `!reduce()`, y además escucha `tiltQuery.addEventListener("change", ...)` (línea 2074-2077) para detenerse si la preferencia se activa **con el login ya abierto** — mismo patrón ya usado por el zoom automático de StaffGate (`d15e05c`, 2026-07-24) y por la inclinación de la tarjeta (`40c43f5`, 2026-07-26). Correcto y consistente con el resto del archivo.
- **No pude confirmar nada de esto con `getComputedStyle`/`matchMedia` forzado en vivo** (sin herramienta de JS esta sesión, ver aviso arriba) — a diferencia de lo que se me pidió verificar. Es lectura de código, marcada como tal.

### 5. Contraste de color — calculado con la fórmula real de luminancia relativa WCAG 2.x sobre los valores hexadecimales exactos del código (no estimación visual, no medido con `getComputedStyle` por falta de herramienta esta sesión)

| Par | Dónde | Contraste calculado | Umbral | Resultado |
|---|---|---|---|---|
| `#16212B` sobre `#BFE3CE` (heatmap, verde) | número de día, celda "bien" | **11.73:1** | 4.5:1 | Pasa |
| `#16212B` sobre `#F2DFAE` (heatmap, ámbar) | número de día, celda "al límite" | **12.39:1** | 4.5:1 | Pasa |
| `#16212B` sobre `#EFBDB4` (heatmap, rojo) | número de día, celda "sobrecarga" | **9.80:1** | 4.5:1 | Pasa |
| **`#9AA29B` sobre `#F1F3F0`** (heatmap, celda vacía) | número de día, celda "sin registrar" | **≈2.35:1** | 4.5:1 | **NO pasa** |
| `#5C6670` sobre `#FBFCFB` | textos de ejes/etiquetas dentro de los 5 SVG | **5.69:1** | 4.5:1 | Pasa |
| `#EAF3F2` sobre `#12242A` | texto principal del panel flotante (título, tiempo) | **14.18:1** | 4.5:1 | Pasa |
| `#9FBFBC` sobre `#12242A` | texto secundario del panel flotante (`.fp-sec`) | **8.12:1** | 4.5:1 | Pasa |
| `#2E8C86` (Trabajo) sobre blanco | segmento de dona/barra, como objeto gráfico | **4.03:1** | 3:1 | Pasa |
| `#B8862F` (Voluntariado) sobre blanco | ídem | **3.24:1** | 3:1 | Pasa (margen chico) |
| `#7C6BB0` (Personal) sobre blanco | ídem | **4.58:1** | 3:1 | Pasa |
| `#6B7A8F` (Bloques Fijos) sobre blanco | ídem | **4.37:1** | 3:1 | Pasa |
| `#B8862F` (arco ámbar del anillo, mismo tono) sobre blanco | `overloadRing`, estado "amarillo" | **3.24:1** | 3:1 | Pasa (mismo margen chico) |

**Hallazgo real: el texto del número de día en las celdas "sin registrar" del heatmap (`#9AA29B` sobre `#F1F3F0`, `hourglass.html:1639` y `1642`) da ≈2,35:1, muy por debajo de 4,5:1.** Aclaración sobre el encargo: se me pidió medir "`#F1F3F0` con texto `#16212B` encima" — **no es así en el código real**: `#16212B` se usa solo para las celdas con color (verde/ámbar/rojo, donde sí pasa cómodo, 9,8–12,4:1); la celda vacía usa un segundo color de texto más claro, `#9AA29B`, específicamente para verse "apagada" — y ese es el que falla. Es un hallazgo concreto y accionable (afecta solo al número del día en celdas sin tiempo registrado, dato de bajo impacto pero visible), no una sospecha. El resto de los pares pedidos por el encargo pasa cómodamente; el color de sección más ajustado (`#B8862F`, reutilizado tanto para "Voluntariado" como para el arco ámbar del anillo) pasa el umbral de 3:1 con un margen pequeño (0,24) — no es un hallazgo, pero si algún día se oscurece ese tono por diseño, vale la pena remedir. Ver Caso borde 20 en `requerimientos.md`.

## Veredicto (2026-08-02, commit `3ff7445`)

**APROBADO CON OBSERVACIONES.**

Ningún hallazgo de este commit llega al nivel de "control genuinamente inalcanzable por teclado" (la barra de RECHAZADO): el asa del panel flotante es alcanzable, se mueve con teclado con una instrucción explícita para lectores de pantalla, el botón de minimizar tiene `aria-expanded` correcto, los botones de pausar/detener son botones nativos con texto, el panel no atrapa el foco y respeta correctamente tanto el candado de login como el modal de cronómetro olvidado preexistente (este último sin ningún cambio necesario, gracias a que `lockBehindModal()` ya itera todos los hijos de `<body>` sin excepción). Los 5 gráficos nuevos tienen `role="img"` + `aria-label` con datos reales, y 4 de los 5 nunca dejan información solo en el color gracias a leyendas/tablas textuales.

Quedan pendientes, no bloqueantes:
1. **Contraste real bajo AA**: el número de día en celdas vacías del heatmap (`#9AA29B`/`#F1F3F0`, ≈2,35:1) — arreglo de una línea (oscurecer el gris o acercarlo a `#5C6670`, que sí pasa contra fondos claros similares).
2. **Uso de color sin alternativa textual en un caso concreto**: los puntos de la línea de tendencia semanal, específicamente en la vista Año (donde la tabla diaria se apaga a propósito y no existe una tabla semanal que la sustituya).
3. **Colisión de posición del panel flotante** con controles de la app (sin evitarla, y persistente entre sesiones vía `localStorage`) — no crea una trampa de teclado, pero sí puede tapar visualmente un control que conserva el foco.
4. **Orden de tabulación**: el panel flotante, aunque visible sobre toda la app, queda al final de la secuencia de Tab de la página completa.
5. El heatmap resuelve bien el "no solo color" pero solo si se abre la tabla plegada — no es "de un vistazo" para quien no distingue el color, aunque sí es accesible.

**Limitación de esta revisión, para quien la retome:** ninguno de los 5 puntos de arriba se confirmó con interacción real en el navegador (arrastre real del panel, `getComputedStyle` forzando la preferencia, clics/Tab reales más allá del primer campo de login) — el compositing del panel del navegador se cayó a mitad de esta sesión, tal como se avisó al encargarla. Toda la verificación es lectura completa y literal del código citado línea por línea, cruzada donde fue posible con los patrones ya confirmados en vivo por el equipo en revisiones anteriores de este mismo archivo. Recomendado repetir el arrastre real del panel (mouse y teclado) y la emulación de `prefers-reduced-motion` en una sesión donde el navegador sí componga.

---

## Veredicto de la revisión anterior (2026-07-30, sin fusionar entonces)

**APROBADO CON OBSERVACIONES.**

No encontré ningún hallazgo del nivel "control genuinamente inalcanzable por teclado" (la barra que bloquearía con RECHAZADO según la regla del proyecto) — al contrario, la lectura completa del código muestra un patrón consistentemente correcto: controles nativos (`<button>`, `<label>`, `<select>`) en vez de reinvenciones, ARIA de pestañas siguiendo el patrón APG, trampa de foco de diálogo bien implementada, contraste de color que pasa AA en todos los pares revisados, y color que nunca es la única señal.

Dicho esto, dos observaciones concretas quedan pendientes (ninguna bloqueante):
1. El diálogo de "cronómetro olvidado" no aplica `inert`/`aria-hidden` al resto de la página — brecha real para lectores de pantalla en modo de cursor virtual, no para usuarios de solo-teclado.
2. El `tabpanel` pierde el indicador de foco visible en una parada real del recorrido de Tab.

---

## Revisión 2026-08-04 — rama `hourglass-ventana-pastilla-siempre-visible` (diff acotado a `hourglass.html`, pastilla `.pip-mini`)

Encargo: revisar accesibilidad del cambio que hace que la ventana aparte de cronómetros ya no se cierre al volver a la vista Cronómetros, sino que se colapse a una pastilla chica (`pintarPip()`, rama `colapsado`, `hourglass.html:2866-2908`; CSS en `hourglass.html:395-406`).

### Método y limitación de herramienta (léase antes que los hallazgos)

No hay ejecución de JS disponible en esta sesión (sin `javascript_exec`/consola), así que **no se pudo abrir una ventana Document Picture-in-Picture real** — coincide con la limitación ya documentada varias veces en este archivo y en `docs/team-memory.md`, y el propio encargo eximía expresamente esta prueba. Lo que sí hice:

- **Lectura completa y literal del diff** (`git diff origin/master -- hourglass.html`) y del código circundante no tocado por el diff pero relevante (`renderFloatPanel()`, `ajustarVentanaSegunVista()`, `pintarPip()` completo).
- **Cálculo manual de contraste WCAG** (fórmula real de luminancia relativa, con composición alfa sobre el fondo real) para el color nuevo `.fp-mini-close`, no una estimación visual.
- **Servidor real** (`http://localhost:8791/hourglass.html`, `.claude/static-server.ps1`): confirmé `0` errores de consola tras el cambio (`read_console_messages`) — descarta una rotura de sintaxis como la que costó el candado de login el 2026-07-30. `get_page_text` funcionó y mostró el panel normal renderizado; `computer{action:"screenshot"}` volvió a fallar con "the Browser pane is not displayed" (mismo patrón crónico de esta app), así que no hay captura visual real de esta sesión tampoco.
- **Reproducción aislada** del marcado exacto de la pastilla (copiado literal de `hourglass.html:2876-2881`) con el CSS real (copiado literal de `hourglass.html:383-406`) en un archivo de prueba fuera del repo (`pip-mini-repro.html`, en el scratchpad de esta sesión, nunca escrito dentro del proyecto): sirvió para medir el `getBoundingClientRect()` del botón con un script embebido en el propio archivo de prueba (no en la app), pero el navegador de esta sesión renderiza archivos fuera de la carpeta del proyecto como "instantánea estática" sin interacción — no pude confirmar el resultado con `get_page_text`/`screenshot` en vivo tampoco. La cifra de tamaño de caja que reporto abajo es del **cálculo del modelo de caja CSS**, no de una medición en pantalla.

Ninguno de los hallazgos de abajo se presenta como "confirmado con interacción real"; están marcados según lo que realmente pude verificar (código + servidor real sin interacción, o cálculo matemático) frente a lo que es deducción de lectura.

### 1. `prefers-reduced-motion` dentro de la ventana aparte real — VERIFICADO POR CÓDIGO, no solo supuesto

El punto que late (`.fp-pill .dot`) ya tenía su regla de apagado desde el 2026-08-02 (`hourglass.html:413-417`, dentro del mismo `<style>` que define `.fp-pill .dot`). Lo que pedía específicamente este encargo — si esa regla **sobrevive** al mecanismo de copia de estilos hacia el `document` de la ventana aparte, que es *otro* documento con su propio `matchMedia` — sí se sostiene: `abrirVentanaFlotante()` (`hourglass.html:2725-2731`) copia `document.styleSheets` iterando `ss.cssRules` y concatenando `r.cssText` de cada regla de nivel superior. Para una regla `@media`, `CSSMediaRule.cssText` (API estándar del CSSOM) devuelve el bloque `@media (...) { ... }` completo, no solo sus reglas internas — así que el bloque de `prefers-reduced-motion` de la línea 413-417 se copia íntegro al `<style>` que se inyecta en `pipWin.document.head`. Como `prefers-reduced-motion` es una preferencia del sistema operativo/navegador (no del documento), se evalúa igual en cualquier documento del mismo navegador, incluida la ventana aparte. **Conclusión: el punto de la pastilla debería dejar de latir en la ventana aparte real también, no solo en la página**, sin necesitar ningún cambio de código. No verificado con `getComputedStyle`/`getAnimations()` en una ventana PiP real (imposible sin gesto genuino en esta sesión) — es lectura correcta del mecanismo, marcada como tal.

### 2. Contraste de `.fp-mini-close` — calculado, no estimado

Fondo real detrás del botón: `.pip-body`/`#float-panel` usan `background:var(--dark)` = `#12242A` (`hourglass.html:321-323, 388`); `.pip-mini` no cambia el fondo.

| Color / estado | Fórmula | Contraste calculado | Umbral | Resultado |
|---|---|---|---|---|
| `.fp-mini-close` reposo: `rgba(234,243,242,0.6)` sobre `#12242A` | color compuesto ≈ `rgb(148,160,162)` | **≈5.96:1** | 4.5:1 (texto normal) | Pasa |
| `.fp-mini-close:hover`: `color:#EAF3F2` sobre `background:rgba(255,255,255,0.14)` compuesto sobre `#12242A` | fondo compuesto ≈ `rgb(51,67,72)` | **≈9.16:1** | 4.5:1 | Pasa |
| `.fp-mini-close:focus-visible`: contorno `#7FE3DC` sobre `#12242A` | mismo par ya usado en `.fp-btn`/`.fp-act`/`.fp-foot button` del propio archivo, ya aceptado en revisiones anteriores | — | 3:1 (borde de componente UI) | Pasa por consistencia con patrones ya verificados |

**Sin hallazgo de contraste aquí** — el color elegido (mismo `rgba(234,243,242,0.6)` que ya usa `.fp-dots`, línea 347) pasa cómodo incluso el umbral de texto normal, con margen de sobra.

### 3. Tamaño del objetivo táctil de `.fp-mini-close` — HALLAZGO NUEVO, no bloqueante

`.fp-mini-close` (`hourglass.html:400-404`): `padding:2px 5px`, `font-size:16px`, `line-height:1`, sin `width`/`height` explícitos, `border:none`. Con el modelo de caja del archivo (`*{box-sizing:border-box;}`, línea 200) y sin ningún `min-width`/`min-height`, la altura de la caja del botón queda determinada por `line-height (16px) + padding-top/bottom (2+2px) = 20px`, y el ancho por el glyph `×` a 16px (~9-10px) + `padding-left/right (5+5px) ≈ 19-20px`. **Caja resultante ≈ 20×20px CSS**, por debajo del mínimo de 24×24px CSS que pide WCAG 2.2 SC 2.5.8 (Target Size Minimum, nivel AA) y bien por debajo del objetivo práctico de 44×44px recomendado para táctil. Es, además, más chico que el patrón ya establecido en el propio archivo para botones equivalentes dentro del mismo panel: `.fp-btn` (el botón "⧉ Sacar a ventana aparte" de la página) es explícitamente `width:26px;height:26px` (línea 350-354) — el nuevo botón de cerrar la pastilla es el control interactivo más pequeño que se ha agregado a este panel hasta ahora. El encargo señala correctamente que la ventana aparte puede abrirse también en una laptop/tablet con pantalla táctil corriendo Chrome/Edge de escritorio (no depende de Chrome Android, que hoy no soporta `documentPictureInPicture`) — en ese escenario, un botón de ~20×20px es un objetivo de dedo genuinamente pequeño para la única forma de cerrar la pastilla sin usar el X nativo de la ventana del sistema. **Pendiente, no bloqueante** (la ventana del sistema operativo siempre ofrece su propio botón de cerrar como alternativa; nada queda inalcanzable). Remedio simple: agregar `min-width:24px;min-height:24px` o subir el padding.

### 4. `aria-label` dinámico del contenedor y del botón de cerrar — revisado, sin hallazgo bloqueante

- Contenedor mini: `aria-label` dinámico correcto vía `esc()` — "Cronómetro en curso" (singular, `n===1`) / "N cronómetros en curso" (`hourglass.html:2876`). Distinto en texto del contenedor de la vista completa ("Cronómetros en curso" fijo, línea 2883); ambos son `role="complementary"`, un landmark, no una región interactiva que compita entre sí.
- Botón de cerrar: `aria-label="Cerrar la ventana aparte"` (pastilla) vs. el botón de la vista completa, que no lleva `aria-label` propio y depende de su texto visible "Devolver a la página" (línea 2891) — ambos activan la misma función (`cerrarVentanaFlotante({manual:true})`), y ambos son suficientemente distintos en su anuncio por lector de pantalla ("Cerrar la ventana aparte, botón" vs. "Devolver a la página, botón") como para no confundirse entre sí al usarlos por separado. Diferencia menor, no un hallazgo: "Cerrar la ventana aparte" no deja explícito que el cronómetro sigue corriendo y el recordatorio vuelve a la página (que sí lo dice "Devolver a la página"), pero tampoco es información crítica para decidir si pulsarlo.

### 5. `data-fp-total` y lectura repetitiva — revisado, SIN hallazgo (comportamiento correcto confirmado por código)

Ni el contenedor (`role="complementary"`) ni ningún `<span data-fp-total>` llevan `aria-live` en ningún punto del archivo (`grep` completo de `aria-live` solo encuentra la región dedicada `#live` de la página principal, `hourglass.html:460`, que no envuelve la pastilla). La actualización de cada segundo (`setInterval`, `hourglass.html:3262-3279`) solo hace `el.textContent = fmtClock(total)` sobre el `<span>` existente — un cambio de texto en un elemento sin ningún ancestro `aria-live`/rol implícito de región viva no se anuncia por sí solo. **Correcto tal como está**: el total no se lee en voz alta cada segundo.

### 6. Pérdida de foco al repintar la ventana aparte — HALLAZGO NUEVO, el más importante de esta revisión, no bloqueante pero real

`pintarPip()` (`hourglass.html:2866-2908`) siempre reconstruye el contenido completo con `pipWin.document.body.innerHTML = html;` (línea 2893) — tanto para pasar de pastilla a lista completa como a la inversa, **y también cada vez que se vuelve a llamar sin que la pastilla/lista cambie de forma**. No guarda ni restaura `pipWin.document.activeElement` en ningún punto. `pintarPip()` no se llama solo al abrir la ventana o al cambiar de vista: se llama desde `renderFloatPanel()` en **dos** ramas (línea 2932 y 2953) cada vez que corre `render()` — y `render()` corre en prácticamente cualquier acción que cambie el estado de la app (guardar un registro, editar un proyecto, pausar/reanudar/detener un cronómetro desde cualquiera de los dos documentos, y el refresco periódico de 60 s cuando `ui.view==='panel'`, línea 3284-3290), no solo en cambios de vista o de visibilidad de pestaña.

Consecuencia concreta: si la usuaria tabula con el teclado hasta `.fp-mini-close` dentro de la ventana aparte real (dejando el foco ahí, sin haber pulsado todavía Enter/Espacio) y mientras tanto ocurre **cualquier** otra actualización de estado en la app — por ejemplo el refresco automático de 60 segundos del panel mientras la ventana sigue abierta, o cualquier acción tomada desde la pestaña principal — `pintarPip()` vuelve a reconstruir el `<body>` completo de la ventana aparte, y el foco cae de vuelta a `<body>` sin que nada lo recupere. No es una trampa de foco (no impide seguir tabulando), pero sí es una **pérdida silenciosa de foco** cada vez que el DOM se reconstruye debajo de la usuaria — justo el patrón que pedía revisar el encargo ("qué pasa tabulando justo cuando el overlay se monta/desmonta"), solo que aquí el "montaje/desmontaje" no es único (al abrir la ventana) sino que se repite en cada `render()` mientras la ventana esté abierta.

Esto no es exclusivo de la pastilla — el mismo `innerHTML =` sin preservar foco ya afectaba a la vista completa antes de este diff — pero **este diff amplía sustancialmente la ventana de exposición real**: antes, la ventana aparte se cerraba por completo en cuanto la usuaria volvía a la vista Cronómetros, así que el tiempo durante el cual podía haber foco vivo dentro de un documento que luego se reconstruye era relativamente corto (solo mientras estaba fuera de esa vista). Ahora la ventana se queda abierta indefinidamente mientras corra algún cronómetro, incluida la vista Cronómetros (colapsada a pastilla) — y la pastilla agrega, por primera vez, un control interactivo real (`.fp-mini-close`) alcanzable por Tab en un estado que antes ni siquiera existía como tal (antes ahí no había ventana, punto). **Pendiente, no bloqueante** (no hay control inalcanzable, el foco vuelve a `<body>` y un Tab más lo recupera), pero es una degradación real de la experiencia de teclado que vale la pena que el tech lead decida si corregir: guardar si `pipWin.document.activeElement` está dentro del panel antes de reconstruir, y devolver el foco al elemento equivalente después (el botón de cerrar, si sigue existiendo en el nuevo marcado) resolvería esto sin rediseñar nada. No verificado con una ventana PiP real (mismo límite de gesto de siempre); es una deducción directa de qué línea reconstruye qué y desde qué disparadores, no una suposición genérica.

### Veredicto (2026-08-04, rama `hourglass-ventana-pastilla-siempre-visible`)

**APROBADO CON OBSERVACIONES.** Ningún hallazgo llega a "control genuinamente inalcanzable por teclado": el nuevo botón de cerrar es un `<button>` nativo con `aria-label` claro, alcanzable por Tab, con contraste de sobra en sus tres estados, y el `prefers-reduced-motion` ya existente debería seguir aplicando dentro de la ventana aparte real por cómo se copian las hojas de estilo. Dos hallazgos concretos, ninguno bloqueante: (1) el botón `.fp-mini-close` mide ≈20×20px CSS, por debajo del mínimo de 24×24px de WCAG 2.2 SC 2.5.8 y del propio patrón de 26×26px que ya usa `.fp-btn` en el mismo panel; (2) `pintarPip()` reconstruye el `<body>` completo de la ventana aparte sin preservar el foco, y este diff amplía mucho la ventana de tiempo en la que eso puede pasarle a una usuaria que esté tabulando dentro de la ventana aparte real. Ninguno de los dos se pudo confirmar con una ventana Document Picture-in-Picture real (mismo límite de gesto de usuario de siempre en esta app), ambos son deducciones trazadas línea por línea del código real del diff, no suposiciones genéricas.

Y una limitación de proceso que el tech lead debe conocer antes de dar esto por "probado con teclado real": **esta sesión no pudo confirmar nada de forma interactiva** (ni clics, ni teclas, ni capturas) — todo lo anterior es lectura de código, no ejecución en vivo. Se recomienda una segunda pasada (de `qa-lead` u otra sesión de `accessibility-reviewer`) cuando el panel del navegador sí componga frames, específicamente para el Tab real por la tabla de Registros/Proyectos y sus filtros, y para confirmar `prefers-reduced-motion` con una emulación real.
