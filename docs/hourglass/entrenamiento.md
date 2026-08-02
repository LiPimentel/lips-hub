# Hourglass — guía para usarla (sin necesitar conocimientos técnicos)

Esta guía explica, paso a paso, cómo usar **Hourglass**, la app de LIPS-HUB para
llevar el control de en qué se te va el tiempo entre trabajo, voluntariado y
proyectos personales.

**Actualizada el 2026-08-02** con el paquete de cambios CR-01 a CR-04: el panel
flotante de cronómetros, que el sueño y la comida ahora se registran solas
todos los días, que el Panel se ve más que se lee, y la nueva vista Año.

## Aviso importante sobre las capturas de pantalla de esta guía

Se intentó de nuevo capturar pantallas reales de la app en esta sesión,
manejando el navegador de verdad, tal como pide el protocolo del equipo.
**Tampoco fue posible esta vez**, por los mismos motivos ya documentados el
2026-07-30 (no es la primera vez que pasa con esta app, en sesiones distintas):

1. `computer{action:"screenshot"}` falló siempre con el mismo error: *"the
   Browser pane is not displayed, so the page is not compositing frames"* —
   probado varias veces, con la ventana en tamaño de escritorio y también
   después de forzar un cambio de tamaño de la ventana, sin éxito en ningún
   intento.
2. Como prueba de control, se hizo clic sobre la pestaña real "Cronómetros"
   (`ref_3` en el árbol de accesibilidad, un botón real de la app, no un
   elemento inventado) y se comparó el contenido de la pantalla antes y
   después con `get_page_text`: **el contenido no cambió**, es decir, el clic
   no tuvo ningún efecto confirmable. Es el mismo patrón que ya reportaron
   `business-analyst` y `accessibility-reviewer` el 2026-07-30 con esta misma
   app (ver `docs/team-memory.md`), así que se trata de una limitación de la
   herramienta en esta sesión, no de un defecto de Hourglass.
3. Adicionalmente, `get_page_text`/`read_page` mostraron el contenido de la
   pantalla **Panel** directamente, sin ningún rastro del candado de acceso —
   coincide con un patrón ya conocido del equipo: estas dos herramientas de
   lectura de texto no reflejan el overlay del candado de login aunque esté
   visualmente en pantalla (`docs/team-memory.md`, hallazgo de
   `accessibility-reviewer` del 2026-08-02). Por eso no se puede afirmar con
   esta sesión si el candado estaba realmente abierto o cerrado en ese
   momento.

Por eso **esta guía sigue sin tener una sola captura de pantalla propia**. En
vez de inventarlas o describir pantallas que no se llegaron a ver, cada paso
se describe con precisión a partir de dos fuentes verificables:

- La lectura completa del código real de `hourglass.html` en el commit
  `3c6fa0a` (los textos de botones, mensajes y campos citados abajo son
  literalmente los que produce el código, no una paráfrasis).
- Lo que **sí** se verificó con ejecución real en el navegador, en sesiones
  distintas donde la herramienta sí funcionó: `qa-lead` confirmó en vivo
  (clics reales, datos inyectados, medición con cronómetro del propio
  navegador) el cálculo de sobrecarga, el reparto de una sesión que cruza
  medianoche, dos cronómetros del mismo proyecto a la vez, el aviso emergente
  de cronómetro olvidado, el rango personalizado acotado a un año, las metas
  con comparación plan-vs-real, los filtros de Registros y Proyectos, que
  CR-02 no duplica ni pierde horas de sueño/comida en ningún camino probado,
  que el arrastre del panel flotante ya no tapa la barra de pestañas, y que
  la tecla Inicio del panel flotante funciona — todo esto está en
  `docs/hourglass/qa-checklist.md` y se cita aquí en vez de volver a
  inventarlo.

Si más adelante alguien retoma esta guía en una sesión donde el navegador sí
componga imágenes, lo ideal es repetir cada paso y agregar ahí las capturas
reales en `docs/hourglass/capturas/` (la carpeta no existe todavía porque no
hay ninguna imagen real que guardar en ella).

---

## 1. Entrar a la app

Hourglass está protegida por el mismo candado de acceso que el resto de
LIPS-HUB. Para entrar:

1. Abre Hourglass desde la pantalla principal del hub (la tarjeta con el
   ícono ⏳ y el texto "your time slice"), o entra directo a la dirección de
   la app.
2. Escribe tu correo y tu contraseña en la tarjeta de acceso y confirma.
3. Si tienes algún cronómetro corriendo desde hace muchas horas, **apenas
   entres** puede aparecer una ventana en el centro de la pantalla avisando
   de eso — ver la sección 7 más abajo antes de seguir, porque esa ventana
   hay que resolverla (o cerrarla a propósito) antes de poder tocar el resto
   de la pantalla.
4. Desde este paquete de cambios, el fondo decorativo de esa pantalla de
   acceso se ve distinto: el reloj de arena ya no es el emoji de tu sistema,
   sino un dibujo propio que se voltea cuando se vacía; alrededor hay tres
   tipos de reloj (de arena, de manecillas con segundero, y digitales con la
   hora corriendo de verdad); y el Gato de Cheshire salta de un reloj a otro,
   desapareciendo a medio salto. Es solo decorativo — no afecta a nada de lo
   que haces dentro de la app. **No se pudo ver con los propios ojos en esta
   sesión** (ver el aviso de arriba); esta descripción viene de leer el
   código de `auth-gate.js` y de lo que ya confirmó `accessibility-reviewer`
   el 2026-08-02.

Una vez dentro, ves la barra superior con el nombre "⏳ Hourglass" y, debajo,
cinco pestañas: **Panel, Cronómetros, Registros, Proyectos y Ajustes**. La
pestaña que se abre primero siempre es **Panel**.

## 2. El panel flotante de cronómetros (nuevo)

Esta es la novedad más visible del paquete de cambios: en cuanto tengas al
menos un cronómetro corriendo, aparece un panel pequeño que **te sigue a
cualquier pestaña** en la que estés — no hace falta volver a Cronómetros para
verlo ni para manejarlo.

1. El panel muestra, para cada cronómetro en curso, su proyecto (con su
   color), su sección, y el tiempo transcurrido contando en vivo,
   segundo a segundo. Si tienes varios cronómetros a la vez, todos aparecen
   apilados dentro del mismo panel.
2. **Para moverlo:** arrástralo desde su asa (el icono "⠿" de puntos, arriba
   del panel) con el ratón, con el dedo en una pantalla táctil, o —si el
   asa está enfocada— con las flechas del teclado (mantén presionada Mayús
   para moverlo más rápido). La tecla **Inicio** lo devuelve de un salto a su
   posición de siempre, útil si en algún momento sientes que quedó estorbando.
3. El panel **no puede quedar tapando** la barra de pestañas ni la cabecera
   de la app: siempre deja esa franja libre, así que un clic o un toque ahí
   siempre llega a la pestaña, nunca al panel.
4. **Para minimizarlo:** pulsa el botón "—" de la esquina del panel. Se
   convierte en una pastilla pequeña con solo el tiempo total, sin cerrarse
   del todo. Pulsa el mismo botón (ahora "▣") para volver a expandirlo. La
   app recuerda si lo dejaste minimizado y en qué posición, para la próxima
   vez que entres en este mismo navegador.
5. **Para pausar, reanudar o detener** un cronómetro sin salir de donde
   estás: cada fila del panel tiene sus propios botones ("⏸ Pausar" / "▶
   Reanudar" y "⏹ Detener"), igual que en la pestaña Cronómetros. Al final
   del panel hay un enlace "Ver todo en Cronómetros →" por si prefieres ir a
   la pantalla completa.
6. **Límite importante que conviene saber:** este panel vive dentro de la
   página web, así que si **cierras la pestaña del navegador**, el panel deja
   de verse (una página no puede dibujar nada por fuera de su propia
   ventana). Para que no se te olvide igual que un cronómetro sigue
   corriendo, el **título de la pestaña del navegador** (lo que ves en la
   barra de pestañas de Chrome/Edge) también muestra el tiempo acumulado,
   por ejemplo "⏳ 1h 20m · Hourglass" — así lo notas aunque estés mirando
   otra pestaña o otra aplicación.

## 3. Ver cómo va tu día (pestaña Panel)

Panel es la pantalla principal: te dice, para el periodo que elijas, cuánto
tiempo has usado y si vas sobrecargada. Con este paquete de cambios, el Panel
pasó de ser sobre todo tablas a ser sobre todo **gráficos** — se entiende de
un vistazo, sin tener que leer números.

1. Arriba de todo, en "Periodo", elige el tipo de rango: **Día**, **Semana**,
   **Mes**, **Año** (nuevo) o **Personalizado**. Con Día/Semana/Mes/Año puedes
   moverte con las flechas "←" y "→", o volver al periodo de hoy con el botón
   "Hoy".
2. Si eliges **Personalizado**, aparecen dos campos de fecha ("Desde" /
   "Hasta"). Solo puedes elegir un rango dentro del mismo año calendario —
   si escoges fechas de dos años distintos, la app las ajusta ella sola al 31
   de diciembre del año de la fecha inicial y te avisa por qué.
3. Debajo verás el bloque **"Estado de carga"**, encabezado ahora por un
   **anillo grande de colores** con el porcentaje de tus horas usadas:
   - **Verde — "Carga bajo control"**: vas por debajo del 85% de tu tiempo
     disponible.
   - **Amarillo — "Cerca del límite"**: entre 85% y 100%.
   - **Rojo — "Sobrecarga"**: pasaste el 100% de tu tiempo disponible.

   Junto al anillo, un texto te dice cuántas horas llevas de las disponibles,
   y si hay una sección (Trabajo, Voluntariado o Personal) que está aportando
   más que las otras, te lo señala ahí mismo. Los Bloques Fijos (sueño y
   comida) nunca cuentan para este semáforo — ver la sección 5 más abajo.
4. Debajo del anillo hay cuatro números que vale la pena entender bien,
   porque no significan lo mismo (ver la sección 9 de esta guía, "Conceptos
   que conviene tener claros"): **Tiempo de reloj**, **Tiempo bruto**,
   **Disponible** y **Sin registrar**.
5. Más abajo, en **"De un vistazo"**, están los gráficos nuevos:
   - Una **dona** con el reparto del periodo entre Trabajo, Voluntariado,
     Personal y Bloques Fijos.
   - **Barras apiladas**, una por día, cuando el periodo cubre entre 2 y 62
     días — muestran cómo se repartió cada día entre las secciones.
   - Una **línea de tendencia** semana a semana, cuando el periodo cubre más
     de 8 días — para ver si tu carga sube o baja. Además de los puntos de
     color, el texto de abajo dice en números cuántas semanas estuvieron en
     rojo, cuántas al límite y cuántas bien, para no depender solo de
     distinguir los colores.
   - Un **calendario de colores (heatmap)**, un cuadrito por día, **solo
     cuando estás en la vista Mes** — cada día se pinta de verde, amarillo o
     rojo según su carga, y en blanco si no tienes nada registrado ese día.
6. Más abajo, **"Bloques fijos"** muestra cuánto de tu día se va en sueño y
   comida (ver la sección 5).
7. Más abajo, **"Desglose por sección y proyecto"** te deja filtrar por
   Sección o por Proyecto para ver el detalle. Importante: este filtro **no
   cambia** el anillo de arriba — el aviso de sobrecarga siempre es del
   día/periodo completo, filtres lo que filtres.
8. Si algún proyecto tiene una meta de horas semanales, aparece la sección
   **"Metas: plan vs. real"** comparando lo planeado con lo que realmente
   trabajaste, ajustado al tamaño del periodo que estés mirando.
9. Si estás en la vista **Año**, en vez de la tabla día por día verás un
   consolidado **"Mes a mes"** — ver la sección 6.
10. Si el periodo elegido tiene más de un día (y no estás en la vista Año),
    al final encontrarás, **ahora plegada** (hay que abrirla con un clic),
    la tabla **"Día por día (detalle)"** con el estado de cada día por
    separado. Si el rango es muy largo (un Personalizado de varios meses),
    la tabla te avisa que solo muestra los primeros 62 días y sugiere acotar
    el rango.

## 4. Trabajar con cronómetros (pestaña Cronómetros)

Esta pestaña es para medir el tiempo mientras trabajas, en vez de anotarlo
después a mano.

1. Ve a la pestaña **Cronómetros**.
2. En "Iniciar un cronómetro", elige el **Proyecto** (solo aparecen los
   proyectos activos de Trabajo, Voluntariado o Personal — Sueño y Comidas no
   se eligen aquí, se generan solos) y, si quieres, escribe una **Nota** de
   en qué vas a trabajar.
3. Pulsa **"▶ Iniciar"**. El cronómetro aparece de inmediato en la lista "En
   curso", contando en vivo (horas:minutos:segundos), y también en el panel
   flotante nuevo (sección 2) y en un aviso pequeño en la cabecera de la app.
4. Puedes tener **varios cronómetros corriendo al mismo tiempo**, incluso dos
   del mismo proyecto a la vez — la app lo permite a propósito. Los dos
   tiempos se suman al total de ese proyecto; si coinciden en el reloj (por
   ejemplo, ambos corren de 2pm a 3pm), esa hora en común solo cuenta **una
   vez** para saber si el día está sobrecargado, aunque en el detalle del
   proyecto sí se vean las dos franjas sumadas por separado.
5. Sobre cada cronómetro en curso tienes tres botones:
   - **"⏸ Pausar"** — lo detiene sin darlo por terminado; el tiempo en pausa
     no cuenta como trabajado. El botón cambia a **"▶ Reanudar"**.
   - **"⏹ Detener y guardar"** — lo termina y lo convierte automáticamente en
     un registro de tiempo (visible después en la pestaña Registros).
   - **"Descartar"** — te pide confirmar y, si aceptas, borra el cronómetro
     sin guardar nada de su tiempo.
6. Si un cronómetro lleva corriendo mucho tiempo, verás junto a él una
   etiqueta roja que dice **"Lleva mucho tiempo"**.

## 5. Sueño y comidas ya no se restan solas: ahora son registros (novedad)

Antes, Hourglass simplemente descontaba 10 horas del día (7 de sueño + 3 de
comida) sin dejar rastro. Ahora **cada día se generan solos** un registro de
"Sueño" y uno de "Comidas", visibles igual que cualquier otro tiempo
registrado.

1. No tienes que hacer nada para que aparezcan: cada vez que abres la app,
   se ponen al día automáticamente (incluido el día de hoy), hasta un máximo
   de 31 días hacia atrás si estuviste mucho tiempo sin entrar.
2. Los ves en el **Historial** de Registros y en los gráficos del Panel (la
   dona, las barras apiladas), con su propio color, dentro de la sección
   "Bloques Fijos".
3. **Lo más importante de entender:** estos registros **no cuentan** para el
   semáforo de sobrecarga. No compiten por tus horas disponibles — son
   justamente las que las definen. Si contaran, cada día empezaría con 10 de
   14 horas ya "gastadas" y todo saldría en rojo siempre.
4. **Para corregir un día concreto** (por ejemplo, dormiste menos esa noche):
   - Desde el **Panel**, viendo un solo día: escribe las horas en "Sueño de
     [fecha] (horas)" / "Comida de [fecha] (horas)" y pulsa **"Guardar este
     día"**. El botón **"Volver al valor por defecto"** borra esa corrección
     y ese día vuelve a usar tus valores normales.
   - Desde **Ajustes → "Días fuera de lo habitual"** (ver sección 8): ahí
     puedes anotar un día puntual y ver la lista completa de todos los días
     que ya se apartan del valor por defecto, con un botón para devolver cada
     uno a la normalidad.
5. **Cambiar tu valor por defecto de sueño o comida en Ajustes solo aplica
   hacia adelante**: los días que ya se generaron se quedan como estaban, no
   se reescriben.
6. Puedes editar un registro de Sueño o Comidas para corregir su horario o
   agregarle una nota, pero **no puedes reasignarlo a otro proyecto** — el
   selector de proyecto aparece bloqueado al editarlo, justamente para que no
   se te vaya, sin querer, un bloque de sueño a un proyecto normal.

## 6. La vista Año (novedad)

Además de Día, Semana y Mes, ahora puedes elegir **Año** en el selector de
Periodo del Panel.

1. En vez de la tabla día por día (que con 365 filas no se puede leer), la
   vista Año muestra un **consolidado mes a mes**: para cada mes, cuántas
   horas de reloj llevaste, cuántas tenías disponibles, cuántas horas por
   cada sección, cuántos días de ese mes estuvieron en rojo, y un estado
   general del mes (verde, amarillo o rojo).
2. **Un detalle que conviene entender:** un mes puede aparecer en amarillo (o
   incluso verde) en su estado general, y **al mismo tiempo** llevar la
   etiqueta **"sostenida"** de sobrecarga. Eso pasa cuando el mes completo no
   se pasó de sus horas totales, pero **muchos días sueltos de ese mes sí**
   estuvieron en rojo (al menos un tercio de los días con datos). Son dos
   preguntas distintas — "¿el mes en total se pasó?" y "¿hubo una racha de
   días pesados?" — y la app responde las dos a la vez, así que pueden no
   coincidir.

## 7. Anotar tiempo a mano (pestaña Registros)

Úsala cuando ya terminaste una actividad y quieres anotarla directamente, sin
haber usado un cronómetro.

1. Ve a la pestaña **Registros**.
2. Completa: **Proyecto**, **Fecha**, **Hora de inicio**, y elige cómo
   indicar el final:
   - **"Hora de fin"** — escribe la hora en que terminaste.
   - **"Duración (minutos)"** — escribe directamente cuántos minutos duró.
3. Si escribes una hora de fin igual o anterior a la de inicio, no pasa nada
   raro: la app entiende que terminaste al día siguiente (por ejemplo,
   inicio 11:00 pm y fin 1:00 am se guarda como una sesión de 2 horas que
   cruza la medianoche).
4. Puedes agregar una **Nota** opcional.
5. Pulsa **"Agregar registro"**.
6. Debajo aparece el **Historial** de todo lo registrado (incluidos los
   registros automáticos de Sueño y Comidas), con filtros por Proyecto, por
   rango de fechas ("Desde"/"Hasta") y por texto libre ("Buscar en la nota").
7. Para corregir un registro ya guardado, pulsa **"Editar"** en su fila: el
   formulario de arriba se llena con sus datos y el botón cambia a **"Guardar
   cambios"** (con un botón adicional **"Cancelar"** por si te arrepientes).
   Si el registro es de Sueño o Comidas, el campo Proyecto aparece bloqueado
   (ver sección 5, punto 6).
8. Para borrarlo, pulsa **"Eliminar"**: te pide confirmar mostrando cuánto
   tiempo y de qué proyecto es, antes de borrarlo.

## 8. Administrar tus proyectos (pestaña Proyectos)

1. Ve a la pestaña **Proyectos**.
2. Para crear uno nuevo: escribe un **Nombre** (no puede repetirse con uno ya
   existente), elige su **Sección** (Trabajo / Voluntariado / Personal — no
   se pueden crear proyectos dentro de Bloques Fijos, que es de la app), un
   **Color** para identificarlo, y si quieres, una **Meta semanal (horas)**.
   Pulsa **"Crear proyecto"**.
3. En la lista de abajo puedes **filtrar** por Sección, por Estado (Activo /
   Archivado) o buscar por nombre.
4. Cada proyecto tiene tres botones:
   - **"Editar"** — cambia cualquiera de sus datos.
   - **"Archivar"** (o **"Reactivar"** si ya está archivado).
   - **"Eliminar"**.

   La diferencia entre los dos últimos es importante y **no es la misma
   acción con otro nombre**:

   - **Archivar** guarda todo tu historial intacto; solo deja de ofrecerse
     como opción para iniciar cronómetros o registros nuevos. Puedes
     "Reactivarlo" cuando quieras y todo tu historial sigue ahí.
   - **Eliminar** es definitivo: además del proyecto, **borra también todos
     sus registros de tiempo guardados** y descarta cualquier cronómetro
     suyo que esté corriendo en ese momento. La app te avisa antes de
     borrar, diciéndote exactamente cuántos registros y cronómetros vas a
     perder, y te recuerda en el mismo aviso que "Archivar" es la opción que
     conserva el historial — léelo antes de confirmar.

   Si solo quieres dejar de ver un proyecto que ya no usas, **usa Archivar**,
   no Eliminar.

## 9. El aviso de "cronómetro olvidado"

Si dejas un cronómetro corriendo sin detenerlo (por defecto, más de 6 horas,
puedes cambiar ese número en Ajustes), la próxima vez que abras Hourglass
**aparece automáticamente una ventana en el centro de la pantalla**, no un
simple aviso discreto en una esquina — es así a propósito, para que no se te
pase por alto.

La ventana te muestra qué cronómetro(s) llevan tiempo corriendo y te da tres
opciones:

- **"Detener ahora" / "Detener todos ahora"** — los da por terminados de
  inmediato y los convierte en registros.
- **"Ir a corregir"** — cierra el aviso y te lleva directo a la pestaña
  Cronómetros para que tú decidas (pausar, detener, corregir el horario
  después de guardarlo).
- **"Dejarlo corriendo"** — cierra el aviso sin hacer nada; el cronómetro
  sigue corriendo.

Mientras esta ventana está abierta, el resto de la pantalla no responde — es
intencional, para asegurarse de que la veas antes de seguir usando la app.
Puedes cerrarla también con la tecla Escape (equivale a "Dejarlo corriendo").

## 10. Zona horaria, valores por defecto y días puntuales (pestaña Ajustes)

1. Ve a la pestaña **Ajustes**.
2. Ahí puedes cambiar:
   - Tu **zona horaria** (usada para calcular a qué día calendario
     pertenece cada hora).
   - Tus horas de **sueño** y **comida por defecto**.
   - Después de cuántas horas se te avisa de un **cronómetro olvidado**.
3. Pulsa **"Guardar preferencias"** para que los cambios queden guardados.
   Recuerda: esto **solo afecta a los días que vienen**, no reescribe los que
   ya se generaron.
4. Más abajo, en **"Días fuera de lo habitual"** (antes se llamaba
   "Excepciones de sueño y comida"), puedes anotar un día concreto (pasado o
   futuro) en el que dormiste o comiste distinto de lo habitual, sin cambiar
   tu valor por defecto de los demás días. Debajo aparece la lista de todos
   los días que ya se apartan del valor por defecto (calculada a partir de
   tus propios registros, no de una lista separada), que se puede filtrar
   por rango de fechas, y cada uno se puede devolver a la normalidad con el
   botón **"Volver al valor por defecto"**.
5. Al final de la pantalla, **"Tus datos"** te recuerda cuántos proyectos,
   registros, cronómetros en curso y días fuera de lo habitual tienes
   guardados en total, y te confirma que todo se guarda en tu cuenta de
   LIPS-HUB (y también en este navegador) sin enviarse a ningún otro servicio
   externo.

## 11. Conceptos que conviene tener claros

Estos son los puntos que más fácilmente se malinterpretan de Hourglass:

- **Tiempo de reloj vs. tiempo bruto.** Si tienes dos actividades ocurriendo
  a la misma hora (por ejemplo, dos cronómetros del mismo proyecto, o un
  cronómetro y un registro manual que se solapan), esa franja de tiempo
  cuenta **una sola vez** en el reloj del día — porque en la vida real solo
  viviste esa hora una vez — pero **sí se suma a los dos proyectos por
  separado** en su propio total. El aviso de sobrecarga (el anillo del
  Panel) siempre usa el **tiempo de reloj**, nunca la suma de todos los
  proyectos juntos, para no exagerar cuánto trabajaste en realidad.

- **Sueño y comidas no compiten por tu tiempo: lo definen.** Aunque ahora se
  vean como registros de verdad, en el historial y en los gráficos, **nunca**
  entran en el cálculo de sobrecarga. Son las horas que hacen que tu tiempo
  disponible sean 14 horas en vez de 24, no algo más que sumar a esas 14
  horas ya calculadas.

- **Tiempo disponible.** Cada día tiene 24 horas menos las horas que le
  asignes a dormir y a comer ese día en concreto (leídas de sus propios
  registros). Por defecto son 7 horas de sueño y 3 de comida (14 horas
  disponibles), pero puedes corregir esos dos valores para un día concreto
  sin afectar los demás días.

- **Una sesión que cruza la medianoche.** Si registras (a mano o con un
  cronómetro) una actividad que empieza, por ejemplo, a las 11 pm y termina
  a la 1 am, **el registro guardado conserva su hora real de inicio y fin**
  tal cual — no se parte en dos registros. Lo que sí se reparte entre los
  dos días es el **cálculo de totales**: al mirar el día de ayer verás 1 hora
  de esa sesión, y al mirar el día de hoy verás la otra hora, aunque en el
  Historial siga apareciendo como un único registro.

- **Varios cronómetros a la vez.** Puedes tener más de un cronómetro
  corriendo al mismo tiempo, incluso dos del mismo proyecto. No hay ningún
  límite ni advertencia por eso — es un uso previsto de la app.

- **El panel flotante vive dentro de la pestaña del navegador.** Si cierras
  la pestaña, deja de verse — para eso el título de la pestaña también
  muestra el tiempo corriendo, como se explica en la sección 2.

- **"Sobrecarga sostenida" en la vista Año no es lo mismo que "el mes salió
  en rojo".** Como se explica en la sección 6, un mes puede quedar marcado
  como sostenida aun cuando su color general sea amarillo o verde, si tuvo
  muchos días sueltos pesados.

- **El aviso de cronómetro olvidado es una ventana emergente, no un aviso
  discreto.** Aparece sola, al abrir la app, y bloquea el resto de la
  pantalla hasta que la cierres de alguna forma (ver sección 9).

- **Archivar no es lo mismo que Eliminar.** Archivar conserva todo tu
  historial y es reversible ("Reactivar"). Eliminar borra el proyecto **y**
  sus registros de tiempo, y no se puede deshacer.
