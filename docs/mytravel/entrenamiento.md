# MyTravel Agent Pro — Guía de uso

Esta guía está pensada para la persona que usa MyTravel Agent Pro para
llevar su historial de viajes y su lista de destinos deseados, sin
necesidad de conocimientos técnicos.

## Aviso importante — léelo antes de seguir los pasos

Antes de explicar cómo se usa la app, es necesario que sepas exactamente
qué se pudo comprobar viendo la app funcionar de verdad, y qué no, durante
la preparación de esta guía:

- **No fue posible guardar ninguna captura de pantalla como archivo de
  imagen** en esta sesión de trabajo. La herramienta disponible para "ver"
  el navegador solo permite tomarle una foto temporal en pantalla, pero
  cada intento de hacerlo en esta sesión concreta **se quedó colgado sin
  responder** (tiempo de espera agotado), tanto para el archivo local como
  para la versión publicada en internet. Por eso esta guía **no incluye
  ninguna imagen** en `docs/mytravel/capturas/` — la carpeta se creó pero
  quedó vacía. Todo lo que se describe abajo se basa en texto real
  extraído de la página (lo que "dice" la pantalla) y en la lectura del
  código de la app, nunca en una captura visual real.
- **Se encontró, sin buscarla, una sesión ya iniciada de verdad** en la
  versión publicada de la app (`https://dapper-sunflower-c4c010.netlify.app`,
  el sitio en producción del hub). Es decir, alguien ya había iniciado
  sesión antes en ese navegador con una cuenta real, y esa sesión seguía
  activa. Gracias a eso, se pudo confirmar el contenido real de la primera
  pantalla interna del app (el panel "Mapa de Rutas") ya con sesión
  iniciada, algo que normalmente no se podría ver sin credenciales reales.
  **Por seguridad, no se cerró esa sesión** (el botón "Cerrar sesión" no se
  usó) porque no se contaba con la contraseña real para volver a entrar
  después, y **no se guardó ningún viaje ni deseo de prueba** en esa cuenta
  real para no mezclar datos falsos con los datos reales de esa persona.
- **Después de esa primera comprobación, cualquier clic o intento de
  interacción dejó de tener efecto.** Se intentó cambiar de sección (ir a
  "Gestionar Viajes"), y también pulsar el botón "Exportar CSV" — ninguno
  de los dos produjo ningún cambio visible en la página, ni un mensaje, ni
  un cambio de pantalla, a pesar de que el código de la app sí debería
  reaccionar a esos clics. Esto coincide con un problema ya reportado en
  una sesión anterior de este mismo proyecto (con el Generador de Gantt):
  la herramienta de navegador de este entorno de trabajo, en algún punto,
  deja de transmitir realmente los clics y las teclas escritas a la
  página, aunque parezca aceptarlos sin error. Por eso no se pudo navegar
  en vivo más allá de esa primera pantalla.
- **Al abrir el archivo local `mytravel-pro-v4.html` directamente en el
  navegador** (sin pasar por el sitio publicado), la pantalla de inicio de
  sesión **no apareció en absoluto** — se veía directamente el contenido
  interno de la app, vacío. Esto también coincide con lo reportado
  anteriormente para el Generador de Gantt ("se muestra como una vista
  estática"), y se interpreta como una limitación de la herramienta usada
  en esta sesión para abrir archivos locales, no como que el candado de la
  app esté realmente roto — pero esto no quedó confirmado al 100%, así que
  se marca como pendiente de revisar en una sesión con mejores
  condiciones.
- **Por lo anterior, la pantalla de inicio de sesión propiamente dicha
  (formulario "Iniciar sesión", mensaje de error de credenciales
  incorrectas, modo "Recuperar contraseña") no se pudo ver ni probar en
  vivo en esta sesión**, a diferencia de lo que sí se logró antes con
  StaffGate. Todo lo que se explica sobre esa pantalla en esta guía viene
  de leer el código (el mismo código compartido `auth-gate.js` que usan
  todas las apps del hub, ya confirmado en vivo para StaffGate en su
  propia guía), ajustado con la decoración visual específica de MyTravel
  que si se pudo confirmar leyendo el código: fondo azul marino con un
  horizonte de ciudad y aviones que cruzan la pantalla.
- **Todas las pantallas y funciones que están detrás del inicio de sesión,
  salvo la primera vista del panel "Mapa de Rutas" ya mencionada, no se
  pudieron navegar en vivo.** Se explican a partir de la lectura del
  código de la app. Se marca claramente "no verificado en vivo" en cada
  sección correspondiente.

Se recomienda repetir esta sesión de captura apenas se cuente con una
herramienta de navegador que no se quede colgada al tomar capturas, para
completar esta guía con imágenes reales de cada pantalla.

---

## 1. Cómo entrar a la app

1. Abre el archivo `mytravel-pro-v4.html` (o el enlace publicado de la
   app) en tu navegador. Antes de mostrarte cualquier dato, la app te pide
   iniciar sesión.

**Esto es lo que dice el código de la app sobre esa pantalla** (no
verificado viendo la pantalla real en esta sesión, ver aviso arriba):

- Un fondo azul marino oscuro, con la silueta de un horizonte de ciudad
  con ventanas iluminadas en la parte de abajo, nubes que se mueven
  lentamente, y varios aviones pequeños que cruzan la pantalla en
  distintas direcciones y velocidades — es la decoración exclusiva de
  MyTravel dentro del hub (las demás apps usan otras animaciones, por
  ejemplo StaffGate usa íconos flotantes de entrevistas).
- Una tarjeta color crema/beige en el centro con:
  - El nombre de la app arriba: "✈ MyTravel Agent Pro", con el subtítulo
    "GESTIONA TUS ITINERARIOS Y DESTINOS".
  - El título "Iniciar sesión".
  - Un campo "Correo".
  - Un campo "Contraseña".
  - Un botón grande con el texto "Entrar".
  - Debajo, un enlace: "¿Olvidaste tu contraseña?".
2. Escribe tu correo y tu contraseña y haz clic en "Entrar". **(No
   verificado en vivo en esta sesión.)**
3. Según el código (compartido con las demás apps del hub, donde sí se
   confirmó en vivo en otra sesión para StaffGate), si el correo o la
   contraseña están mal escritos, deberías ver "Correo o contraseña
   incorrectos." en rojo debajo del botón, sin borrar lo que ya
   escribiste. **(No verificado en vivo en esta sesión.)**
4. Si entraste correctamente, la página se recarga sola y te lleva a tus
   datos.

### Si olvidaste tu contraseña

Según el código de la app (no verificado en pantalla en esta sesión):

1. Haz clic en "¿Olvidaste tu contraseña?".
2. El formulario cambia: desaparece el campo de contraseña, el título pasa
   a "Recuperar contraseña", el botón cambia a "Enviar enlace" y el enlace
   de abajo cambia a "Volver a iniciar sesión".
3. Al pulsar "Enviar enlace" deberías ver "Revisa tu correo para
   continuar." y recibir un correo con instrucciones para elegir una
   contraseña nueva.
4. "Volver a iniciar sesión" te regresa al formulario normal.

---

## 2. La primera pantalla dentro de la app: "Mapa de Rutas"

**Esto sí se pudo confirmar de verdad en esta sesión**, gracias a una
sesión ya iniciada que se encontró activa en la versión publicada de la
app (ver aviso al inicio de esta guía). No es una imagen — es una
confirmación por texto real leído de la página, que dice exactamente esto
al entrar:

- En la barra lateral izquierda (en computador): el logo y nombre
  "MyTravel — AGENT PRO", y tres opciones: "🗺️ Mapa de Rutas" (activa por
  defecto), "🎒 Gestionar Viajes" (con un contador, en "0" en esa cuenta
  al momento de revisarla) y "🎯 Mis Deseos" (contador también en "0").
- Debajo, un bloque de indicadores: "Países visitados: 0", "Viajes
  favoritos: 0", "Presupuesto total: $0", "Días de viaje: 0".
- Abajo de todo, dos botones: "📥 Exportar CSV" y "↩ Cerrar sesión".
- En el panel principal: el título "Mapa de Rutas", el mensaje "Sin
  registros — añade tu primer viaje" (porque esa cuenta no tenía ningún
  viaje guardado), una tarjeta de "Presupuesto ejecutado" mostrando "$0"
  de un límite de "$10,000" (0%), y debajo la leyenda del mapa:
  "🚩 Regular", "🚩❤️ Favorito", "🎯 Deseo".
- El mapa (Leaflet, con mapa de calles de OpenStreetMap) se cargó
  correctamente, con sus controles de acercar/alejar ("+"/"−") visibles.
- En la esquina inferior derecha, el aviso "📁 Conectar carpeta de datos"
  (para guardar también una copia en una carpeta del computador).

Este es el estado de una cuenta **sin ningún viaje ni deseo guardado
todavía**. No se pudo confirmar en vivo cómo se ve esta misma pantalla una
vez que ya hay viajes o deseos guardados (con marcadores en el mapa, KPIs
con números reales, etc.) — eso se explica en las secciones siguientes
solo a partir del código.

---

## 3. Qué vas a encontrar en el resto de la app (a partir de aquí, todo se explica leyendo el código — no se pudo navegar en vivo en esta sesión)

### 3.1 Pestaña "Gestionar Viajes" — tu historial de viajes

**Para registrar un viaje nuevo:**
1. Haz clic en "＋ Nuevo viaje" arriba de la lista.
2. En "Ciudad de destino", escribe al menos 3 letras del nombre de la
   ciudad y espera un momento — te va a aparecer una lista de sugerencias
   reales (la app busca en un servicio externo llamado Nominatim, el mismo
   que usa OpenStreetMap). **Tienes que hacer clic en una de esas
   sugerencias**: si solo escribes el nombre sin elegir ninguna, el campo
   "País" no se va a llenar, y al intentar guardar la app te va a decir
   "Selecciona una ciudad de la lista." sin guardar nada.
3. El campo "País" se llena solo al elegir la ciudad; no se puede escribir
   ahí directamente.
4. Completa, si quieres, "Fecha inicio" y "Fecha fin" — la app te muestra
   automáticamente cuántos días de viaje son. Si escribes una fecha de fin
   anterior a la de inicio, te lo advierte y no te deja guardar así.
5. El "Presupuesto (USD)" es opcional (si lo dejas vacío, se guarda como
   $0). Las "Notas" también son opcionales.
6. Si tu viaje tuvo escalas, haz clic en "＋ Añadir escala" por cada una y
   escribe el nombre de la ciudad de escala como texto libre (no hay
   autocompletado para las escalas, a diferencia de la ciudad principal).
   Puedes quitar una escala con el botón "✕" a su lado, sin que te pida
   confirmar.
7. Si quieres, marca la casilla "Marcar como favorito ❤️".
8. Haz clic en "Guardar itinerario". El viaje aparece de inmediato en la
   lista y como un marcador 🚩 (o 🚩❤️ si es favorito) en el mapa de "Mapa
   de Rutas".
9. **Ten en cuenta:** si ya tenías otro viaje guardado en ese mismo país,
   la app te muestra una advertencia ("Ya tienes un viaje registrado en
   {país}.") pero **igual guarda el viaje nuevo** — la advertencia no
   bloquea nada, es solo informativa.

**Para buscar y filtrar tus viajes:**
1. Usa el cuadro "🔍 Ciudad o país…" para buscar por texto.
2. Usa el menú desplegable para mostrar "Todos" o "Solo favoritos ❤️".
3. Ambos se pueden combinar y la lista se actualiza mientras escribes.

**Para eliminar un viaje:**
1. Haz clic en "Eliminar" en la fila (o tarjeta, en el celular) del viaje.
2. La app te pide confirmar en un cuadro propio. Una vez que confirmas, el
   viaje se borra para siempre — no hay manera de deshacerlo.

**Importante:** no existe ningún botón para "editar" un viaje ya guardado.
Si te equivocaste en una fecha, el presupuesto, una nota o una escala
después de guardarlo, la única forma de corregirlo es eliminar ese viaje
por completo y crearlo de nuevo desde cero.

### 3.2 Pestaña "Mis Deseos" — destinos que quieres visitar

1. Haz clic en la pestaña "🎯 Mis Deseos".
2. Escribe la ciudad en el campo correspondiente (mismo mecanismo de
   sugerencias reales que en "Nuevo viaje" — tienes que elegir una de la
   lista, el país se llena solo).
3. Haz clic en "🎯 Añadir". El destino aparece en la lista de deseos y
   como un marcador 🎯 en el mapa de "Mapa de Rutas".
4. Para quitar un deseo, haz clic en "Eliminar" junto a él y confirma en
   el cuadro de diálogo. El borrado es inmediato y permanente.
5. Al igual que con los viajes, **no hay forma de editar** un deseo ya
   guardado — solo agregar o eliminar.

### 3.3 Exportar tus viajes

1. Haz clic en "📥 Exportar CSV" (barra lateral en computador, o el ícono
   correspondiente en la barra superior en el celular).
2. Se descarga un archivo CSV con todos tus viajes (ciudad, país, fechas,
   días, presupuesto, si es favorito, escalas y notas), listo para abrir
   en Excel o Google Sheets.
3. **Ten en cuenta dos cosas:** este botón exporta siempre **todos** tus
   viajes, sin importar si tienes una búsqueda o el filtro de favoritos
   activo en ese momento; y **no incluye tu lista de "deseos"** — no hay
   ninguna forma de exportar los deseos por separado. Si no tienes ningún
   viaje guardado, el botón te avisa "No hay viajes que exportar." y no
   descarga nada.

### 3.4 Guardar una copia en una carpeta de tu computador (opcional)

1. En la esquina inferior derecha vas a ver un botón/aviso. Si usas Chrome
   o Edge, dirá "📁 Conectar carpeta de datos".
2. Al hacer clic, el navegador te pide elegir una carpeta. Desde ese
   momento, cada cambio que hagas en MyTravel también se guarda en un
   archivo `mytravel-pro.data.json` dentro de esa carpeta, como respaldo
   adicional además de la nube.
3. Si usas otro navegador, el aviso dirá "⚠️ Guardado solo local (usa
   Chrome/Edge)" y esta opción no va a estar disponible.
4. **Ten cuidado si compartes la computadora con otra persona que también
   use MyTravel con su propia cuenta:** este archivo no distingue entre
   cuentas, así que los datos de ambas personas podrían mezclarse o
   sobrescribirse si usan la misma carpeta conectada.

### 3.5 Cerrar sesión

Puedes cerrar tu sesión de dos formas equivalentes: con el botón "↩ Cerrar
sesión" de la barra lateral/superior de la propia app, o con el botón
"👤 Cuenta" que aparece en la esquina superior derecha de la pantalla (ese
mismo panel también te permite cambiar tu contraseña). Ambos hacen
exactamente lo mismo: cierran tu sesión y te devuelven a la pantalla de
inicio de sesión.

---

## Resumen de lo verificado vs. lo no verificado

| Pantalla / flujo | ¿Cómo se verificó? |
|---|---|
| Decoración animada de la pantalla de login (horizonte, nubes, aviones) | Solo por lectura del código (`auth-gate.js`, bloque `travel-sky`); no se vio en pantalla en esta sesión |
| Formulario de login normal (Correo, Contraseña, botón Entrar) | Solo por lectura del código; no navegado en vivo en esta sesión |
| Mensaje de error por credenciales incorrectas | Solo por lectura del código (confirmado en vivo para StaffGate en otra sesión, con el mismo código compartido) |
| Modo "Recuperar contraseña" | Solo por lectura del código; no navegado en vivo |
| Pantalla "Elige una contraseña nueva" | Solo por lectura del código; no navegado |
| Panel "Mapa de Rutas" ya con sesión iniciada (KPIs, presupuesto, leyenda, mapa Leaflet, mensaje de "sin registros") | **Confirmado en vivo**, mediante lectura del texto y del árbol de accesibilidad real de la página con una sesión activa encontrada en la versión publicada — no mediante una captura de imagen |
| Botón "Exportar CSV" (clic real) | Se intentó en vivo; el clic no produjo ningún cambio ni mensaje visible — no se pudo confirmar que funcione en esta sesión |
| Cambiar de sección (ir a "Gestionar Viajes") | Se intentó en vivo varias veces; no se reflejó ningún cambio en la pantalla — no se pudo confirmar |
| Formulario "＋ Nuevo viaje" completo (autocompletado, validaciones, guardar) | Solo por lectura del código; no navegado |
| Sección "Mis Deseos" completa | Solo por lectura del código; no navegado |
| Eliminar un viaje o un deseo (cuadro de confirmación) | Solo por lectura del código; no navegado |
| Widget "👤 Cuenta" (cambiar contraseña / cerrar sesión) | Solo por lectura del código; no navegado |
| Botón/aviso de carpeta local | Solo por lectura del código; no navegado (no se intentó, para no arriesgar cambios en la cuenta real encontrada activa) |
| Apertura del archivo local `mytravel-pro-v4.html` sin sesión | Se intentó en vivo; la pantalla de login no llegó a aparecer (se vio el contenido interno vacío en su lugar) — se interpreta como limitación de la herramienta de esta sesión, no como comportamiento confirmado de la app |
| Captura de pantalla como archivo de imagen | No fue posible en ningún momento de esta sesión — la herramienta se quedó sin responder cada vez que se intentó |

Dado que la mayoría de los flujos internos no se pudieron confirmar en
vivo en esta sesión, se recomienda repetir esta guía apenas se cuente con
una herramienta de navegador estable (sin los cuelgues descritos arriba) y,
si es necesario, credenciales de prueba reales, para reemplazar las
descripciones basadas en código por pasos y capturas confirmados en la
práctica.
