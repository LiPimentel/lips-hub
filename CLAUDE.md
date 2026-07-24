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

## Memoria compartida de agentes (obligatorio)

Este proyecto usa 5 agentes de revisión (business-analyst, qa-lead, security-reviewer, accessibility-reviewer, release-manager) que comparten hallazgos entre sí vía `docs/team-memory.md`. Cada agente tiene instrucción de escribir ahí lo relevante al terminar, pero el tech lead (la sesión principal de Claude, en cualquier hilo) es el respaldo: después de que CUALQUIER agente termine su tarea, antes de continuar, confirma que un hallazgo importante para los demás quedó realmente anotado en `docs/team-memory.md` — y si no, agrégalo tú mismo con una línea corta. No depender solo de que el agente se acuerde de hacerlo.

**Archivo del resultado completo de cada agente (obligatorio):** además de lo anterior, guarda el texto completo del resultado de CADA subagente que corras (no solo los 5 de revisión, cualquiera) en `.claude/agent-runs/{YYYY-MM-DD}_{HHmm}_{nombre-del-agente}.md` (crear la carpeta si no existe; está en `.gitignore`, es memoria de trabajo local, no contenido del repo). Esto es lo más parecido a un "transcript" que se puede guardar aquí — no hay forma de capturar la conversación completa, pero el resultado del agente sí, y como `CLAUDE.md` lo lee cualquier hilo que abra esta carpeta, esto se acumula igual sin importar qué hilo corrió el agente. El pase semanal de "dreaming" (`lips-hub-team-memory-dreaming`, programado) usa esta carpeta como su entrada real, no solo los archivos ya destilados en `docs/`.
