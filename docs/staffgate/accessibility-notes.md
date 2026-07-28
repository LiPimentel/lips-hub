# StaffGate — Notas de accesibilidad

Primera revisión de accesibilidad de esta app (no existía `docs/staffgate/accessibility-notes.md` antes de hoy).

## Alcance de esta revisión

Rama `claude/widget-cuenta-y-botones-mentor`, 4 commits sobre `origin/master` (`bbeeac1`, `62e7128`, `3a778ca`, `ac591c7`). Lo que toca a esta app: `window.AIAPPS_LOGO_DART = true` (nuevo, `StaffGate.html:189`) y el nuevo logo `.logo-dart`/`@keyframes dart-fly` en `auth-gate.js` (compartido), más la reposición del widget de Cuenta (también compartido, detallado abajo).

**Misma limitación de herramienta que en las demás apps de esta ronda:** sin JS eval en el navegador de esta sesión, sin `getBoundingClientRect`/`getComputedStyle` en vivo, `read_page`/`get_page_text` no atraviesan el shadow DOM del login/widget. Lo que sigue es, salvo que diga lo contrario, **análisis estático exacto** sobre los valores reales del código (no una inferencia visual).

## 1. El recorrido del dardo (`dart-fly`, 6.5s, infinito) — el pedido explícito de juicio del tech lead

Keyframes reales (`auth-gate.js`):

```
0%{   transform:translate(9.6em, -2.8em) rotate(26deg); opacity:0; }
7%{   opacity:1; }
22%{  transform:translate(6.4em, -3.1em) rotate(8deg); opacity:1; }
38%{  transform:translate(4.2em, 0.9em) rotate(-16deg); }
54%{  transform:translate(2.5em, -2.8em) rotate(6deg); }
70%{  transform:translate(1em, -1.5em) rotate(-4deg); }
82%{  transform:translate(0.1em, 0.05em) rotate(0deg) scale(1); }
86%{  transform:translate(0.1em, 0.05em) rotate(0deg) scale(0.86); }
92%{  transform:translate(0.1em, 0.05em) rotate(0deg) scale(1); opacity:1; }
100%{ transform:translate(0.1em, 0.05em) rotate(0deg) scale(1); opacity:0; }
```

`.logo-dart` hereda el `font-size` de `.brand-mark` (1.5rem = 24px por defecto — StaffGate no define `AIAPPS_APP_LOGO_SIZE`), así que **1em = 24px** en este contexto. El recorrido real: **9.6em ≈ 230px horizontales**, con excursión vertical entre **-3.1em (-74px) y +0.9em (+22px)**, dos cambios de dirección (arcos) antes de clavarse. Es, sin ambigüedad, la animación de mayor amplitud de cualquier logo del proyecto — comparado con `deco-float` (unos pocos px de traslación), `hop-move`/`flag-flutter` (oscilaciones pequeñas dentro de la escena), o el propio `logo-plane-float` de MyTravel (0.26em ≈ 6px). Ninguno de los otros logos se acerca a 230px de recorrido.

**Reduced-motion — correcto y con cuidado real, no una trampa evitada por casualidad:**

```
@media (prefers-reduced-motion: reduce){
  .logo-dart{ animation:none; transform:translate(0.1em, 0.05em); opacity:1; }
}
```

El `100%` real del keyframe es `opacity:0` (el dardo se desvanece antes de reiniciar el ciclo) — si el tech lead hubiera simplemente puesto `animation:none` sin fijar `transform`/`opacity` a mano, el dardo habría quedado invisible (el estado final "natural" es invisible), cayendo en la misma trampa ya documentada para `gantt-grow`/`fly-1`…`fly-6` en `docs/gantt/accessibility-notes.md`. En vez de eso, el bloque fija explícitamente `transform:translate(0.1em,0.05em)` y `opacity:1`, que corresponde al frame del **92%** (dardo clavado en la diana, visible) — el estado correcto. **Mi juicio: el estado de reposo elegido es el correcto**, y de hecho evita exactamente el error que este mismo archivo comete en otras escenas.

**Lo que sí merece una consideración extra que los demás logos no necesitan (mi juicio sobre la pregunta específica del tech lead):**

1. **Sin `prefers-reduced-motion`, esta es la animación de mayor amplitud de movimiento autoplay del proyecto entre los logos "pequeños" junto al nombre** (no cuento aquí las escenas de fondo completas como `coins-rain`/`travel-sky`, que son otra categoría). Para alguien con sensibilidad vestibular que **no** tenga activada la preferencia de reduced-motion del sistema (la mayoría de la gente no sabe que existe esa opción), un elemento junto al título del login que traza dos arcos de ~230px cada 6.5s, en bucle infinito mientras la pantalla de login está abierta, es más propenso a ser molesto que cualquier otro logo del proyecto — precisamente por la combinación de amplitud + duración + repetición infinita sin control de pausa en la página. Esto cae bajo el mismo criterio ya anotado en `docs/gantt/accessibility-notes.md` §2 (WCAG 2.2.2, Nivel A: contenido que se mueve solo, dura más de 5s y corre en paralelo al resto — el sistema operativo respetando `prefers-reduced-motion` no sustituye, en la letra estricta de la norma, un control de pausa en la propia página). No es nuevo como criterio, pero el dardo es el caso donde más pesa, porque es el de mayor amplitud.
2. **Sin `overflow:hidden` en `.card` ni en `.brand`** (confirmado: `grep -n "overflow:hidden" auth-gate.js` no encontró ninguna coincidencia), el dardo, en su punto de partida (`translate(9.6em, -2.8em)` = 230px a la derecha, 74px arriba del ancla), muy probablemente se renderiza **fuera de los límites de `.card`** (`width:min(320px, 90vw)`, `padding:32px 28px`): el punto de anclaje del dardo es la posición del emoji 🎯 dentro de `.brand-mark`, centrado dentro de una tarjeta de ~264px de ancho de contenido — 230px de desplazamiento horizontal desde ahí fácilmente saca al dardo del borde derecho de la tarjeta. No hay clip, así que esto es probablemente intencional (mismo patrón ya usado por las nubes del avión de MyTravel, que también exceden ligeramente su glifo), pero a diferencia de esas nubes (unos pocos px), aquí la excursión es de un orden de magnitud mayor. **Caso borde real:** en viewports angostos (`.card` usa `90vw`, así que en un viewport de ~300-350px de ancho la tarjeta mide ~270-315px), el dardo en su punto de partida podría salir del viewport mismo, no solo de la tarjeta — quedando parcialmente recortado por el borde de la ventana en vez de por el diseño. No lo pude confirmar en vivo (sin JS eval), pero es aritmética directa sobre los valores reales del CSS, no una suposición.

**Recomendación concreta, no solo la observación:** dado que el resto del proyecto ya trata el reduced-motion como mitigación aceptada (no un control de pausa explícito) para todas las demás animaciones de este archivo, no sugiero bloquear el dardo por esto — pero si el tech lead quiere darle un trato distinto por su amplitud (como pregunta explícitamente), la opción de menor esfuerzo es reducir el recorrido inicial (por ejemplo de 9.6em a algo como 5-6em) sin cambiar la lectura narrativa ("entra volando, rodea, se clava") — seguiría leyéndose como una entrada notoria sin ser el movimiento de mayor amplitud del proyecto por un margen tan grande.

## 2. Reposición del widget de Cuenta — hallazgo nuevo, aplica a las 5 apps por igual (código compartido)

Verificado por trazado exacto del modelo de caja CSS sobre `auth-gate.js` (no medido en vivo — sin JS eval en esta sesión, pero es aritmética determinística sobre reglas CSS reales, no una suposición):

- **Antes de este diff:** `host.style.cssText = "position:fixed;top:14px;right:14px;..."` — ancla desde **arriba**. Con `top` fijo y `height:auto`, el contenido nuevo que se agrega abajo (el panel, al abrirlo) simplemente **extiende la caja hacia abajo**; el botón "👤 Cuenta" (primer hijo, arriba de la caja) se queda exactamente donde estaba.
- **Después de este diff:** `host.style.cssText = "position:fixed;right:14px;...bottom:calc(61px + var(--aiapps-chrome-bottom,0px));"` — ahora ancla desde **abajo**. Con `bottom` fijo y `height:auto`, cuando el contenido crece (se abre el panel), es el **borde inferior** el que se queda fijo en ese punto, y la caja crece hacia **arriba** — es decir, el botón "👤 Cuenta" (que sigue siendo el primer hijo, visualmente arriba del panel dentro de la caja) **se desplaza hacia arriba** en la misma proporción en que crece el panel.

Estimé la altura del panel abierto sumando las reglas CSS reales de cada elemento (`label` ~18px, `input` ~32px, `.save-btn` ~42px con margen, `.logout-btn` ~40px con margen, `.msg` ~22px con margen, `padding:16px` arriba y abajo = 32px, más `margin-top:8px` del panel) ≈ **190-195px**. Es decir: **al pulsar "👤 Cuenta" para abrir el panel, el propio botón que se acaba de pulsar salta hacia arriba unos ~190px**, en vez de quedarse quieto con el panel desplegándose debajo (que es como se comportaba antes de este diff, y como se comporta cualquier menú desplegable convencional anclado arriba).

**Por qué esto importa para accesibilidad, no solo estética:** para una persona que usa zoom de pantalla/lupa (magnifier) seguirá el control con la vista en una región acotada de la pantalla — un control que salta ~190px al activarse puede sacarlo por completo de esa región, obligándola a buscarlo de nuevo. También es una sorpresa de comportamiento para cualquier usuaria (el control que acabas de tocar deja de estar donde lo tocaste), que WCAG trata en general bajo el principio de comportamiento predecible de los componentes de interfaz. El foco de teclado en sí **no se pierde** (sigue siendo el mismo nodo del DOM, solo se reposiciona visualmente), así que no es un bloqueante de "control inalcanzable", pero sí una regresión de comportamiento real e introducida por este diff específico (no existía con el ancla `top`).

**No pude confirmarlo con una captura en vivo** (screenshots fallan siempre en esta sesión, y no hay forma de leer `getBoundingClientRect()` sin JS eval) — lo presento como verificado por trazado de CSS, explícitamente distinto de una medición en vivo.

**Recomendación concreta:** si el objetivo es que el botón "Cuenta" quede apilado sobre la insignia de carpeta sin importar si el panel está abierto o cerrado, la forma correcta es que el **botón** (no el host completo) sea el elemento anclado a una posición fija, y que el panel se despliegue hacia arriba desde ahí — por ejemplo con el host en `display:flex; flex-direction:column-reverse` (así el botón, aunque siga siendo el primer hijo en el HTML, se renderiza al final/abajo de la pila, y el panel crece hacia arriba sin mover al botón). Esto es un cambio de una sola regla, no de la lógica.

## 3. Contraste y demás — sin cambios de color en este diff para StaffGate

El único cambio de `StaffGate.html` en este diff es la línea que agrega `window.AIAPPS_LOGO_DART = true;` (más el ajuste ya compartido de la insignia de carpeta) — no hay CSS de color nuevo propio de esta app para revisar.

## 4. Navegación por teclado

No verificado en vivo esta sesión (misma limitación de herramienta documentada arriba y en `docs/bitacora-mentor/accessibility-notes.md`). El diff no toca `inert`/`tabindex`/manejo de foco.

## Veredicto

**APROBADO CON OBSERVACIONES.**

1. El logo del dardo está bien resuelto en cuanto a reduced-motion (estado de reposo correcto, evita la trampa de terminar invisible) — sin acción requerida ahí.
2. Su amplitud (~230px, la mayor de cualquier logo del proyecto) sí merece la consideración extra que el tech lead preguntó: sin control de pausa en página (deuda ya conocida y aceptada para todo el archivo) es, de los logos "pequeños", el que más podría molestar a alguien con sensibilidad al movimiento que no tenga activada la preferencia del sistema. No bloqueante; recomendación concreta de reducir el recorrido si se quiere tratarlo distinto.
3. **Hallazgo nuevo, real, aplica a las 5 apps (código compartido):** el cambio de ancla del widget de Cuenta de `top` a `bottom` hace que el botón "👤 Cuenta" salte ~190px hacia arriba cada vez que se abre el panel, algo que no pasaba con la posición anterior. No bloqueante (el foco no se pierde), pero sí una regresión de comportamiento introducida por este diff, con una solución de una sola regla CSS sugerida arriba.
4. Sin verificación en vivo de teclado por limitación de herramienta de esta sesión (sin JS eval, shadow DOM no atravesable por `read_page`/`get_page_text`).
