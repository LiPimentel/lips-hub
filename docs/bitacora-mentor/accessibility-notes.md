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

## Veredicto

**APROBADO CON OBSERVACIONES.**

1. El logo nuevo (`AIAPPS_LOGO_READER`) está bien resuelto: reduced-motion cubre las dos animaciones (`lr-flip`, `lr-nod`) y el estado de reposo elegido (libro abierto y quieto) es el correcto, sin caer en la trampa de "animación que vuelve a cero" ya documentada para otras escenas del proyecto.
2. Hallazgo accionable, no bloqueante: el badge de pendientes (`--rust` sobre `--rust-light`) da **4.44:1**, por debajo del mínimo AA de 4.5:1 para texto normal — vale la pena un ajuste menor de color antes de considerar esto cerrado, ya que es el elemento que más se apoya en el color para comunicar urgencia.
3. El borde `--brass` sobre `--sage-light` da 4.00:1 (no 4.31:1 como se midió) pero sigue pasando el umbral de 3:1 para componentes de UI — sin acción requerida, solo corrijo el número para el registro.
4. Navegación por teclado no verificada en vivo en esta sesión por limitación de herramienta (sin JS eval, sin shadow-DOM traversal) — no hay indicio de regresión en el diff, pero no cuenta como comprobado.
