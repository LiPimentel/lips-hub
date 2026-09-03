# 3 de septiembre de 2026 — Aviso de "hay una versión nueva, recarga"

## Qué cambió

**Todas las apps y el hub** (Bitácora del Mentor, StaffGate, LPBag, MyTravel Agent Pro,
Generador de Gantt, Hourglass y la página principal)

Hasta ahora, cuando se publicaba una mejora, la persona que ya tenía la app abierta en
una pestaña seguía usando la versión vieja sin enterarse: solo veía el cambio si cerraba
y volvía a entrar, o si recargaba por casualidad.

Ahora, cuando se publica algo nuevo mientras la pestaña está abierta, aparece arriba
—centrado, pequeño— un aviso que dice:

> **New updates in the platform, please refresh**

con dos botones:

- **Refresh** — recarga la página y deja ver los cambios nuevos.
- **×** — cierra el aviso. No vuelve a salir por esa misma versión; sí vuelve a salir si
  más adelante se publica otra.

Detalles de cómo se comporta:

- El aviso **no sale al entrar**: solo cuando hay algo nuevo publicado *después* de que
  se abrió la pestaña. Entrar de cero ya trae la última versión.
- Se revisa cada 5 minutos y también al volver a la pestaña, así que si se deja la app
  abierta y se vuelve un rato después, el aviso ya está esperando.
- No sale sobre la pantalla de inicio de sesión.
- La franja de arriba que queda fuera del aviso sigue siendo clicable: el aviso no
  inutiliza los botones de la app que queden debajo, y de todas formas se puede cerrar
  con la ×.
- En una app con barra de pestañas arriba (Bitácora del Mentor) el aviso puede tapar
  parcialmente esa barra mientras está visible. Se quita con la ×.

## Detalle técnico (para quien lo necesite)

Cada compilación del sitio escribe un archivo `version.json` con el identificador del
cambio publicado. La página lo lee al cargar y lo vuelve a leer cada tanto; si cambió,
es que hubo una publicación nueva. Si ese archivo no existe (por ejemplo, al abrir el
HTML directamente desde el disco), el aviso simplemente no hace nada.

## Dónde quedó publicado

Solo en la rama `claude/update-notification-banner-85im24` y su vista previa. **Todavía
no está en producción** (https://lips-hub.lissette2402.workers.dev): llega ahí cuando el
cambio se fusione a `master`.
