# Notas de versión — 4 de agosto de 2026

## Hourglass ⏳ — la ventana flotante ya no desaparece cuando cambias de pestaña

**El problema que reportaste:** arrancabas un cronómetro estando en la pantalla
de Cronómetros y saltabas directo a otra pestaña — la ventanita no aparecía
hasta recargar la página, y ni recargando era seguro. Eso pasaba porque, hasta
ahora, la ventana **se cerraba** cada vez que volvías a mirar la lista de
Cronómetros, y el navegador solo deja volver a abrirla a partir de un clic
tuyo — cambiar de pestaña no cuenta como ese clic.

**Qué cambia:** la ventana ya no se cierra nunca mientras tengas algún
cronómetro corriendo. En vez de eso:

- Mirando la lista de **Cronómetros**, se reduce sola a una **pastillita**
  chiquita con solo el tiempo total (con su propia X para cerrarla si estorba).
- En cualquier otra pantalla, otra pestaña, o fuera del navegador, se expande
  sola a la lista completa, con pausar/reanudar/detener para cada cronómetro.
- Cambiar de pestaña ya no necesita que hayas tocado nada más justo antes: la
  ventana ya estaba abierta desde que arrancaste el cronómetro, así que
  aparecer o encogerse es solo cambiarle el contenido, no abrir una nueva.

**Un detalle que sigue siendo un límite real del navegador, no algo que se
pueda ajustar:** si recargas la página con un cronómetro ya corriendo y saltas
de pestaña **sin tocar nada en absoluto** (ni un clic, ni una tecla) antes de
irte, la ventana todavía no aparece hasta que vuelvas y toques algo — el
navegador exige que la primera apertura salga de un clic tuyo, y no hay forma
de saltarse eso. Es un hueco mucho más angosto que el de antes (antes bastaba
con arrancar el cronómetro y cambiar de pestaña sin más), pero no desapareció
del todo.

**Dónde quedó:** solo en la rama `hourglass-ventana-pastilla-siempre-visible`,
pendiente de revisión (QA y seguridad) y de fusionar a `master`. Todavía no
está en producción (`lips-hub.lissette2402.workers.dev`).
