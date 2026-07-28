# Notas de versión — 27 de julio de 2026

**Estado:** en la rama `claude/widget-cuenta-y-botones-mentor`, aún no publicado a producción.

## 1. El botón de "Cuenta" ya no tapa los menús de las apps

El botoncito de **👤 Cuenta** (el que sirve para cambiar la contraseña y cerrar sesión) estaba pegado arriba a la derecha en las 5 apps. El problema es que **arriba a la derecha es justo donde cada app pone su propia barra de herramientas**, así que en algunas se montaba encima.

Medido en pantalla, no a ojo:

- En **Bitácora del Mentor** tapaba la pestaña **"Reportes"**.
- En **LPBag** tapaba los botones **"Import"** y **"Salir"**.

No era cuestión de moverlo un poco: no hay ninguna esquina de arriba que esté libre en las cinco, porque cada app coloca cosas distintas ahí.

### La solución

Ahora se ancla **abajo a la derecha, justo encima de la insignia de la carpeta de datos**. Las dos piezas que son comunes a todas las apps quedan juntas, en el mismo sitio siempre, y lejos de las barras de cada app.

Además se creó un "escalón" configurable: si una app tiene algo propio pegado al borde inferior, solo tiene que declarar su altura y **las dos piezas se suben automáticamente** en vez de taparlo.

### De paso, un fallo que nadie había reportado

**En MyTravel Agent Pro, desde el móvil, la insignia de la carpeta estaba tapando la barra de navegación de abajo** (esa con Dashboard, Viajes, Deseos). Llevaba ahí desde que existe la barra.

Con el escalón nuevo, MyTravel declara la altura de su barra y ahora hay **13 puntos de separación** en vez de solape. Se arregla solo, por el mismo mecanismo.

## 2. Bitácora del Mentor — los botones del panel lateral ya se ven

Los botones de **"+ nuevo mentee"**, **"Exportar CSV"**, **"Exportar Excel"**, **"Copia de seguridad"** e **"Importar copia"** eran transparentes con un borde gris muy claro sobre fondo crema. Se leían como texto apagado, no como algo que se puede pulsar.

Ahora llevan **fondo lila suave con borde lila**, usando los tonos que la app ya tenía en su paleta — no se inventaron colores nuevos, así que siguen combinando con el resto.

Verificado que además se leen bien:

| | Antes | Ahora |
|---|---|---|
| Contraste del texto | apagado | **6,52:1** (el mínimo es 4,5) |
| Contraste del borde | casi invisible | **4,31:1** (el mínimo es 3) |

## Nada más cambió

No se tocó ninguna funcionalidad, ni los datos, ni el inicio de sesión. El botón de Cuenta hace exactamente lo mismo que antes, solo que en otro sitio.
