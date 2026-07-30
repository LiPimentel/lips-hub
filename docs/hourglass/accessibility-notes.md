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

## Veredicto

**APROBADO CON OBSERVACIONES.**

No encontré ningún hallazgo del nivel "control genuinamente inalcanzable por teclado" (la barra que bloquearía con RECHAZADO según la regla del proyecto) — al contrario, la lectura completa del código muestra un patrón consistentemente correcto: controles nativos (`<button>`, `<label>`, `<select>`) en vez de reinvenciones, ARIA de pestañas siguiendo el patrón APG, trampa de foco de diálogo bien implementada, contraste de color que pasa AA en todos los pares revisados, y color que nunca es la única señal.

Dicho esto, dos observaciones concretas quedan pendientes (ninguna bloqueante):
1. El diálogo de "cronómetro olvidado" no aplica `inert`/`aria-hidden` al resto de la página — brecha real para lectores de pantalla en modo de cursor virtual, no para usuarios de solo-teclado.
2. El `tabpanel` pierde el indicador de foco visible en una parada real del recorrido de Tab.

Y una limitación de proceso que el tech lead debe conocer antes de dar esto por "probado con teclado real": **esta sesión no pudo confirmar nada de forma interactiva** (ni clics, ni teclas, ni capturas) — todo lo anterior es lectura de código, no ejecución en vivo. Se recomienda una segunda pasada (de `qa-lead` u otra sesión de `accessibility-reviewer`) cuando el panel del navegador sí componga frames, específicamente para el Tab real por la tabla de Registros/Proyectos y sus filtros, y para confirmar `prefers-reduced-motion` con una emulación real.
