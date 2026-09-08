# Bitácora del Mentor — Notas de accesibilidad

Primera revisión de accesibilidad de esta app (no existía `docs/bitacora-mentor/accessibility-notes.md` antes de hoy).

## Alcance de esta revisión

Rama `claude/widget-cuenta-y-botones-mentor`, 4 commits sobre `origin/master` (`bbeeac1`, `62e7128`, `3a778ca`, `ac591c7`), comparados con `git diff origin/master..HEAD -- <archivo>` (no se cambió de rama en el worktree compartido). Lo que toca a esta app: nuevo logo animado `AIAPPS_LOGO_READER` en `auth-gate.js` (compartido), reposición del widget de Cuenta (`auth-gate.js`, compartido), y color nuevo de `.btn-add-mentee`/`.btn-export`/`.pending-badge` en `bitacora-mentor.html`.

**Limitación de herramienta importante, verificada en esta sesión (no solo asumida por la lista de trampas del encargo):** esta sesión **no tiene ninguna herramienta de evaluación JS en el navegador** (no hay `getBoundingClientRect`/`getComputedStyle`/`getAnimations()` disponibles vía la herramienta de navegador, y tampoco hay `node`/`python`/Playwright instalados para montar uno). Confirmado: `computer{action:"screenshot"}` falla siempre ("the Browser pane is not displayed"), y `read_page`/`get_page_text` **no atraviesan el shadow DOM** del widget de Cuenta ni del candado de login (ambos usan `attachShadow({mode:"open"})`) — el botón "👤 Cuenta" nunca aparece en el árbol de accesibilidad ni en el texto de la página aunque el widget esté presente y funcionando. Por esto, todo lo de este documento que depende de medir el DOM en vivo (posición real en píxeles, orden de Tab, estado de foco) está marcado explícitamente como **no verificado en vivo**, y en su lugar se hizo un trazado manual pero exacto del CSS/JS real del commit (matemática de modelo de caja, valores de color exactos del código, keyframes exactos) — no es una inferencia visual, es aritmética sobre los valores reales del archivo.

**Sesión con posible estado de auth ya cacheado:** al abrir `bitacora-mentor.html` en el navegador de esta sesión, la app cargó el dashboard completo sin pantalla de login (ni el candado ni el widget de Cuenta aparecieron), consistente con una sesión de Supabase ya guardada por otro hilo que comparte este navegador (patrón ya documentado varias veces en `docs/team-memory.md`). No se tocó ni cerró esa sesión.

## 1. Reduced motion — el logo `AIAPPS_LOGO_READER` (monigote hojeando un libro)

**Correcto, y evita la trampa ya conocida del equipo.** Verificado leyendo `auth-gate.js` línea por línea:

```
@keyframes lr-flip{ 0%, 28%{transform:scaleX(1);} 44%{transform:scaleX(0.06);} 60%, 100%{transform:scaleX(1);} }
@keyframes lr-nod{ 0%, 100%{rotate:0deg;} 44%{rotate:-5deg;} }
@media (prefers-reduced-motion: reduce){
  .logo-reader .lr-page, .logo-reader .lr-head{ animation:none; }
}
```

A diferencia de varias de las escenas de fondo ya documentadas en `docs/gantt/accessibility-notes.md` (cuyo `100%` cae en `opacity:0`/`width:0`, dejando la escena "vacía" si solo se apaga la animación), aquí el `0%`/`100%` de **ambos** keyframes ya es el estado de reposo real (`scaleX(1)` = página plana/abierta, `rotate:0deg` = cabeza sin inclinar). `animation:none` simplemente devuelve el elemento a ese estado base — no hay riesgo de "vaciar" el ícono. **Mi juicio sobre el estado de reposo elegido: es el correcto.** El libro se ve abierto y quieto, que es exactamente "está leyendo, en pausa" — no un frame a medio doblar ni una cabeza ladeada de forma rara.

## 2. Reduced motion — el logo `AIAPPS_LOGO_DART` (dardo, StaffGate) — análisis completo en `docs/staffgate/accessibility-notes.md`

El dardo no es parte de esta app (`AIAPPS_LOGO_DART` solo se activa en `StaffGate.html`), así que el análisis de su estado de reposo y de si su recorrido amplio merece trato especial está en `docs/staffgate/accessibility-notes.md` §1-2, no aquí, aunque el código vive en el mismo `auth-gate.js` compartido.

## 3. Contraste de color — verificado con la fórmula de luminancia relativa de WCAG sobre los valores reales de `--sage-light`/`--brass`/`--slate`/`--rust`/`--rust-light` (no los números que dio el tech lead)

Colores reales leídos de `bitacora-mentor.html` (líneas 198-206): `--brass:#7C5CBF`, `--sage-light:#E9E1F7`, `--slate:#5B3E91`, `--rust:#A64B3A`, `--rust-light:#F3DFDA`. Calculado con la fórmula WCAG estándar (verificada contra el par de referencia negro/blanco = 21.00:1 exacto antes de usarla):

| Par | Contraste calculado | Lo que midió el tech lead | ¿Coincide? | ¿Pasa AA? |
|---|---|---|---|---|
| `.btn-add-mentee`/`.btn-export` texto `--slate` sobre fondo `--sage-light` | **6.52:1** | 6.52:1 | Sí, exacto | Sí (texto normal, umbral 4.5:1) |
| Borde `--brass` sobre `--sage-light` (componente no-texto, umbral 3:1) | **4.00:1** | 4.31:1 | **No coincide** — mi cálculo da 0.31 menos | Sí de todas formas (por encima de 3:1) |
| `.pending-badge` texto/borde `--rust` sobre fondo `--rust-light` | **4.44:1** | 4.6:1 | **No coincide, y es el que importa** | **No** — queda por debajo de 4.5:1 |

**Hallazgo real, no solo una discrepancia de redondeo:** el badge "N actividades pendientes" (`.pending-badge`, `bitacora-mentor.html:277`) usa texto de 11px en `font-weight:600` — muy por debajo del umbral de "texto grande" (18pt, o 14pt en negrita ≈ 18.7px), así que necesita 4.5:1, no 3:1. Mi cálculo da **4.44:1**, insuficiente por un margen pequeño pero real (no es un error de redondeo de mi parte: reproduje el cálculo dos veces con precisión de 4 decimales, `4.4399`). Esto es exactamente el tipo de elemento que el checklist pide vigilar con cuidado ("colores decorativos-pero-informativos que también cargan significado") — el badge no es decorativo, comunica activamente "hay pendientes", así que su legibilidad importa. **Recomendación concreta:** oscurecer levemente `--rust` (por ejemplo a `#953F2F` o similar) o aclarar `--rust-light`, y volver a medir — no hace falta un cambio grande, el déficit es de 0.06:1.

**Nota de proceso para el equipo:** este es el segundo caso en esta revisión (el primero es el borde `--brass`) donde el número que reportó el tech lead no coincide con el cálculo real. Ninguno de los dos es catastrófico (uno pasa igual, el otro falla por poco), pero refuerza la instrucción de este rol de nunca confiar en el número de otro sin recalcularlo.

## 4. Navegación por teclado — NO verificado en vivo esta sesión

Intenté `computer{action:"key", text:"Tab"}` sobre la página cargada; no hay forma de confirmar si el foco se movió (el árbol de accesibilidad no expone estado de foco, y ya se documentó en `docs/team-memory.md` — confirmado independientemente por 5 agentes previos — que el `keydown` sintético de esta familia de herramientas no siempre llega a la página). No presento esto como aprobado. El diff de este commit no toca `inert`/`tabindex`/manejo de foco en ningún archivo (confirmado por `git diff`), así que no hay razón para sospechar una regresión de teclado nueva — pero tampoco hay una confirmación en vivo de este ciclo específico.

## 5. Markup para lectores de pantalla

`.btn-add-mentee`/`.btn-export` siguen siendo `<button>` reales con texto visible (`+ nuevo mentee`, `Exportar CSV`, etc.) — el cambio de este diff es solo de color, no de marcado; confirmado leyendo el HTML (`bitacora-mentor.html:750-757`), no solo el CSS. Sin `outline:none` en todo el archivo (`grep -n outline` → 2 coincidencias, ambas agregando un contorno visible a `:focus`, ninguna quitándolo), así que el foco por defecto del navegador en estos botones no debería estar suprimido por este cambio ni por código preexistente.
> Mantenido por el agente Accessibility Reviewer. Primera entrada de este archivo (no existía antes de esta revisión). Ver también `docs/team-memory.md` y `docs/bitacora-mentor/requerimientos.md` (sección "Casos borde", lista compartida entre los 5 agentes).

## 2026-07-27 — Revisión: commit `bdf722a` ("Bitácora: agregar el meta viewport que faltaba")

**Alcance del diff confirmado en vivo:** `git diff origin/master bdf722a -- bitacora-mentor.html` da exactamente 1 línea agregada (`<meta name="viewport" content="width=device-width, initial-scale=1.0">`, línea 184) + el archivo de nota de versión. No toca `auth-gate.js`, ni CSS de color/foco/`inert`, ni ningún selector de contraste. Ya tiene `qa-lead: APROBADO` y `security-reviewer: APROBADO`.

Metodología: reproduje las mediciones del propio qa-lead de forma independiente usando los mismos archivos temporales del tech lead (`_vpX-antes.html`=`origin/master`, `_vpX-despues.html`=HEAD, diff byte-exacto confirmado salvo la línea del meta tag) servidos en `http://localhost:8792/`, y construí una tercera copia instrumentada propia (`_a11yX-mobile-metrics.html`, sin trackear, no commiteada) que agrega un `<script>` al final del `<body>` — ejecuta en el mismo scope global de la app, así que pude invocar directamente `currentTab`, `modal`, `render()`, `renderModal()` (las funciones reales de la app, no una simulación) para forzar la pestaña "Base de datos" y los modales "Nuevo mentee"/"Nueva plantilla" sin necesitar login, y volcar `getComputedStyle`/`getBoundingClientRect` como texto plano en el DOM, leído después con `get_page_text`. `computer{action:"screenshot"}` no se usó como evidencia (limitación de entorno ya documentada). Confirmé `location.href` en cada medición.

### 1-2. ¿Es el auto-zoom de iOS una regresión real, y hay que subir los campos a 16px?

**Mi juicio: es un efecto secundario real pero de severidad baja, y es una mejora neta sobre la línea base, no un empeoramiento.**

- Antes del commit, a 375×812 la página completa se renderizaba a `visualViewport.scale=0.3826` (confirmado, no inferido). Un campo de 13.5px de `font-size` en el sistema de coordenadas CSS de la página se veía, en píxeles físicos de pantalla, a **13.5 × 0.3826 ≈ 5.2px** — genuinamente ilegible, y el usuario ya tenía que hacer zoom manual solo para leer cualquier campo. Después del commit, ese mismo campo se ve a sus **13.5px reales** (escala 1). Es decir: el auto-zoom de iOS al enfocar un campo, si ocurre, agranda un texto que ahora es *más* legible que antes, no menos — la comparación correcta no es "texto grande vs texto que aparece encogido al enfocar", sino "texto de 5px ilegible siempre" vs "texto de 13.5px legible, que además puede agrandarse un momento al enfocar".
- El auto-zoom de iOS Safari, cuando ocurre, es una molestia de UX (la vista se desplaza y hay que hacer zoom-out manual al salir del campo) pero no es un violación de WCAG por sí sola, y no bloquea ninguna funcionalidad — el usuario puede seguir escribiendo con el teclado normalmente.
- **No verificable en vivo en esta sesión**: el navegador de prueba es Chromium, no reproduce el comportamiento específico de auto-zoom-on-focus de WebKit/iOS. Coincido con qa-lead en que esto queda pendiente de una prueba manual puntual en un iPhone real antes de darlo por confirmado o descartado — lo marco explícitamente como no verificado, no como inferencia presentada como hecho.
- **Recomendación sobre subir a 16px:** no lo considero urgente, y sí le veo un costo de layout real y medible. Con `.field input/select/textarea` ya en 295px de ancho dentro del modal a 375px (confirmado con `getBoundingClientRect`), subir el `font-size` de 13.5px a 16px (+18.5%) empujaría la altura de esos campos (hoy 36-60px) y podría romper el ajuste de textos ya ajustados por `white-space`/`text-overflow` en otros selectores compartidos con el mismo tamaño (`.mentee-name` en 13.5px con `text-overflow:ellipsis` sobre un contenedor angosto, por ejemplo). Si el tech lead decide subirlo, mi recomendación concreta es limitarlo **solo a los controles de formulario reales dentro de los `@media (max-width:720px)` / `(max-width:420px)` ya existentes**, no a todo el archivo — específicamente:
  - `.search-wrap input` (línea 231)
  - `.field input,.field select,.field textarea` (línea 322)
  - `.tpl-item-row select` (línea 336) y `.tpl-item-row input` (línea 337)
  - `.checklist-q input` (línea 346)
  - `.db-filters input,.db-filters select` (línea 356)

  Esto evita tocar el `font-size` de elementos puramente visuales (`.mentee-name`, `.pill-*`, badges) que no son objeto del auto-zoom de iOS (solo aplica a `<input>/<select>/<textarea>` enfocables), y acota el cambio a donde realmente importa.

### 3. ¿Hay otra app del hub con el mismo patrón que YA sufre esto hoy en producción?

**Sí — es un patrón transversal, no exclusivo de Bitácora, y ya está expuesto en producción hoy en al menos 2 de las otras 4 apps.** Confirmado por grep en las 6 páginas del proyecto: las 5 apps + el hub ya tienen `<meta name="viewport">` (Bitácora era la única sin él, tal como dice el propio commit). De esas 5, encontré controles de formulario reales bajo 16px en:

- **LP-Bag (`lpbag.html`)**: `.form-inp` (línea 374-378, el input principal de "monto" del formulario de alta de gasto) en **14px**; `.csel` (línea 384-389, el `<select>` de moneda junto al monto) en **13px**; `.cview select` (línea 243) en **13px**. Esta app ya tenía `<meta name="viewport">` desde antes (confirmado en el grep), así que el mecanismo de auto-zoom de iOS ya está activo en producción para su formulario más usado (agregar gasto), no en una vista secundaria.
- **StaffGate (`StaffGate.html`)**: `.search-input` (línea 239) en **12px**; `.notes-ta` (línea 313, textarea de notas de entrevista) en **13px**; `.tpl-inp` (línea 377, editor de plantillas) en **12px**; `.q-note` (línea 345) en **11px**. Mismo caso: viewport ya activo, controles ya expuestos hoy.

No alcancé a auditar con el mismo detalle MyTravel ni Gantt en esta sesión (quedaría como pendiente si se quiere el panorama completo de las 5), pero con 2 de 4 ya confirmadas, mi conclusión es que **esto es deuda transversal preexistente del hub, no algo que este commit introduce** — el commit de Bitácora simplemente hace que Bitácora se sume a un problema que las otras apps ya tenían. Si el tech lead decide actuar sobre esto, tiene más sentido como una tarea única que revise las 5 apps a la vez (mismo patrón que la deuda de `prefers-reduced-motion` documentada en `team-memory.md`) que como un parche aislado en Bitácora.

### 4. Tamaño de texto real en móvil (375px), medido en vivo

Con el meta tag puesto, medí `getComputedStyle`/`getBoundingClientRect` reales a 375×812 (no inferidos del CSS fuente):

| Elemento | font-size real | Contexto |
|---|---|---|
| `.brandmark` ("Bitácora del mentor") | 21px | Encabezado |
| `.modal h3` ("Nueva plantilla") | 19px | Título de modal |
| `.tab-btn` | 13px | Pestañas |
| `.btn-add-mentee` / `.search-wrap input` | 13px | Sidebar |
| `.field input/select/textarea` (modal) | 13.5px | Formulario mentee |
| `.db-filters input/select` | 12.5px | Filtros base de datos |
| `.no-results` | 12.5px | Mensaje vacío |
| `.btn-export` ("Exportar CSV"/"Excel") | 11.5px | Texto más pequeño de un botón con texto real |
| `.field label` | 12px | Etiquetas de campo |

Ninguno de estos tamaños es ilegible por sí solo (12-13.5px es un tamaño común en apps de escritorio adaptadas, y el zoom del usuario no está bloqueado — ver punto 6), pero **11.5-12px en textos con función real** (botones de exportar, filtros, etiquetas) es notoriamente pequeño para un teléfono sostenido en la mano, más aún cuando el resto del hub usa el mismo patrón. No es un hallazgo de este commit (los `font-size` no cambiaron, solo se volvieron visibles a su tamaño real por primera vez en móvil) pero es la primera vez que se puede juzgar esto con evidencia real en vez de "no se puede saber, todo está encogido al 38%" — lo dejo como observación, no como defecto bloqueante, porque WCAG 1.4.4 (Resize Text) se satisface por la vía de que el usuario puede hacer zoom manual (confirmado en el punto 6).

### 5. Objetivos táctiles a 375px, medidos en vivo (`getBoundingClientRect`)

| Control | Alto × Ancho real | ¿Cumple 24×24 CSS px (WCAG 2.2 SC 2.5.8, AA)? |
|---|---|---|
| `.tab-btn` (pestañas) | 34.0 × 84.4 | Sí |
| `.btn-add-mentee` | 36.0 × 339.0 | Sí |
| `.search-wrap input` | 34.0 × 339.0 | Sí |
| `.btn-export` | 32.0 × 339.0 | Sí |
| `.db-filters input` | 33.0 × 335.0 | Sí |
| `.db-filters select` | 35.0 × 335.0 | Sí |
| `.field input` (modal) | 36.0 × 295.0 | Sí |
| `.field select` (modal) | 38.0 × 295.0 | Sí |
| `.btn-ghost`/`.btn-primary` (modal, columna completa) | 34-36 × 295.0 | Sí |
| **`.tpl-item-remove`** (botón "✕" de eliminar ítem de plantilla) | **27.0 × 23.4** | **No en ancho** — 23.4px queda 0.6px por debajo del mínimo de 24×24 CSS px de WCAG 2.2 SC 2.5.8 |

El único objetivo táctil que no llega al umbral es el botón "✕" para quitar un ítem de una plantilla (`.tpl-item-remove`, CSS en la línea 338: `padding:4px 6px;font-size:14px`), y por un margen mínimo (0.6px de ancho). Es preexistente (el CSS de este botón no cambió con este commit) y **no verifiqué el espaciado entre filas contiguas**, por lo que no puedo confirmar si aplica la excepción de "espaciado" de la propia SC 2.5.8 (un círculo de 24px centrado en el objetivo sin superponerse con el objetivo vecino). Lo dejo como hallazgo menor, no bloqueante, con la medición exacta para que quien lo revise decida si aplica la excepción o conviene agrandar el padding.

Todo lo demás medido llega cómodamente al umbral AA (24×24), aunque ninguno alcanza el umbral AAA recomendado de 44×44.

### 6. ¿El meta tag bloquea el zoom del usuario?

**Confirmado que NO.** Leí la línea exacta en el archivo servido: `<meta name="viewport" content="width=device-width, initial-scale=1.0">` (línea 184 de `bitacora-mentor.html`, y línea 187 de `_a11yX-mobile-metrics.html` con el `<script>` de Folder Bridge antepuesto). No contiene `user-scalable=no` ni `maximum-scale` en ningún valor — solo `width=device-width` e `initial-scale=1.0`. Coincido con la confirmación de security-reviewer: el usuario conserva la capacidad de hacer pinch-zoom libremente, lo que además es la razón por la que los tamaños de texto pequeños del punto 4 no llegan a ser una violación de WCAG 1.4.4 (Resize Text) — el mecanismo de escape (zoom manual del usuario) sigue disponible.

### 7. ¿Se rompió algo ya verificado antes (contraste, foco, `inert`)?

**No.** El diff no toca ningún selector de color, ningún atributo `tabindex`/`inert`, ni `auth-gate.js` — confirmado por `git diff origin/master bdf722a -- bitacora-mentor.html`, que muestra únicamente la línea del `<meta>`. El único efecto es que 3 media queries de layout (420px/720px propias, 900px de `auth-gate.js`) pasan de nunca cumplirse a cumplirse por primera vez en móvil real — ya verificado por qa-lead y reconfirmado por mí (ver más abajo) que ninguna de las 3 reglas cambia colores ni oculta contenido informativo, solo reordena layout (`flex-direction:column`, anchos al 100%, `grid-template-columns`) y oculta `.growth-scene` (decorativa, `pointer-events:none`, ya confirmado sin contenido interactivo por security-reviewer).

### Prueba de teclado (intentada, con limitación de entorno confirmada de nuevo)

Antes de asumir la limitación ya documentada por el equipo (`team-memory.md`, "ningún evento `keydown` sintético llegó a la página"), la reproduje yo mismo en esta sesión concreta: agregué un listener de captura (`document.addEventListener('keydown', ..., true)`) a mi harness que escribe cada tecla recibida en `document.title`, y envié `Tab` con `computer{action:"key", text:"Tab"}`. El título se quedó en `METRICS_READY` — **el evento no llegó**, confirmando la limitación para esta sesión en particular, no solo asumiéndola por la nota de otro agente. En consecuencia, no pude conducir un recorrido de Tab real esta vez. Me apoyo en que el diff de este commit no toca `inert`/`tabindex`/el overlay de `auth-gate.js` en absoluto — el orden de tabulación y el manejo de foco del candado, ya auditados por otras rondas (ver `docs/lpbag/accessibility-notes.md` y `docs/staffgate/accessibility-notes.md`), no tienen ninguna ruta de código que este commit pueda haber alterado.

### Hallazgo nuevo, fuera del diff pero dentro del checklist de este rol: estado del mentee comunicado solo por color en la lista lateral

En `renderMentoriaView` (línea 933): `<span class="status-dot" style="background:var(--status-${status})"></span>` — el punto de color junto al avatar de cada mentee en la lista lateral (activo=verde `#5C8C5A`, pausa=naranja `#C08A3E`, cerrado=gris `#8A8A8A`) **no tiene `title`, `aria-label` ni ningún texto equivalente en el `<li>`**; es el único indicador de estado visible en esa lista. La única traducción textual del estado ("Activo"/"Pausa"/"Cerrado") vive en `.status-badge` dentro del perfil del mentee, que requiere haberlo seleccionado primero. Esto es un caso de "Uso del color" (WCAG 1.4.1): quien navegue solo la lista lateral (por daltonismo, baja visión, o lector de pantalla) no tiene forma de distinguir el estado de un mentee sin abrir su perfil.

Calculé el contraste de cada color del punto contra el anillo blanco que lo bordea (`border:1.5px solid var(--surface)`, `--surface:#FFFFFF`) para descartar además un problema de contraste no-textual (WCAG 1.4.11): activo `#5C8C5A` → **3.92:1**, cerrado `#8A8A8A` → **3.45:1**, pausa `#C08A3E` → **3.02:1** (marginal pero sobre el umbral de 3:1). Es decir, el punto en sí es distinguible visualmente para quien ve el color — el problema no es de contraste sino de ausencia total de una vía no-cromática de acceder a la misma información en esa vista. Preexistente, no introducido por este commit; lo documento aquí porque cae directamente en el punto del checklist sobre "elementos decorativos-pero-informativos que también portan significado".

## Veredicto

**APROBADO CON OBSERVACIONES.**

1. El logo nuevo (`AIAPPS_LOGO_READER`) está bien resuelto: reduced-motion cubre las dos animaciones (`lr-flip`, `lr-nod`) y el estado de reposo elegido (libro abierto y quieto) es el correcto, sin caer en la trampa de "animación que vuelve a cero" ya documentada para otras escenas del proyecto.
2. Hallazgo accionable, no bloqueante: el badge de pendientes (`--rust` sobre `--rust-light`) da **4.44:1**, por debajo del mínimo AA de 4.5:1 para texto normal — vale la pena un ajuste menor de color antes de considerar esto cerrado, ya que es el elemento que más se apoya en el color para comunicar urgencia.
3. El borde `--brass` sobre `--sage-light` da 4.00:1 (no 4.31:1 como se midió) pero sigue pasando el umbral de 3:1 para componentes de UI — sin acción requerida, solo corrijo el número para el registro.
4. Navegación por teclado no verificada en vivo en esta sesión por limitación de herramienta (sin JS eval, sin shadow-DOM traversal) — no hay indicio de regresión en el diff, pero no cuenta como comprobado.
El commit en sí (agregar el `<meta name="viewport">` que faltaba) no introduce ninguna regresión de accesibilidad — es una corrección pura que hace que la app se vea a su tamaño real por primera vez en móvil, con evidencia medida (no inferida) de que el texto y los controles táctiles quedan en rangos aceptables y de que el zoom del usuario sigue disponible. Las observaciones que dejo son:

1. El riesgo de auto-zoom de iOS por `font-size<16px` en los `<input>/<select>/<textarea>` es real y ahora alcanzable por primera vez en un iPhone real, pero es una consecuencia esperada de corregir el bug, no un defecto nuevo, y es una mejora neta sobre la ilegibilidad de antes (texto de ~5px efectivos). No verificable en este entorno (Chromium). Pendiente de prueba manual en iPhone real antes de decidir si se sube a 16px.
2. El mismo patrón (viewport real + inputs bajo 16px) ya existe hoy en producción en LP-Bag y StaffGate — no es exclusivo de Bitácora.
3. Un objetivo táctil preexistente (`.tpl-item-remove`, 23.4px de ancho) queda 0.6px bajo el umbral AA de 24×24 — hallazgo menor, no bloqueante, no introducido por este commit.
4. El estado del mentee en la lista lateral se comunica solo por color (`.status-dot`, sin texto/aria-label) — hallazgo preexistente, no introducido por este commit, pero relevante al checklist de este rol.

Ninguno de estos cuatro puntos es un control genuinamente inalcanzable por teclado ni un bloqueo funcional — por eso no llega a RECHAZADO.

## 2026-07-29 — Revisión: rama `claude/mentor-sesiones-editables-y-checklist` (enfoque múltiple con chips, compromisos como lista, botón "editar")

**Alcance confirmado con `git diff $(git merge-base HEAD origin/master) -- bitacora-mentor.html`** (433 líneas, 3 commits: `fa22eb9` "permitir editar sesión ya guardada", `964e833` "compromisos como checklist y enfoque con selección múltiple", `9e6dc47` "que un enfoque inválido no deje la sesión sin etiqueta"). No se cambió de rama; no se tocó código de la app.

### Limitación de entorno confirmada esta sesión: contaminación cruzada real, no solo sospechada

Antes de responder las preguntas del encargo, reporto lo que pasó al intentar inyectar datos (`state`+`render()`) para ver la app sin credenciales, porque invalida buena parte de lo que hubiera sido verificación "en vivo":

- No hay forma de ejecutar JS arbitrario en esta sesión: `navigate` con un URL `javascript:...` es rechazado por la herramienta ("no es un path ni URL válido"), no hay consola expuesta, y `tabs_create` falló ("Tab cap reached" / "Browser pane gone") — no pude abrir una pestaña limpia propia.
- Reutilicé `tab-8` (compartida con otras sesiones, confirmado con `tabs_context`: 8 pestañas en `http://localhost:8796`, todas de otros hilos). `location.href` coincidió en cada lectura (siempre `http://localhost:8796`), así que por la letra de la regla no hubo que abortar por URL distinta — pero encontré una contaminación más grave que un cambio de URL: **el contenido cambió bajo mis pies sin ninguna acción mía.** Until ahí la app mostraba "0 mentees registrados" en tres lecturas seguidas; tras un clic mío en la caja de búsqueda y escribir "zzz" (que no llegó a filtrar nada — el campo se quedó en `""`), la página pasó a mostrar 1 mentee ("Ana Vieja") con 2 sesiones y compromisos ya cargados — datos que yo no inyecté. Un `ref` que acababa de leer (`ref_75`, el botón "+ registrar sesión") quedó **stale** milisegundos después. En una lectura posterior apareció un modal "Editar sesión" ya abierto con contenido editado (`"bien EDITADO"`, un enfoque "Directivo Socrático" ya marcado doble, un compromiso nuevo "Practicar entrevista", y un toast "Sesión registrada.") sin que yo hubiera abierto ese modal ni pulsado guardar. Es decir: otra sesión de Claude concurrente estuvo operando la misma pestaña en tiempo real mientras yo intentaba medir.
- Consecuencia: **no puedo atribuirme con certeza ninguna interacción de clic/teclado de esta sesión sobre `tab-8`** — lo que vi pudo ser (parcialmente) obra de otro hilo, no mía. Uso esas capturas solo para lo que es verificable de forma independiente del *quién* lo causó (estructura del árbol de accesibilidad: nombres accesibles, presencia/ausencia de agrupación), nunca para afirmar "confirmé con Tab real que..." Todo lo que requeriría un recorrido de teclado controlado por mí queda como **NO verificado**, no como aprobado por inferencia — igual que ya reportaron 3 agentes antes con el límite de `keydown` sintético (`docs/team-memory.md`), pero esta vez el problema adicional es que ni siquiera los clics son atribuibles con confianza en esta ronda.
- Por eso, para las preguntas de contraste/semántica/estructura respondo con **trazado exacto de código + aritmética de color verificada** (mismo método que usaron los agentes anteriores cuando esta sesión no tuvo herramienta de evaluación JS), no con medición en vivo — y lo marco así en cada punto.

### 1. `<button aria-pressed>` vs. checkboxes en `<fieldset>` — mi recomendación: el patrón actual tiene un hueco real, y checkboxes en `fieldset` lo resuelve gratis

`aria-pressed` en un `<button type="button">` es semánticamente válido para un grupo de botones de "encendido/apagado" (patrón *Button* de WAI-ARIA APG) — no es una elección incorrecta en el vacío. Pero encontré el hueco real que hace la diferencia aquí: el grupo de 3 chips **no tiene ninguna agrupación programática**. El marcado exacto es:

```html
<div class="field"><label>Enfoque usado <span>(puedes elegir varios)</span></label>
  <div class="enfoque-picker" id="s-approach">
    <button type="button" class="enfoque-chip ..." aria-pressed="...">Directivo</button>
    ...
  </div>
</div>
```
(`bitacora-mentor.html:1896-1899`)

El `<label>` no tiene `for`, no envuelve nada, y `.enfoque-picker` no tiene `role="group"` ni `aria-labelledby`. Confirmado por lectura directa del archivo, no por inferencia: **no existe ningún atributo que ate "Enfoque usado (puedes elegir varios)" a los tres botones.** Un lector de pantalla que llegue a cualquiera de los tres solo anuncia "Directivo, botón, presionado" / "Socrático, botón, no presionado" — nunca el nombre del grupo ni cuántas opciones hay. Con checkboxes dentro de un `<fieldset><legend>Enfoque usado...</legend>` esto se resuelve automáticamente, sin ARIA adicional, porque `<legend>` se anuncia sola al entrar a cualquier control del `fieldset` en todos los lectores de pantalla comunes (NVDA, JAWS, VoiceOver) — es conocimiento de especificación de plataforma, no algo que pude verificar con un lector real en este entorno.

**Dato a favor de mi recomendación, encontrado en el propio archivo:** esta misma app ya resuelve el problema equivalente correctamente en otro lado, sin necesitar `fieldset`: la lista de "Integrantes" del modal de grupo envuelve cada checkbox en un `<label class="member-check-row"><input type="checkbox" value="${m.id}"><span>${esc(m.name)}</span></label>` (`bitacora-mentor.html:1585-1588`) — asociación nativa, sin `aria-label`, sin `for` explícito. Ese patrón (checkbox envuelto en `<label>`) ya es parte del vocabulario de esta app.

**Mi conclusión:** si el objetivo visual (etiquetas ovaladas encendido/apagado) importa más que el control nativo, la corrección mínima es mantener los `<button aria-pressed>` pero agregarle `id` al `<label>` y `role="group" aria-labelledby="<ese id>"` a `.enfoque-picker` — 2 atributos, sin rehacer el HTML. Si se prefiere la vía más robusta y ya usada en esta misma app, migrar a checkboxes dentro de un `<fieldset><legend>` (se puede seguir maquetando como píldoras con CSS sobre `<label>`, igual que ya hace `.member-check-row`) elimina el problema de raíz y de paso resuelve la restricción "nunca las 3 apagadas" con menos JS custom para el toggle (aunque la regla de "al menos una marcada" seguiría necesitando validación propia en cualquiera de los dos casos). **No es una preferencia estética mía** — es la corrección al hueco de agrupación que encontré, no un cambio "porque sí es más nativo".

### 2. Contraste — recalculado con la fórmula WCAG de luminancia relativa (verificada contra el par blanco/negro = 21.00:1 antes de usarla)

Fondo real del contenedor: el picker vive dentro de `.modal`, cuyo `background` es `var(--surface)` = `#FFFFFF` (confirmado, `bitacora-mentor.html:353`) — el chip inactivo tiene `background:transparent`, así que su fondo efectivo es ese blanco.

| Par | Colores | Contraste calculado | Umbral aplicable | ¿Pasa? |
|---|---|---|---|---|
| Texto **inactivo** (`--muted` #79796F) sobre fondo del modal (`--surface` #FFFFFF) | 12.5px, peso normal | **4.40:1** | 4.5:1 (texto normal) | **No** — falta 0.10:1, mismo tipo de déficit pequeño-pero-real que el badge de pendientes ya reportado el 2026-07-27 |
| Borde **inactivo** (`--line` #D8D6C8) sobre fondo del modal (`--surface` #FFFFFF) | borde 1px, componente no-textual | **1.46:1** | 3:1 (WCAG 1.4.11, non-text) | **No, por un margen grande** — el borde del estado "apagado" es casi invisible contra el blanco |
| Texto **activo** (`--slate` #5B3E91) sobre fondo activo (`--sage-light` #E9E1F7) | 12.5px, peso 600 | **6.52:1** | 4.5:1 | Sí — coincide exacto con el mismo par ya medido para `.btn-add-mentee` el 2026-07-27 (mismo par de colores, buena señal de consistencia del cálculo) |
| Borde **activo** (`--brass` #7C5CBF) sobre fondo activo (`--sage-light` #E9E1F7) | borde 1px | **4.00:1** | 3:1 | Sí — coincide con el recálculo ya hecho el 2026-07-27 para el mismo par |
| Contorno de foco (`:focus-visible`, `--brass` #7C5CBF) sobre fondo del modal (`--surface` #FFFFFF) | outline 2px | **5.07:1** | 3:1 (WCAG 1.4.11, indicador de foco) | Sí |

**El hallazgo nuevo real es el borde inactivo (1.46:1).** No es un fallo por redondeo: el chip "apagado" no tiene relleno (transparente) ni texto con suficiente contraste (4.40, ya al límite), y su único indicio visual de ser un control con forma de píldora es un borde de 1px que contra el blanco del modal es casi imperceptible (`#D8D6C8` es un gris muy claro sobre blanco puro). Para alguien con baja visión, un chip inactivo puede leerse como texto suelto flotando, no como un botón — el `:hover`/`:focus-visible` sí mejoran el borde a `--brass` (4.00:1), pero eso no ayuda a quien solo pasa el ojo por la fila sin interactuar. El texto inactivo (4.40:1) es el mismo tipo de déficit pequeño que ya se documentó para el badge de pendientes — no lo presento como el hallazgo más severo, pero sí como real. Recomendación concreta: oscurecer `--line` para el borde específico de `.enfoque-chip` (o darle un `background` sutil no transparente, p. ej. un gris muy claro) en vez de tocar la variable global `--line` (usada en decenas de otros bordes divisorios donde 1.46:1 sí es aceptable, porque ahí no cargan la única pista visual de "esto es clicable").

### 3. Objetivo táctil de `.enfoque-chip` — estimado por aritmética, no medido en vivo (ver limitación de entorno arriba)

CSS real: `padding:7px 15px;font-size:12.5px` (`bitacora-mentor.html:263-266`), sin `line-height` propio (hereda el de `body`, no declarado tampoco → default del navegador ≈1.2). Cálculo: alto ≈ `12.5×1.2 + 7×2 + 1×2(borde)` ≈ 15+14+2 = **~31px**; ancho, incluso para la etiqueta más corta ("Directivo", 9 caracteres) a ~7px promedio por carácter en Inter 12.5px, ronda **~93px** (63px de texto + 30px de padding lateral). Ambas dimensiones superan holgadamente el umbral de 24×24 CSS px de WCAG 2.2 SC 2.5.8. **No es una medición con `getBoundingClientRect`** (no disponible esta sesión) — es aritmética de modelo de caja sobre los valores reales del CSS, con margen amplio (no es un caso límite como el 23.4px ya documentado de `.tpl-item-remove`), así que la confianza en la conclusión es alta aunque el método no sea el ideal.

### 4. "Nunca se pueden apagar todas" — aceptable como regla, pero el rechazo silencioso del clic necesita comunicarse

Confirmado por lectura del código (`bitacora-mentor.html:1931-1939`): al hacer clic en el único chip activo restante, el handler simplemente `return`s — ningún cambio visual, ningún mensaje, `aria-pressed` no cambia. Desde accesibilidad esto es un caso real de "el control no respondió a mi activación y no sé por qué": alguien que usa lector de pantalla o que no ve bien el estado visual no tiene manera de saber si su clic/Enter "no hizo nada por error" o "no hizo nada a propósito". La regla de negocio (al menos un enfoque siempre marcado) me parece razonable — el problema es la ausencia de retroalimentación, no la regla en sí. La app ya tiene una función `showToast()` usada en el resto del código para exactamente este tipo de aviso (p. ej. "Describe el tema de la sesión."); usar ese mismo mecanismo aquí ("Debe quedar al menos un enfoque marcado.") sería consistente con el resto de la app y no requiere una decisión de diseño nueva, solo aplicar el patrón ya existente.

### 5. Checkboxes de compromisos sin `<label>` — sí es un problema real para lector de pantalla, con corrección concreta y un precedente ya resuelto en el mismo archivo

Tres lugares distintos, los tres con el mismo hueco:

- Tarjeta de sesión (solo lectura): `<div class="commit-row..."><input type="checkbox" data-commit-idx="${i}" ...><span>${esc(c.text)}</span></div>` (`bitacora-mentor.html:960`, y su gemelo de grupo en la línea 1161).
- Modal de edición: `<input type="checkbox" data-cdone="${i}" ...><input type="text" data-ctext="${i}" value="${esc(c.text)}">` (`bitacora-mentor.html:1946-1947`).

En los tres, el checkbox no tiene `<label for>`, `aria-label` ni `aria-labelledby` — es un `<input type="checkbox">` sin nombre accesible propio; un lector de pantalla lo anuncia como "casilla, no marcada" sin decir *de qué*. Esto **no es una suposición**: es exactamente lo que reflejó la propia herramienta de este entorno al leer el árbol de accesibilidad durante la contaminación descrita arriba — apareció como `checkbox "on" type="checkbox"` (sin ningún texto de nombre, solo el estado), a diferencia de, por ejemplo, `combobox "Activo"` que sí trae su nombre accesible real.

**Esta misma app ya resuelve el problema equivalente en otro punto del mismo archivo** (ver punto 1: `.member-check-row`, línea 1585-1588, checkbox envuelto en `<label>`). Correcciones concretas, sin rehacer el layout:

- **Tarjeta de sesión (solo lectura, texto estático):** cambiar el `<div class="commit-row...">` que envuelve checkbox+`<span>` por un `<label class="commit-row...">` — igual que ya hace `.member-check-row`. Es el arreglo más barato porque el texto ahí no es editable.
- **Modal de edición (texto editable en un `<input type="text">` aparte):** no se puede envolver todo en un `<label>` (un `<label>` con dos controles enfocables es ambiguo para el primero que reciba el foco), así que la corrección ahí es `aria-label` dinámico en el checkbox, p. ej. `aria-label="Compromiso cumplido: ${esc(c.text) || 'sin texto'}"`, regenerado en cada `renderCommits()` para que siga el texto si se edita.

### 6. Botón "quitar" sin contexto — necesita `aria-label`, mismo patrón que el hallazgo de "editar"/"eliminar" de abajo

Confirmado: `<button type="button" class="icon-btn" data-cdel="${i}">quitar</button>` (`bitacora-mentor.html:1948`), repetido una vez por compromiso. Con 2+ compromisos, un lector de pantalla que navegue por botones oye "quitar, quitar, quitar..." sin saber cuál corresponde a cuál fila. Corrección recomendada, preservando la palabra visible ("quitar") dentro del `aria-label` para no romper control por voz (WCAG 2.5.3, *Label in Name*): `aria-label="quitar compromiso: ${esc(c.text) || 'sin texto'}"`.

### 7. Foco al agregar y al quitar un compromiso (modal) — confirmado por código, NO por Tab en vivo (ver limitación de entorno)

- **Agregar:** `addCommit()` llama `inp.focus()` después de `renderCommits()` (`bitacora-mentor.html:1955-1963`) — el foco vuelve al campo de texto de "agregar", listo para seguir escribiendo el siguiente compromiso. **Correcto**, confirmado por lectura de código.
- **Quitar:** el handler de `data-cdel` es `()=>{ modalCommits.splice(+e.target.dataset.cdel,1); renderCommits(); }` (`bitacora-mentor.html:1952`) — **sin ninguna llamada a `.focus()`**. `renderCommits()` reemplaza `box.innerHTML` por completo, así que el botón "quitar" que se acaba de pulsar deja de existir; el navegador no tiene a dónde devolver el foco y lo resetea a `<body>`. Para quien navega con teclado, esto significa perder el punto exacto del modal donde estaba y tener que volver a tabular desde el campo "Fecha" (el primer campo del modal) para retomar donde iba. **Esto sí es una regresión nueva de este commit** (la función `renderCommits()` es enteramente nueva de esta rama) — no es un patrón heredado. Recomendación concreta: después de `splice`+`renderCommits()`, enfocar el campo de texto de "agregar" (`overlay.querySelector('#s-commitment').focus()`), igual que ya hace `addCommit()` — mismo patrón, una línea.

### 8. Hallazgo adicional, fuera de lo preguntado pero dentro del checklist: la misma pérdida de foco ya existía para la tarjeta (no es nueva, pero ahora se repite más veces por sesión)

Al marcar/desmarcar un compromiso en la tarjeta de sesión (no en el modal), el handler llama `saveData()` y luego `render()` (`bitacora-mentor.html:982-995`) — y `render()` es la función de nivel más alto de toda la app: reescribe `root.innerHTML` completo (barra de pestañas incluida, `bitacora-mentor.html:785-802`), no solo la fila del compromiso. **Confirmado por `git diff` que este patrón exacto (`onchange` → `saveData()` → `render()` completo) ya existía antes de esta rama** para el único compromiso que existía por sesión (`commitBox.onchange` con `data-commit-id`, ahora reemplazado por `data-commit-idx`) — no es una regresión nueva. Lo que sí cambia con este commit: antes había como máximo 1 casilla de compromiso por sesión, así que el usuario perdía el foco una sola vez si marcaba ese único ítem; ahora puede haber varios compromisos por sesión, así que alguien que quiera marcar 3 compromisos seguidos en la misma tarjeta pierde el foco (vuelve a `<body>`, hay que re-tabular desde arriba) **una vez por cada clic**, en vez de una sola vez en total. El defecto de fondo es preexistente y transversal a toda la app (cualquier cambio de estado dispara un re-render completo de la página), pero esta rama lo hace más frecuente en la práctica para este flujo específico. Lo dejo también como caso borde compartido en `docs/bitacora-mentor/requerimientos.md`.

### 9. Botón "editar" — sí merece corrección, mismo patrón de `aria-label` que "quitar"

Confirmado: `<button class="icon-btn" data-action="edit">editar</button>` / `<button class="icon-btn" data-action="delete">eliminar</button>` por cada sesión (`bitacora-mentor.html:964-965`, y su gemelo de grupo en 1163-1164), sin ningún dato que distinga una sesión de otra en el nombre accesible del botón. Con varias sesiones, un lector de pantalla que navegue por la lista de controles de la página (una forma común de navegación, no solo Tab secuencial) oye "editar, eliminar, editar, eliminar..." indistinguibles, sin saber a qué sesión corresponde cada par sin antes leer el contexto visual (fecha, "Sesión #N") por separado. Esto no es un fallo de WCAG 4.1.2 (el botón sí tiene nombre, "editar" no está vacío) pero sí es un problema real de propósito de enlace/botón para navegación por lista de controles. Corrección recomendada, preservando la palabra visible (WCAG 2.5.3): `aria-label="editar sesión del ${fmtDate(s.date)}"` / `aria-label="eliminar sesión del ${fmtDate(s.date)}"` (o incluir "Sesión #N" si está disponible en ese punto del código, como ya hace el propio `<span class="session-number-tag">`).

### 10. `prefers-reduced-motion` para la transición de los chips — sí es suficiente, confirmado contra el diff completo

`git diff` confirma que la **única** regla `transition`/`animation` nueva en todo el diff de esta rama es la de `.enfoque-chip` (`transition:background .15s ease,border-color .15s ease,color .15s ease;`, `bitacora-mentor.html:267`), y el bloque agregado la cubre exactamente:
```css
@media (prefers-reduced-motion: reduce){ .enfoque-chip{transition:none;} }
```
No hay ninguna otra animación/transición nueva en este diff que haya quedado sin cubrir — confirmado por `grep` sobre las líneas `+` del diff completo, no solo sobre el fragmento que agregaste. Es un caso simple (transición de color entre dos estados estáticos, sin ciclo ni riesgo de "vaciar" el elemento como sí pasa con las escenas de `auth-gate.js`), así que el bloque de una sola línea es proporcional y correcto. Nota de alcance: esto es movimiento disparado por interacción del usuario, no una animación automática que se repita sola — cae bajo WCAG 2.3.3 (AAA, deseable) más que bajo un criterio AA obligatorio, pero cubrirlo no cuesta nada y ya está hecho bien.

### 11. Navegación por teclado y overlay de login — NO verificado en vivo esta sesión (ver limitación de entorno)

No apareció pantalla de login en ningún momento (sesión de Supabase ya cacheada por otro hilo, mismo patrón ya documentado varias veces en `docs/team-memory.md`), así que no pude probar el montaje/desmontaje del overlay de shadow-DOM ni su manejo de foco en esta ronda. Tampoco pude completar un recorrido de Tab controlado y atribuible con confianza a mis propias acciones (ver la sección de contaminación arriba). El diff de esta rama no toca `auth-gate.js`, `inert`, `tabindex` ni manejo de foco del candado en ningún punto (confirmado por `git diff`), así que no hay indicio de una regresión ahí — pero no cuenta como comprobado, se queda como pendiente de una sesión con navegador limpio.

## Veredicto — rama `claude/mentor-sesiones-editables-y-checklist`

**APROBADO CON OBSERVACIONES.** Ningún hallazgo es un control genuinamente inalcanzable por teclado (el foco perdido en "quitar"/checkboxes de tarjeta es recuperable re-tabulando, molesto pero no bloqueante) ni una regresión de contraste severa (el peor caso, 1.46:1 en el borde inactivo, es un borde decorativo-de-apoyo, no la única vía para identificar el control — el texto sigue siendo legible aunque bajo el umbral por poco). Comparado explícitamente con el `<select>`+campo único anterior: **sí hay una pérdida neta de accesibilidad de fábrica** — un `<select multiple>` habría traído agrupación, nombre accesible y operación por teclado nativos sin ningún trabajo adicional; los chips actuales replican visualmente el pedido pero dejan 3 huecos concretos (agrupación ausente, borde inactivo con contraste muy bajo, foco perdido al quitar un compromiso) que un control nativo no habría tenido. Ninguno es grave por sí solo, pero juntos son la respuesta a la pregunta de fondo del encargo: sí se retrocedió un poco frente a la barra de accesibilidad de fábrica del `<select>`, de forma corregible con cambios pequeños y ya señalados uno por uno arriba.

## 2026-09-03 — rama sin fusionar `claude/update-notification-banner-85im24` (`update-notice.js`, compartido, no exclusivo de esta app)

**Detalle completo y metodología en `docs/hub/accessibility-notes.md`** (esa es la ubicación principal porque `update-notice.js` es compartido por las 7 páginas, igual que `auth-gate.js`). Esta entrada solo deja el resumen específico de lo que se midió *en esta app*, con datos reales (Playwright + Chromium, medición en vivo, no inferencia):

- **El banner cubre por completo la primera pestaña de navegación ("Mentoría")** cuando se muestra, y **el botón "Refresh" del banner intercepta el clic** que un usuario dirigiría a esa pestaña (confirmado con `page.mouse.click` real en las coordenadas donde visualmente estaría "Mentoría": el clic disparó la recarga de página, no el cambio de pestaña). La pestaña "Grupos" queda parcialmente cubierta (~40% de su ancho). No es exclusivo de esta app (el hub sufre el mismo patrón a 390px de ancho), pero Bitácora es donde se confirmó con medición de coordenadas reales, porque es la app con la barra de pestañas más pegada al borde superior de las 7.
- Orden de tabulación real (60 pulsaciones de Tab reales, con `page.keyboard.press`): "Refresh"/"×" llegan al final de todo, después del widget de Cuenta — 12-13 Tabs desde el inicio del documento en esta app. Alcanzable, no bloqueante, pero desalineado con la posición visual (arriba de todo).

Severidad y recomendación: ver `docs/hub/accessibility-notes.md` §3 ("Solapamiento con la navegación superior de la app"), marcado ahí como hallazgo de severidad ALTA no bloqueante en sentido estricto. Ver también caso borde nuevo en `docs/bitacora-mentor/requerimientos.md`.

