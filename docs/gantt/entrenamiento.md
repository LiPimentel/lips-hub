# Generador de Gantt — Guía de uso

Esta guía está pensada para la persona que usa el Generador de Gantt para convertir un cronograma de proyecto en un diagrama visual, sin necesidad de conocimientos técnicos.

## Aviso importante sobre esta guía — léelo antes de seguir los pasos

Antes de explicar cómo se usa la app, es importante que sepas exactamente qué se pudo comprobar viendo la pantalla real funcionar, y qué no:

- **Solo se pudo ver, de forma real y en pantalla, la apariencia inicial de la pantalla de "Iniciar sesión"** (colores, textos, animación de fondo). Esto se describe abajo con el mayor detalle posible, tal como se vio.
- **No se pudo interactuar de verdad con la app en esta sesión de trabajo** — ni siquiera para probar el inicio de sesión con credenciales de prueba, como sí se logró antes con StaffGate. Se intentó escribir en los campos de correo y contraseña, hacer clic en "¿Olvidaste tu contraseña?", abrir una pestaña nueva, forzar la navegación, y hasta cargar la versión publicada del sitio en producción — ninguno de esos intentos permitió una interacción real; la herramienta de navegador de esta sesión avisó que el archivo "se muestra como una vista estática", y al intentar usar una pestaña nueva respondió que "no hay ningún sitio realmente cargado en esa pestaña". Tampoco había un servidor local instalado en esta computadora (Python, Node) para intentar otra vía.
- **No fue posible guardar ninguna captura de pantalla como archivo de imagen** dentro de `docs/gantt/capturas/` — las herramientas disponibles solo permiten "ver" la pantalla del navegador de forma temporal, no exportarla a un archivo `.png` en el disco. Por eso esta guía no incluye imágenes; en su lugar, describe con el mayor detalle posible lo que sí se vio.
- **Todo lo que se explica sobre el uso real de la app (cargar archivos, corregir la tabla, generar el Gantt, exportar) proviene de leer el código fuente de la app, no de haberla usado en pantalla.** Se marca claramente como "no verificado visualmente" en cada sección.

Se recomienda que, en cuanto alguien pueda abrir esta app en un navegador normal (por ejemplo desde el sitio publicado, con una cuenta real, o desde una computadora con un servidor local disponible), se repita esta sesión para completar la guía con capturas reales y confirmación real de cada paso.

---

## 1. Cómo entrar a la app

1. Abre el archivo `generador_gantt_2.html` (o el enlace publicado de la app) en tu navegador. Antes de mostrarte cualquier dato, la app te pide iniciar sesión.

**Esto es lo que se vio realmente en pantalla** (la única parte confirmada viendo la pantalla real en esta sesión):

- Un fondo azul marino muy oscuro, con una animación a la izquierda de barras horizontales tipo "Gantt" que van creciendo de color dorado/ámbar y verde-azulado, cada una terminando en una pequeña banderita, simulando tareas de un cronograma completándose.
- Una tarjeta color crema/beige, ubicada hacia el lado derecho de la pantalla (no en el centro exacto, a diferencia de otras apps del hub), con:
  - El nombre de la app arriba: "📊 Generador de Gantt", con el subtítulo "PLANIFICACIÓN DE PROYECTOS".
  - El título "Iniciar sesión".
  - Un campo llamado "Correo".
  - Un campo llamado "Contraseña".
  - Un botón grande color dorado/marrón con el texto "Entrar".
  - Debajo del botón, un enlace en texto: "¿Olvidaste tu contraseña?".

2. Escribe tu correo y tu contraseña en los campos correspondientes y haz clic en "Entrar". **(Este paso no se pudo probar en esta sesión — ver aviso arriba.)**
3. Según el código de la app (el mismo que usan las demás apps del hub), si el correo o la contraseña están mal escritos, deberías ver el mensaje "Correo o contraseña incorrectos." en letras rojas debajo del botón "Entrar", sin que se borre lo que ya escribiste en el campo de correo. **(No verificado en pantalla en esta sesión.)**
4. Si entraste correctamente, la página se recarga sola y te lleva directo a la app.

### Si olvidaste tu contraseña

Según el código de la app (no se pudo confirmar en pantalla en esta sesión):

1. Haz clic en el enlace "¿Olvidaste tu contraseña?" que está debajo del botón "Entrar".
2. El formulario debería cambiar: el campo de "Contraseña" desaparece, solo queda el campo "Correo", el título pasa de "Iniciar sesión" a "Recuperar contraseña", el botón cambia su texto a "Enviar enlace", y el enlace de abajo cambia a "Volver a iniciar sesión".
3. Al hacer clic en "Enviar enlace", deberías ver el mensaje "Revisa tu correo para continuar." — desde ahí, sigue las instrucciones que te lleguen a tu correo para crear una nueva contraseña.
4. Si te arrepientes, haz clic en "Volver a iniciar sesión" para regresar al formulario normal.

---

## 2. Qué vas a encontrar dentro de la app (a partir de aquí, todo se explica leyendo el código de la app — no se pudo navegar en vivo en esta sesión)

Una vez adentro, vas a ver tres secciones numeradas, una debajo de la otra: **"1. Carga tu archivo"**, **"2. Revisa y corrige las filas"** y **"3. Gantt"** (esta última solo aparece después de generar el diagrama).

### Aviso muy importante sobre guardar tu trabajo

A diferencia de las demás apps del hub, **el Generador de Gantt no guarda tu cronograma en ningún lado mientras trabajas.** Todo lo que cargas y corriges vive solo en esa pestaña del navegador que tienes abierta. Si recargas la página, cierras la pestaña, o se cierra el navegador por accidente, **pierdes todo el trabajo sin ningún aviso previo.** La única forma segura de no perder tu trabajo es descargar el Excel corregido o exportar el PDF antes de cerrar o recargar la página.

### 2.1 Paso 1 — Cargar tu cronograma

Tienes tres formas de traer tu cronograma a la app:

1. **Subir un archivo:** haz clic en el recuadro punteado que dice "Arrastra aquí tu archivo (.xlsx, .csv, .pdf) o haz clic para elegirlo", o arrastra directamente tu archivo hasta ahí. Se aceptan archivos de Excel (`.xlsx`, `.xls`), CSV, o PDF.
2. **Cargar un ejemplo:** haz clic en el botón "Cargar ejemplo (Opción 1 — Odoo PES)" para ver la app funcionando con un cronograma de muestra ya armado (16 filas con fases y fechas de un proyecto de ejemplo entre junio y octubre de 2026). Útil para practicar o para ver cómo debería verse un cronograma bien formado.
3. **Pegar texto:** si tienes tu cronograma en otro lugar (por ejemplo una tabla de Word o un correo), puedes copiar esas filas y pegarlas en el cuadro de texto grande, con las columnas separadas por tabulación o por varios espacios, en este orden: Fase, Fecha de inicio, Fecha de fin, Entregable, Días de duración. Luego haz clic en "Interpretar texto pegado".

**Cómo reconoce tus columnas:** si subes un Excel o CSV, la app busca automáticamente los encabezados de tus columnas y trata de identificar cuál es "Fase", cuál es la fecha de inicio, cuál es la fecha de fin, cuál es el "Entregable" y cuál es la duración en días — no necesitas que los nombres sean exactos, pero sí que se parezcan (por ejemplo "Fecha_Inicio" o simplemente "Inicio" funcionan igual).

**Sobre las fechas:** escribe tus fechas en el formato mes/día/año (por ejemplo, 15 de junio de 2026 se escribe "6/15/2026"), tal como aparece en el ejemplo incluido en la app. **Ten mucho cuidado si estás acostumbrado a escribir las fechas al estilo dominicano (día/mes/año)**, porque la app no distingue entre ambos formatos y siempre asume que el primer número es el mes — ver la advertencia en la sección de Casos borde del documento de requerimientos.

**Si ya tenías filas cargadas** y cargas un archivo nuevo, pegas texto nuevo, o pulsas "Cargar ejemplo", te va a aparecer una ventanita de confirmación preguntando qué hacer. **Lee bien el texto de esa ventana antes de hacer clic:** el botón "Aceptar" agrega las filas nuevas a las que ya tenías, pero el botón "Cancelar" no significa "no hacer nada" — significa "borrar todo lo que ya tenías y quedarme solo con las filas nuevas". Si ya habías corregido cosas a mano en la tabla, ten cuidado de no perderlas por accidente con este botón.

Si subes un PDF y la app no logra reconocer ninguna fila con fechas claras, no te va a dar un error sin más — te va a copiar el texto que extrajo del PDF dentro del cuadro de texto pegado, para que tú lo ajustes a mano y luego pulses "Interpretar texto pegado".

El botón "Limpiar todo" borra de inmediato todas las filas cargadas (sin pedirte confirmar), así que úsalo solo cuando estés seguro.

### 2.2 Paso 2 — Revisar y corregir las filas

Una vez que tengas filas cargadas (de cualquiera de las tres formas), aparecen en una tabla con las columnas Fase, Fecha inicio, Fecha fin, Entregable y Días.

1. Puedes hacer clic directamente sobre cualquier celda de la tabla y escribir para corregirla — no hay un botón "Editar" ni un modo especial, las celdas son editables directamente.
2. El cambio se guarda cuando haces clic fuera de la celda (no mientras escribes).
3. **Cuidado al corregir una fecha:** si escribes algo que la app no logra entender como fecha, no vas a ver ningún mensaje de error en ese momento — la app simplemente se queda sin saber la fecha de esa fila por dentro, y solo te vas a enterar más adelante, cuando generes el Gantt y esa fila aparezca contada dentro de un aviso general de filas excluidas (sin decirte cuál fila fue). Si algo no te cuadra al generar el Gantt, revisa fila por fila las fechas que escribiste a mano.
4. El botón "+ Agregar fila" agrega una fila completamente vacía al final, para que la llenes tú mismo.
5. La "x" al final de cada fila la elimina de inmediato — no hay confirmación ni forma de deshacerlo, así que revisa bien antes de hacer clic.
6. El botón "Descargar tabla corregida (Excel)" te descarga un archivo de Excel con exactamente lo que está en la tabla en ese momento — incluidas filas vacías o a medio llenar si las dejaste así, la app no las filtra.

### 2.3 Paso 3 — Generar y usar el diagrama de Gantt

1. Cuando la tabla esté como la quieres, haz clic en el botón "Generar Gantt".
2. La app solo usa las filas que tengan Fase, Fecha de inicio y Fecha de fin completas. Si alguna fila tiene la fecha de fin antes que la fecha de inicio, esa fila se excluye y te avisa cuántas filas así encontró. Si te faltan datos en alguna fila, también te avisa cuántas se dejaron fuera.
3. Si ninguna fila es válida, no se dibuja nada y la app te lo indica con un mensaje de error.
4. El diagrama aparece debajo, con una barra de color por cada tarea, ordenadas de la fecha más temprana a la más tardía y numeradas del 1 en adelante. El tamaño del "zoom" horizontal se ajusta solo, según qué tan largo sea tu proyecto — no hay un control manual de acercar/alejar.
5. Cada fase distinta de tu cronograma recibe un color propio, visible también en la leyenda debajo del diagrama. **Ojo:** la app solo tiene 8 colores disponibles — si tu cronograma tiene más de 8 fases distintas, algunos colores se van a repetir entre fases que no tienen relación entre sí.
6. Haz clic en cualquier número dentro de una barra, o en el nombre a la izquierda, para ver el detalle completo de esa tarea (fase, descripción completa, fechas exactas y días de duración) en el recuadro que aparece debajo del diagrama.
7. Debajo del diagrama también hay un índice compacto de texto con todos los números de tarea y una versión corta de cada entregable.

### 2.4 Exportar el diagrama a PDF

1. Con el Gantt ya generado, haz clic en el botón "Exportar a PDF (horizontal)" (arriba a la derecha del panel del diagrama).
2. La app arma automáticamente una hoja de PDF en orientación horizontal con una imagen de todo tu cronograma completo (no solo la parte que se ve en pantalla) y la descarga directamente a tu computadora con el nombre `cronograma_gantt.pdf`. A diferencia de otras apps del hub, aquí no se abre una vista previa de impresión — el archivo se descarga de una sola vez.
3. Si intentas exportar antes de generar un Gantt, la app te muestra un mensaje de error pidiéndote generar el diagrama primero.

---

## Resumen de lo verificado vs. lo no verificado

| Pantalla / flujo | ¿Cómo se verificó? |
|---|---|
| Apariencia inicial de la pantalla de inicio de sesión (fondo animado, tarjeta, campos, botón) | Vista en pantalla real (captura estática) en el navegador durante esta sesión |
| Escritura en los campos de Correo/Contraseña | Se intentó en vivo; no se reflejó ningún cambio real en la pantalla — no se pudo confirmar que funcione |
| Clic en "¿Olvidaste tu contraseña?" (cambio de modo) | Se intentó en vivo; no se reflejó ningún cambio real en la pantalla — no se pudo confirmar |
| Mensaje de error por credenciales incorrectas | Solo por lectura del código (mismo código compartido con StaffGate, donde sí se confirmó en otra sesión) |
| Modo "Recuperar contraseña" completo | Solo por lectura del código; no navegado en esta sesión |
| Pantalla "Elige una contraseña nueva" | Solo por lectura del código; no navegado |
| Widget de cuenta (cambiar contraseña / cerrar sesión) | Solo por lectura del código; no navegado (requiere sesión real) |
| Paso 1: Cargar archivo / ejemplo / texto pegado | Solo por lectura del código; no navegado |
| Paso 2: Tabla editable, agregar/eliminar filas, descargar Excel | Solo por lectura del código; no navegado |
| Paso 3: Generar Gantt, ver detalle, leyenda | Solo por lectura del código; no navegado |
| Exportar a PDF | Solo por lectura del código; no navegado |
| Intento de usar una pestaña nueva del navegador para interactuar | Se intentó; la herramienta respondió "No site is open in this tab" (sin sitio real cargado) |
| Intento de forzar la navegación al archivo | Se intentó con la opción "force"; mismo resultado que sin ella |
| Intento de usar el sitio publicado en producción (Netlify) para una pestaña interactiva real | Se intentó; la navegación quedó colgada sin responder y se abandonó el intento |
| Búsqueda de un servidor local en esta computadora para servir la carpeta del proyecto | Se buscó Python, Node y npm; ninguno estaba disponible |

Dado lo limitado de la verificación en esta sesión, se recomienda encarecidamente repetir esta guía apenas sea posible abrir la app en un navegador realmente interactivo (por ejemplo desde el sitio publicado con una cuenta real, o desde una computadora con un servidor local disponible), para confirmar en la práctica cada uno de los pasos descritos arriba y reemplazar las descripciones por capturas de pantalla reales.
