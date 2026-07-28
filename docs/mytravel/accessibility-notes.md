# MyTravel Agent Pro — Notas de accesibilidad

Primera revisión de accesibilidad de esta app (no existía `docs/mytravel/accessibility-notes.md` antes de hoy).

## Alcance de esta revisión

Rama `claude/widget-cuenta-y-botones-mentor`, 4 commits sobre `origin/master`. Lo que toca a esta app: nubes del logo más grandes, flote del avión más marcado (`auth-gate.js`, compartido), la variable `--aiapps-chrome-bottom` que declara `mytravel-pro-v4.html` para que el widget de Cuenta y la insignia de carpeta no se monten sobre su barra de navegación móvil, y la reposición del widget de Cuenta (compartida — análisis completo en `docs/staffgate/accessibility-notes.md` §2, no repetido aquí).

**Misma limitación de herramienta que en el resto de esta ronda:** sin JS eval, sin capturas de pantalla funcionales, `read_page`/`get_page_text` no atraviesan el shadow DOM del login/widget. Análisis estático exacto sobre el código real.

## 1. Flote del avión más marcado — ¿sigue siendo aceptable o se acerca a algo molesto?

Cambio real en `auth-gate.js`:

```
@keyframes logo-plane-float{
  0%, 100%{ transform:translateY(0) rotate(0deg); }
  50%{ transform:translateY(-0.26em) rotate(-4deg); }
}
```

(antes: `translateY(-0.16em)` sin rotación). `.lp-glyph` hereda el `font-size` de `.brand-mark` (1.5rem = 24px; MyTravel no define `AIAPPS_APP_LOGO_SIZE`), así que el recorrido real pasa de **≈3.8px a ≈6.2px** de traslación vertical, más una inclinación nueva de 4 grados, en un ciclo de 3.6s ease-in-out infinito.

**Mi juicio: sigue siendo aceptable, no se acerca a "molesto".** En términos absolutos es un movimiento pequeño (6px, menos de una línea de texto) sobre un ícono también pequeño (24px), con una curva `ease-in-out` suave, sin parpadeo ni cambios de opacidad. Comparado con el dardo de StaffGate (~230px de recorrido, ver `docs/staffgate/accessibility-notes.md` §1), esto está en una categoría completamente distinta de amplitud — el aumento del 62% en la distancia (0.16→0.26em) sigue siendo un incremento sobre una base ya muy pequeña. La rotación de 4° es sutil y coherente con la narrativa ("vuela" en vez de "sube y baja", que es literalmente lo que dice el comentario del propio commit) sin producir un efecto de balanceo pronunciado.

**Cobertura de reduced-motion — confirmada, sin huecos nuevos.** La regla que apaga esta animación ya existía antes de este diff y no fue tocada: `.logo-plane .lp-glyph, .logo-plane .lp-cloud{ animation:none; }` (dentro de un `@media (prefers-reduced-motion: reduce)` existente). Como `animation:none` apaga la animación por completo sin depender de su amplitud ni de dónde cae su `100%` (que en este caso ya es `translateY(0) rotate(0deg)`, el propio estado de reposo — no hay riesgo de "vaciar" nada), el aumento de amplitud **no introduce ningún hueco nuevo** en la cobertura de reduced-motion ya existente. Confirmado leyendo el archivo completo, no solo el diff: sigue habiendo exactamente una coincidencia de esa regla para `.logo-plane`.

## 2. La variable `--aiapps-chrome-bottom` — geometría verificada por CSS, no en vivo

`mytravel-pro-v4.html` declara, dentro de `@media(max-width:767px)`: `:root{ --aiapps-chrome-bottom: calc(var(--bottom-nav) + var(--safe-bottom)); }`, con `--bottom-nav:60px` y `--safe-bottom: env(safe-area-inset-bottom, 0px)` definidas más arriba en el mismo archivo (fuera de cualquier media query, así que están disponibles cuando la variable las usa). El widget de Cuenta y la insignia de carpeta compartidos (`auth-gate.js`, `mytravel-pro-v4.html`) leen esa misma variable con un valor por defecto de `0px` si no está definida. Resultado: en escritorio (≥768px) ambos quedan en su posición base (61px / 14px desde abajo); en móvil (<768px) ambos suben exactamente 60px + el inset seguro del sistema, despejando la barra de navegación inferior propia de esta app. Es la única de las 5 apps con algo propio anclado abajo, y es la que motivó la variable de escape — la lógica es consistente y no depende de ningún valor mágico no declarado. No lo medí con `getBoundingClientRect()` en vivo (sin JS eval en esta sesión), pero es una relación aritmética directa entre las reglas CSS reales del archivo, no una suposición.

## 3. Reposición del widget de Cuenta — mismo hallazgo que las otras 4 apps

El salto de ~190px del botón "👤 Cuenta" al abrir el panel (ver análisis completo en `docs/staffgate/accessibility-notes.md` §2) es código 100% compartido en `auth-gate.js` — aplica igual aquí. No lo repito en detalle en este documento para no duplicar; el hallazgo y la recomendación de arreglo son los mismos.

## 4. Navegación por teclado

No verificado en vivo esta sesión (misma limitación de herramienta ya documentada). El diff no toca `inert`/`tabindex`/manejo de foco en ningún archivo.

## Veredicto

**APROBADO CON OBSERVACIONES.**

1. El flote de avión más marcado sigue siendo aceptable: el incremento es pequeño en términos absolutos (≈6px + 4°), sin romper la cobertura de reduced-motion ya existente para este elemento.
2. La nueva variable `--aiapps-chrome-bottom` está bien resuelta geométricamente (verificado por CSS, no en vivo).
3. Comparte el hallazgo transversal del widget de Cuenta (salto al abrir el panel) documentado en detalle en `docs/staffgate/accessibility-notes.md` — no bloqueante, con solución sugerida de una sola regla.
