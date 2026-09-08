# Nutri Log — Requerimientos

> Este archivo lo puede completar cualquiera de los 5 agentes de revisión (no solo
> `business-analyst`), con la sección "Casos borde" en particular compartida entre
> los 5. Creado por `security-reviewer` el 2026-09-08 al revisar la rama
> `claude/nutri-log-app` (app nueva) porque no existía todavía. **Falta el
> Propósito, los requerimientos funcionales (RF-01 a RF-43 según referencia el
> propio código) y el diagrama de flujo** — eso le corresponde a `business-analyst`
> cuando corra sobre esta app (ver regla de "Documentación de usuario" en
> `CLAUDE.md`); esta sección solo trae lo que salió de la revisión de seguridad.

## Casos borde

Estado de cada uno: **pendiente** (no implementado, no descartado, hay que decidir con la usuaria), **descartado** (con razón) o **implementado**.

1. **[pendiente] CSV injection de baja severidad en la exportación de historial.** `exportLogsCsv()` (`nutri-log.html:1613-1627`) escapa comillas dobles correctamente para la estructura del CSV, pero no antepone protección a celdas cuyo contenido empiece con `=`, `+`, `-` o `@`. El único campo de texto libre que llega al CSV es el nombre de receta editado a mano por la usuaria (fecha/hora/tipo son generados por la app). Si ese nombre empezara con uno de esos caracteres, Excel/Sheets podría interpretarlo como fórmula al abrir el archivo. Severidad baja porque la usuaria exporta y abre sus propios datos, no hay flujo de compartir el CSV con terceros. Mitigación conocida si se retoma: anteponer `'` (apóstrofe) a cualquier celda que empiece con esos 4 caracteres antes de armar el CSV. Ver `docs/security-notes.md`, revisión 2026-09-08, punto 4.

2. **[pendiente] El campo "Nota" del registro de consumo se guarda pero nunca se vuelve a mostrar.** `ui.logNote` se captura en la pantalla "Registrar consumo" (`nutri-log.html:1110`) y se guarda en `entry.note`/`l.note` (`:1136`), pero ninguna pantalla lo vuelve a mostrar: la tabla de historial de Análisis (`:1511-1517`) no tiene columna de nota, y no existe ninguna pantalla de "ver/editar registro" pese a que el texto traducido `T.log.edit` = "Editar registro" ya existe sin una función que lo use (`l.edited` se declara en `false` al crear el registro pero ningún camino de código lo pone en `true`, solo existe borrado vía `data-nl-log-delete`). No es un hallazgo de seguridad — el valor nunca se interpola en HTML, así que hoy no hay riesgo de XSS por este campo — pero es una discrepancia funcional real: la usuaria escribe algo pensando que queda accesible y hoy es de solo escritura. Se recomienda decidir con la usuaria si se agrega una vista de detalle del registro (que además le daría uso real al texto "Editar registro" que ya existe) o si se retira el campo. Ver `docs/security-notes.md`, revisión 2026-09-08, punto 1.

3. **[pendiente, defensa en profundidad] Ids en atributos `data-nl-*` sin `esc()` de refuerzo.** Todo id interpolado directo en un atributo (`data-nl-recipe-open="${r.id}"`, `data-nl-log-with="${recipe.id}"`, `data-nl-tpl-cell="${d}|${c.id}"`, etc.) depende de que `uid()` (`nutri-log.html:357`, alfanumérico puro vía `toString(36)`) sea la única fuente de esos ids en todo el código, lo cual es cierto hoy (verificado por lectura completa) pero no está reforzado con `esc()` en el punto de interpolación. No es explotable con el código actual — no hay ningún camino de UI donde un id derive de texto libre de la usuaria, y tampoco hay función de "importar copia"/restaurar un JSON externo en esta app (a diferencia de `bitacora-mentor.html`, que sí la tiene y por eso tuvo un hallazgo real de ese tipo). Solo quedaría expuesto si la propia cuenta editara su fila de `app_data` por fuera de la UI (vía API/devtools con su propia sesión) — auto-XSS de un solo usuario contra sí mismo, sin cruce de cuentas. Se sugiere envolver los ids en `esc()` la próxima vez que se toque este bloque, sin bloquear el envío actual por esto. Ver `docs/security-notes.md`, revisión 2026-09-08, punto 2.

## Límites conocidos de la revisión de seguridad (2026-09-08)

- No se pudo inspeccionar el dashboard de Supabase para confirmar que la política RLS `auth.uid() = user_id` está realmente activa sobre las filas `app_id='nutri-log'` de `app_data` (mismo límite ya documentado para el resto del hub en `docs/security-notes.md`).
- No se probó en vivo con navegador real en esta sesión (revisión basada en lectura completa del código con semántica de JS confirmada, no en ejecución) — se recomienda que `qa-lead` cubra la ejecución real como complemento antes de fusionar.
