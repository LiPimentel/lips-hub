# Hourglass — guía para usarla (sin necesitar conocimientos técnicos)

Esta guía explica, paso a paso, cómo usar **Hourglass**, la app de LIPS-HUB para
llevar el control de en qué se te va el tiempo entre trabajo, voluntariado y
proyectos personales.

## Aviso importante sobre las capturas de pantalla de esta guía

Se intentó capturar pantallas reales de la app, driving el navegador de esta
sesión de trabajo, tal como pide el protocolo del equipo. **No fue posible
esta vez**, por dos motivos comprobados, no supuestos:

1. `computer{action:"screenshot"}` falló siempre con el mismo error: *"the
   Browser pane is not displayed, so the page is not compositing frames"*
   — el panel del navegador de esta sesión concreta nunca llegó a dibujar
   nada capturable, en ningún intento (se probó también `zoom`, que usa el
   mismo mecanismo).
2. Como prueba de control (para descartar que fuera un problema de la propia
   app y no de la herramienta), se intentó un clic sobre un enlace normal sin
   ningún JavaScript de por medio (`<a href="./index.html">`, el enlace
   "← Volver al hub"); no navegó en ningún intento. Es el mismo resultado que
   ya había reportado `accessibility-reviewer` el mismo día trabajando en esta
   misma app, con el mismo tipo de prueba (ver `docs/team-memory.md`,
   2026-07-30) — así que se trata de una limitación conocida de esta
   herramienta en esta sesión, no de un defecto de Hourglass.

Por eso **esta guía no tiene una sola captura de pantalla propia**. En vez de
inventarlas o describir pantallas que no llegué a ver, cada paso se describe
con precisión a partir de dos fuentes verificables:

- La lectura completa del código real de `hourglass.html` (los textos de
  botones, mensajes y campos citados abajo son literalmente los que produce
  el código, no una paráfrasis).
- Lo que **sí** se verificó con ejecución real en el navegador ese mismo día,
  en una sesión distinta donde la herramienta sí funcionó: `qa-lead` confirmó
  en vivo (clics reales, datos inyectados, medición con cronómetro del propio
  navegador) el cálculo de sobrecarga, el reparto de una sesión que cruza
  medianoche, dos cronómetros del mismo proyecto a la vez, el aviso emergente
  de cronómetro olvidado, el rango personalizado acotado a un año, las metas
  con comparación plan-vs-real, y los filtros de Registros y Proyectos — todo
  esto está en `docs/hourglass/qa-checklist.md` y se cita aquí en vez de
  volver a inventarlo.

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
   de eso — ver la sección 6 más abajo antes de seguir, porque esa ventana
   hay que resolverla (o cerrarla a propósito) antes de poder tocar el resto
   de la pantalla.

Una vez dentro, ves la barra superior con el nombre "⏳ Hourglass" y, debajo,
cinco pestañas: **Panel, Cronómetros, Registros, Proyectos y Ajustes**. La
pestaña que se abre primero siempre es **Panel**.

## 2. Ver cómo va tu día (pestaña Panel)

Panel es la pantalla principal: te dice, para el periodo que elijas, cuánto
tiempo has usado y si vas sobrecargada.

1. Arriba de todo, en "Periodo", elige el tipo de rango: **Día**, **Semana**,
   **Mes**, o **Personalizado**. Con Día/Semana/Mes puedes moverte con las
   flechas "←" y "→", o volver al día de hoy con el botón "Hoy".
2. Si eliges **Personalizado**, aparecen dos campos de fecha ("Desde" /
   "Hasta"). Solo puedes elegir un rango dentro del mismo año calendario —
   si escoges fechas de dos años distintos, la app las ajusta ella sola al 31
   de diciembre del año de la fecha inicial y te avisa por qué.
3. Debajo verás el bloque **"Estado de carga"**, con uno de tres colores:
   - **Verde — "Carga bajo control"**: vas por debajo del 85% de tu tiempo
     disponible.
   - **Amarillo — "Cerca del límite"**: entre 85% y 100%.
   - **Rojo — "Sobrecarga"**: pasaste el 100% de tu tiempo disponible.

   Junto al color, un texto te dice cuántas horas llevas de las disponibles,
   y si hay una sección (Trabajo, Voluntariado o Personal) que está aportando
   más que las otras, te lo señala ahí mismo.
4. Debajo del semáforo hay cuatro números que vale la pena entender bien,
   porque no significan lo mismo (ver la sección 7 de esta guía, "Conceptos
   que conviene tener claros"):
   - **Tiempo de reloj**
   - **Tiempo bruto**
   - **Disponible**
   - **Sin registrar**
5. Más abajo, **"Bloques fijos"** muestra cuánto de tu día se va en sueño y
   comida. Si estás viendo un solo día, puedes cambiar esas horas solo para
   ese día concreto escribiendo en "Sueño de [fecha] (horas)" y "Comida de
   [fecha] (horas)" y pulsando **"Guardar este día"**. El botón **"Volver al
   valor por defecto"** borra esa excepción puntual y ese día vuelve a usar
   tus valores normales (los de la pestaña Ajustes).
6. Más abajo todavía, **"Desglose por sección y proyecto"** te deja filtrar
   por Sección o por Proyecto para ver el detalle. Importante: este filtro
   **no cambia** el semáforo de arriba — el aviso de sobrecarga siempre es
   del día/periodo completo, filtres lo que filtres.
7. Si algún proyecto tiene una meta de horas semanales, aparece la sección
   **"Metas: plan vs. real"** comparando lo planeado con lo que realmente
   trabajaste, ajustado al tamaño del periodo que estés mirando.
8. Si el periodo elegido tiene más de un día, al final aparece una tabla
   **"Día por día"** con el estado (verde/amarillo/rojo) de cada día por
   separado.

## 3. Trabajar con cronómetros (pestaña Cronómetros)

Esta pestaña es para medir el tiempo mientras trabajas, en vez de anotarlo
después a mano.

1. Ve a la pestaña **Cronómetros**.
2. En "Iniciar un cronómetro", elige el **Proyecto** (solo aparecen los
   proyectos activos) y, si quieres, escribe una **Nota** de en qué vas a
   trabajar.
3. Pulsa **"▶ Iniciar"**. El cronómetro aparece de inmediato en la lista "En
   curso", contando en vivo (horas:minutos:segundos), y también aparece un
   aviso pequeño arriba a la derecha, en la cabecera de la app, con cuántos
   cronómetros tienes corriendo y el tiempo acumulado.
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

## 4. Anotar tiempo a mano (pestaña Registros)

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
6. Debajo aparece el **Historial** de todo lo registrado, con filtros por
   Proyecto, por rango de fechas ("Desde"/"Hasta") y por texto libre
   ("Buscar en la nota").
7. Para corregir un registro ya guardado, pulsa **"Editar"** en su fila: el
   formulario de arriba se llena con sus datos y el botón cambia a **"Guardar
   cambios"** (con un botón adicional **"Cancelar"** por si te arrepientes).
8. Para borrarlo, pulsa **"Eliminar"**: te pide confirmar mostrando cuánto
   tiempo y de qué proyecto es, antes de borrarlo.

## 5. Administrar tus proyectos (pestaña Proyectos)

1. Ve a la pestaña **Proyectos**.
2. Para crear uno nuevo: escribe un **Nombre** (no puede repetirse con uno ya
   existente), elige su **Sección** (Trabajo / Voluntariado / Personal), un
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

## 6. El aviso de "cronómetro olvidado"

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

## 7. Conceptos que conviene tener claros

Estos son los puntos que más fácilmente se malinterpretan de Hourglass:

- **Tiempo de reloj vs. tiempo bruto.** Si tienes dos actividades ocurriendo
  a la misma hora (por ejemplo, dos cronómetros del mismo proyecto, o un
  cronómetro y un registro manual que se solapan), esa franja de tiempo
  cuenta **una sola vez** en el reloj del día — porque en la vida real solo
  viviste esa hora una vez — pero **sí se suma a los dos proyectos por
  separado** en su propio total. El aviso de sobrecarga (el semáforo del
  Panel) siempre usa el **tiempo de reloj**, nunca la suma de todos los
  proyectos juntos, para no exagerar cuánto trabajaste en realidad.

- **Tiempo disponible.** Cada día tiene 24 horas menos las horas que le
  asignes a dormir y a comer. Por defecto son 7 horas de sueño y 3 de
  comida (14 horas disponibles), pero puedes cambiar esos dos valores para
  un día concreto (por ejemplo, un día que dormiste menos) sin afectar los
  demás días.

- **Una sesión que cruza la medianoche.** Si registras (a mano o con un
  cronómetro) una actividad que empieza, por ejemplo, a las 11 pm y termina
  a la 1 am, **el registro guardado conserva su hora real de inicio y fin**
  tal cual — no se parte en dos registros. Lo que sí se reparte entre los
  dos días es el **cálculo de totales**: al mirar el día de ayer verás 1 hora
  de esa sesión, y al mirar el día de hoy verás la otra hora, aunque en el
  Historial siga apareciendo como un único registro con la etiqueta "cruza
  medianoche".

- **Varios cronómetros a la vez.** Puedes tener más de un cronómetro
  corriendo al mismo tiempo, incluso dos del mismo proyecto. No hay ningún
  límite ni advertencia por eso — es un uso previsto de la app.

- **El aviso de cronómetro olvidado es una ventana emergente, no un aviso
  discreto.** Aparece sola, al abrir la app, y bloquea el resto de la
  pantalla hasta que la cierres de alguna forma (ver sección 6).

- **Archivar no es lo mismo que Eliminar.** Archivar conserva todo tu
  historial y es reversible ("Reactivar"). Eliminar borra el proyecto **y**
  sus registros de tiempo, y no se puede deshacer.

## 8. Zona horaria, valores por defecto y excepciones (pestaña Ajustes)

1. Ve a la pestaña **Ajustes**.
2. Ahí puedes cambiar:
   - Tu **zona horaria** (usada para calcular a qué día calendario
     pertenece cada hora).
   - Tus horas de **sueño** y **comida por defecto**.
   - Después de cuántas horas se te avisa de un **cronómetro olvidado**.
3. Pulsa **"Guardar preferencias"** para que los cambios queden guardados.
4. Más abajo, en **"Excepciones de sueño y comida"**, puedes anotar un día
   concreto (pasado o futuro) en el que dormiste o comiste distinto de lo
   habitual, sin cambiar tu valor por defecto de los demás días. La lista de
   excepciones se puede filtrar por rango de fechas, y cada una se puede
   quitar con el botón **"Quitar"**.
5. Al final de la pantalla, **"Tus datos"** te recuerda cuántos proyectos,
   registros, cronómetros en curso y excepciones tienes guardados en total,
   y te confirma que todo se guarda en tu cuenta de LIPS-HUB (y también en
   este navegador) sin enviarse a ningún otro servicio externo.
