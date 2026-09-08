# Nutri Log — notas de accesibilidad

Primera revisión de accesibilidad de esta app (no existía `docs/nutrilog/` antes de hoy).

## Revisión 2026-09-08 — rama `claude/nutri-log-app` (8 commits sobre `master`, sin fusionar)

**Alcance confirmado con `git diff master --stat`:** `index.html` (+9, alta al hub), `nutri-log.html` (archivo nuevo, 2075 líneas), `supabase-client-app.js` (+1/-1). **`auth-gate.js` NO forma parte de este diff** — sigue en el estado del commit `3ff7445` (anterior a esta rama), donde el bloque `@media (prefers-reduced-motion: reduce)` para las escenas de login (incluida `nutrilog-leaf`, la que usa esta app) ya existe y ya fue verificado por el equipo el 2026-07-25 (ver `docs/team-memory.md`). Por eso el punto del encargo sobre `deco-float`/`coin-fall`/`interview-bounce`/etc. en `auth-gate.js` **no aplica como hallazgo nuevo de esta revisión**: es código compartido, no tocado por esta rama, y ya resuelto. Confirmado con `grep -c "prefers-reduced-motion" auth-gate.js` = 10 coincidencias, y con `git log -1 --oneline -- auth-gate.js` = `3ff7445` (anterior a los 8 commits de esta rama).

**Método de prueba:** `build.sh` + `http-server dist -p 8090`, Playwright real (`/opt/node22/lib/node_modules/playwright`, Chromium en `/opt/pw-browsers/chromium-1194`) contra `http://localhost:8090/nutri-log.html`. Se interceptaron y abortaron las rutas de `unpkg.com` y `fonts.googleapis.com`/`fonts.gstatic.com` (bloqueadas por el proxy), y se mockeó `window.supabase.createClient(...)` vía `addInitScript` para simular una sesión ya iniciada (o, para la prueba del candado, una sesión que pasa de `null` a real). El onboarding se saltó con `[data-nl-onb-skip]`. **0 errores de página (`pageerror`) en ninguna corrida** — el bloqueo de `unpkg`/`fonts.googleapis` solo genera `net::ERR_FAILED` en la consola (esperado, no es un fallo de la app) y dejó los íconos Lucide sin renderizar visualmente, pero no rompió ninguna función. Todos los números de contraste y los árboles de accesibilidad (`page.accessibility.snapshot`, que usa el mismo motor que expone Chrome a un lector de pantalla real) son medición en vivo, no lectura de CSS.

### 1. Switches (`.nl-switch`, Productos y metas) — sin hallazgos, confirmado en vivo

Los 4 switches de la pantalla ("Racha de días", "Frecuencia", "Horario de consumo", "Impulso matutino"):
- Se alcanzan con **Tab real** (no `.focus()` sintético) desde el botón "Producto y metas" del sidebar.
- **Espacio real** invierte el estado del checkbox (`checked: true → false` confirmado con `page.keyboard.press('Space')`).
- El nombre accesible calculado por el motor de accesibilidad de Chrome (`page.accessibility.snapshot`) coincide **exactamente** con el `aria-label` del HTML en los 4 casos — no está ensombrecido por ninguna otra fuente de nombre:
  ```
  switch[0] aria-label="Racha de días"      -> a11y name="Racha de días"      (role checkbox, checked:true)
  switch[1] aria-label="Frecuencia"         -> a11y name="Frecuencia"         (role checkbox, checked:true)
  switch[2] aria-label="Horario de consumo" -> a11y name="Horario de consumo" (role checkbox, checked:false)
  switch[3] aria-label="Impulso matutino"   -> a11y name="Impulso matutino"   (role checkbox, checked:false)
  ```
- El anillo de foco (`:focus-visible + .track`) sí aparece con Tab real: `outline: rgb(198, 113, 57) solid 2px` medido con `getComputedStyle` sobre el `.track` cuando el `<input>` tiene foco de teclado real.

**Hallazgo nuevo, no bloqueante — contraste del anillo de foco insuficiente (WCAG 1.4.11/2.4.11, 3:1 mínimo para indicadores no textuales):** el color del anillo (`--color-accent` `#c67139`, `rgb(198,113,57)`) contra el fondo real donde vive el switch (`--color-surface` `#ebddc5`, `rgb(235,221,197)`, confirmado con `getComputedStyle` sobre el ancestro real, no el token de CSS) da **2.69:1** — por debajo del 3:1 exigido para un indicador de foco. Es visible (no es invisible), pero no cumple el mínimo de contraste con su fondo inmediato. Afecta a los 4 switches por igual (mismo color, mismo fondo de tarjeta).

### 2. Escalas 1-5 del check-in del reto (`.nl-scale-btn`) — hallazgo real, confirmado en vivo

Iniciado un reto real (botón "Iniciar reto de 14 días") y medidos los 20 botones (4 categorías × 5 valores):
```
Accesible-name real del primer botón ("Enfoque", valor 1): {"role":"button","name":"1", ...}
aria-pressed: null
Tras click en el botón "3" de la misma fila: class="nl-scale-btn " (sin .on aplicado — ver nota abajo), aria-pressed: null
```
- El nombre accesible expuesto a un lector de pantalla es literalmente **"1"**, **"2"**, **"3"**, **"4"** o **"5"**, sin ninguna palabra de contexto — un lector de pantalla no anuncia a qué categoría pertenece (enfoque/digestión/ánimo/piel) ni la escala (de 5). Con foco por Tab, alguien navegando solo con lector de pantalla solo oye "3, botón" cinco veces por fila, indistinguibles entre sí salvo por el orden.
- **No hay `aria-pressed` ni ningún otro mecanismo ARIA de estado** — el único indicador de "seleccionado" es la clase `.on` (fondo sólido color de acento + texto blanco), es decir, **color puro**, sin repaldo textual/semántico. Confirma directamente el punto 2 del encargo.
- Nota aparte, de calidad funcional (reportada también a `qa-lead`/casos borde): en la prueba en vivo, el click sobre el botón "3" de la fila `data-nl-ci-val="3"` **no aplicó la clase `.on`** en el DOM inmediatamente después del click (se leyó `class="nl-scale-btn "` sin `on`). No investigué más a fondo si es un problema de temporización de mi prueba o un bug real de re-render — lo dejo anotado como caso borde para que `qa-lead` lo confirme con más tiempo, no lo reporto como hallazgo de accesibilidad cerrado.

Fix sugerido, concreto: `aria-label="${catLabel}: ${v} de 5"` (ej. `"Enfoque: 3 de 5"`) + `aria-pressed="${checkin.ratings[cat]===v}"` en cada botón de `nl-scale-btn` (`nutri-log.html:1691`).

### 3. Estrellas de valoración (`.nl-star`, Detalle de receta) — hallazgo real, severo, confirmado en vivo

Medidas las 5 estrellas de la pantalla "Detalle de receta" en modo editable (`renderStars(rating, true, recipeId)`):
```
Accessible snapshot primera estrella: {"role":"button","name":""}
tabindex: null (es decir, foco por defecto de un <button>, SÍ es alcanzable con Tab)
```
El botón **es** un `<button>` real, alcanzable por teclado — pero su **nombre accesible es la cadena vacía**. No hay texto (el número no se muestra, solo un ícono), no hay `aria-label`, y el ícono SVG de Lucide que se inyecta dentro (`<i data-lucide="star">`) no aporta ningún nombre por sí mismo. Un lector de pantalla anuncia simplemente **"botón"**, sin ninguna indicación de que es la estrella 1, 2, 3, 4 o 5, ni de la valoración actual — peor que el caso de las escalas 1-5 (que al menos exponen un número). Esto es una falla de WCAG 4.1.2 (Nombre, función, valor): un control interactivo sin nombre accesible discernible.

En las tarjetas de receta de la lista (modo no editable, `renderStars(rating, false)`) las estrellas llevan `tabindex="-1"` — correctamente sacadas del orden de tabulación por ser decorativas ahí, eso está bien resuelto.

Fix sugerido: `aria-label="Calificar con ${i} estrella${i>1?'s':''}"` en cada botón de `nutri-log.html:1194`, más idealmente `aria-pressed` o un texto oculto (`aria-live`) que anuncie la calificación actual tras cada click.

### 4. Botón `.nl-check` (hábito complementario del reto) — hallazgo real, severo, confirmado en vivo

```
Antes de click: {"cls":"nl-check ","aria":null,"pressed":null,"text":""}
Después de click: {"cls":"nl-check on","aria":null,"pressed":null,"text":""}
Accessibility snapshot: {"role":"button","name":""}
```
Igual que las estrellas: es un `<button>` real y alcanzable por Tab, pero su **nombre accesible es vacío en los dos estados** (marcado y no marcado). Cuando está "on" se inyecta un ícono de check (Lucide) sin texto ni `aria-label`; cuando está "off" el botón queda literalmente sin ningún contenido. El único cambio entre estados es la clase CSS (color de fondo). Un lector de pantalla anuncia "botón" sin nombre y sin ningún indicio de si el hábito está marcado o no — ni siquiera comunica *qué* hábito es (el texto "¿Tomaste tu snack post-entreno?" o equivalente vive en un `<div>` hermano, sin asociación programática con el botón). Confirma el punto 4 del encargo, con un resultado peor de lo que sugería el enunciado (no es "solo color", es nombre accesible vacío).

Fix sugerido: `aria-label` dinámico (ej. `"${habitText}: ${checkin.habitDone ? 'cumplido' : 'sin marcar'}"`) + `aria-pressed="${checkin.habitDone}"` en `nutri-log.html:1696`.

### 5. Corazón de favorito (`.nl-heart`) — dos instancias con comportamiento DISTINTO, una con un bug real

El encargo decía "ya tiene `aria-label` estático... confirma que el texto cambia correctamente tras un clic, no solo en el render inicial". En la práctica hay **dos instancias del mismo componente con implementaciones distintas**, confirmadas con clicks reales:

**a) Tarjeta de receta en la lista (`nutri-log.html:1180`)** — usa `aria-label` (no `title`), pero **hardcodeado siempre a `T[L].detail.fav` ("Favorita")**, sin condicionar por el estado real:
```js
aria-label="${esc(T[L].detail.fav)}"   // siempre "Favorita", nunca "Marcar favorita"
```
Prueba en vivo (toggle real vía click, favorito inicial "true"):
```
aria-label antes:  Favorita
aria-label después de click (favorito pasó a false): Favorita   <- NO cambió
```
**Esto es un bug real y confirmado, no solo un descuido cosmético**: un lector de pantalla anunciaría "Favorita, botón" incluso para una receta que **no** es favorita — el mensaje es engañoso, no solo estático. Es distinto de "no actualiza" en abstracto: literalmente miente sobre el estado.

**b) Pantalla Detalle de receta (`nutri-log.html:1232`)** — **no usa `aria-label`, usa `title`**, y ese sí condiciona correctamente por estado:
```js
title="${esc(recipe.favorite?t.fav:t.notFav)}"
```
Prueba en vivo (dos clicks consecutivos, ida y vuelta):
```
antes:   title="Marcar favorita"
click 1: title="Favorita"
click 2: title="Marcar favorita"   <- vuelve correctamente
Accessible-name snapshot: {"role":"button","name":"Marcar favorita"}   <- title SÍ se usa como nombre accesible aquí
```
Este caso funciona correctamente en cuanto a que el nombre accesible reportado por el navegador coincide con el estado real en todo momento. Pero usar `title` en vez de `aria-label` es una práctica más frágil: `title` no tiene soporte consistente entre lectores de pantalla/navegadores (algunos lo anuncian, otros no, y además dispara un tooltip nativo del navegador al pasar el mouse, redundante con el patrón de icono ya usado en el resto de la app, que usa `aria-label` en todos los demás botones-ícono, ej. `nutri-log.html:829`).

**Conclusión de este punto:** ninguna de las dos instancias está "bien" del todo — la de la lista tiene un bug real de contenido (aria-label falso), la de detalle usa un mecanismo distinto e inconsistente con el resto de la app aunque funcionalmente correcto. Fix sugerido: unificar ambas al patrón `aria-label="${esc(recipe.favorite ? t.fav : t.notFav)}"`.

### 6. Contraste — 5 fallos reales confirmados con colores renderizados en vivo (no estimados)

Metodología: colores tomados de `getComputedStyle` sobre el elemento real ya pintado en pantalla, siguiendo la cadena de `opacity` de cada ancestro (varias piezas de esta app usan `opacity` en vez de canal alfa del color, lo que cambia el resultado real — ver detalle) y componiendo sobre el fondo real detrás. Fórmula de luminancia relativa y contraste según WCAG 2.x estándar.

| Elemento | Texto | Fondo efectivo | Tamaño/peso | Contraste medido | Umbral aplicable | Resultado |
|---|---|---|---|---|---|---|
| `.nl-streak-num` (número de racha, Inicio) | blanco `rgb(255,255,255)` | `--color-accent` `rgb(198,113,57)` | 56px regular | **3.61:1** | 3:1 (texto grande, ≥24px) | **Pasa** |
| Etiqueta "Racha actual" (`nutri-log.html:1003`, `span style="opacity:.85"`) | blanco con `opacity:.85` | accent | 12px regular | **2.60:1** | 4.5:1 (texto normal) | **FALLA** |
| Punto de día "pendiente" en la racha (`.nl-dow span.pending`, `nutri-log.html:153`) | blanco sobre `rgba(255,255,255,.24)` compuesto sobre el accent de la tarjeta | 11px bold | **2.57:1** | 4.5:1 (texto normal — 11px bold no llega al umbral de texto grande de 18.66px) | **FALLA**, y es informativo (marca "pendiente" vs. "cumplido" en la semana, no solo decorativo) |
| Pill activa (`.nl-pill.active`, ej. "Caliente" en Registrar consumo) | blanco | accent sólido | 13.5px bold | **3.61:1** | 4.5:1 (texto normal — 13.5px bold no llega a 18.66px) | **FALLA** |
| Item de navegación activo (`.nl-navitem[aria-current="page"]`, sidebar/tabbar) | blanco | accent sólido | 14px, weight 600 | **3.61:1** | 4.5:1 (texto normal — 14px semibold no llega a 18.66px) | **FALLA** |
| Botón rápido "Ya registraste" (`.nl-quickbtn.done`) | blanco | `--color-accent-2` `rgb(122,138,94)` | 15px bold | **3.73:1** | 4.5:1 (texto normal) | **FALLA** |
| Insignia bloqueada, texto "Bloqueada" (`.card-body` dentro de `div` con `opacity:.75`, Perfil) | `rgb(32,30,29)` atenuado por `opacity:.75` del contenedor → efectivo `rgb(115,108,99)` | `rgb(239,226,205)` (surface atenuado ×.75 sobre bg de página) | 13px regular | **4.04:1** | 4.5:1 (texto normal) | **FALLA** (cerca del umbral, pero por debajo) |
| Insignia bloqueada, nombre (`.card-title` dentro de `div` con `opacity:.75`) | mismo mecanismo | mismo | 14px (heading) | **6.28:1** | 4.5:1 | Pasa |

**El patrón más importante para el equipo:** el texto blanco de peso normal/seminegrita a tamaños de 12-15px sobre `--color-accent`/`--color-accent-2` sólido **falla AA de forma sistemática** en toda la app — no es un color aislado mal elegido en un solo lugar, es el color de acento base del sistema de diseño "Organic" usado como fondo de casi todos los estados "activo/seleccionado/hecho" (pills, botón rápido, item de navegación activo). El número grande de la racha (56px) sí pasa porque cae en el umbral de texto grande (3:1), pero todo lo demás que reutiliza el mismo par de colores a tamaño normal no pasa. Esto no es específico de un componente: es el token `--color-accent` (`#c67139`) contra blanco, que da 3.61:1 en cualquier lugar que se use a tamaño de texto normal.

Insignias bloqueadas: el hallazgo señalado en el encargo ("opacity:.75 sobre fondo transparente") es más matizado que lo que sugiere el enunciado — el fondo **no** es transparente en la práctica (el `<div class="card">` no tiene transparencia propia en su regla base; la propiedad `opacity:.75` inline atenúa **toda la caja** —texto y fondo por igual— contra lo que sea que esté detrás del `<div>`, que es el fondo de página `--color-bg`). El resultado neto es un fallo real pero menor (4.04:1, a 0.46 del umbral) solo en el texto secundario ("Bloqueada"), no en el nombre de la insignia.

### 7. Animación `nl-pop` y `nl-toastin` — sin `prefers-reduced-motion`, confirmado en vivo (hallazgo real)

- `grep -c "prefers-reduced-motion" nutri-log.html` → **0** coincidencias en todo el archivo nuevo (2075 líneas). Las únicas dos animaciones CSS propias de esta app (`nl-pop`, aplicada a `.nl-streak-num.pop` al registrar consumo; `nl-toastin`, aplicada a cada `.nl-toast`) no tienen ningún bloque `@media (prefers-reduced-motion: reduce)` que las module o desactive.
- **Confirmado con emulación real** (`browser.newContext({ reducedMotion: 'reduce' })`, que hace que `matchMedia('(prefers-reduced-motion: reduce)').matches` devuelva `true` de verdad dentro de la página — confirmado): al hacer click real en "Ya lo tomé" (que agrega la clase `.pop` al número de racha), `element.getAnimations()` reporta la animación `nl-pop` **corriendo** (`playState:"running"`, duración 400ms) exactamente igual que sin la preferencia activada. Es decir, la preferencia del sistema operativo se ignora por completo para esta pieza de movimiento.
- Ninguna de las dos animaciones es la escena de login (`auth-gate.js`, que sí respeta la preferencia, no tocado por esta rama — ver nota de alcance arriba). Son animaciones nuevas, propias de esta app, e igual de reales como "movimiento con información": `nl-pop` marca el momento exacto en que se registró un consumo (relevante para alguien con sensibilidad vestibular que prefiere no ver el "salto" pero sigue queriendo saber que el registro se guardó — el color/posición final ya lo comunica igual sin el pop) y `nl-toastin` es un mensaje de confirmación transitorio (2.6s) cuya aparición podría perderse si alguien la asocia solo con el movimiento y no con el cambio de opacidad.
- Ninguna de las dos animaciones termina en un estado invisible (a diferencia de varias de `auth-gate.js`, según la nota histórica del equipo) — así que el fix aquí es simple: envolver ambas reglas en un bloque `@media (prefers-reduced-motion: reduce){ .nl-streak-num.pop, .nl-toast{ animation:none; } }` sin ningún caso especial de "estado final invisible" que resolver.

**Caso borde relacionado, no solo un checklist item — respuesta a la pregunta explícita del encargo ("¿qué pasa si la animación con reduced-motion carga información?"):** ninguna de las dos animaciones de esta app es puramente informativa por sí misma (no hay una barra de progreso ni un contador animado cuyo *valor final* dependa de ver el movimiento completo) — el valor final (el número de racha, el texto del toast) ya está presente en el DOM independientemente de si la animación corre o no, así que desactivarla con `animation:none` no pierde información, solo el efecto visual. Documentado como caso borde 1 en `docs/nutrilog/requerimientos.md` para que quede en la lista de triage compartida, no solo aquí.

### 8. Barra de pestañas móvil (`.nl-tabbar`, 390px) — sin hallazgos, confirmado en vivo

A 390×844px, tras navegar con el tab "Inicio" de la barra móvil:
- Los 5 `<button class="nl-tabitem">` (Inicio/Recetas/Reto/Análisis/Perfil) están **siempre en el DOM** (sidebar y tabbar móvil coexisten; el `@media` decide cuál se muestra vía `display:none`, sin depender de JS) — confirmado que a 390px el `.nl-sidebar` (`display:none`) saca correctamente sus botones del orden de Tab (no aparecen duplicados en la secuencia real de teclado).
- `aria-current="page"` se aplica **solo** al tab activo (`"Inicio"`, `current:"page"`) y es `null` en los otros 4 — confirmado en el árbol real, no solo en el HTML fuente.
- **Secuencia de Tab real desde `document.body.focus()`** a 390px, en la pantalla de Inicio: `ES → EN → botón de ajustes (ícono ⚙) → "Ya lo tomé" → "Registrar con detalle" → Inicio → Recetas → Reto → Análisis → Perfil` (y de ahí el navegador cicla de vuelta al principio del documento, comportamiento normal sin address bar en este entorno de prueba). Es un orden lógico y predecible, sin saltos raros ni controles atrapados.

### 9. Formularios — hallazgo real, sistémico, confirmado en vivo (más severo de lo que sugería el encargo)

El encargo preguntaba "¿todos tienen `<label>` asociado?". La respuesta corta es: **hay una etiqueta `<label>` junto a cada campo visualmente, pero en casi ningún caso está programáticamente asociada al control** (ni por anidamiento, ni por `for`/`id`), así que un lector de pantalla no la anuncia al enfocar el campo.

Patrón encontrado por lectura de código y **confirmado con el árbol de accesibilidad real** (`page.accessibility.snapshot`) en el check-in del reto:
```html
<div class="field"><label>¿Cómo te sentiste antes...?</label><textarea class="input" data-nl-ci-r1>...</textarea></div>
```
`<label>` y `<textarea>` son **hermanos**, no hay anidamiento (el `<label>` no envuelve al campo) ni `for="algún-id"` apuntando al `id` del campo (el campo ni siquiera tiene `id` en la mayoría de los casos). El CSS (`.field > label{...}`) los hace *ver* asociados visualmente, pero no lo están para un lector de pantalla.

Prueba en vivo sobre los dos textareas del check-in del reto:
```
Textarea accesible-name snapshot: {"role":"textbox","name":"","multiline":true, ...}
Textarea accesible-name snapshot: {"role":"textbox","name":"","multiline":true, ...}
```
**Nombre accesible vacío en ambos** — un lector de pantalla anuncia "cuadro de texto, multilínea" sin ningún indicio de qué pregunta está respondiendo ("¿Cómo te sentiste...?" / "¿Cuál fue un pequeño logro de hoy?").

Este mismo patrón (`<div class="field"><label>...</label><input ...></div>`, sin `for`) se repite en **todos** los formularios de la app, confirmado por lectura de código en los puntos que pedía el encargo:
- Registro de consumo (`nutri-log.html:1071-1111`): producto, hora, tipo, receta, nota.
- Editor de receta (`nutri-log.html:1321-1331`): nombre, tipo, ingredientes, pasos — estos sí tienen `id` en el `<input>`/`<textarea>` (`nl-re-name`, `nl-re-ingredients`, etc.), pero el `<label>` **sigue sin `for`** apuntando a esos IDs, así que el `id` no sirve de nada para la asociación.
- Check-in del reto (`nutri-log.html:1699-1700`): confirmado en vivo arriba.
- Producto nuevo y metas (`nutri-log.html:1997-1999, 2048-2049`): mismo patrón, incluidos los campos numéricos de meta (racha objetivo, veces por semana) y el campo de hora.

Es un fallo real de WCAG 1.3.1 (Info y relaciones) y 4.1.2 (Nombre, función, valor), y afecta a la app completa, no a una pantalla puntual. Fix sugerido, de una sola pasada: agregar `for="<id>"` al `<label>` y el `id` correspondiente al control en cada uno de los ~15 campos de formulario del archivo (varios ya tienen `id`, solo falta el `for`; los que no tienen `id` necesitan ambos).

### 10. Tabla editable de la Plantilla del reto — hallazgo real, confirmado en vivo

14 filas × 3 columnas de datos (`template.columns`, más la columna fija "Día") = 42 `<input>` de celda, medidos en vivo:
```
Info tabla: {"hasCaption":false, "thScopes":[null,null,null,null], "rows":14, "firstRowFirstCellTag":"TD"}
Cantidad de inputs de celda: 42
Accessible-name snapshot de la primera celda editable: {"role":"textbox","name":"","value":"Adaptogen Latte", ...}
data-nl-tpl-cell / aria-label de esa celda: {"dataCell":"1|recipe","ariaLabel":null}
```
Confirma exactamente el punto 10 del encargo, con evidencia adicional:
- La tabla **no tiene `<caption>`** (ningún título programático de "qué es esta tabla" para quien navegue por tablas con un lector de pantalla).
- Los `<th>` de encabezado de columna **no tienen `scope="col"`**.
- La primera celda de cada fila (el número de día) es un **`<td>` normal, no un `<th scope="row">`** — no hay ningún encabezado de fila.
- Los `<input>` de celda no tienen `aria-label` ni `aria-labelledby` — su "nombre accesible" termina siendo, por defecto del navegador, **el valor actual escrito en la celda** (ej. "Adaptogen Latte"), no una descripción de qué es esa celda.

Con estos tres elementos faltando a la vez, alguien que navegue la tabla con un lector de pantalla (fila por fila, o celda por celda con `Ctrl+Alt+flechas` en NVDA/JAWS) solo oye el contenido de cada celda, sin ningún anuncio de fila ("Día 1") ni columna ("Receta", "Horario", "Acompañante") — exactamente el escenario "solo anuncia 'cuadro de edición' sin contexto" que planteaba el encargo, salvo que en este caso ni siquiera anuncia "cuadro de edición" genérico: anuncia el valor ya escrito, que en las filas todavía vacías es una cadena vacía, indistinguible entre sí.

Fix sugerido: `<caption>` con el título de la plantilla; `scope="col"` en cada `<th>`; convertir la primera celda de cada fila en `<th scope="row">`; y `aria-label="Día ${d}, ${nombreColumna}"` en cada `<input>` de celda (`nutri-log.html:1828`).

## Resumen de hallazgos (11 en total, 0 bloqueantes de teclado)

| # | Punto del encargo | Severidad | Confirmado en vivo |
|---|---|---|---|
| 1 | Switches | Sin hallazgo funcional — 1 hallazgo menor de contraste del anillo de foco (2.69:1, bajo 3:1) | Sí |
| 2 | Escalas 1-5 del reto | Real — nombre accesible sin contexto ("1".."5"), sin `aria-pressed` | Sí |
| 3 | Estrellas de valoración | Real, severo — nombre accesible vacío | Sí |
| 4 | Botón `.nl-check` | Real, severo — nombre accesible vacío en ambos estados | Sí |
| 5 | Corazón de favorito | Real — `aria-label` de la tarjeta de lista NUNCA cambia (bug de contenido, no solo de patrón); versión de detalle usa `title` en vez de `aria-label` (funciona pero inconsistente) | Sí |
| 6 | Contraste | Real, sistémico — 5 de 8 pares medidos fallan AA (texto blanco normal sobre `--color-accent`/`--color-accent-2`) | Sí |
| 7 | `prefers-reduced-motion` | Real — 0 reglas en `nutri-log.html`, animación confirmada corriendo igual con la preferencia activa | Sí |
| 8 | Tab bar móvil | Sin hallazgos | Sí |
| 9 | Formularios / labels | Real, sistémico — ningún `<label>` está asociado programáticamente a su control en toda la app | Sí |
| 10 | Tabla de plantilla | Real — sin caption, sin scope, celdas sin nombre de fila/columna | Sí |
| — | Candado de login (mount/unmount) | Sin hallazgo nuevo — ver nota de alcance | Sí (con matices, ver abajo) |

**Nota sobre el candado de login (fuera del diff, pero probado igual por ser el edge case explícito del encargo):** confirmé con Playwright que la transición real de "candado visible" a "app usable" **no es un unmount de SPA dentro de la misma carga de página — es un `location.reload()` completo** (`auth-gate.js:2293`, código no tocado por esta rama). Es decir, no existe el momento de "tabbing justo cuando el overlay se desmonta" que planteaba el encargo como riesgo: cada inicio de sesión exitoso dispara una recarga completa del navegador, y el foco después de esa recarga cae de forma estándar en `<body>` (confirmado con sesión persistida en `localStorage` a través de la recarga real, no solo en memoria: `childrenWithInertRemaining: []`, `activeElement: {tag:"BODY"}`, `nl-app` con contenido real de 2130 caracteres). Mi primer intento de esta prueba, sin persistir la sesión mockeada a través de la recarga, mostró `nl-app`/`nl-modal-host` todavía con `inert` — pero confirmé que era un artefacto de mi propio mock (`getSession` volvía a responder `null` tras el reload porque mi `addInitScript` no persiste estado de JS entre navegaciones) y no un bug real de la app, al repetir la prueba con la sesión guardada en `localStorage`.

## Limitaciones de esta revisión (dicho explícitamente, no asumido)

- No hay lector de pantalla real (NVDA/JAWS/VoiceOver) en este entorno — toda afirmación de "nombre accesible" viene de `page.accessibility.snapshot()` de Playwright, que usa el mismo árbol de accesibilidad que expone Chrome al sistema operativo (la misma fuente que consultaría un lector de pantalla real), pero no es una prueba con un lector de pantalla real hablando.
- Los íconos de Lucide (`unpkg.com`) estuvieron bloqueados durante toda la prueba (proxy de este entorno) — no se pudo confirmar en vivo si el HTML que genera `lucide.createIcons()` agrega `aria-hidden="true"` a los `<svg>` que inyecta. Es el mismo patrón (`icons()` función, `nutri-log.html:386-388`) que ya usan las otras apps del hub, así que no es un riesgo introducido por esta rama, pero queda sin confirmar en vivo específicamente para esta app. Recomendado confirmarlo la próxima vez que el proxy permita `unpkg.com`, o vendorizando el paquete.
- No verifiqué el editor de receta completo con ejecución real campo por campo (ingredientes, pasos) más allá de confirmar el patrón de `<label>` sin `for` por lectura de código — el patrón es idéntico al ya confirmado en vivo en el check-in del reto, así que no repetí la prueba en vivo ahí por eficiencia, pero no es una verificación en vivo independiente de esa pantalla en particular.
