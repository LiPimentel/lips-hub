# StaffGate — Guía de uso

Esta guía está pensada para la persona que usa StaffGate en su día a día para llevar entrevistas técnicas de candidatos, sin necesidad de conocimientos técnicos.

## Aviso importante sobre las capturas de pantalla de esta guía

Antes de leer los pasos, es importante que sepas qué se pudo comprobar realmente y qué no:

- **La pantalla de inicio de sesión sí se navegó en vivo** en el navegador durante la preparación de esta guía, incluyendo tres estados distintos: el formulario normal de "Iniciar sesión", el mensaje de error al escribir un correo y contraseña incorrectos, y el modo "Recuperar contraseña" (se hizo clic en el enlace correspondiente y se regresó al modo normal). Las tres se describen a continuación con el mayor detalle posible, tal como se vieron en pantalla.
- **No fue posible guardar esas capturas como archivos de imagen** dentro de la carpeta `docs/staffgate/capturas/`: las herramientas disponibles en esta sesión de trabajo permiten "ver" la pantalla del navegador de forma temporal (en pantalla, no como archivo), pero no ofrecen ninguna forma de exportar esa imagen a un archivo `.png` en el disco. Por eso esta guía no incluye archivos de captura embebidos; en su lugar, cada pantalla verificada en vivo se describe con el mayor detalle posible, exactamente como se observó.
- **Todas las pantallas que están detrás del inicio de sesión (Candidatos, Plantillas, Reportes, y todos los formularios y modales dentro de ellas) NO se pudieron ver ni navegar**, porque la app exige una cuenta y contraseña reales de Supabase, y no se contaba con credenciales de prueba. Todo lo que se explica sobre esas pantallas en esta guía proviene de leer el código fuente de la app, no de haberlas usado. Se marcan claramente como "no verificado visualmente" en cada sección.

Se recomienda que, cuando alguien con acceso real a la app pueda iniciar sesión, se repita esta sesión de capturas para completar la guía con imágenes reales de cada pantalla.

---

## 1. Cómo entrar a la app

1. Abre el archivo `StaffGate.html` (o el enlace publicado de la app) en tu navegador. Antes de mostrarte cualquier dato, la app te pide iniciar sesión.

**Esto es lo que se vio realmente en pantalla** (navegado y confirmado en esta sesión):

- Un fondo azul oscuro casi negro, con íconos decorativos flotando de color rojo, dorado, verde-azulado y morado relacionados con entrevistas: lupa, maletín, globo/burbuja de chat, diana (target), reloj, gráfico de barras, bandera, portapapeles, lápiz, brújula, birrete de graduación, estrella, calendario, engranaje, etc.
- Una tarjeta color crema/beige en el centro con:
  - El nombre de la app arriba: "🎯 StaffGate" (la palabra "Gate" en rojo), con el subtítulo "ENTREVISTAS TÉCNICAS".
  - El título "Iniciar sesión".
  - Un campo llamado "Correo".
  - Un campo llamado "Contraseña".
  - Un botón grande color dorado/marrón con el texto "Entrar".
  - Debajo del botón, un enlace en texto: "¿Olvidaste tu contraseña?".

2. Escribe tu correo y tu contraseña en los campos correspondientes y haz clic en "Entrar".
3. Si el correo o la contraseña están mal escritos, la app te lo indica con el mensaje "Correo o contraseña incorrectos." en letras rojas justo debajo del botón "Entrar", y te deja intentar de nuevo — no borra lo que ya escribiste en el campo de correo. **(Se probó en vivo escribiendo un correo y una contraseña inventados: el mensaje apareció exactamente así, y el correo escrito se mantuvo visible en el campo.)**
4. Si entraste correctamente, la página se recarga sola y te lleva directo a tus datos.

### Si olvidaste tu contraseña

1. Haz clic en el enlace "¿Olvidaste tu contraseña?" que está debajo del botón "Entrar".
2. **(Verificado en vivo)** La tarjeta cambia de inmediato: el campo de "Contraseña" desaparece, solo queda el campo "Correo", el título pasa de "Iniciar sesión" a "Recuperar contraseña", el botón cambia su texto a "Enviar enlace", y el enlace de abajo cambia a "Volver a iniciar sesión".
3. Al hacer clic en "Enviar enlace" (esto **no se probó con un correo real** durante esta sesión, para no generar un envío de correo innecesario), según el código de la app deberías ver el mensaje "Revisa tu correo para continuar." — desde ahí, sigue las instrucciones que te lleguen a tu correo para crear una nueva contraseña.
4. Si te arrepientes, haz clic en "Volver a iniciar sesión" para regresar al formulario normal. **(Verificado en vivo: al hacer clic ahí, la tarjeta regresó exactamente al estado descrito en el paso 1 de esta guía, con los campos de Correo y Contraseña vacíos otra vez.)**

---

## 2. Qué vas a encontrar dentro de la app (a partir de aquí, todo se explica leyendo el código de la app — no se pudo navegar en vivo)

Una vez adentro, en la barra lateral izquierda vas a ver 3 pestañas: **Candidatos**, **Plantillas** y **Reportes**. A continuación se explica, paso a paso y según el comportamiento programado en la app, cómo se usa cada una. Como se indicó arriba, estas instrucciones no están acompañadas de capturas reales porque no fue posible iniciar sesión durante esta preparación.

### 2.1 Pestaña "Candidatos" — tus entrevistas

**Para crear un candidato nuevo:**
1. Haz clic en el botón "+ Nuevo candidato" en la parte de arriba de la barra lateral.
2. Se abre un formulario. Lo único obligatorio es el **nombre completo**.
3. Elige una "Plantilla de entrevista" del menú (por defecto aparece seleccionada la primera de tu lista — normalmente la plantilla base "Entrevista técnica BA").
4. Completa, si quieres, "Posición / Rol" (por ejemplo "Pasante BA") y "Fuente / Canal" (por ejemplo "LinkedIn").
5. Haz clic en "Crear ficha". La app te lleva directo a la entrevista de ese candidato.
6. **Importante:** una vez creado el candidato, no hay ninguna forma de cambiar qué plantilla está usando. Si te equivocaste de plantilla, tendrías que eliminar el candidato y crearlo de nuevo desde cero.

**Para entrevistar a un candidato (registrar respuestas):**
1. Haz clic en su nombre en la lista de la barra lateral, o crea uno nuevo como se explicó arriba.
2. Vas a ver la ficha organizada en secciones plegables (por ejemplo "Intro / romper el hielo", "Pensamiento analítico", "Documentación / User stories", etc., si usas la plantilla base). Haz clic en el encabezado de una sección para abrirla o cerrarla.
3. Por cada pregunta puedes:
   - Escribir una nota libre en el cuadro de texto ("Anotar respuesta...").
   - Elegir una señal con los botones de la derecha: **Aprobado** (verde), **Aceptable** (azul), **Neutral** (ámbar), **Reprobado** (rojo) u **Omitir** (gris, para preguntas que no se llegaron a hacer). Si haces clic otra vez sobre la misma señal ya elegida, se quita la selección.
   - Si marcas "Omitir", la pregunta se tacha y se atenúa en pantalla, y una etiqueta "omitida" aparece junto al texto. Las preguntas omitidas no cuentan para el puntaje ni aparecen en las exportaciones (PDF/Word/TXT).
4. Arriba de las preguntas hay un panel de puntaje que se actualiza al instante con cada clic: conteo de Aprobado/Aceptable/Neutral/Reprobado/Omitidas, y un "veredicto" automático:
   - **"Sin evaluar aún"** — si todavía has calificado menos de 5 preguntas.
   - **"Candidato aprobado ✓"** — si al menos el 70% de lo evaluado es Aprobado o Aceptable, y hay 2 o menos Reprobadas.
   - **"Candidato reprobado ✗"** — si hay 5 o más preguntas Reprobadas.
   - **"Evaluar con cuidado ~"** — en cualquier otro caso.
5. Debajo del puntaje hay un panel de "Evaluación manual del entrevistador" con 10 criterios adicionales (Comunicación, Comprensión, Fluidez verbal, Presentación personal, Pensamiento analítico, Autonomía, Actitud/fit cultural, Conocimiento del área, Puntualidad, Notificación previa). Para cada uno, haz clic en la cantidad de estrellas que quieras darle (de 1 a 5); cada estrella vale 2 puntos, así que 5 estrellas equivale a 10/10 en ese criterio. Si haces clic otra vez en la misma cantidad de estrellas, se borra la calificación de ese criterio.
   - El promedio general que ves ("X / 10") solo toma en cuenta los criterios que sí calificaste; si solo calificaste uno o dos, el promedio puede verse muy alto sin que hayas evaluado casi nada por este método — ten cuidado con esto.
6. Hay un campo de "Notas generales" para impresiones que no encajan en ninguna pregunta puntual.
7. Para marcar a alguien en la **lista negra**, activa la casilla "Agregar a lista negra" arriba de las preguntas. Aparece un campo para escribir el motivo. Ten en cuenta que, aunque el campo se pone en rojo si lo dejas vacío, la app **no te impide guardar sin escribir un motivo** — es solo una advertencia visual, no un bloqueo real. Si vuelves a desmarcar la casilla, el motivo se borra de inmediato sin pedirte confirmación.
8. Para eliminar un candidato, usa el botón "Eliminar" en la parte de arriba de su ficha. Te va a pedir confirmar. **A diferencia de otras apps del hub, aquí no hay "Deshacer": una vez que confirmas, el candidato se borra para siempre.**

**Para exportar la ficha de un candidato:**
1. Con el candidato abierto, haz clic en el botón "Exportar ▾" en la parte de arriba.
2. Elige uno de tres formatos:
   - **Exportar PDF**: abre una pestaña nueva del navegador con el reporte ya diseñado, y un botón "Imprimir / Guardar como PDF" — tienes que usar ese botón (o Ctrl+P) y elegir "Guardar como PDF" en el diálogo de impresión; la app no descarga el PDF directamente por sí sola.
   - **Exportar Word**: descarga un archivo `.docx` que puedes abrir en Microsoft Word.
   - **Exportar texto**: descarga un archivo `.txt` simple.
3. Los tres formatos incluyen los mismos datos: nombre, posición, plantilla, fuente, fecha, el resumen de puntaje, el veredicto, tus notas generales, las calificaciones por estrella que hayas puesto, y todas las preguntas evaluadas (las que marcaste como "Omitir" no aparecen en ningún formato de exportación).

### 2.2 Pestaña "Plantillas" — tus listas de preguntas reutilizables

1. Haz clic en la pestaña "Plantillas".
2. La app ya trae una plantilla lista para usar: "Entrevista técnica BA", con 25 preguntas en 9 secciones. Tiene una etiqueta "base" para distinguirla de las que tú crees.
3. En esa plantilla base **no puedes editar ni borrar las preguntas ni secciones originales** (los campos aparecen bloqueados y no tienen botón de eliminar). Lo que sí puedes hacer es:
   - Agregar preguntas nuevas dentro de sus secciones existentes, con "Agregar pregunta a esta sección".
   - Agregar secciones completamente nuevas, con "Agregar nueva sección".
   - Esas preguntas y secciones que tú agregues sí las puedes editar o borrar cuando quieras.
4. Si quieres control total sobre la plantilla base (por ejemplo, cambiar el texto de una pregunta original), haz clic en "Duplicar" arriba de la plantilla. Esto crea una copia completa, totalmente editable, con su propio nombre ("... (copia)").
5. Para crear una plantilla desde cero, haz clic en "+ Nueva plantilla", ponle un nombre (obligatorio) y opcionalmente un "Rol / Área". Empieza vacía — tienes que agregarle secciones y preguntas tú mismo.
6. Para eliminar una plantilla (que no sea la base), haz clic en "Eliminar" dentro de su editor. Si algún candidato ya la está usando, el mensaje de confirmación te avisa cuántos. **Ojo:** aunque el mensaje dice que esos candidatos "quedarán sin plantilla asignada", en la práctica, cuando vuelvas a abrir la ficha de esos candidatos, la app les va a mostrar automáticamente la primera plantilla de tu lista (usualmente la base de 25 preguntas), que probablemente no tiene nada que ver con lo que le preguntaste realmente a esa persona. Las señales y notas que ya habías guardado no se pierden del todo, pero van a dejar de coincidir con ninguna pregunta visible. Evita borrar plantillas que ya usaste con candidatos si puedes.
7. Al igual que con los candidatos, eliminar una plantilla, una sección o una pregunta personalizada es inmediato y permanente una vez que confirmas — no hay "Deshacer".

### 2.3 Pestaña "Reportes" — todos tus candidatos en una tabla

1. Haz clic en la pestaña "Reportes".
2. Arriba vas a ver 4 tarjetas con totales: Aprobados, En revisión, Reprobados y Blacklisted. Estos totales siempre cuentan a TODOS tus candidatos, sin importar si tienes algún filtro activo. Puedes hacer clic en cualquiera de estas tarjetas para filtrar la tabla por ese grupo.
3. Debajo hay filtros que puedes combinar entre sí (puedes activar varios a la vez): por veredicto (Aprobado / En revisión / Reprobado / Sin evaluar), por "Blacklisted", y por posición (si tienes candidatos con distintas posiciones). También hay un buscador de texto por nombre o posición.
4. Cuando tengas algún filtro activo, aparece un botón "✕ Limpiar filtros" para quitarlos todos de una vez.
5. La tabla se puede ordenar por cualquier columna haciendo clic en su título (candidato, posición, veredicto, % positivo, estrella promedio, fecha). Hacer clic otra vez invierte el orden.
6. Haz clic en cualquier fila para ir directo a la ficha completa de ese candidato.
7. El botón "Exportar CSV" (arriba a la derecha del reporte, o el botón principal de la barra lateral que se renombra a "Exportar todo" mientras estás en esta pestaña) descarga una tabla en formato CSV para abrir en Excel o Google Sheets. **Ten cuidado: este botón exporta solo los candidatos que estás viendo en ese momento según tus filtros activos, no necesariamente todos tus candidatos.** Si quieres exportar absolutamente todo, asegúrate de hacer clic primero en "Limpiar filtros".

### 2.4 Guardar una copia en una carpeta de tu computador (opcional)

1. En la esquina inferior derecha de la pantalla vas a ver un pequeño botón/aviso. Si usas Chrome o Edge, dirá "📁 Conectar carpeta de datos".
2. Al hacer clic, el navegador te pedirá elegir una carpeta de tu computador. A partir de ahí, cada cambio que hagas en StaffGate también se guarda en un archivo `staffgate.data.json` dentro de esa carpeta, como respaldo adicional independiente de la nube.
3. Si usas un navegador distinto a Chrome/Edge, el aviso dirá "⚠️ Guardado solo local (usa Chrome/Edge)" y esta opción no estará disponible.
4. **Ten cuidado si compartes la computadora con otra persona que también usa StaffGate con su propia cuenta**: este archivo de la carpeta no distingue entre cuentas de usuario, así que podría mezclarse o sobrescribirse entre distintas personas que usen la misma carpeta conectada.

---

## Resumen de lo verificado vs. lo no verificado

| Pantalla / flujo | ¿Cómo se verificó? |
|---|---|
| Pantalla de inicio de sesión (login, formulario normal) | Navegada en vivo y observada directamente en el navegador |
| Mensaje de error por credenciales incorrectas | Navegado en vivo: se probó con un correo y contraseña inventados y se confirmó el mensaje exacto |
| Modo "Recuperar contraseña" del login (cambio de formulario, ida y vuelta) | Navegado en vivo: se hizo clic en el enlace, se observó el cambio, y se regresó al modo normal |
| Envío real del enlace de recuperación ("Revisa tu correo para continuar.") | Solo por lectura del código; no se envió un correo real durante esta sesión |
| Pantalla "Elige una contraseña nueva" (tras seguir un enlace de recuperación real) | Solo por lectura del código; no navegado |
| Widget de cuenta (cambiar contraseña / cerrar sesión) | Solo por lectura del código; no navegado (requiere sesión real) |
| Pestaña Candidatos (lista, ficha, entrevista, exportar) | Solo por lectura del código; no navegado |
| Pestaña Plantillas (lista, editor, duplicar, eliminar) | Solo por lectura del código; no navegado |
| Pestaña Reportes (tabla, filtros, orden, exportar CSV) | Solo por lectura del código; no navegado |
| Botón/badge de carpeta local | Se confirmó que existe en el DOM de la página (detectado por la herramienta de accesibilidad del navegador incluso con el login tapándolo visualmente); su funcionamiento interno se documentó solo por lectura del código |

Para cualquier duda sobre si la app realmente se comporta como se describe en las secciones marcadas como "no verificado visualmente", lo más seguro es probarlo en vivo con una cuenta real antes de confiar en la guía al 100%.
