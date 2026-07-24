# Memoria compartida del equipo de agentes

Este archivo lo leen y actualizan los 5 agentes de revisión del proyecto (business-analyst, qa-lead, security-reviewer, accessibility-reviewer, release-manager). El objetivo: que lo que un agente descubre no se quede encerrado en su propio archivo (`docs/{app-id}/qa-checklist.md`, `docs/security-notes.md`, etc.) sino que los demás lo vean también.

**Cómo usarlo (para cada agente):**
- Al empezar tu revisión, lee este archivo antes que tu propio archivo de notas — así sabes si otro agente ya encontró algo relevante para lo que vas a revisar.
- Al terminar, si encontraste algo que otro agente debería saber (no solo algo de tu propia especialidad), agrega una entrada corta en "Hallazgos recientes" con fecha, tu rol, y una línea de qué es y por qué importa a los demás. No dupliques aquí el detalle completo — eso vive en tu propio archivo; aquí solo el resumen y el puntero.
- Si un hallazgo tuyo ya no aplica (se corrigió, se descartó), muévelo a "Histórico" en vez de borrarlo.
- Si algo requiere atención urgente del tech lead o del usuario (no puede esperar al próximo ciclo normal — ej. un riesgo de seguridad real, o el proyecto de Supabase a punto de pausarse), ponlo en "⚠️ Requiere atención" en vez de "Hallazgos recientes". El tech lead revisa esa sección primero, siempre.

## ⚠️ Requiere atención

- **2026-07-23 (tech lead, en nombre de business-analyst):** al documentar MyTravel Agent Pro, el agente encontró una **sesión real ya autenticada** en la pestaña de producción (Netlify). No guardó ni modificó nada con ella (evitó crear datos de prueba o cerrar sesión), pero cualquier agente que navegue a la URL de producción durante una revisión debe asumir que puede haber una sesión real activa y evitar escribir/borrar datos con ella salvo que el tech lead lo autorice explícitamente para esa tarea.

## Hechos que todo el equipo debe conocer

- `auth-gate.js` y `supabase-client.js`/`supabase-client-app.js` son compartidos por las 5 apps + el hub — un cambio ahí puede afectar a cualquiera, no solo a la app donde se hizo el cambio.
- El hub (`index.html`) usa un login propio, deliberadamente distinto al de las 5 apps (sin escena decorativa, sin widget de cuenta) — nunca debe tratarse como "una app más" al revisar login.
- Este proyecto ya tuvo un incidente real de dos hilos de Claude Code editando la misma carpeta a la vez sin worktrees, causando que trabajo sin commitear se sobreescribiera silenciosamente (2026-07-23). Si algo revisado no coincide con lo que se esperaba encontrar, considerar esto como causa antes de asumir que es un bug de la app.
- Supabase está en plan gratuito con auto-pausa por inactividad — ver `docs/infra-watch.md` (release-manager) para el estado más reciente.
- **Limitación de herramientas confirmada varias veces esta semana (business-analyst, en bitacora-mentor/staffgate/gantt/mytravel):** el navegador de prueba de esta sesión no tiene forma de guardar capturas de pantalla como archivo `.png` en disco — la herramienta de screenshot solo devuelve la imagen en el chat. Además, en al menos dos apps (`generador_gantt_2.html`, `mytravel-pro-v4.html`) la interactividad real (clics, tecleo) dejó de registrarse después de la carga inicial dentro de la misma sesión de revisión, sin causa clara. Cualquier agente que dependa de verificación visual en vivo debe esperar esto y documentarlo explícitamente en vez de asumir que es un bug de la app bajo revisión.

## Hallazgos recientes

- **2026-07-23 (tech lead, en nombre de business-analyst):** StaffGate y MyTravel comparten el mismo patrón de riesgo: si un usuario nuevo inicia sesión en una cuenta sin fila propia todavía en Supabase, la app recurre a lo que haya en `localStorage` (y, si está conectada, la carpeta de respaldo local) — que puede pertenecer a otra persona que usó el mismo equipo. Ninguno de los dos mecanismos de respaldo local está vinculado al usuario de Supabase. Vale la pena que `security-reviewer` lo evalúe como patrón compartido (posiblemente también presente en `lpbag.html` y `bitacora-mentor.html`, pendiente de confirmar), no como hallazgo aislado por app. Detalle completo en `docs/staffgate/requerimientos.md` y `docs/mytravel/requerimientos.md`.

## Histórico

_(hallazgos que ya no aplican se mueven aquí, no se borran)_
