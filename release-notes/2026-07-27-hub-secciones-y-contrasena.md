# Notas de versión — 27 de julio de 2026

**Estado:** en la rama `claude/hub-secciones-y-contrasena`, aún no publicado a producción.

## LIPS-HUB — las apps ahora van en dos grupos, y se puede cambiar la contraseña

### 1. Dos secciones plegables

La lista de aplicaciones dejó de ser una sola cuadrícula. Ahora hay dos grupos:

- **Apps profesionales** — Timeline Loader, Bitácora del Mentor, Entrevistas Técnicas
- **Apps personales** — Presupuesto Personal, Tracking de Viajes

Las dos **aparecen siempre abiertas** al entrar. Si quieres apartar un grupo de la vista, haces clic en su título y se pliega; vuelves a hacer clic y reaparece. La flecha de la izquierda indica si está abierto o cerrado, y al lado del título verás cuántas apps tiene cada grupo.

El plegado **no se recuerda** entre visitas: cada vez que entras, ambos grupos están abiertos. Es a propósito — plegar sirve para apartar algo en el momento, no para esconderlo permanentemente.

> **Revisa esta clasificación.** El reparto entre "profesional" y "personal" lo decidí a partir del nombre y la descripción de cada app. Timeline Loader (cronogramas) lo puse en profesionales, pero si lo usas sobre todo para planes personales, dímelo y lo cambio: es un ajuste de una palabra por app.

### 2. Cambiar la contraseña desde el hub

Tenías razón: **no estaba**. Las 5 apps sí tenían un botón de cuenta para cambiar la contraseña, pero el hub no — se había dejado fuera a propósito cuando se diseñó, y nunca se retomó.

Ahora, arriba a la derecha junto a "Cerrar sesión", aparece **"Cambiar contraseña"**. Al pulsarlo se abre un pequeño panel donde escribes la nueva clave y guardas. Te avisa si es demasiado corta (mínimo 6 caracteres) y te confirma cuando se guardó.

No se copió el botón flotante que usan las 5 apps: ese aparece encima de todo, en la esquina, y aquí chocaría con la cabecera del hub. El panel nuevo tiene el mismo aspecto que el resto del hub.

## Detalles de calidad

- Las cabeceras plegables se hicieron con el mecanismo nativo del navegador, así que **funcionan con el teclado** (Tab para llegar, Enter o Espacio para plegar) y los lectores de pantalla anuncian si el grupo está abierto o cerrado, sin necesidad de código extra.
- Se les dio altura suficiente para tocarlas cómodamente con el dedo: el texto solo mide 14 puntos de alto, lo que se queda corto en un móvil, así que la zona pulsable se amplió a 32.
- Con la opción del sistema de "reducir movimiento" activada, la flecha cambia de golpe en vez de girar.
- El panel de contraseña **no es alcanzable sin haber iniciado sesión**: queda dentro de la zona que el candado bloquea, igual que el resto del hub.

## Nada más cambió

Las 5 apps no se tocaron. Tampoco el inicio de sesión, ni los datos, ni el diseño de las fichas.
