# LIPS-HUB

Hub personal con 5 apps HTML independientes (`index.html` + `bitacora-mentor.html`, `StaffGate.html`, `lpbag.html`, `mytravel-pro-v4.html`, `generador_gantt_2.html`), sincronizadas con Supabase.

## Notas de versión (obligatorio)

Cada vez que se haga un cambio en el código de este proyecto, generar una nota de versión y guardarla en la carpeta `release-notes/` (en la raíz del proyecto), con nombre `YYYY-MM-DD.md` (usar `YYYY-MM-DD-2.md`, `-3.md`, etc. si ya hay una nota ese mismo día).

Cada nota debe estar en español, dirigida a una persona no técnica, e incluir:
- Fecha
- Qué cambió, agrupado por app afectada
- Si se publicó a producción o solo quedó en una rama/vista previa

No es necesario preguntar antes de crear la nota — es un paso automático de cada cambio.

## Documentación de usuario (obligatorio)

Cada vez que se haga un cambio funcional en una app (cómo funciona, qué hace, sus pantallas o su flujo de uso — no aplica a ajustes puramente cosméticos del fondo de login, que es compartido y decorativo), correr el agente `business-analyst` sobre esa app para actualizar `docs/{app-id}/requerimientos.md` y `docs/{app-id}/entrenamiento.md`.

No es necesario preguntar antes de correrlo — es un paso automático de cada cambio funcional, igual que la nota de versión.
