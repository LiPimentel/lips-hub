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

### 4.2 El enlace "¿Olvidaste tu contraseña?" es inalcanzable por teclado (hallazgo severo, preexistente)

`auth-gate.js:824`: `<div class="link-row"><a class="toggle-mode">¿Olvidaste tu contraseña?</a></div>` — el `<a>` no tiene atributo `href` ni `tabindex`. Confirmado en vivo:
- Llamar `.focus()` directamente sobre el elemento **no lo convierte en el elemento activo** (`shadowRoot.activeElement !== el`) — no es focuseable.
- La secuencia natural de Tab dentro de la tarjeta es correo → contraseña → botón "Entrar" → (sale de la tarjeta, vuelve al panel oculto) — el enlace de recuperación **nunca aparece** en esa secuencia.
- Mismo código exacto (`<a class="toggle-mode">` sin `href`) ya estaba presente en el commit previo al PR #17 (línea 731 de esa versión) — no es algo introducido por el PR #18.

**Impacto:** una persona que use solo teclado no tiene forma de activar el flujo de "Recuperar contraseña" en ninguna de las 5 apps (el componente es compartido). Solo funciona con mouse/touch.

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

## Limitaciones de esta revisión (dicho explícitamente, no inferido)

- No hay lector de pantalla real disponible en este entorno; toda conclusión sobre qué "anunciaría" un lector de pantalla (`aria-hidden`, SVG sin rol, etc.) es una inferencia basada en el DOM/árbol de accesibilidad y en el comportamiento típico documentado de los lectores más comunes, no una prueba auditiva real.
- No se probó en un navegador con GUI real ni con un dispositivo táctil; toda interacción de teclado fue automatizada vía Playwright + Chromium headless.
- No se pudo alcanzar el deploy preview de Netlify ni Supabase real desde este entorno (proxy bloqueado, ver hallazgo de `release-manager` en `docs/team-memory.md`); toda la prueba se hizo contra una copia local servida por HTTP con un cliente de Supabase simulado, tal como indicó el encargo.
