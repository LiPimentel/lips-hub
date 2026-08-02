# Notas de versión — 30 de julio de 2026

## Hourglass (app nueva) ⏳

Nace la sexta app del hub: **Hourglass — *your time slice***, para llevar la
cuenta de en qué se te va el tiempo real entre los dos trabajos y medio, el
voluntariado y lo personal.

**Lo que ya puedes hacer:**

- **Cronómetros en vivo.** Iniciar, pausar, reanudar y detener. Puedes tener
  varios corriendo a la vez, incluso dos del mismo proyecto: los dos suman a
  ese proyecto.
- **Registro a mano.** Fecha, hora de inicio y (a elegir) hora de fin o
  duración en minutos, con una nota opcional. Si la hora de fin es anterior a
  la de inicio, la app entiende que la sesión terminó al día siguiente.
- **Tres secciones fijas** — Trabajo, Voluntariado y Personal — con sus
  proyectos: crear, editar, archivar y eliminar, cada uno con su color y su
  meta de horas semanales.
- **Bloques fijos.** Sueño y comida tienen un valor por defecto (7 h y 3 h) y
  se pueden cambiar para un día concreto, sin tocar el resto.
- **Panel de carga** por día, semana, mes o un rango que elijas (dentro de un
  mismo año). Avisa en verde, amarillo o rojo, y dice qué sección es la que
  más está aportando.
- **Metas plan vs. real**, con una barra por proyecto que compara lo que te
  propusiste con lo que registraste.
- **Historial editable**: cualquier registro guardado se puede corregir o
  borrar.
- **Aviso de cronómetro olvidado**: si al abrir la app hay uno corriendo desde
  hace más de 6 horas (ajustable), sale un aviso centrado en la pantalla con
  la opción de detenerlo ahí mismo.
- **Filtros en todas las listas**: por proyecto, por fechas y por texto en el
  historial; por estado y por nombre en los proyectos; por sección y proyecto
  en el panel.

**Lo importante del cálculo:** cuando dos actividades ocurren a la misma hora,
esa franja **cuenta una sola vez** en el reloj del día. Por eso verás dos
cifras: el *tiempo de reloj* (lo que realmente ocupó tu día) y el *tiempo
bruto* (la suma de todos los proyectos, que puede ser mayor). La alerta de
sobrecarga se calcula siempre con la primera.

**Pantalla de acceso.** Hourglass estrena su propia escena: relojes de arena
que se vacían y se dan la vuelta, un reloj de manecillas, y el Gato de
Cheshire que aparece y se desvanece. Si tienes activada la preferencia del
sistema de "reducir movimiento", la escena se queda quieta pero completa: nada
desaparece. En pantallas angostas (móvil) la escena no se dibuja, para que el
formulario tenga todo el espacio.

## Hub (index.html)

Se agregó la tarjeta de Hourglass en el grupo **Apps personales**.

## Bajo el capó (afecta a las 5 apps anteriores)

- `supabase-client-app.js` ahora acepta `hourglass` como app válida. Sin este
  cambio la app nueva no arrancaría. Las otras cinco no cambian de
  comportamiento.
- `auth-gate.js` incorpora la escena nueva. **Durante el desarrollo esto
  rompió temporalmente el candado de todas las apps** (un carácter mal puesto
  dentro de un comentario) y se corrigió antes de cerrar el cambio; se dejó
  una nota en el propio archivo para que no vuelva a pasar.

## Revisión antes de publicar

Los tres revisores automáticos (calidad, seguridad y accesibilidad) dieron
**aprobado con observaciones**. Las observaciones se corrigieron antes de
guardar el cambio, no quedaron pendientes:

- Un registro con fechas absurdas (por ejemplo, si el archivo de datos de tu
  carpeta se edita a mano y queda mal) **congelaba la app 14 segundos** cada
  vez que se abría. Ahora esos registros imposibles se descartan solos y la
  app responde al instante.
- El aviso de cronómetro olvidado ahora bloquea de verdad el resto de la
  página mientras está abierto, también para lectores de pantalla.
- Volvió el recuadro que indica dónde está parado el teclado al recorrer la
  app con Tab.
- Los campos "hora de fin" y "duración" del formulario de registro no tenían
  nombre propio para un lector de pantalla. Ya lo tienen.
- Si detenías un cronómetro que había estado en pausa todo el rato, la app
  decía "guardado como registro" **sin haber guardado nada**. Ahora te avisa
  claramente de que no había tiempo que guardar, y cuando sí lo hay, te dice
  cuánto guardó.

También se escribió la documentación de la app en `docs/hourglass/`:
requerimientos, guía de entrenamiento paso a paso y diagrama del flujo de
trabajo.

## Dónde quedó

**Publicado.** Se fusionó a `master` en el PR #37 y ya está en vivo en
https://lips-hub.lissette2402.workers.dev

*(Esta nota decía "pendiente de fusionar" hasta el 02/08/2026; se corrigió al
detectarse que el PR ya estaba fusionado.)*
