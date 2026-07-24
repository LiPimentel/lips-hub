# Bitácora del Mentor — Guía de uso

Esta guía está pensada para la persona que usa la app en su día a día como mentor o mentora, sin necesidad de conocimientos técnicos.

## Aviso importante sobre las capturas de pantalla de esta guía

Antes de leer los pasos, es importante que sepas qué se pudo comprobar realmente y qué no:

- **La pantalla de inicio de sesión sí se navegó en vivo** en el navegador durante la preparación de esta guía, y su descripción a continuación corresponde exactamente a lo que se vio en pantalla.
- **No fue posible guardar esa captura como archivo de imagen** dentro de la carpeta `docs/bitacora-mentor/capturas/`: las herramientas disponibles en esta sesión de trabajo permiten "ver" la pantalla del navegador, pero no ofrecen una forma de exportar esa imagen a un archivo `.png` en el disco. Por eso esta guía no incluye archivos de captura embebidos; en su lugar, se describe la pantalla con el mayor detalle posible, tal como se observó.
- **Todas las pantallas que están detrás del inicio de sesión (Mentoría, Grupos, Plantillas, Base de datos, Reportes, y todos los formularios) NO se pudieron ver ni navegar**, porque la app exige una cuenta y contraseña reales de Supabase, y no se contaba con credenciales de prueba. Todo lo que se explica sobre esas pantallas en esta guía proviene de leer el código fuente de la app, no de haberlas usado. Se marcan claramente como "no verificado visualmente" en cada sección.

Se recomienda que, cuando alguien con acceso real a la app pueda iniciar sesión, se repita esta sesión de capturas para completar la guía con imágenes reales de cada pantalla.

---

## 1. Cómo entrar a la app

1. Abre el archivo `bitacora-mentor.html` (o el enlace publicado de la app) en tu navegador. Antes de mostrarte cualquier dato, la app te pide iniciar sesión.

**Esto es lo que se vio realmente en pantalla** (navegado y confirmado en esta sesión):

- Un fondo verde oscuro con una decoración de puntos y una tarjeta clara a la derecha.
- El nombre de la app arriba: "📖 Bitácora del Mentor", con el subtítulo "REGISTRO DE MENTORÍAS".
- El título "Iniciar sesión".
- Un campo llamado "Correo".
- Un campo llamado "Contraseña".
- Un botón grande color dorado/marrón con el texto "Entrar".
- Debajo del botón, un enlace en texto: "¿Olvidaste tu contraseña?".

2. Escribe tu correo y tu contraseña en los campos correspondientes y haz clic en "Entrar".
3. Si el correo o la contraseña están mal escritos, la app te lo indica con el mensaje "Correo o contraseña incorrectos." y te deja intentar de nuevo — no borra lo que ya escribiste en el campo de correo.
4. Si entraste correctamente, la página se recarga sola y te lleva directo a tus datos.

### Si olvidaste tu contraseña

1. Haz clic en el enlace "¿Olvidaste tu contraseña?" que está debajo del botón "Entrar".
2. Según el código de la app (esto **no se pudo confirmar navegándolo en vivo**, ver aviso al inicio de esta guía), la pantalla cambia a un formulario más corto: solo te pide el correo, el título cambia a "Recuperar contraseña" y el botón dice "Enviar enlace".
3. Al enviarlo, deberías ver el mensaje "Revisa tu correo para continuar." — desde ahí, sigue las instrucciones que te lleguen a tu correo para crear una nueva contraseña.
4. Hay un enlace para "Volver a iniciar sesión" si te arrepientes o ya no lo necesitas.

---

## 2. Qué vas a encontrar dentro de la app (a partir de aquí, todo se explica leyendo el código de la app — no se pudo navegar en vivo)

Una vez adentro, en la parte de arriba vas a ver 5 pestañas: **Mentoría**, **Grupos**, **Plantillas**, **Base de datos** y **Reportes**. A continuación se explica, paso a paso y según el comportamiento programado en la app, cómo se usa cada una. Como se indicó arriba, estas instrucciones no están acompañadas de capturas reales porque no fue posible iniciar sesión durante esta preparación.

### 2.1 Pestaña "Mentoría" — tu lista de mentees y sus sesiones

**Para agregar un nuevo mentee:**
1. En el panel de la izquierda, haz clic en el botón "+ nuevo mentee".
2. Se abre un formulario. Lo único obligatorio es el **nombre**; si no llenas el "Área" o el "Objetivo principal", la app los completa sola con el texto "Sin especificar" (no te va a avisar si los dejaste vacíos, así que revisa antes de guardar).
3. Completa el resto de los datos que quieras: área de trabajo, nivel (Principiante/Intermedio/Avanzado), tipo de mentoría (seguimiento continuo o consulta puntual de 1-2 sesiones), estado, estilo de aprendizaje, objetivo, teléfono, correo, país, y notas de progresión.
4. Haz clic en "Guardar mentee".

**Para ver y editar el perfil de un mentee:**
1. Haz clic en su nombre en la lista de la izquierda (están agrupados por nivel: Principiante, Intermedio, Avanzado).
2. En su perfil puedes: cambiar su estado (Activo / En pausa / Cerrado) con un menú desplegable junto a su nombre — el cambio se guarda apenas lo eliges, sin botón adicional; hacer clic en "editar datos" para modificar cualquier campo; o hacer clic en "eliminar mentee" para borrarlo (te pedirá confirmar, y después de borrar aparece un mensaje abajo con la opción "Deshacer" por unos segundos, por si te equivocaste).
3. Si pasaron más de 30 días desde la última sesión de un mentee activo de seguimiento continuo, vas a ver una alerta amarilla arriba de su perfil avisando que no tienes sesión registrada hace X días.

**Para registrar una sesión con un mentee:**
1. Con el mentee seleccionado, haz clic en "+ registrar sesión".
2. Llena la fecha (por defecto trae la de hoy), el enfoque que usaste (Directivo / Socrático / Colaborativo), el tema tratado, qué funcionó, qué ajustar, próximos pasos, y si quedó algún compromiso pendiente.
3. Si tienes una plantilla de preguntas creada (ver sección de Plantillas más abajo), puedes elegirla en "Plantilla de preguntas clave" y se te va a mostrar el checklist para llenarlo ahí mismo.
4. Tienes dos formas de guardar:
   - **"Guardar como borrador"**: no exige que llenes nada, útil si quieres dejarlo a medias y continuar después.
   - **"Guardar sesión"**: esta sí exige que el campo "Tema tratado" no esté vacío.
5. Las sesiones guardadas aparecen en una línea de tiempo debajo del perfil, con la más reciente primero, numeradas en el orden en que ocurrieron (no en el orden en que las escribiste).
6. Si guardaste un compromiso, puedes marcarlo como cumplido directamente con la casilla que aparece junto al texto del compromiso, sin tener que volver a abrir el formulario.
7. Un borrador se puede retomar con el botón "continuar borrador" que aparece en esa tarjeta.

**Para exportar o respaldar tus datos** (botones en el panel izquierdo, pestaña Mentoría):
- **"Exportar CSV"** / **"Exportar Excel"**: descarga una tabla con todas tus sesiones (individuales y grupales) para abrir en Excel o Google Sheets.
- **"Copia de seguridad"**: descarga un archivo `bitacora-mentor-backup.json` con absolutamente todos tus datos, para guardarlo como respaldo.
- **"Importar copia"**: te deja subir un archivo de respaldo anterior. **Ten mucho cuidado con este botón**: según el código, apenas subes un archivo con el formato correcto, reemplaza TODOS tus datos actuales por los del archivo, sin preguntarte "¿estás seguro?" y sin opción de deshacer. Solo úsalo si realmente quieres reemplazar lo que tienes ahora.

### 2.2 Pestaña "Grupos" — mentorías con varias personas a la vez

1. Haz clic en la pestaña "Grupos".
2. Para crear un grupo, haz clic en "+ nuevo grupo", ponle un nombre (obligatorio), una descripción si quieres, y marca en la lista de casillas qué mentees ya registrados van a ser parte del grupo. Si todavía no tienes ningún mentee creado, la app te va a pedir que primero agregues mentees desde la pestaña "Mentoría".
3. Dentro del perfil de un grupo puedes editarlo, eliminarlo (con confirmación y "Deshacer", igual que con los mentees), y registrar sesiones grupales con los mismos campos que una sesión individual (fecha, enfoque, tema, qué funcionó, qué ajustar, próximos pasos, compromiso) — con la diferencia de que las sesiones grupales **no** se pueden numerar automáticamente ni usar una plantilla de preguntas; eso solo está disponible para sesiones con un mentee individual.
4. Igual que con los mentees, si pasan más de 30 días sin una sesión grupal, aparece la alerta de inactividad — pero como los grupos no tienen un "estado" (no se pueden marcar como pausados o cerrados), la única forma de que la alerta deje de aparecer es registrando una nueva sesión o eliminando el grupo.

### 2.3 Pestaña "Plantillas" — listas de preguntas reutilizables

1. Haz clic en "+ nueva plantilla".
2. Ponle un nombre (por ejemplo, "Checklist primera sesión") y agrega los ítems que quieras con el botón "+ agregar item". Cada ítem puede ser una "Casilla (sin respuesta)" (para marcar sí/no) o una "Pregunta con respuesta" (para escribir una respuesta corta).
3. Guarda con "Guardar plantilla". Necesitas al menos un ítem con texto.
4. Estas plantillas solo se pueden usar al registrar sesiones **individuales**, no sesiones grupales.
5. Si eliminas una plantilla, las sesiones que ya la usaron conservan su checklist tal como quedó guardado (no se les borra nada) — pero ten en cuenta que, a diferencia de casi todo lo demás que se puede borrar en esta app, **eliminar una plantilla no ofrece la opción de "Deshacer"**.

### 2.4 Pestaña "Base de datos" — buscar y filtrar todos tus mentees

1. Aquí ves una tabla con todos tus mentees individuales (nombre, área, país, nivel, tipo, estado, teléfono, correo, cantidad de sesiones y cantidad de pendientes).
2. Puedes filtrar por nombre, área, país, nivel, tipo y estado usando los campos de arriba de la tabla.
3. Puedes ordenar por cualquier columna haciendo clic en su título.
4. Si haces clic en cualquier fila, te lleva directo al perfil de ese mentee en la pestaña Mentoría.
5. Importante: esta tabla **no incluye a tus grupos de mentoría**, solo mentees individuales.

### 2.5 Pestaña "Reportes" — tus números generales

1. Aquí ves tarjetas con totales: personas ayudadas en total, mentorías registradas (con el desglose de cuántas son individuales, grupales y borradores), grupos de mentoría, tasa de objetivos logrados, y mentees activos ahora.
2. Más abajo hay gráficos de barra por: estado de tus mentees, resultados de mentorías cerradas, área de trabajo (las 8 más frecuentes), tipo de mentoría, nivel, y enfoque usado en las sesiones.
3. Todos estos números son acumulados de todo el histórico — la app no ofrece una forma de ver, por ejemplo, "solo este mes" o "solo este trimestre".

---

## Resumen de lo verificado vs. lo no verificado

| Pantalla / flujo | ¿Cómo se verificó? |
|---|---|
| Pantalla de inicio de sesión (login) | Navegada en vivo y observada directamente en el navegador |
| Modo "recuperar contraseña" del login | Solo por lectura del código (`auth-gate.js`); no se logró activar el enlace durante la prueba en navegador |
| Pestaña Mentoría (lista, perfil, sesiones) | Solo por lectura del código; no navegado (requiere sesión real) |
| Pestaña Grupos | Solo por lectura del código; no navegado |
| Pestaña Plantillas | Solo por lectura del código; no navegado |
| Pestaña Base de datos | Solo por lectura del código; no navegado |
| Pestaña Reportes | Solo por lectura del código; no navegado |

Para cualquier duda sobre si la app realmente se comporta como se describe en las secciones marcadas como "no verificado visualmente", lo más seguro es probarlo en vivo con una cuenta real antes de confiar en la guía al 100%.
