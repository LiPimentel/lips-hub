# Notas de versión — 27 de julio de 2026

**Estado:** en la rama `claude/bitacora-meta-viewport`, aún no publicado a producción.

## Bitácora del Mentor — la app se veía diminuta en el teléfono

Si abrías Bitácora del Mentor desde el móvil, todo salía **muy pequeño**: el texto, los botones, los campos para escribir. Había que hacer zoom con los dedos para poder usarla. En las otras cuatro apps y en el hub no pasaba.

### Por qué

A las páginas web hay que decirles explícitamente *"adáptate al ancho del teléfono"*. Es una línea que se pone una sola vez, y **Bitácora del Mentor era la única de las seis páginas que no la tenía** (se comprobó una por una).

Sin esa línea, el teléfono no se anuncia como teléfono: finge ser una pantalla de escritorio de 981 puntos de ancho y luego encoge la página entera para que quepa. Resultado medido: en un móvil de 375 puntos, **el contenido se veía al 38 % de su tamaño**.

### Qué más arrastraba

El problema no era solo el tamaño. La app tenía dos ajustes preparados para pantallas chicas, y **ninguno llegaba a activarse nunca en un teléfono real**, porque la página se creía de 981 puntos:

- Un ajuste para pantallas de menos de 420 puntos.
- Otro para pantallas de menos de 720 puntos.
- Y un tercero, en la pantalla de inicio de sesión compartida, que oculta la cordillera decorativa del fondo cuando no hay ancho suficiente.

Los tres estaban escritos y funcionando bien; simplemente nunca se cumplía la condición para que entraran. Con esta corrección los tres vuelven a hacer su trabajo.

### Cómo se comprobó

Se cargaron las dos versiones —la de antes y la corregida— en un teléfono simulado de 375×812 y se midió:

| | Antes | Después |
|---|---|---|
| Ancho que reporta la página | 981 | 375 |
| Escala del contenido | 38 % | 100 % |
| Los tres ajustes de pantalla chica | Inactivos | Activos |
| Barra de desplazamiento horizontal | — | Ninguna |

### Una aclaración

En el reporte inicial se dijo que la cordillera del fondo **se solapaba** con la tarjeta de inicio de sesión. Al medirlo resultó **falso**: no se solapan. Ese problema existió, pero ya se había corregido antes por otra vía (limitando el ancho de la escena). Lo que sí seguía roto era el tamaño general de la app, que es lo que corrige esta nota.

## Nada más cambió

Es una sola línea añadida. No se tocó ninguna funcionalidad, ni los datos, ni el inicio de sesión, ni ninguna de las otras apps.
