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
- **Nunca tapa un botón de la app, aunque visualmente pase por encima.** El
  aviso se acomoda solo, justo debajo de la barra superior de cada aplicación.
  En pantallas angostas (teléfono) puede quedar visualmente sobre algún control
  — no hay dónde más ponerlo sin taparlo — pero el clic siempre llega al botón
  de la app de todos modos: solo el propio texto "Refresh"/"×" del aviso
  responde al clic, el resto de la franja es transparente al toque. Probado en
  las 7 páginas a cuatro anchos distintos, incluido teléfono, con clics reales.
- **El botón "Refresh" recarga sin preguntar.** Si estás a la mitad de llenar un
  formulario, lo que no hayas guardado se pierde — igual que si recargaras con
  F5. Si te pasa, cierra el aviso con la "×" y recarga cuando termines.
- **Mientras estás en la pantalla de inicio de sesión no aparece**, para no
  estorbar el login.

## Dónde quedó

Solo en la rama `claude/update-notification-banner-85im24` y su vista previa.
**Todavía no está publicado en producción.**
