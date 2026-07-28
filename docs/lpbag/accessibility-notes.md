# Notas de accesibilidad — LP-Bag (login compartido, `auth-gate.js`)

Revisión: PR #18 (rama `claude/lpbag-login-background-cg4med`), rehecho de la escena decorativa `coins-rain` en `auth-gate.js`. **Nota de proceso importante primero, ver abajo.**

## 0. Nota de proceso: el PR #18 ya está fusionado a `master`

Verificado con `git fetch origin` durante esta revisión: `origin/master` está en el commit `61cd68e` ("Merge pull request #18: LPBag fondo de login zigzag + monedas 3D (versión mejorada)"), fusionado el 2026-07-24 17:24:20 -0400 — **antes** de que esta revisión de accesibilidad terminara. `auth-gate.js` en `origin/master` es byte-idéntico (mismo md5) al de esta rama, así que no hay contenido adicional que revisar por una posible reconciliación de conflicto — pero si la intención era que esta revisión funcionara como gate previo al merge, ya no puede cumplir ese rol para el PR #18: llegó tarde. Ninguno de los hallazgos de abajo habría cambiado la decisión de fusionar (nada de lo nuevo introducido por el PR es un blocker en sí mismo — ver sección 1), pero el tech lead debería saberlo.

También: al iniciar esta revisión `git status` mostró el árbol de trabajo limpio; más tarde, sin que yo hiciera ningún cambio, `docs/team-memory.md` y `docs/lpbag/requerimientos.md` aparecieron con cambios sin commitear (la entrada de `release-manager` sobre el conflicto PR #17/#18). Es consistente con otro agente escribiendo en la misma carpeta compartida durante esta sesión — el mismo patrón de riesgo ya documentado en `docs/team-memory.md` ("incidente real... sin worktrees"). Volví a leer ambos archivos justo antes de editarlos para no pisar ese trabajo.

## 1. Qué introduce específicamente el PR #18 (comparado contra el commit previo a este PR, `7068c2a` = PR #17 ya fusionado — **no** contra el `master` local desactualizado que tenía este entorno, que todavía no incluía el PR #17 tampoco)

- **`auth-gate.js:147-155`** — el keyframe `coin-fall` se reescribió: antes recorría `translateY(0)` → `translateY(58vh)` con una sola rotación 0→360°; ahora recorre `translateY(0)` → `translateY(118vh)` (toda la pantalla, el doble de antes) y añade una oscilación de `scaleX(1)→scaleX(0.12)→scaleX(-1)→scaleX(0.12)→scaleX(1)` para simular el giro de la moneda sobre su eje. **Esto aumenta el rango de movimiento de una animación que ya era infinita y ya carecía de `prefers-reduced-motion`** — no crea el problema (ya existía, ver sección 2) pero sí lo agrava en magnitud para esta escena puntual.
- **`auth-gate.js:617-624`** — mejora real de accesibilidad: la moneda que cae pasó de ser el emoji de texto sin ocultar `🪙` (repetido 16-18 veces por pantalla, expuesto tal cual al árbol de accesibilidad en todas las versiones anteriores) a un `<svg viewBox="0 0 26 32" aria-hidden="true">` dibujado a mano. Confirmado con Playwright que el SVG lleva `aria-hidden="true"` explícito. Bien — pero ver 3.F sobre el resto de los SVG de la escena que siguen sin esa marca.
- **Recuento de elementos parpadeantes (destellos):** medido en vivo con Playwright (viewport 1280×800) sobre esta rama: 18 monedas cayendo, de las cuales 14 llevan destello (`sparkle-glint`), más 25 destellos fijos en el montón (`floor-sparkle`) = **39 elementos con `animation:sparkle-flash` infinito**. En el mismo viewport contra el commit previo al PR #17 (`eae42fb`, la versión "clásica" con emoji): 16 monedas cayendo con 5 destellos + 48 destellos en el montón = **53 elementos**. Es decir, el PR #18 **reduce** ligeramente el conteo total de elementos parpadeantes frente a la línea base anterior a estos dos PRs — no lo empeora en ese eje, aunque sigue siendo del mismo orden de magnitud (decenas) y sigue sin ningún control de `prefers-reduced-motion`.
- Nada más de lo tocado por el diff (z-index, geometría de la cordillera, proporciones de las monedas) tiene implicación de accesibilidad.

**Conclusión sección 1:** el PR #18, por sí mismo, ni agrega ni quita el problema de fondo (cero soporte de `prefers-reduced-motion` en todo `auth-gate.js`) — eso es 100% preexistente (sección 2). En términos de *cantidad* de movimiento, el PR deja el archivo **igual de mal** en el problema estructural, **levemente mejor** en conteo de destellos, y **objetivamente peor** en rango/alcance del movimiento de la animación `coin-fall` específicamente (dos veces más recorrido vertical + oscilación de escala nueva).

## 2. Reduced motion — confirmado y dimensionado (severidad: hallazgo real, no urgente para bloquear este PR puntual, pero pendiente desde antes de que este rol existiera)

`grep -c "prefers-reduced-motion" auth-gate.js` → **0** coincidencias, antes y después de este PR. Confirmado además en vivo: con Playwright y `page.emulateMedia({ reducedMotion: 'reduce' })`, `window.matchMedia('(prefers-reduced-motion: reduce)').matches` da `true` dentro de la página, pero los estilos computados de `.coin-rain` y `.floor-sparkle` siguen mostrando `animation-name` y `animation-duration` normales, sin ningún cambio — es decir, la preferencia del sistema operativo es ignorada por completo, no es una suposición.

Inventario completo de animaciones infinitas/con rango de movimiento no trivial en `auth-gate.js` (todas comparten este archivo, así que afectan a cualquier app que use la escena correspondiente — no solo LP-Bag):

| Animación | Selector / línea | Escena | Naturaleza del movimiento |
|---|---|---|---|
| `coin-pop` | `.coin`, línea 120/126 | logo de marca (LP-Bag) | 3 monedas saltan y se desvanecen, infinito |
| `coin-fall` | `.coin-rain`, línea 138/147 | coins-rain (LP-Bag) | caída vertical de pantalla completa + giro, infinito — **ampliado por este PR** |
| `sparkle-flash` | `.sparkle-glint` línea 160/165, `.floor-sparkle` línea 185 | coins-rain | parpadeo de estrellas, infinito, ~0.59 destellos/seg cada una (ver 2.1) |
| `gantt-grow`, `gantt-dot-move`, `gantt-flag-show`, `gantt-date-fall` | líneas 198-244 | gantt-build (Gantt) | barras crecen/decrecen en bucle de 6s, infinito |
| `cloud-drift-back`, `cloud-drift-screen` | líneas 252-269 | travel-sky (MyTravel) | nubes oscilando lateralmente, infinito |
| `fly-1` … `fly-6` | líneas 278-313 | travel-sky (MyTravel) | aviones cruzando toda la pantalla en diagonal, infinito |
| `milestone-light`, `flag-cycle`, `flag-flutter`, `hop-move`, `hop-squash` | líneas 336-387 | growth-scene | personaje saltando de hito en hito por toda la escena, infinito |
| `interview-bounce` | línea 407/413 | interview (Bitácora del Mentor) | icono rebotando ~36px verticalmente, infinito |
| `deco-float` | línea 486/501 | decoraciones flotantes (compartidas) | íconos flotando ±9px, infinito |

### 2.1 Umbral de 3 destellos/segundo (fotosensibilidad)

`sparkle-flash` (línea 165): ciclo de 1.7s (`.sparkle-glint`) o 2.4s (`.floor-sparkle`), con opacidad 0→1→0 una sola vez por ciclo → **~0.59 y ~0.42 destellos/segundo respectivamente por elemento**, muy por debajo del umbral de 3/seg de WCAG 2.3.1. Los ~39 elementos (medidos en esta rama) tienen retardos aleatorios individuales (`Math.random() * 3.5s` etc.), así que **no están sincronizados** — no se comportan como un único flash de área grande y no deberían disparar una convulsión fotosensible por sí solos. El riesgo real para sensibilidad al movimiento aquí es el **movimiento continuo** (caída, oscilación, rebote), no el parpadeo.

### 2.2 Caso borde — animación que "lleva información" bajo reduced-motion

Si se aplicara un bloque `prefers-reduced-motion` ingenuo (`animation: none` a todo por igual), varios elementos de la escena `gantt-build` quedarían **permanentemente invisibles**, no solo "calmados", porque su estado de reposo (el `0%` del keyframe, que es a lo que vuelve el elemento al quitarle la animación) es `opacity:0` o `width:0%`:
- `.gantt-bar{width:0%}` (línea 195-198)
- `.gantt-dot{opacity:0}` (línea 202-208)
- `.gantt-flag{opacity:0}` (línea 211-217)
- `.gantt-date{opacity:0}` (línea 219-223)
- `.milestone{opacity:0}` (línea 327-331 aprox.)

Como es una escena puramente decorativa (un gráfico de Gantt ficticio en la pantalla de login, no datos reales de progreso del usuario), que quede en blanco bajo reduced-motion podría ser una decisión de diseño aceptable — pero debe ser **deliberada** (fijar un estado final legible: `width` final, `opacity:1`), no un efecto colateral accidental de copiar un `animation:none` genérico. Lo mismo aplica en menor medida a `.hop-figure` (línea 356-360): no tiene `top`/`left` fuera del keyframe, así que sin animación cae a la posición por defecto del navegador, no a un lugar con intención.

### Propuesta concreta de bloque `@media (prefers-reduced-motion: reduce)` (NO aplicada — decisión de alcance de la usuaria)

```css
@media (prefers-reduced-motion: reduce) {
  /* Elementos cuyo estado de reposo ya es visible: basta con detener el movimiento. */
  .coin, .cloud-el, .travel-cloud-drift, .plane,
  .interview-icon-float, .deco-float, .growth-flag {
    animation: none !important;
  }

  /* Elementos cuyo estado de reposo es invisible (opacity:0 / width:0 en el
     0% del keyframe): si solo se quita la animación desaparecen del todo.
     Se fija un estado final estático legible en vez de solo animation:none. */
  .coin-rain, .sparkle-glint, .floor-sparkle {
    animation: none !important;
    opacity: 0 !important; /* aceptable: el montón de monedas de fondo sigue visible sin la lluvia */
  }
  .gantt-bar { animation: none !important; width: var(--w, 70%) !important; }
  .gantt-dot { animation: none !important; opacity: 1 !important; left: var(--w, 70%) !important; }
  .gantt-flag { animation: none !important; opacity: 1 !important; transform: none !important; }
  .gantt-date { animation: none !important; opacity: 0.85 !important; transform: none !important; }
  .milestone { animation: none !important; opacity: 1 !important; }
  .hop-figure { animation: none !important; opacity: 0 !important; } /* o fijar top/left final si se prefiere mostrarlo quieto */
}
```

Esto cubre las 5 escenas del archivo, no solo `coins-rain`. Falta decidir con la usuaria si `.hop-figure` y el resto de la escena `growth-scene` deben ocultarse (como aquí) o congelarse en un frame final visible — lo dejo como pregunta abierta, no lo decido yo.

## 3. Contraste de color — tarjeta de login (`.card{background:#EFEADC}`, línea 73)

Calculado con la fórmula de luminancia relativa de WCAG a partir de los valores hex reales del CSS (no estimado a ojo):

| Elemento | Color texto | Fondo | Contraste | Umbral WCAG AA | Resultado |
|---|---|---|---|---|---|
| `label` (línea 420-425) | `#3E4757` | `#EFEADC` | 7.79:1 | 4.5:1 | PASA |
| `.brand-name` (línea 810) | `#1B2430` | `#EFEADC` | 13.02:1 | 4.5:1 | PASA |
| texto de `input` (línea 426-435) | `#1B2430` | `#fff` | 15.65:1 | 4.5:1 | PASA |
| `.brand-tagline` (línea 106-112) | `#8B94A3` | `#EFEADC` | **2.55:1** | 4.5:1 | **FALLA** |
| `.link-row a` / "¿Olvidaste tu contraseña?" (línea 467-472) | `#8B94A3` | `#EFEADC` | **2.55:1** | 4.5:1 | **FALLA** |
| botón "Entrar" (línea 436-447, texto blanco, 14.4px/600) | `#fff` | `#B8863B` | **3.23:1** | 4.5:1 (texto normal — 14.4px no llega al umbral de texto grande de 18.66px en negrita) | **FALLA** |
| `.ok` (mensaje de éxito, línea 456-462) | `#4E8B8B` | `#EFEADC` | **3.24:1** | 4.5:1 | **FALLA** |
| `.error` (mensaje de error, línea 449-455) | `#B8433B` | `#EFEADC` | **4.48:1** | 4.5:1 | **FALLA** (por muy poco) |

**Todos estos valores son preexistentes — confirmado byte a byte que los mismos hex ya estaban en el archivo antes del PR #17 y del PR #18** (no forman parte del diff de ninguno de los dos). No los reporto como algo que este PR haya introducido, pero sí como hallazgo real de la revisión: el enlace de recuperación de contraseña falla contraste (2.55:1) **y** es inalcanzable por teclado (sección 4) — el mismo elemento acumula dos problemas de accesibilidad distintos e independientes.

## 4. Navegación por teclado — probado en vivo, no inferido

Herramienta usada: Playwright (`chromium_headless_shell-1194`) contra `http://localhost:8900/lpbag-test.html`, una copia de `lpbag.html` con el cliente de Supabase reemplazado por el stub indicado en el encargo (`window.supabaseClient` simulado, sin sesión). No usé un lector de pantalla real (no hay uno disponible en este entorno) — lo digo explícitamente en vez de inferir su comportamiento.

### 4.1 El overlay de login NO atrapa el foco (hallazgo severo, preexistente — confirmado igual en el commit previo al PR #17)

El host del shadow DOM (`#aiapps-auth-gate`, creado en `attachShadow`) es `position:fixed; z-index:2147483647`, cubriendo visualmente toda la pantalla — pero el contenido de la app detrás (`#appScreen`) sigue con `display:block`, sin `inert`, sin `aria-hidden`, totalmente en el orden de tabulación.

Medido con una sesión de LP-Bag recién cargada (sin categorías): **25 controles del panel oculto detrás del overlay** (selector de moneda, botones Exportar/Importar/Salir, campo de tasa de cambio, campo de nueva categoría, botón "+", botones "×" de categorías) son alcanzables con Tab **antes** de llegar al primer campo del formulario de login — el campo de correo solo se alcanza en el **Tab #25**. Con más categorías/gastos reales cargados este número sería mayor. Además, al tabular hacia adelante desde el botón "Entrar" (última parada del formulario), el foco **sale de la tarjeta y regresa a `#globalCurrency`** en el panel oculto, en vez de ciclar de vuelta al campo de correo — confirma que no hay trampa de foco (`focus trap`) en ningún sentido.

Repetí la misma prueba contra el commit inmediatamente anterior a estos dos PRs (`eae42fb`, antes del PR #17): el primer Tab también aterriza en `#globalCurrency`, igual que ahora. **Este comportamiento es arquitectónico de cómo `auth-gate.js` monta el overlay (no usa `inert` ni gestiona el foco al montar/desmontar), no algo que el PR #18 haya tocado o cambiado.**

> **RESUELTO (tech lead, 2026-07-24) — commit `38f96f1`, fusionado a `master` en el PR #20.** Mientras la superposición está visible, `auth-gate.js` marca `inert` en todos los hijos del `<body>` salvo su propio host, y lo revierte al quitarla; el foco ahora arranca en el campo de correo. Un `MutationObserver` sobre `document.body` cubre lo que las apps agregan **después** del candado — el badge "Conectar carpeta de datos" de LP-Bag se escapaba del bloqueo inicial, y es justo el que abre el selector de carpetas con permiso de escritura.
>
> Re-verificado en vivo el 2026-07-24 sobre `lpbag.html`: de los 4 hijos del `<body>`, **0 quedan sin `inert`** aparte del host del candado (que correctamente no lo lleva). Antes eran 25 controles alcanzables con Tab antes del campo de correo.

### 4.2 El enlace "¿Olvidaste tu contraseña?" es inalcanzable por teclado (hallazgo severo, preexistente)

`auth-gate.js:824`: `<div class="link-row"><a class="toggle-mode">¿Olvidaste tu contraseña?</a></div>` — el `<a>` no tiene atributo `href` ni `tabindex`. Confirmado en vivo:
- Llamar `.focus()` directamente sobre el elemento **no lo convierte en el elemento activo** (`shadowRoot.activeElement !== el`) — no es focuseable.
- La secuencia natural de Tab dentro de la tarjeta es correo → contraseña → botón "Entrar" → (sale de la tarjeta, vuelve al panel oculto) — el enlace de recuperación **nunca aparece** en esa secuencia.
- Mismo código exacto (`<a class="toggle-mode">` sin `href`) ya estaba presente en el commit previo al PR #17 (línea 731 de esa versión) — no es algo introducido por el PR #18.

**Impacto:** una persona que use solo teclado no tiene forma de activar el flujo de "Recuperar contraseña" en ninguna de las 5 apps (el componente es compartido). Solo funciona con mouse/touch.

> **RESUELTO (tech lead, 2026-07-24) — commit `38f96f1`, fusionado a `master` en el PR #20.** El `<a>` sin `href` pasó a ser `<button type="button" class="toggle-mode">`, dentro del mismo `<form>` (el `type="button"` es lo que evita que haga submit; el submit real sigue siendo el botón "Entrar"). El aspecto de enlace se conserva en `.link-row button` y se agregó un anillo de foco propio en `.link-row button:focus-visible` (`outline:2px solid #1B2430; outline-offset:2px`), que antes no existía para este elemento.
>
> Re-verificado en vivo el 2026-07-24 sobre `lpbag.html`: el elemento es `BUTTON` con `type="button"`, `.focus()` **sí** lo convierte en `shadowRoot.activeElement`, y partiendo del campo de correo se alcanza en el **3.er Tab** (correo → contraseña → "Entrar" → enlace de recuperación). Activándolo, la tarjeta cambia a "Recuperar contraseña", se oculta `.pw-field` y el propio botón pasa a "Volver a iniciar sesión" — el flujo con mouse sigue igual que antes.
>
> **Salvedad de método:** la activación con Enter/Espacio **no se pudo confirmar end-to-end con la herramienta de navegador de esta sesión** — ver la limitación anotada en `docs/team-memory.md` ("Hechos que todo el equipo debe conocer"): sus eventos de teclado sintéticos no disparan la activación por defecto del navegador, ni siquiera sobre un `<button>` normal del light DOM creado como control. Lo que sí queda verificado es lo que era el defecto real (que el elemento no era enfocable ni alcanzable con Tab); la activación con Enter/Espacio es comportamiento nativo de `<button>`, no código de la app, y esa es justamente la razón de haber preferido `<button>` sobre `<a tabindex="0">` + manejador de `keydown`.

### 4.3 Foco visible

Los campos y botones que sí son alcanzables (correo, contraseña, botón "Entrar") muestran el anillo de foco por defecto del navegador (`outline: auto 1px rgb(16, 16, 16)` medido vía `getComputedStyle`) — `auth-gate.js` no define ningún `:focus` propio ni lo suprime con `outline:none`, así que el foco por defecto queda visible. No verifiqué el contraste exacto de ese anillo por defecto contra el fondo de la tarjeta en todos los navegadores/SO (varía por implementación) — lo marco como no verificado en detalle, no como aprobado sin más.

## 5. Markup para lectores de pantalla

- `<input id="aiapps-email">` / `<label for="aiapps-email">Correo</label>` (línea 815-816) y `<input id="aiapps-password">` / `<label for="aiapps-password">Contraseña</label>` (línea 818-819): asociación `for`/`id` correcta. Confirmado también en las pantallas de recuperación (línea 956-957) y de cambio de contraseña de cuenta (línea 1072-1073).
- `<img class="brand-logo-img" ... alt="">` (línea 800): `alt=""` correcto para un logo decorativo con fallback de emoji.
- La moneda que cae (nueva en este PR) lleva `aria-hidden="true"` en su propio `<svg>` (línea 617) — bien, ver sección 1.
- **`.coin-floor svg`** (el SVG grande del montón de monedas/cordillera, línea 640) **no** lleva `aria-hidden` ni `role="img"`. En la práctica, un `<svg>` plano sin nombre accesible ni contenido enfocable normalmente no se anuncia en la mayoría de lectores de pantalla modernos, así que el impacto práctico probablemente sea bajo — pero no lo verifiqué con un lector de pantalla real (no hay uno disponible en este entorno), así que lo marco como una inconsistencia a corregir por buena práctica, no como algo confirmado audible. Preexistente (mismo hueco en el commit previo al PR #17).
- **`.sparkle-glint svg`** (el destello sobre algunas monedas que caen, generado junto a `fallingCoin`) tampoco lleva `aria-hidden`. Mismo razonamiento que el punto anterior. Preexistente.
- Botón "Entrar" / "Enviar enlace" / "Guardar" / "Cambiar contraseña" / "Cerrar sesión": todos tienen texto discernible propio, ninguno depende solo de un ícono.

## Veredicto

**APROBADO CON OBSERVACIONES** para el PR #18 en sí — lo que introduce (SVG con `aria-hidden` reemplazando el emoji suelto, más rango de movimiento en `coin-fall`, leve reducción en conteo de destellos) no agrega ningún bloqueador nuevo; es una mezcla de una mejora pequeña y un empeoramiento pequeño sobre un problema preexistente que ya era conocido (falta total de `prefers-reduced-motion`).

Esto **no** es un veredicto de "todo bien" para el estado general del login compartido: la sección 4 documenta dos hallazgos que, tomados solos, ameritarían **RECHAZADO** si fueran nuevos (enlace de recuperación inalcanzable por teclado; overlay sin trampa de foco con 25 controles ocultos alcanzables antes que el formulario) — pero ambos son preexistentes y confirmados idénticos antes del PR #17, por lo que no son atribuibles a este PR puntual. Los reporto con la misma prioridad igual, porque el encargo pedía explícitamente revisar navegación por teclado y comportamiento del overlay, y porque ya están afectando a las 5 apps en producción ahora mismo (el PR #18 ya está fusionado a `master`, sección 0).

## 6. Revisión del commit `40c43f5` (rama `claude/login-glow-y-preferencia-en-vivo`) — devolver el resplandor del cursor + preferencia reactiva

Revisión pedida específicamente sobre este commit (1 archivo de código, ~35 líneas en `auth-gate.js`), que corrige dos defectos que quedaron tras `fc7dfc5` (el bloque `prefers-reduced-motion` de las 5 escenas, ya cubierto en la sección 2/caso borde 14). Diff completo leído con `git show 40c43f5` antes de probar nada. Método: arnés HTML propio (`_a11yX-glow-audit.html`, `_a11yX-glow-audit-forced.html`, `_a11yX-tab-order.html`, no trackeados, servidos por `http://localhost:8791/`) que carga `auth-gate.js` real con un `window.supabaseClient` simulado y sin sesión, más un `matchMedia` controlable para disparar el evento `change` a voluntad — mismo patrón que ya usó el equipo para el zoom de StaffGate. Todos los números de abajo son de ejecución real (`getComputedStyle`, `cardEl.style.transform`, `cover.style.getPropertyValue`), no de lectura de código.

### 6.1 ¿Es correcto conservar el resplandor bajo `prefers-reduced-motion`?

**Sí — confirmo el criterio, con evidencia nueva, no solo repitiendo lo dicho antes.** Argumento en términos de WCAG 2.3.3 (Animación provocada por interacción): lo que ese criterio busca evitar es el movimiento que **persiste o se interpola** más allá del estado exacto del input en ese instante — parallax, inercia, easing, "swooping". Verifiqué en el CSS (`auth-gate.js:180-187`) que `.cover` **no tiene ninguna propiedad `transition` ni `animation`**; el degradado se reposiciona escribiendo `--mx`/`--my` directamente por JS en cada evento `mousemove` (línea 1574-1575), sin interpolación de ningún tipo. Con la preferencia **activa**, disparé dos eventos `mousemove` sintéticos en esquinas opuestas del `.cover` (rectángulo real vía `getBoundingClientRect`) y `--mx` pasó de `2.5%` a `97.5%` **en el mismo tick**, mientras `card.style.transform` se mantuvo clavado en `perspective(800px) rotateX(0deg) rotateY(0deg)` en ambas mediciones — es decir, el resplandor sigue el input 1:1 sin ningún rastro de movimiento propio, y la inclinación (que sí es la animación con "swooping" real, cambia de ángulo con easing de 0.15s) permanece apagada. Esto es más cercano a un `:hover` o a un cursor con foco visual que a una animación en el sentido de 2.3.3.

**Matiz que sí quiero dejar anotado, no descartado:** el degradado mide 500px de radio (línea 183); en una pantalla grande, un movimiento rápido del mouse de esquina a esquina produce un barrido visual grande en poco tiempo. No es "movimiento con inercia", pero para una fracción muy sensible de usuarios con trastornos vestibulares severos, cualquier cambio visual grande y rápido puede incomodar, incluso sin easing. No lo considero suficiente para revertir la decisión (el criterio central de 2.3.3 —persistencia/interpolación— no aplica aquí, y sin ningún resplandor la pantalla con preferencia activa queda visualmente inerte del todo), pero es la clase de caso límite que vale la pena que la usuaria conozca antes de darlo por cerrado sin más. Ver caso borde 16 en `docs/lpbag/requerimientos.md`.

### 6.2 ¿La reactividad en vivo es correcta? ¿Basta `.card{transition:none}`?

**Sí a ambas, verificado con dos pruebas independientes** (una prueba sola no bastaba, porque mockear `window.matchMedia` en JS no activa la media query CSS real del navegador — son dos mecanismos distintos que en un navegador real están sincronizados por el mismo feature del SO, pero mi arnés de JS solo cubre el lado JS):

- **Lado JS (arnés con `matchMedia` controlable, `auth-gate.js` real, sin forzar el CSS):** con la preferencia apagada, incliné la tarjeta con un `mousemove` (`rotateX(6.22deg) rotateY(-12.13deg)`, valor real, no cero). Llamé `__setReduced(true)` (dispara el listener `change` real que agrega el commit, línea 1565-1570) y **en el mismo tick**, sin ningún `mousemove` adicional, `card.style.transform` pasó a `perspective(800px) rotateX(0deg) rotateY(0deg)`. Confirmé además que el resplandor **sigue funcionando** con la preferencia ya activa (`--mx` cambió de `2.5%` a `97.5%` entre dos `mousemove`, con la tarjeta plana en ambas lecturas). Al desactivar la preferencia, la tarjeta volvió a inclinarse con el siguiente `mousemove` (`rotateX(-6.22deg) rotateY(12.13deg)`). `host._aiappsCleanups` tenía longitud 1 tras montar el overlay; al invocar sus funciones (simulando lo que hace `removeExistingOverlay()`, confirmado leyendo `auth-gate.js:86-94` que sí las llama antes de desmontar), los oyentes internos del mock bajaron de 1 a 0 — sin fuga.
- **Lado CSS (copia con `@media (prefers-reduced-motion: reduce)` forzado a `@media all`, generada con el mismo `sed` que indica el encargo):** `getComputedStyle(card).transitionDuration` dio **`0s`** y `transitionProperty` dio **`none`**, antes y después de un `mousemove` — confirma que la regla `.card{transition:none}` (línea 200-206) está bien escrita y realmente anula la transición de 0.15s cuando la media query aplica.

**Lo que NO pude probar de un solo tirón:** un cambio real del *system setting* de "reducir movimiento" del sistema operativo en vivo, con ambos mecanismos (CSS y JS) reaccionando a la vez al mismo evento del navegador — esta herramienta no expone un control para eso, y mockear `matchMedia` en JS no mueve la media query CSS real. Lo que sí verifiqué por separado es que cada mitad funciona correctamente de forma aislada; como ambas leen el mismo feature nativo del navegador (`prefers-reduced-motion`), no hay ninguna razón para que se desincronicen en un navegador real. Lo dejo explícito en vez de darlo por probado de punta a punta.

### 6.3 ¿Queda algún movimiento sin cubrir que este commit debería haber tocado?

No. Confirmé con `grep -n "mousemove"` sobre todo `auth-gate.js` que existe **un solo** listener de `mousemove` en el archivo entero (línea 1572, el que este commit corrige) — no hay otro efecto de seguimiento de cursor sin cubrir. Revisé además las otras 3 funciones que construyen overlays (`buildSetNewPasswordOverlay` línea 1708, `buildConnectionErrorOverlay` línea 1911, `buildAccountWidget` línea 1785): ninguna tiene `.card` con `transform`/`transition` ni resplandor — son tarjetas estáticas, así que no necesitan este mismo tratamiento. El zoom automático de StaffGate (`setInterval` + `matchMedia`, líneas 1592-1620) ya era reactivo desde `d15e05c` y no lo toca este diff; lo re-confirmé leyendo el código, sigue con su propio `motionQuery` independiente del `tiltQuery` nuevo, sin conflicto entre ambos.

### 6.4 ¿Se rompió algo ya verificado (contraste, `inert`, foco inicial, orden de tabulación)?

El diff (`git show 40c43f5`) no toca ningún color, ningún atributo `inert`, ningún manejo de foco ni el DOM del formulario — solo el bloque de `mousemove`/`matchMedia` y una regla CSS de `transition`. Confirmé por lectura que es así (no hay ninguna línea fuera de esas dos zonas). Además, verifiqué en vivo lo que **sí** se puede comprobar sin depender de teclado real:
- Foco inicial: recién montado el overlay, `document.activeElement` (bajando por `shadowRoot.activeElement`) es `input#aiapps-email` — igual que lo ya verificado en el caso borde 12.
- `inert`: de los hijos de `<body>` distintos del overlay, los 3 presentes (`<pre>`, dos `<script>`) tienen `inert === true` — el mecanismo de `lockBackground()` sigue funcionando igual.

**Lo que no pude verificar esta sesión, dicho explícitamente y no inferido:** no logré conducir un Tab real por teclado en esta sesión del navegador de prueba. `computer{action:"screenshot"}` falló repetidamente con "the Browser pane is not displayed, so the page is not compositing frames" (probado varias veces, en dos pestañas distintas). Para descartar que fuera un problema específico de la tecla Tab, agregué un listener de `keydown` en captura sobre `document` que registra cualquier tecla recibida (confirmé por separado, con un `setInterval` que sí aparecía en el log en cada lectura, que `get_page_text` está leyendo el DOM en vivo y no un snapshot viejo) — y **ninguna** tecla, ni siquiera `"a"`, produjo un solo evento `keydown` registrado, en ninguna de las dos pestañas donde lo probé. Es decir, esta sesión concreta de la herramienta de navegador no está entregando eventos de teclado a la página en absoluto, no solo Tab — un problema de la herramienta, no algo que pueda atribuirle a este commit ni a `auth-gate.js`. Por eso me apoyo en el punto anterior (diff no toca esa zona + estado de `inert`/foco inicial confirmado igual que antes) para concluir que **no hay regresión de teclado**, pero sin poder decir que re-conduje el Tab real esta vez. El orden de tabulación y la trampa de foco de la tarjeta ya están verificados con Playwright real en la sección 4 (no afectado por este diff) — no encontré motivo para dudar de esa verificación previa, solo no pude repetirla yo mismo hoy.

Con la preferencia **desactivada**, confirmé que el comportamiento es idéntico al de `master` antes de este commit: la tarjeta se inclina con el mouse (`rotateX`/`rotateY` con valores reales, no cero) y el resplandor la acompaña — ninguno de los dos efectos cambia cuando la preferencia está apagada.

### Veredicto — commit `40c43f5`

**APROBADO.** El resplandor del cursor no es, en los términos que le importan a `prefers-reduced-motion`/WCAG 2.3.3, una animación con movimiento propio (sin `transition`, sin inercia, sin interpolación, 1:1 con el input) — conservarlo es una decisión correcta, no una concesión. La reactividad en vivo del apagado de la inclinación está bien resuelta y `transition:none` sí cubre el caso de "se activa con la tarjeta ya inclinada" (confirmado, `transitionDuration:0s`). No queda ningún movimiento fuera del alcance de este commit que debiera haberse tocado. No encontré ninguna regresión en contraste/`inert`/foco/tabulación — con la salvedad explícita de que no pude re-conducir un Tab real esta sesión por una falla de la herramienta (detallada arriba), no por evidencia de un problema en el código.

## Limitaciones de esta revisión (dicho explícitamente, no inferido)

- No hay lector de pantalla real disponible en este entorno; toda conclusión sobre qué "anunciaría" un lector de pantalla (`aria-hidden`, SVG sin rol, etc.) es una inferencia basada en el DOM/árbol de accesibilidad y en el comportamiento típico documentado de los lectores más comunes, no una prueba auditiva real.
- No se probó en un navegador con GUI real ni con un dispositivo táctil; toda interacción de teclado fue automatizada vía Playwright + Chromium headless.
- No se pudo alcanzar el deploy preview de Netlify ni Supabase real desde este entorno (proxy bloqueado, ver hallazgo de `release-manager` en `docs/team-memory.md`); toda la prueba se hizo contra una copia local servida por HTTP con un cliente de Supabase simulado, tal como indicó el encargo.

## Revisión 2026-07-28 — rama `claude/widget-cuenta-y-botones-mentor` (4 commits sobre `origin/master`)

Lo que toca a LP-Bag en esta rama: se eliminó la sección propia "Seguridad de Acceso" (formulario duplicado de cambio de contraseña) más su CSS muerto; símbolo de moneda pasó de `$` a `US$`/`RD$`; y la reposición compartida del widget de Cuenta (`auth-gate.js`).

**Confirmado por lectura del código (no en vivo — ver limitación de herramienta abajo, distinta de la de la revisión anterior de este mismo archivo): el cambio de contraseña sigue siendo alcanzable en LP-Bag.** `lpbag.html` mantiene `window.AIAPPS_SHOW_ACCOUNT_WIDGET = true` (línea 189, sin cambios), y el widget compartido (`buildAccountWidget()` en `auth-gate.js`) sigue construyéndose exactamente igual que en las otras 4 apps cuando hay sesión activa — mismo `updateUser({password})`, mismo `autocomplete="new-password"`, mismo botón "Cambiar contraseña". Confirmado además que el formulario eliminado (`#securityAlert`, `changeCredentials()`, `.sec-alert`, `.btn-sec`) hacía exactamente lo mismo con una copia separada del flujo (`git diff` muestra la función completa removida, línea por línea, sin dejar ningún residuo que pudiera confundirse con el widget). No queda ningún camino roto: antes había dos formas de cambiar la contraseña (la sección propia + el widget), ahora solo una (el widget), que ya estaba presente y probada en esta misma app desde antes de este diff.

**Limitación de herramienta distinta a la de la revisión previa de este documento:** esta vez no hay Playwright ni JS eval disponible en absoluto (no solo `keydown` sintético fallando, como en la revisión del commit `40c43f5` arriba) — no hay forma de confirmar en vivo que el botón "Cambiar contraseña" del widget realmente abre el panel y llama a `updateUser` en esta sesión concreta. La conclusión de arriba es 100% verificación estática de código (comparación de `AIAPPS_SHOW_ACCOUNT_WIDGET` + lectura de `buildAccountWidget()`), no una prueba funcional en vivo.

**Hallazgo transversal (no específico de LP-Bag, código compartido) reportado en detalle en `docs/staffgate/accessibility-notes.md` §2:** el widget de Cuenta cambió su ancla de `top:14px` a `bottom:calc(61px + var(--aiapps-chrome-bottom,0px))` — por el modelo de caja de CSS, esto hace que el botón "👤 Cuenta" salte hacia arriba (~190px, estimado por las reglas CSS reales del panel) cada vez que se abre el panel, algo que no pasaba con el ancla anterior. Aplica igual a LP-Bag. No repito el detalle aquí.

**Veredicto de esta ronda: APROBADO CON OBSERVACIONES.** El cambio de contraseña sigue siendo alcanzable (confirmado por código, no en vivo). El único hallazgo nuevo relevante para LP-Bag es el salto de posición del widget de Cuenta al abrir el panel — compartido con las otras 4 apps, no bloqueante, con solución de una sola regla CSS sugerida en `docs/staffgate/accessibility-notes.md`.
