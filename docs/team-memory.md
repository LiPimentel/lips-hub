# Memoria compartida del equipo de agentes

Este archivo lo leen y actualizan los 5 agentes de revisión del proyecto (business-analyst, qa-lead, security-reviewer, accessibility-reviewer, release-manager). El objetivo: que lo que un agente descubre no se quede encerrado en su propio archivo (`docs/{app-id}/qa-checklist.md`, `docs/security-notes.md`, etc.) sino que los demás lo vean también.

**Cómo usarlo (para cada agente):**
- Al empezar tu revisión, lee este archivo antes que tu propio archivo de notas — así sabes si otro agente ya encontró algo relevante para lo que vas a revisar.
- Al terminar, si encontraste algo que otro agente debería saber (no solo algo de tu propia especialidad), agrega una entrada corta en "Hallazgos recientes" con fecha, tu rol, y una línea de qué es y por qué importa a los demás. No dupliques aquí el detalle completo — eso vive en tu propio archivo; aquí solo el resumen y el puntero.
- Si un hallazgo tuyo ya no aplica (se corrigió, se descartó), muévelo a "Histórico" en vez de borrarlo.

## Hechos que todo el equipo debe conocer

- `auth-gate.js` y `supabase-client.js`/`supabase-client-app.js` son compartidos por las 5 apps + el hub — un cambio ahí puede afectar a cualquiera, no solo a la app donde se hizo el cambio.
- El hub (`index.html`) usa un login propio, deliberadamente distinto al de las 5 apps (sin escena decorativa, sin widget de cuenta) — nunca debe tratarse como "una app más" al revisar login.
- Este proyecto ya tuvo un incidente real de dos hilos de Claude Code editando la misma carpeta a la vez sin worktrees, causando que trabajo sin commitear se sobreescribiera silenciosamente (2026-07-23). Si algo revisado no coincide con lo que se esperaba encontrar, considerar esto como causa antes de asumir que es un bug de la app.
- Supabase está en plan gratuito con auto-pausa por inactividad — ver `docs/infra-watch.md` (release-manager) para el estado más reciente.

## Hallazgos recientes

_(vacío por ahora — el primer agente que encuentre algo relevante para los demás lo agrega aquí)_

## Histórico

_(hallazgos que ya no aplican se mueven aquí, no se borran)_
