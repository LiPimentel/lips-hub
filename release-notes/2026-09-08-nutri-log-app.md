# 8 de septiembre de 2026 — Nutri Log, la 7ma app del hub

## Qué cambió

**App nueva: Nutri Log** (`nutri-log.html`), agregada al hub junto a las otras 6.

Es una app de registro de consumo de productos alimenticios/suplementos —el
producto que viene precargado desde el primer uso es **Urth Superfood Brew**,
con sus 3 recetas de la guía de la marca (Collagen Iced Mocha, Adaptogen Latte,
Mood-Boost Smoothie)—, con una experiencia gamificada al estilo Duolingo:
racha de días, metas, insignias, y un reto guiado de 14 días.

### Pantallas incluidas

- **Inicio** — foto rápida del día: racha, si ya se registró hoy, botón "Ya lo
  tomé" para registrar con un toque, progreso de la semana contra la meta.
- **Registro de consumo** — hora, tipo (caliente/frío/licuado), receta usada
  (opcional), nota.
- **Recetas** — buscador, filtros (todas/favoritas/por tipo), favoritos,
  crear recetas propias.
- **Detalle de receta** — perfil de efectos calculado (energía, enfoque,
  digestión, etc.), cafeína estimada, ingredientes, pasos, valoración de 1 a
  5 estrellas, aviso de que estos efectos son referenciales y no son consejo
  médico.
- **Nutrición** — calorías y macros por receta (producto base + ingredientes
  propios), desglose por ingrediente, acumulados de hoy/semana/mes.
- **Análisis** — racha en calendario tipo mapa de calor, frecuencia por día de
  la semana, tipo de consumo, horario, efectos acumulados del mes, historial
  completo con exportar a CSV.
- **Reto de 14 días** — plan del día (qué receta, a qué hora, con qué hábito
  complementario), check-in diario de cómo te sientes, hábito cumplido,
  reflexiones, resumen comparativo día 1 vs. día 14 al terminar.
- **Plantilla del reto** — la tabla de 14 días es editable: se puede renombrar
  las columnas para reutilizarla con otro producto sin rehacer las filas, y
  duplicarla.
- **Perfil / Insignias** — racha actual, mejor racha, 14 insignias por
  distintos logros, días libres para no perder la racha por un día puntual.
- **Productos y metas** — se pueden agregar más productos además de Urth; por
  cada uno se elige qué medir (racha, frecuencia, horario — se puede combinar
  más de uno) y su meta.
- **Onboarding** — 3 pasos la primera vez que se abre, siempre se puede
  omitir.

Todo bilingüe (español/inglés, con español por defecto).

### Cómo se guardan los datos

Igual que las otras 6 apps: en la nube (Supabase, con su propia sesión de
inicio de sesión independiente de las demás) y una copia en el navegador, para
que sigan disponibles sin conexión y no se pierdan al cerrar la pestaña.

### Vista móvil

En pantallas angostas (teléfono) la navegación pasa de un menú lateral a una
barra de pestañas abajo, con las 5 secciones principales; "Productos y metas"
queda accesible desde un ícono de ajustes arriba.

## Verificación

Cada pantalla se probó en un navegador real (no solo revisando el código):
el motor de cálculo da los mismos valores que trae el documento de
requerimientos (por ejemplo, Collagen Iced Mocha ≈184 kcal, Adaptogen Latte
≈83 kcal), la racha sube al registrar, el reto de 14 días se puede iniciar y
completar un check-in, la plantilla se puede editar y duplicar, y la vista
móvil no tapa ningún botón.

Después de esta primera versión se corrieron las revisiones de calidad,
seguridad y accesibilidad del proyecto, y sus observaciones **ya se
corrigieron en la misma rama** (commit `4982f8d`, 8 de septiembre):
- Se agregó la preferencia de "reducir movimiento" a las dos animaciones
  propias de la app (número de racha, aviso de confirmación) — antes no la
  respetaban.
- Se corrigieron los textos que usan los lectores de pantalla en las
  estrellas de valoración, las escalas 1-5 del reto, el botón de hábito
  cumplido, el corazón de favorito y unos 15 campos de formulario que no
  estaban conectados a su etiqueta.
- Se mejoró el contraste de color en varios puntos donde el texto blanco
  sobre el color de acento de la app no se leía con suficiente claridad
  (insignia bloqueada, etiquetas de racha, botones activos), y el contorno
  que marca qué casilla está seleccionada al navegar con teclado.
- Se corrigió que elegir "Agregar mi propio producto" en la bienvenida no
  hacía nada (quedaba en silencio con el producto por defecto).

Quedan pendientes, sin bloquear este release, dos observaciones menores de
seguridad (de bajo impacto: un archivo CSV exportado podría necesitar un
ajuste si se abre en Excel, y el campo de nota del registro no se vuelve a
mostrar después de guardarlo) y un detalle de un indicador de la pantalla de
Análisis — ver `docs/nutrilog/requerimientos.md` ("Casos borde") para el
detalle completo.

## Dónde quedó

Solo en la rama `claude/nutri-log-app` y su vista previa (build local
verificado por `release-manager` — ver `docs/release-log.md`). **Todavía no
está en producción** (https://lips-hub.lissette2402.workers.dev).
