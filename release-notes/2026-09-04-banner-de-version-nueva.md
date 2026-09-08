# 4 de septiembre de 2026 — Aviso de "hay una versión nueva"

## Qué cambió

**En todas las apps y en el hub** (Bitácora del Mentor, StaffGate, LPBag,
MyTravel, Generador de Gantt, Hourglass y la página principal):

Cuando se publique una mejora mientras tienes una pestaña abierta, ahora aparece
arriba un aviso pequeño que dice **"New updates in the platform, please refresh"**,
con dos botones:

- **Refresh** — recarga la página para que veas los cambios nuevos.
- **×** — cierra el aviso. No vuelve a salir por esa misma versión, pero sí si
  más adelante se publica otra.

Antes no había forma de enterarse: si dejabas una pestaña abierta y se publicaba
una mejora, seguías usando la versión vieja sin saberlo hasta que recargabas por
tu cuenta.

### Detalles que conviene saber

- **El aviso solo sale cuando de verdad se publicó algo nuevo.** No sale porque
  sí, ni cada cierto tiempo: la página compara la versión con la que se abrió
  contra la que hay publicada, y solo avisa si cambió de verdad.
- **Nunca deja un botón de la app sin poder usarse.** El aviso se acomoda
  solo, revisando qué hay debajo suyo y bajando hasta despejarlo — y se
  reacomoda cada vez que la app cambia lo que muestra en pantalla (una lista
  que se abre, un menú que se despliega, un panel que aparece), no solo al
  mover la ventana. Esto se probó a fondo: se encontraron y corrigieron
  cuatro formas distintas en que el aviso podía terminar tapando un botón
  real sin que el clic le llegara — cada una verificada con un clic real
  sobre la app, no solo revisando el código. En pantallas angostas
  (teléfono), o en apps con mucho contenido pegado arriba, puede quedar
  visualmente sobre algún control — no hay dónde más ponerlo sin taparlo —
  pero el clic siempre llega al botón de la app de todos modos: solo el
  propio texto "Refresh"/"×" del aviso responde al clic. En Bitácora del
  Mentor, en el teléfono, esto hace que el aviso quede más abajo de lo ideal
  (a mitad de pantalla en vez de arriba) — se prefirió eso a arriesgar que
  tape un botón sin que se pueda usar; queda abierto para revisar el diseño
  en ese caso puntual si hace falta.

  La quinta y última forma que se encontró y corrigió fue más sutil: al
  abrir y cerrar un menú varias veces seguidas, el aviso podía quedar
  "atascado" en una posición vieja por más de un segundo, con la misma
  consecuencia — un clic en el lugar correcto activaba el aviso en vez de la
  app. Se corrigió haciendo que el aviso se reacomode en el instante exacto
  en que termina cualquier animación de la app, no un rato después
  adivinando cuánto puede durar.
- **El botón "Refresh" recarga sin preguntar.** Si estás a la mitad de llenar un
  formulario, lo que no hayas guardado se pierde — igual que si recargaras con
  F5. Si te pasa, cierra el aviso con la "×" y recarga cuando termines.
- **Mientras estás en la pantalla de inicio de sesión no aparece**, para no
  estorbar el login.

## Dónde quedó

Solo en la rama `claude/update-notification-banner-85im24` y su vista previa.
**Todavía no está publicado en producción.**
