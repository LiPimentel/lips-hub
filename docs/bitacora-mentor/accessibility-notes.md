# Bitácora del Mentor — Notas de accesibilidad

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

El commit en sí (agregar el `<meta name="viewport">` que faltaba) no introduce ninguna regresión de accesibilidad — es una corrección pura que hace que la app se vea a su tamaño real por primera vez en móvil, con evidencia medida (no inferida) de que el texto y los controles táctiles quedan en rangos aceptables y de que el zoom del usuario sigue disponible. Las observaciones que dejo son:

1. El riesgo de auto-zoom de iOS por `font-size<16px` en los `<input>/<select>/<textarea>` es real y ahora alcanzable por primera vez en un iPhone real, pero es una consecuencia esperada de corregir el bug, no un defecto nuevo, y es una mejora neta sobre la ilegibilidad de antes (texto de ~5px efectivos). No verificable en este entorno (Chromium). Pendiente de prueba manual en iPhone real antes de decidir si se sube a 16px.
2. El mismo patrón (viewport real + inputs bajo 16px) ya existe hoy en producción en LP-Bag y StaffGate — no es exclusivo de Bitácora.
3. Un objetivo táctil preexistente (`.tpl-item-remove`, 23.4px de ancho) queda 0.6px bajo el umbral AA de 24×24 — hallazgo menor, no bloqueante, no introducido por este commit.
4. El estado del mentee en la lista lateral se comunica solo por color (`.status-dot`, sin texto/aria-label) — hallazgo preexistente, no introducido por este commit, pero relevante al checklist de este rol.

Ninguno de estos cuatro puntos es un control genuinamente inalcanzable por teclado ni un bloqueo funcional — por eso no llega a RECHAZADO.
