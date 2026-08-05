# Notas de versión — 4 de agosto de 2026 (2)

## Hourglass ⏳ — el ícono de "volver a la pestaña" ya no apaga la ventana flotante

**El problema que reportaste hoy mismo, ya con el cambio anterior fusionado:**
usabas el ícono que el propio navegador dibuja en el borde de la ventanita
flotante (el que está junto a la X, para volver rápido a la pestaña) — y
aunque eso funcionaba bien la primera vez, la segunda vez que cambiabas de
pestaña la ventana ya no volvía a aparecer, ni siquiera recargando de forma
confiable.

**La causa:** ese ícono, aunque solo pretendes usarlo para asomarte a la
pestaña, cierra la ventana real exactamente igual que la X — y el código no
tenía forma de distinguir uno del otro. Los trataba a los dos como "decidiste
cerrarla a propósito" y dejaba de ofrecértela sola hasta que arrancaras un
cronómetro nuevo.

**Qué cambia:** ahora, si la ventana se cierra por cualquier ícono nativo del
navegador (el que sea), la app ya no asume que fue una decisión definitiva.
En vez de eso, queda lista para reaparecer en el próximo clic o toque que
hagas en cualquier parte de la página — no hace falta que sea arrancar un
cronómetro nuevo. Cerrarla con **tu propio botón** dentro de la app (la "×" de
la pastilla, o "Devolver a la página") sigue funcionando igual que antes: esa
sí se respeta hasta el próximo cronómetro, porque ahí no hay ninguna duda de
que fue tu decisión.

**Límite que sigue igual, y no se puede evitar:** si cierras la ventana (por
cualquier vía) y cambias de pestaña **sin tocar absolutamente nada más** antes
de irte, la ventana todavía no reaparece hasta que vuelvas y toques algo — el
navegador exige un clic tuyo para abrirla, y eso no tiene solución desde el
código.

**Dónde quedó:** en la rama `hourglass-pip-icono-nativo-no-bloquea`, pendiente
de revisión y de fusionar a `master`. El cambio anterior (la pastilla) ya está
en producción; este ajuste todavía no.
