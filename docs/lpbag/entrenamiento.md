# LP-Bag (Presupuesto Inteligente) — Guía de uso

Esta guía está pensada para la persona que usa LP-Bag para llevar el control de sus gastos fijos mensuales y anuales, sin necesidad de conocimientos técnicos.

## Aviso importante sobre esta guía: qué se pudo comprobar en vivo y qué no

Antes de leer los pasos, es importante que sepas exactamente qué tan verificado está cada parte de esta guía:

- **No se logró capturar ni una sola imagen real de la app en esta sesión de trabajo**, ni de la pantalla de login ni del panel interno. Se intentó abrir el archivo local `lpbag.html` en el navegador de prueba de este entorno; la herramienta mostró la app como una **vista congelada** (no interactiva) del panel interno, y dos intentos de tomar una captura de pantalla agotaron el tiempo de espera sin producir ninguna imagen. Un intento de escribir texto en el campo "Nueva categoría…" tampoco tuvo ningún efecto visible. Por lo tanto, **esta guía no incluye ninguna captura de pantalla real**, y todo lo que describe sobre la apariencia y el comportamiento de la app proviene de leer el código fuente de `lpbag.html` y de `auth-gate.js` (el archivo que dibuja la pantalla de login para las 5 apps del hub), no de haberla usado o visto funcionar en pantalla.
- Este mismo problema de herramienta ya se había reportado esta semana al documentar el Generador de Gantt y MyTravel Agent Pro (ver `docs/team-memory.md`), así que se trata de una limitación conocida de este entorno de prueba, no de un error de LP-Bag.
- Por instrucción explícita para esta tarea, **no se navegó a la versión publicada (producción) de la app**, porque podría haber una sesión real de otra persona ya iniciada ahí (ver aviso en `docs/team-memory.md`) y no se quería arriesgar a tocar datos reales.
- Se recomienda que, en cuanto alguien logre abrir la app con una herramienta de navegador que sí responda a clics y teclas (o directamente desde un navegador normal), se repita esta sesión de documentación para reemplazar las descripciones "según el código" por capturas y confirmaciones reales.

Cada sección de abajo indica con una etiqueta si lo que describe se confirmó de alguna forma en esta sesión o si viene solo de leer el código.

---

## 1. Cómo entrar a la app

**[No verificado en vivo — descrito según el código de `auth-gate.js`]**

1. Abre el archivo `lpbag.html` (o el enlace publicado de la app) en tu navegador. Antes de mostrarte tus gastos, la app te pide iniciar sesión.
2. Vas a ver una tarjeta de inicio de sesión sobre un fondo oscuro con una animación de monedas de oro 🪙 cayendo desde la parte de arriba de la pantalla, y un "piso" de montoncitos de monedas dibujado en la parte inferior — esta decoración es exclusiva de LP-Bag entre las apps del hub (en el código se llama `coins-rain`).
3. En la tarjeta vas a encontrar: el título "Iniciar sesión", un campo "Correo", un campo "Contraseña", un botón "Entrar", y debajo un enlace "¿Olvidaste tu contraseña?".
4. Escribe tu correo y tu contraseña y haz clic en "Entrar".
5. Si el correo o la contraseña están mal escritos, según el código la app debería mostrar el mensaje "Correo o contraseña incorrectos." debajo del botón, sin borrar lo que ya escribiste en el campo de correo. Esto **no se pudo comprobar viendo la pantalla** durante esta sesión.
6. Si entraste correctamente, la página se recarga sola y te lleva a tu panel de gastos.

### Si olvidaste tu contraseña

**[No verificado en vivo — descrito según el código]**

1. Haz clic en "¿Olvidaste tu contraseña?".
2. Según el código, la tarjeta debería cambiar: desaparece el campo de contraseña, el título pasa a "Recuperar contraseña", el botón cambia a "Enviar enlace" y el enlace de abajo cambia a "Volver a iniciar sesión".
3. Al hacer clic en "Enviar enlace", deberías ver el mensaje "Revisa tu correo para continuar." — desde ahí, sigue las instrucciones que te lleguen a tu correo para crear una nueva contraseña.
4. Si te arrepientes, haz clic en "Volver a iniciar sesión" para regresar al formulario normal.

---

## 2. El panel principal (una vez adentro)

**[Estructura confirmada por la herramienta de lectura de accesibilidad del navegador, es decir: se confirmó que estos textos y campos existen realmente en la página, aunque no se pudo interactuar con ellos ni verlos como imagen. El comportamiento de cada botón se describe según el código.]**

Al entrar, todo el panel de LP-Bag aparece en una sola pantalla, de arriba hacia abajo:

### 2.1 Barra superior

- El nombre de la app, "💰 LPBag", a la izquierda.
- Un selector "Vista" para elegir en qué moneda quieres ver tus totales: **RD$ DOP** o **$ USD**. Esto solo cambia cómo se **muestran** los montos, no en qué moneda quedó guardado cada gasto.
- Botones "⬇ Export" (exportar tus datos), "⬆ Import" (importar datos desde un archivo) y "← Salir" (cerrar sesión).

### 2.2 Tasa de Cambio

Para que la app pueda convertir entre dólares y pesos dominicanos, tienes que decirle la tasa de cambio actual:

1. Busca la tarjeta "⇄ Tasa de Cambio", que muestra "1 USD = ___ DOP".
2. Escribe el valor de la tasa (por ejemplo, si 1 dólar equivale a 59 pesos, escribe "59") y sal del campo (Tab o clic afuera).
3. Según el código, la app guarda la tasa nueva, muestra brevemente "✓ Tasa actualizada" y un aviso emergente con el valor que escribiste.
4. **Importante:** si escribes 0, un número negativo, o dejas el campo vacío, la app no guarda nada — pero tampoco te avisa que falló. Si no ves el mensaje "✓ Tasa actualizada", vuelve a intentarlo con un número mayor que cero.
5. Ten en cuenta que la tasa que uses aquí se aplica a **todos** tus gastos, incluso a los que ya habías registrado hace tiempo — no queda "congelada" la tasa que estaba vigente cuando registraste cada gasto (ver más detalle en `requerimientos.md`, caso borde 3).

### 2.3 Categorías

1. En la tarjeta "⊞ Categorías" vas a ver las categorías que ya existen. LP-Bag trae 5 de fábrica: Vivienda, Servicios, Suscripciones, Transporte y Otros. **(Confirmado por la herramienta de lectura de accesibilidad: estos 5 nombres aparecen efectivamente en la página en el estado inicial.)**
2. Para agregar una categoría nueva, escribe su nombre en el campo "Nueva categoría…" y presiona el botón "+" (o Enter). No puedes repetir un nombre que ya exista.
3. Para eliminar una categoría, haz clic en la "×" junto a su nombre. **Ojo:** a diferencia de eliminar un gasto, esto no te pide confirmar — se borra al instante. Eso sí, la app no te deja borrar una categoría si todavía hay algún gasto usándola (te avisa con el mensaje "Categoría en uso, no se puede eliminar").
4. No existe una forma de "renombrar" una categoría directamente. Si te equivocaste al escribir el nombre y ya la usaste en varios gastos, tendrías que editar cada gasto uno por uno para cambiarlo a una categoría distinta.

### 2.4 Resumen Totalizado

La tarjeta "◈ Resumen Totalizado" muestra, sin importar ningún filtro que tengas activo en la tabla de abajo:

- **Total Mensual**: la suma de todos tus gastos, convertidos a un valor mensual (los gastos anuales se dividen entre 12).
- **Total Anualizado**: la suma de todos tus gastos convertidos a un valor anual (los gastos mensuales se multiplican por 12).
- **Mens · Anuales**: cuánto de ese total corresponde solo a gastos que registraste como mensuales, y cuánto a los que registraste como anuales.

### 2.5 Distribución por Categoría (gráfico)

Debajo del resumen hay un gráfico de dona que muestra qué porcentaje de tu gasto mensual corresponde a cada categoría, con una leyenda al lado (nombre, monto y porcentaje). Si todavía no tienes ningún gasto registrado, en su lugar vas a ver el mensaje "Agrega gastos para ver la distribución."

### 2.6 Registrar un gasto nuevo

1. Baja hasta la sección "Registrar Gasto Fijo".
2. Completa: "Descripción" (por ejemplo, "Renta" o "Netflix" — obligatorio), "Monto y Moneda" (un número mayor a 0, y elige si es en DOP o en USD — ambos obligatorios), "Frecuencia" (Mensual o Anual) y "Categoría" (elige una de tu lista).
3. Haz clic en "+ Agregar Gasto". El gasto aparece de inmediato en la tabla de abajo, en el resumen y en el gráfico.
4. Si dejas la descripción vacía o el monto en blanco o en 0, el propio navegador debería impedirte enviar el formulario (por las reglas del campo), sin necesidad de que la app te muestre un mensaje aparte.

### 2.7 La tabla de gastos ("Desglose de Gastos")

1. Todos tus gastos aparecen en una tabla (en pantallas anchas) o en tarjetas (en el celular).
2. Puedes buscar por texto en el cuadro "🔍 Buscar…" (busca tanto en la descripción como en la categoría).
3. Puedes filtrar con los botones "Todos", "Mensuales" o "Anuales" (uno a la vez).
4. Puedes ordenar haciendo clic en el título de cualquier columna (Descripción, Categoría, Frecuencia, Monto Original); un segundo clic invierte el orden.
5. Si tienes gastos de más de una categoría a la vez visibles en la tabla, aparece una fila de "Subtotal" al final de cada grupo de categoría.
6. Cada fila tiene dos botones: "✏" para editar el gasto y "✕" para eliminarlo.

**Para editar un gasto:**
1. Haz clic en "✏" junto al gasto que quieras corregir. Se abre una ventana con los mismos campos que al crearlo.
2. Cambia lo que necesites y haz clic en "Guardar cambios".
3. **Cuidado:** si la categoría que ese gasto tenía originalmente ya no existe en tu lista (por ejemplo, porque la borraste o porque importaste un archivo con categorías distintas), la ventana de edición va a mostrar seleccionada la primera categoría de tu lista sin avisarte del cambio. Si guardas sin fijarte en ese campo, el gasto quedará reasignado a esa categoría sin que te des cuenta. Revisa siempre el campo "Categoría" antes de guardar una edición.

**Para eliminar un gasto:**
1. Haz clic en "✕" junto al gasto.
2. Aparece una ventana pidiendo confirmar, con el texto "¿Eliminar permanentemente...? Esta acción no se puede deshacer."
3. Si confirmas, el gasto se borra para siempre — LP-Bag no tiene una opción de "Deshacer" en ningún lugar.

### 2.8 Exportar e importar tus datos

- **Exportar:** el botón "⬇ Export" descarga un archivo con el nombre `LPBag_` seguido de la fecha (por ejemplo `LPBag_2026-07-23.json`), que contiene tu tasa de cambio, tus categorías y todos tus gastos.
- **Importar:** el botón "⬆ Import" te deja elegir un archivo `.json` para cargarlo. **Ten mucho cuidado con esto:** importar un archivo **reemplaza por completo** todos tus datos actuales (tasa, categorías y gastos) sin pedirte confirmar y sin ninguna forma de deshacerlo después — si eliges el archivo equivocado, perderías todo lo que tenías guardado antes de ese momento. Antes de importar algo, si no estás seguro, exporta primero tus datos actuales como respaldo.

### 2.9 Seguridad de Acceso (cambiar tu contraseña)

1. Baja hasta la tarjeta "🔑 Cambiar Contraseña".
2. Escribe una contraseña nueva de al menos 6 caracteres.
3. Haz clic en "Actualizar Contraseña". Si todo sale bien, verás el mensaje "¡Contraseña actualizada!" en verde y un aviso emergente.

### 2.10 Guardar una copia en una carpeta de tu computador (opcional)

1. En la esquina inferior derecha vas a ver un botón. Si usas Chrome o Edge, dirá "📁 Conectar carpeta de datos". **(Confirmado por la herramienta de lectura de accesibilidad: este texto existe en la página.)**
2. Al hacer clic, el navegador te va a pedir elegir una carpeta de tu computador. A partir de ahí, cada cambio que hagas en LP-Bag también se guarda en un archivo `lpbag-presupuesto.data.json` dentro de esa carpeta, como respaldo adicional independiente de la nube.
3. Si usas otro navegador, el aviso dirá "⚠️ Guardado solo local (usa Chrome/Edge)" y esta opción no estará disponible.
4. **Ten cuidado si compartes la computadora con otra persona que también use LP-Bag con su propia cuenta:** este archivo no distingue entre cuentas de usuario, así que sus categorías y gastos podrían mezclarse o sobrescribirse con los tuyos si ambos conectan la misma carpeta. Este mismo riesgo ya se identificó en otras apps del hub (StaffGate y MyTravel) y está pendiente de una decisión del equipo técnico — mientras tanto, evita compartir la carpeta conectada con otra persona.

---

## Resumen de lo verificado vs. lo no verificado

| Pantalla / flujo | ¿Cómo se verificó? |
|---|---|
| Pantalla de inicio de sesión (formulario normal, decoración de monedas) | No verificado en vivo esta sesión — la herramienta de navegador no mostró la superposición de login ni respondió a intentos de interacción. Descrito solo por lectura del código. |
| Mensaje de error por credenciales incorrectas | No verificado en vivo — descrito solo por lectura del código. |
| Modo "Recuperar contraseña" del login | No verificado en vivo — descrito solo por lectura del código. |
| Panel general (categorías por defecto, contador de gastos en 0) | Estructura y textos confirmados por la herramienta de lectura de accesibilidad del navegador sobre la copia local (`file://`), en un estado sin sesión — coincide con lo que predice el código, pero no se pudo confirmar si esa vista corresponde a la pantalla realmente protegida por el login, ni interactuar con ningún botón o campo. |
| Agregar / editar / eliminar un gasto | No verificado en vivo — descrito solo por lectura del código. Un intento de escribir texto en el campo de categoría no tuvo ningún efecto visible. |
| Tasa de cambio, categorías, resumen, gráfico | No verificado en vivo — descrito solo por lectura del código; su existencia en el DOM se confirmó por la herramienta de accesibilidad, pero no su funcionamiento real. |
| Exportar / Importar JSON | No verificado en vivo — descrito solo por lectura del código. |
| Cambiar contraseña | No verificado en vivo — descrito solo por lectura del código. |
| Botón/badge de carpeta local | Se confirmó que el texto "📁 Conectar carpeta de datos" existe en la página (herramienta de accesibilidad); su funcionamiento interno se documentó solo por lectura del código. |
| Capturas de pantalla | Ninguna captura real se pudo obtener en esta sesión (la herramienta de captura agotó el tiempo de espera dos veces); esta guía no contiene imágenes. |

**Antes de confiar en esta guía al 100%, lo más seguro es que alguien la revise usando la app real (con una cuenta válida y un navegador que responda con normalidad) para confirmar cada paso y agregar capturas de pantalla verdaderas.**
