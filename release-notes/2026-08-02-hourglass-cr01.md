# Notas de versión — 2 de agosto de 2026

## Hourglass ⏳ — primer paquete de ajustes (CR-01 a CR-04)

Cambios pedidos en el documento *CR-01_Hourglass_Ajustes.docx*, más unos
arreglos visuales de la pantalla de acceso.

### El reloj flotante (CR-01)

Ya no hace falta acordarse de que un cronómetro sigue corriendo.

- Un panel pequeño **siempre visible mientras algo esté contando**, en
  cualquier pestaña de la app.
- Lista **todos** los cronómetros a la vez, cada uno con su proyecto, su
  sección y su tiempo corriendo.
- **Lo arrastras donde quieras** y se queda ahí, incluso si cierras y vuelves
  a abrir. También se mueve con las flechas del teclado, y la tecla **Inicio**
  lo devuelve a su esquina si quedó estorbando.
- Se **minimiza a una pastillita** con solo el tiempo, sin cerrarse.
- Desde ahí mismo puedes **pausar, reanudar y detener** cada cronómetro, sin
  ir a ninguna pantalla. Y tiene un enlace directo a Cronómetros.

**El botón ⧉ "ventana aparte" — esto es lo importante.** El panel de arriba
vive dentro de la página: por mucho que lo arrastres nunca sale del área de
Hourglass, y desaparece si cambias de pestaña o minimizas. Eso es un límite del
navegador, no algo que se pueda ajustar.

Para verlo **por encima de cualquier programa**, pulsa el botón **⧉** del
panel. Se abre una **ventana pequeña de verdad**, del sistema, que:

- se queda **siempre encima** de lo que estés haciendo (Word, correo, lo que
  sea),
- la mueves **por toda la pantalla**, no solo dentro del navegador,
- **sigue ahí** aunque te vayas a otra pestaña o **minimices el navegador**,
- deja **pausar, reanudar y detener** desde ella misma.

Se cierra sola si cierras la pestaña de Hourglass, y con el botón "Devolver a
la página" vuelve donde estaba. Funciona en **Chrome y Edge**; en otros
navegadores el botón no aparece.

Como tercer aviso, **el tiempo también sale en el título de la pestaña**, para
verlo en la barra del navegador sin abrir nada.

### Sueño y comidas ahora son registros de verdad (CR-02)

Antes eran solo una resta invisible: la app descontaba 10 horas y ya.

- Cada día se crean **solos** un registro de Sueño y uno de Comidas, sin que
  tengas que hacer nada.
- Se ven en el historial y en los gráficos como cualquier otro registro, con
  su propio color.
- Puedes **corregir un día concreto** (si dormiste menos, por ejemplo) sin que
  eso toque los demás días.
- Si cambias el valor por defecto, **solo aplica de ahí en adelante**: los días
  ya registrados se quedan como estaban.

**Un detalle que conviene entender:** estos registros **no cuentan** para la
alerta de sobrecarga. No compiten por tus horas disponibles — son justamente
las que las definen. Si contaran, cada día empezaría con 10 de 14 horas
ocupadas y todo saldría en rojo siempre.

*Decisión que el documento dejaba abierta:* se generan para todos los días
**hasta hoy inclusive**, no solo al cerrar el día. Si se generaran solo al
cierre, el día en curso diría que tienes 24 horas disponibles hasta la
medianoche, que es justo el número que la app existe para no equivocar.

### El panel se ve, ya no se lee (CR-03)

El panel era casi todo tablas. Ahora entra por los ojos:

- **Un anillo grande** con el porcentaje de tus horas usadas, en verde,
  amarillo o rojo.
- **Una dona** con el reparto entre Trabajo, Voluntariado, Personal y Bloques
  Fijos.
- **Barras apiladas** que muestran cómo se repartió cada día.
- **Una línea de tendencia** semana a semana, para ver si la carga sube o
  baja.
- **Un calendario de colores** (heatmap) donde cada día del mes se pinta según
  su nivel de carga.

La tabla de detalle día por día sigue estando, pero **plegada**: se abre si la
necesitas, y ya no es lo primero que ves.

### Vista de Año (CR-04)

Se suma **Año** al selector de Día / Semana / Mes. Muestra el consolidado mes a
mes: horas por sección, cuántos días hubo en rojo, y marca los meses con
**sobrecarga sostenida**.

Un mes puede salir en amarillo y aun así estar marcado como sostenida: quiere
decir que el mes completo no pasó de sus horas totales, pero muchos días
sueltos sí. Son dos preguntas distintas y se responden las dos.

### La pantalla de acceso

- El **símbolo del reloj de arena** ya no es el emoji del sistema (que se veía
  como una pegatina de app de mensajes): ahora está dibujado, con marco de
  madera, la arena cayendo y el reloj **volteándose** cuando se vacía.
- El **fondo** pasa a tener tres clases de reloj bien repartidos: de arena,
  de manecillas (con segundero), y digitales **con la hora real corriendo**.
- El **Gato de Cheshire** ya no aparece y se apaga en el mismo sitio: **salta
  de un reloj a otro**, esfumándose a mitad del salto y reapareciendo en el
  siguiente.
- Si tienes activada la preferencia del sistema de "reducir movimiento", todo
  se queda quieto pero completo: no desaparece nada.

### Arreglos que salieron de la revisión

- La app **se congelaba más de 30 segundos** al abrir la vista de Año con
  muchos registros. Ahora tarda menos de medio segundo.
- Varios ajustes de accesibilidad: contraste del calendario de colores, y que
  la línea de tendencia diga **en texto** cuántas semanas hubo con sobrecarga,
  para no depender de distinguir verde de rojo.
- En el teléfono, el reloj flotante se podía arrastrar **encima de la barra de
  pestañas** y esa zona dejaba de responder al toque. Ya no puede subir hasta
  ahí.
- Al corregir un registro de Sueño o Comidas se podía cambiar su proyecto o su
  fecha, y eso **descuadraba las horas del día en silencio** (o las contaba
  dos veces). Ahora solo se pueden ajustar sus horas; para cambiar otro día se
  edita el registro de ese día.
- La app creaba y guardaba los registros automáticos **incluso sin haber
  iniciado sesión**. Ahora espera a saber de quién son.

## Dónde quedó

Solo en la rama `claude/hourglass-app`, pendiente de fusionar a `master`.
