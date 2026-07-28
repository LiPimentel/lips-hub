# Generador de Gantt — Notas de accesibilidad

Primera revisión de accesibilidad del proyecto (el rol `accessibility-reviewer` no existía antes del 2026-07-21; no hay historial previo que consultar en ninguna app del hub).

## Alcance de esta revisión

Commit revisado: **`7e6dac5`** — "Gantt: barras del login escalonadas en lila/amarillo/purpura y logo animado" (rama `hub-header-apps-label-lp-logo`), diff contra `3bfae3d` (padre inmediato). Verificado con `git show 7e6dac5` / `git diff 3bfae3d 7e6dac5 -- auth-gate.js generador_gantt_2.html`.

**Aviso de entorno importante:** había otro hilo de Claude trabajando en paralelo sobre la misma carpeta, con cambios sin commitear en `auth-gate.js` y `mytravel-pro-v4.html` (logo `.logo-plane`, `scatterCells()`, reescritura de `travel-sky`). Para no mezclar ese trabajo con lo que se pidió revisar, esta revisión se hizo contra una copia aislada de `auth-gate.js` y `generador_gantt_2.html` extraída directamente del commit `7e6dac5` (`git show 7e6dac5:archivo > copia`), **no contra el working tree**. El working tree del repo real (`auth-gate.js`, `mytravel-pro-v4.html`) no fue leído, tocado ni usado como fuente para ninguna conclusión de este documento.

**Limitación de herramienta confirmada en esta sesión (agregar a la ya documentada en `docs/team-memory.md`):** el panel del navegador de esta sesión es un recurso **compartido** entre hilos paralelos — se abrieron/cerraron pestañas de otros agentes (`_qa-bitacora.html`, `_qa2-gantt.html`, `StaffGate`, `LP-Bag`) sin que yo las abriera, y varias veces `computer.screenshot` falló con "the Browser pane is not displayed" porque otro hilo tenía el panel al frente. Esto limitó la prueba de teclado en vivo a **una sola captura confirmada** (ver abajo); el resto del ciclo de tabulación (campo Contraseña, botón Entrar, enlace de recuperación) no se pudo confirmar visualmente en esta sesión — se documenta como no verificado, no como aprobado por inferencia.

## 1. Reduced motion — hallazgo real, no solo nota

**Lo que agrega el commit está bien hecho:** `.logo-bars` (el SVG nuevo de 3 barras que reemplaza el emoji 📊) tiene su propio `@media (prefers-reduced-motion: reduce)` (auth-gate.js líneas 136–140 en el archivo extraído del commit) que fija cada barra en una altura estática distinta (`scaleY(0.55/1/0.75)`) en vez de solo poner `animation:none` a secas — esto es la forma correcta de hacerlo, porque conserva la silueta de "barras de distinta altura" en reposo.

**Pero es la única cobertura de reduced-motion en todo `auth-gate.js`.** Confirmado por conteo de bloques `@media (prefers-reduced-motion: reduce)` en el archivo extraído del commit 7e6dac5: **1 solo bloque, el de `.logo-bars`.** Ninguna de estas animaciones (todas `infinite`, todas arrancan solas al cargar la pantalla de login) tiene manejo de reduced-motion:

- `gantt-grow` / `gantt-dot-move` / `gantt-flag-show` / `gantt-date-fall` (6s c/u, escena `gantt-build` — la que usa esta app)
- `coin-pop` (1.6s), `coin-fall` (var(--dur,7s)) — LP-Bag
- `sparkle-flash` (1.7s / 2.4s)
- `cloud-drift-back` / `cloud-drift-screen` (duración variable) y `fly-1`…`fly-6` — MyTravel
- `milestone-light` (7s), `flag-cycle` + `flag-flutter` (7s + 0.9s), `hop-move` + `hop-squash` (7s c/u) — escena de crecimiento/StaffGate
- `interview-bounce` (2.6s) — StaffGate
- `deco-float` (5s) — decoraciones genéricas de apps sin escena propia

**Severidad: hallazgo real, no urgente pero tampoco cosmético.** Son animaciones `infinite` en la primera pantalla que ve cualquier usuaria al abrir cualquiera de las 5 apps, antes incluso de iniciar sesión — es el peor momento posible para no respetar la preferencia del sistema, porque no hay forma de evitarlas sin cerrar la pestaña. No bloquea esta revisión (no es una regresión de este commit — `.logo-bars` es, de hecho, la primera vez que *algo* en este archivo respeta reduced-motion), pero debe quedar en el radar del tech lead como deuda pendiente de todo el hub, no solo de Gantt.

**Recomendación concreta para implementarlo sin romper las 5 apps (no lo implementé — está en el working tree ocupado por otro hilo):**

Agregar UN solo bloque global dentro del `<style>` que ya vive en `shadow.innerHTML` (es decir, ya scoped al shadow root, no hace falta prefijarlo con `#aiapps-auth-gate`):

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    animation-fill-mode: forwards !important;
    transition-duration: 0.01ms !important;
  }
}
```

Ventajas: una sola edición cubre las 5 apps y cualquier escena futura automáticamente, sin tener que enumerar cada `@keyframes` a mano ni arriesgarse a olvidar una.

**Advertencia concreta que hay que verificar antes de dar esto por bueno (no es un one-liner sin riesgo):** revisé el `100%` de cada `@keyframes` una por una porque varias son loops que *vuelven* a un estado invisible/vacío al cerrar el ciclo, no que terminan en su punto "lleno". Con `animation-iteration-count:1; animation-fill-mode:forwards`, el resultado visual depende de dónde cae ese `100%`:

- **Terminan visibles / en reposo (buen resultado):** `flag-cycle` (100%: opacity 0.95, escala 1, en su lugar), `interview-bounce` (100%: translateY(0)), `deco-float` (100%: sin transformar).
- **Terminan invisibles / en cero (la escena decorativa queda "en blanco", sin bar/ícono/personaje visible, aunque no rota ni se ve rara — solo plana):** `gantt-grow` (100%: `width:0%` — **exactamente la escena de esta app**), `gantt-dot-move` y `gantt-flag-show` y `gantt-date-fall` (100%: `opacity:0`), `hop-move` (100%: `opacity:0`), `fly-1`…`fly-6` (100%: `opacity:0` en las 6).

Es decir, con el interruptor genérico de arriba, la escena de fondo de **esta app (Gantt)** quedaría con los rieles vacíos (sin ninguna barra) para quien tenga reduced-motion activado — no es un error visual ni bloquea nada, pero es lo opuesto de "una versión calmada de la animación": es una versión *vacía*. Antes de dar el cambio por terminado, tomar una captura de cada una de las 5 escenas con `prefers-reduced-motion: reduce` forzado y confirmar que el resultado es aceptable; si no lo es para `gantt-build` en particular (dado que esta app es literalmente sobre barras de progreso, un fondo "vacío" puede leerse como "no cargó"), seguir el mismo patrón manual que ya usa `.logo-bars` (fijar `width`/`opacity`/`transform` estáticos a un punto intermedio del ciclo, no `animation:none` a secas) solo para esa escena.

**Caso borde de reduced-motion + información (el que pide el checklist explícitamente):** ninguna de estas animaciones representa datos reales (son decorativas: la escena `gantt-build` dibuja fechas y avances aleatorios con `Math.random()`, no el cronograma real del usuario), así que no hay riesgo de "ocultar información real" al calmarlas. Sí hay un riesgo de percepción distinto y ya descrito arriba: una escena de progreso que queda plana puede parecer "colgada" aunque no lo esté.

## 2. Movimiento en loop infinito del logo — más allá de reduced-motion

Pregunta específica: si el logo animado (loop infinito, ~41px, junto al título) es un problema más allá de reduced-motion. Sí, hay una capa adicional real:

- **WCAG 2.2.2 (Pausar, detener, ocultar — Nivel A)** aplica a cualquier animación que (a) arranca sola, (b) dura más de 5 segundos, y (c) corre en paralelo al resto del contenido — exactamente este caso (loop de 2.2s × infinito). La norma pide un mecanismo *en la página* para pausarla/detenerla/ocultarla, **independiente de si el sistema operativo respeta `prefers-reduced-motion`** — es decir, tener el `@media` no es, en la letra estricta de la norma, 100% equivalente a cumplir 2.2.2, porque cubre solo a quien ya configuró esa preferencia del sistema (muchas personas con sensibilidad leve al movimiento no saben que esa opción existe).
- **Contexto que sí atenúa la severidad:** es un elemento pequeño (~41px), el movimiento es solo escala vertical (no desplazamiento ni parpadeo), no ocupa pantalla completa, y este es un hub personal de una sola usuaria, no un producto público con obligación legal de conformidad WCAG. No lo considero bloqueante.
- **Recomendación:** dado que ya existe el soporte de reduced-motion para este elemento específico, y el proyecto no tiene obligación de conformidad formal, documentar esto como riesgo aceptado en vez de bloquear — pero si en el futuro se agrega más contenido animado permanente junto al login (ya hay bastante: aviones, monedas, banderas, personaje saltando), vale la pena considerar un control de pausa único y compartido en `auth-gate.js` en vez de resolverlo animación por animación.
- **Hallazgo relacionado, no mencionado en la lista original de animaciones a revisar:** la tarjeta de login completa (`.card`, todas las apps) tiene un efecto de inclinación 3D (`rotateX`/`rotateY` hasta 6°) que sigue el mouse en tiempo real (`auth-gate.js`, listener `mousemove` sobre `.cover`, línea ~873–883 en el archivo extraído del commit). No es un `@keyframes` con nombre, así que no aparecía en el checklist original ("`deco-float`, `coin-fall`, `interview-bounce`, `flag-cycle`/`flag-flutter`, `hop-move`, `gantt-grow`, `fly-1`…`fly-6`"), pero es otra fuente de movimiento continuo en la misma pantalla, activada por el simple hecho de mover el mouse sobre la tarjeta. El interruptor CSS genérico recomendado arriba (que también reduce `transition-duration`) lo atenúa parcialmente (la inclinación pasaría de suave a casi instantánea), pero la forma correcta de resolverlo del todo es que el propio listener de JS revise `matchMedia('(prefers-reduced-motion: reduce)')` y no reasigne `transform` en absoluto cuando esté activo — eso ya requiere tocar JS, no solo CSS.

## 3. Contraste de color

Aplicando la fórmula de luminancia relativa de WCAG a los colores reales del commit (no una inferencia visual):

**Fondo de la escena `#0D1F3C`** → luminancia relativa L = 0.01393 (calculado a mano, fórmula WCAG estándar).

| Elemento | Color(es) | Contraste vs `#0D1F3C` | ¿Aplica el criterio 1.4.11? |
|---|---|---|---|
| `.gantt-bar.c-lila` | `#7E5EC2` → `#C3ABF0` (gradiente 90°) | **3.34:1** (extremo oscuro/izquierdo) hasta 8.14:1 (extremo claro) | No — decorativo puro, sin función ni información real (datos `Math.random()`). Pasa igual el umbral de 3:1 de objetos gráficos aunque no sea obligatorio. |
| `.gantt-bar.c-amarillo` | `#C99A2E` → `#F5D77A` | **6.37:1** (extremo oscuro) | No aplica (decorativo); pasa cómodo de todos modos. |
| `.gantt-bar.c-purpura` | `#4C2A80` → `#9B6BD6` | **1.53:1** (extremo oscuro/izquierdo) hasta 4.28:1 (extremo claro) | No aplica formalmente (decorativo), pero **1.53:1 es prácticamente invisible** contra el fondo — en la captura tomada se ve como una línea muy tenue, casi indistinguible del riel vacío detrás. Es la barra que aparece en las filas 3, 6 y 9 de las 9 filas de la escena (1 de cada 3). |
| `.gantt-dot.c-purpura` (punto al final de la barra) | `#C7A6F0` | 7.93:1 | No aplica; pasa bien. |
| Números de día (`.gantt-date`) | `rgba(255,255,255,0.6)` compuesto sobre `#0D1F3C` | **6.65:1** (calculado componiendo el alfa contra el fondo real) | Pasaría incluso el criterio de texto normal (4.5:1) aunque es decorativo y no hace falta. |

**Conclusión sobre si aplica el criterio de contraste:** formalmente **no**, porque tanto las barras como los números son elementos puramente decorativos de una escena animada de fondo (no representan el cronograma real de la usuaria, no son clickeables, no son necesarios para entender ni operar la pantalla) — WCAG 1.4.11 exime explícitamente a los elementos "puramente decorativos". Dicho esto, `c-purpura` en su extremo oscuro (1.53:1) está muy por debajo de cualquier umbral razonable y **anula visualmente 1 de los 3 colores nuevos que se pidieron** ("lila, amarillo y púrpura" — la barra púrpura casi no se distingue del fondo). Esto es una observación de calidad de diseño, no una falla de cumplimiento — vale la pena que el tech lead lo confirme con la usuaria antes de considerarlo terminado.

**Logo `.logo-bars` — contraste contra su fondo real (la tarjeta `#EFEADC`, no la escena `#0D1F3C`):** el logo vive dentro de `.brand-mark`, dentro de `.card`, cuyo `background` es `#EFEADC` (crema), no el fondo azul marino de la escena. Recalculado contra ese fondo real:

| Barra | Color | Contraste vs `#EFEADC` |
|---|---|---|
| `.lb-1` | `#B79BE0` (lila) | **1.95:1** |
| `.lb-2` | `#F0C550` (amarillo) | **1.37:1** |
| `.lb-3` | `#8C6BC8` (púrpura) | 3.46:1 |

También decorativo (`aria-hidden="true"`, ver punto 4) así que tampoco aplica formalmente el criterio de contraste — pero **1.37:1 y 1.95:1 son extremadamente bajos**; el logo nuevo, en la práctica, se ve muy lavado contra la tarjeta clara. Esto sugiere que la paleta se pensó/probó contra el fondo oscuro de la escena (`#0D1F3C`, donde estos mismos colores sí se verían con buen contraste) y no contra el fondo real donde termina renderizado el ícono (la tarjeta crema). Confirmado visualmente con una captura de pantalla real del commit renderizado (no solo el cálculo). Vale la pena que el tech lead lo revise con la usuaria — no es un incumplimiento de accesibilidad (es decorativo) pero sí socava el propósito del logo nuevo si apenas se ve.

## 4. `aria-hidden="true"` en el SVG del logo — es lo correcto

Confirmado leyendo el marcado real (auth-gate.js, dentro de `.brand-mark`): el SVG de `.logo-bars` es **hermano directo**, en el mismo contenedor, del `<span>` con el texto visible `${window.AIAPPS_APP_NAME}` ("Generador de Gantt") — no es un ícono aislado sin texto cercano. Como el nombre de la app ya está en texto real justo al lado, ocultar el SVG decorativo de lectores de pantalla con `aria-hidden="true"` es correcto: evita que un lector de pantalla anuncie un `<svg>` sin nombre accesible (o, peor, que quede como "imagen sin descripción") de forma redundante justo antes de leer el nombre real de la app. Este patrón coincide con el mismo criterio ya usado para el emoji 📊 anterior en esta misma posición.

## 5. Zoom del navegador / fuente grande del sistema

El logo usa `width:1.7em; height:1.7em` dentro de `.brand-mark`, cuyo `font-size` es `${AIAPPS_APP_LOGO_SIZE || '1.5rem'}` — es decir, todo el tamaño está en unidades relativas (`em`/`rem`), no en píxeles fijos. Verificado leyendo el CSS (no fue necesario probarlo en vivo para esta conclusión, es un hecho de las unidades usadas, no una inferencia):

- **Zoom del navegador (Ctrl+/Ctrl-):** no debería romper nada — el zoom del navegador escala la página completa (incluyendo los `320px` fijos de `.card`) de forma proporcional, así que la relación entre el logo y el resto de la tarjeta se mantiene.
- **Fuente grande de accesibilidad del sistema/navegador (cambiar el tamaño de fuente por defecto, no el zoom):** aquí sí hay una diferencia real entre el logo y el resto de la tarjeta. `.brand-mark` (que contiene el logo + el nombre de la app) no tiene `display:flex` ni `white-space:nowrap` — es un `div` de bloque normal con contenido en línea (el `<span>` del SVG + el `<span>` del texto), así que si el texto crece mucho, el comportamiento por defecto del navegador es que el texto pase a una segunda línea debajo del logo, no que se corte ni se superponga. **No encontré overflow ni solapamiento en el CSS leído.** Esto es una conclusión de lectura de código sobre un caso que no pude reproducir en vivo (la sesión del navegador no permitió simular de forma confiable un `font-size` base grande del sistema en el tiempo disponible) — lo marco como verificado por análisis estático del CSS, no por prueba visual en vivo.

## 6. Navegación por teclado

**Lo que sí pude confirmar en vivo, con una captura real:** abrí una copia aislada del archivo (extraída del commit 7e6dac5, con `auth-gate.js` propio para no tocar el working tree del otro hilo) dentro de la carpeta del proyecto para que el JS se ejecutara con normalidad. Con el foco en el `<body>` (clic fuera de la tarjeta) y **una sola pulsación de Tab**, el foco entró directo y correctamente al campo **"Correo"** dentro del shadow DOM del overlay, con un anillo de foco visible (borde naranja) — confirmado con captura de pantalla. Esto responde directamente al punto que pedía el checklist ("confirmar que el foco no se pierde ni queda atrapado cuando el overlay del shadow DOM monta"): en este primer paso, no se perdió ni quedó atrapado — entró limpio al primer campo del formulario.

**Lo que NO pude confirmar en vivo, por la limitación de entorno ya descrita (panel de navegador compartido con otro hilo):** el resto del ciclo de Tab (campo Contraseña → botón Entrar → enlace "¿Olvidaste tu contraseña?" → si vuelve a envolver al campo Correo o se escapa del formulario), y qué pasa si se tabula justo cuando el overlay monta o desmonta (por ejemplo, justo al iniciar sesión con éxito, cuando el overlay se remueve del DOM). Los intentos de captura posteriores fallaron con "the Browser pane is not displayed" porque otra pestaña de otro hilo tenía el panel al frente. No lo presento como aprobado — queda como no verificado.

**Hallazgo real encontrado por lectura de código (no es una suposición — es un hecho verificable del HTML/DOM, aunque no pude confirmarlo también con una captura en vivo por la razón de arriba):** el enlace `<a class="toggle-mode">¿Olvidaste tu contraseña?</a>` (auth-gate.js, dentro del `<form class="card">`) **no tiene atributo `href`** en ningún punto del archivo, y tampoco tiene `tabindex` en ningún punto del archivo (`grep -n tabindex` sobre el archivo completo no encontró ninguna coincidencia). Un `<a>` sin `href` no es un enlace real para el navegador — **no entra en el orden de tabulación por defecto** en ningún motor de navegador (Chrome/Firefox/Safari), es simplemente texto inerte con estilo de enlace (`cursor:pointer` + color) que solo responde a clic de mouse (hay un listener de clic sobre `.toggle-mode` en el JS). Esto significa que **"¿Olvidaste tu contraseña?" es inalcanzable por teclado** en las 5 apps del hub (es código compartido de `auth-gate.js`, no algo introducido por este commit). Esto es exactamente el tipo de hallazgo que el checklist de este rol considera bloqueante ("un control genuinamente inalcanzable por teclado") — **no bloquea *este* commit** porque no lo introduce ni lo empeora (es preexistente y fuera del diff revisado), pero es lo bastante severo y transversal (afecta las 5 apps) como para ir en `docs/team-memory.md` bajo "⚠️ Requiere atención", no solo como nota.

**Verificado (preexistente, no de este commit): asociación de labels.** `<label for="aiapps-email">Correo</label>` + `<input id="aiapps-email">`, y lo mismo para `aiapps-password` — ambos campos del formulario de login tienen su label correctamente asociado por `for`/`id`. Ningún `outline:none` encontrado en todo el archivo (`grep -n outline` sin resultados), así que el foco por defecto del navegador no está siendo suprimido en ningún input/botón — consistente con el anillo de foco visible que sí confirmé en vivo para el campo Correo.

## Veredicto

**APROBADO CON OBSERVACIONES.**

Nada en el diff de `7e6dac5` en sí introduce una falla de accesibilidad nueva ni bloqueante: el SVG nuevo es decorativo, correctamente `aria-hidden`, con soporte de reduced-motion propio (el primero que existe en todo el archivo), y usa unidades relativas que no deberían romperse con zoom. Las observaciones son:

1. El resto de `auth-gate.js` (todas las escenas de login de las 5 apps) sigue sin reduced-motion — deuda preexistente, no de este commit, pero real y con una recomendación concreta arriba de cómo cerrarla sin romper nada.
2. La barra `c-purpura` del fondo (1.53:1 en su extremo oscuro) y las 3 barras del logo nuevo contra la tarjeta crema (1.37:1–3.46:1) son decorativas así que no incumplen un criterio WCAG formal, pero se ven mucho más tenues de lo que probablemente se buscaba — vale confirmarlo con la usuaria.
3. Hallazgo transversal, preexistente y más serio, encontrado durante esta revisión: el enlace "¿Olvidaste tu contraseña?" no es alcanzable por teclado en ninguna de las 5 apps (falta `href`/`tabindex`) — reportado en `docs/team-memory.md` bajo "Requiere atención" porque es del tipo de hallazgo que normalmente bloquearía una revisión, aunque no es parte de este commit.

## Revisión 2026-07-28 — rama `claude/widget-cuenta-y-botones-mentor` (4 commits sobre `origin/master`)

Lo que toca a Gantt en esta rama: paleta pastel `--c1`…`--c8`, barras con `border-radius:999px` (cápsula), texto de ejemplo renombrado, y la reposición compartida del widget de Cuenta (análisis completo en `docs/staffgate/accessibility-notes.md` §2, no repetido aquí).

**Contraste del número dentro de la barra (`.gantt-bar .num`, `color:#1a1a1a` sobre `rgba(255,255,255,.55)` compuesto sobre el color de la barra) — el punto que el tech lead marcó como "menos comprobado".** Calculado con la fórmula de luminancia relativa de WCAG sobre los 8 colores nuevos reales (`--c1:#7FC8AE` … `--c8:#C2C0B8`), componiendo primero el blanco al 55% de opacidad sobre cada color de barra:

| Color | Fondo compuesto (blanco 55% sobre la barra) | Contraste del `#1a1a1a` |
|---|---|---|
| `--c1` `#7FC8AE` | `rgb(197,230,219)` | **13.05:1** |
| `--c2` `#9A93E0` | `rgb(210,206,241)` | **11.49:1** |
| `--c3` `#F0AE93` | `rgb(248,219,206)` | **13.24:1** |
| `--c4` `#EDA8BF` | `rgb(247,216,226)` | **13.14:1** |
| `--c5` `#9DC4E8` | `rgb(211,228,245)` | **13.45:1** |
| `--c6` `#EFBB6B` | `rgb(248,224,188)` | **13.61:1** |
| `--c7` `#A9CE7E` | `rgb(216,233,197)` | **13.58:1** |
| `--c8` `#C2C0B8` | `rgb(228,227,223)` | **13.51:1** |

**Conclusión: no hay ningún problema aquí, y de hecho mejoró.** Los 8 valores están muy por encima del mínimo de 4.5:1 para texto normal (el número es de 11px, muy por debajo del umbral de "texto grande", así que aplica el criterio más estricto). Repetí el mismo cálculo contra la paleta **anterior** (saturada: `--c1:#5DCAA5` … `--c8:#B4B2A9`) para comparar: el rango antes era **10.23:1 a 12.84:1** — es decir, la nueva paleta pastel en realidad **subió** el contraste del número en los 8 casos (colores más claros → el blanco al 55% encima queda más claro también → más contraste contra el `#1a1a1a`). El tech lead puede dar este punto por cerrado con más confianza de la que tenía: no solo pasa, mejoró.

**Hallazgo nuevo, no preguntado explícitamente pero relevante — contraste de la barra en sí contra el fondo de la página (`--paper:#F7F7F4`):** las barras no tienen borde (`grep -n "gantt-bar{" generador_gantt_2.html` confirma que `.gantt-bar` no define `border`, solo `background` inline vía `var(--c{n})`), así que el color de relleno es la única señal visual del límite de cada tarea contra el fondo de la página. Calculado: la paleta nueva da **1.63:1 a 2.57:1** contra `--paper`, muy por debajo del 3:1 que pide WCAG 1.4.11 para objetos gráficos con significado (cada barra representa una tarea real del cronograma del usuario — a diferencia de la escena de login que ya se documentó como decorativa, esto es el contenido funcional de la app, no algo exento). **No es una regresión de este commit:** la paleta anterior ya fallaba el mismo umbral en 7 de 8 colores (1.87:1–3.50:1, con `--c2` como único que pasaba); con la paleta nueva, `--c2` baja de 3.50:1 a 2.57:1 (deja de pasar), y el resto se mantiene en el mismo rango bajo que ya tenían. Es decir: **el cambio empeora marginalmente uno de los 8 colores y no mejora ninguno**, sobre una base que ya era deficiente en este criterio específico antes de este commit. No lo marco como bloqueante (es deuda preexistente, no introducida de forma sustancial), pero sí como algo que vale la pena que el tech lead confirme con la usuaria si las cápsulas nuevas (`border-radius:999px`, sin borde) se distinguen bien del fondo a simple vista en una pantalla real, ya que el redondeo nuevo no compensa el contraste bajo.

**Veredicto de esta ronda: APROBADO CON OBSERVACIONES.** El contraste del número dentro de la barra, que era la preocupación explícita del tech lead, está confirmado bien resuelto (y mejoró). El único hallazgo nuevo es de bajo contraste barra-vs-fondo-de-página, preexistente y solo marginalmente empeorado en 1 de 8 colores — no bloqueante, documentado para que el tech lead decida si amerita un borde o un tono algo más saturado.
