# LIPS-HUB

Hub personal con 5 apps HTML independientes (`index.html` + `bitacora-mentor.html`, `StaffGate.html`, `lpbag.html`, `mytravel-pro-v4.html`, `generador_gantt_2.html`), sincronizadas con Supabase.

## Revisión obligatoria antes de cada PR (regla principal)

Esta regla aplica **siempre y en todo lugar**: en cualquier hilo, en la terminal local, en claude.ai/code, o en cualquier computadora. El usuario no debe tener que pedirlo cada vez — es automático.

**Antes de abrir un PR o de fusionar a `master`, el tech lead (la sesión principal de Claude) debe correr los agentes que apliquen al cambio, mediante la herramienta Agent, contra el diff real — no describirles el cambio, sino dejar que lo verifiquen ellos mismos:**

| Agente | Cuándo correrlo |
|---|---|
| `qa-lead` | **Siempre**, en todo cambio de código. |
| `security-reviewer` | **Siempre**, en todo cambio de código. |
| `accessibility-reviewer` | Cuando el cambio agregue o modifique animaciones, controles de interfaz, o combinaciones de color/texto visibles. |
| `release-manager` | Antes de fusionar a `master`, y al menos una vez por sesión para vigilar el riesgo de auto-pausa de Supabase (plan gratuito). |
| `business-analyst` | Después de un cambio funcional ya estabilizado en una app (ver "Documentación de usuario"). |

Reglas de este proceso:
- Reportar al usuario el veredicto de cada agente (APROBADO / APROBADO CON OBSERVACIONES / RECHAZADO) — no actuar sobre ellos en silencio.
- Si alguno responde **RECHAZADO**, corregir y volver a correrlo antes de continuar. No pedirle al usuario que acepte un cambio rechazado.
- Excepción única: cambios que no tocan código de las apps (por ejemplo, solo notas de versión o documentación) no requieren correr QA ni seguridad.
- Si un agente no está disponible como `subagent_type` en la sesión actual, correr `general-purpose` pegando el contenido de `.claude/agents/{nombre}.md` en el prompt — el rol se cumple igual, no se omite.

## Dónde vive producción (importante)

**Producción es Cloudflare Workers: https://lips-hub.lissette2402.workers.dev** (desde el 26/07/2026). Netlify **ya no es la referencia**: sigue conectado al repo unos días como respaldo, así que se actualiza en paralelo, pero se va a apagar — no verificar nada contra `*.netlify.app` ni mandar al usuario ahí.

Cada fusión a `master` dispara la construcción y publicación automática. La configuración vive en `wrangler.toml`; las cuentas nuevas de Cloudflare ya no ofrecen crear proyectos de Pages, solo Workers.

## Qué se publica en el sitio (importante)

El sitio **no** publica la raíz del repo: publica lo que `build.sh` copia a `dist/` (las 6 páginas HTML, los 3 JS compartidos, `_headers`, y `assets/` si existe). `docs/`, `release-notes/` y `.claude/` quedan fuera a propósito — son memoria de trabajo, no contenido público.

Consecuencia práctica: **cualquier archivo nuevo que el sitio necesite hay que agregarlo a `build.sh`**, o funcionará en local y no en producción. Imágenes y CSS propios van en `assets/`, que ya se copia solo. Ver `docs/hosting-cloudflare-pages.md`.

## Notas de versión (obligatorio)

Cada vez que se haga un cambio en el código de este proyecto, generar una nota de versión y guardarla en la carpeta `release-notes/` (en la raíz del proyecto), con nombre **`YYYY-MM-DD-{nombre-de-la-rama}.md`** — por ejemplo `2026-07-26-login-glow-y-preferencia-en-vivo.md`. Si la rama lleva prefijo (`claude/`, `feature/`), usar solo la parte final; si el nombre queda larguísimo, acortarlo a las 3-5 palabras que lo identifiquen.

**Por qué por rama y no por número:** la convención anterior era `YYYY-MM-DD.md` más `-2`, `-3`, etc. para el mismo día, y **falla cuando hay varios hilos trabajando en paralelo**, que es lo normal en este proyecto. Dos ramas eligen el mismo número sin verse (cada una mira solo los archivos de su propio checkout, que no incluye lo que la otra aún no ha fusionado), y el resultado es un conflicto *add/add* en GitHub: dos archivos distintos creados en la misma ruta, que Git no puede fusionar solo y que **bloquea el merge del PR** aunque el código no tenga ningún conflicto. Pasó tres veces en tres días (una de ellas dejó el PR #21 bloqueado). El nombre de la rama no colisiona nunca, porque dos hilos nunca comparten rama.

Consecuencia práctica: si un PR se queda bloqueado por conflicto en un archivo de `release-notes/`, **no hay que resolver el texto** — se renombra la nota propia y el conflicto desaparece.

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

## Casos borde (obligatorio)

Los 5 agentes (no solo business-analyst) tienen instrucción de anotar cualquier caso borde que encuentren en `docs/{app-id}/requerimientos.md`, sección "Casos borde" — es una lista compartida, no exclusiva de un agente. El tech lead es responsable de revisar esa sección en cada app tocada antes de darla por cerrada: cada caso borde debe quedar en uno de tres estados — implementado, descartado explícitamente con el usuario (con la razón anotada), o pendiente y comunicado al usuario como tal. Un caso borde que nadie revisó no cuenta como "cubierto" solo porque quedó escrito en un archivo.

## Postura de QA (obligatorio)

qa-lead no es un trámite de confirmación — su objetivo es retar activamente lo que el tech lead dice haber hecho, no solo verificar una lista de puntos. Cuando qa-lead reporte un hallazgo que contradice lo que el tech lead esperaba encontrar, tratar esa discrepancia como la señal más importante del reporte, no como ruido a descartar — investigarla antes de continuar, no asumir que el tech lead tenía razón.

## Eficiencia de contexto y tokens (obligatorio)

Aplica siempre, sin que el usuario lo pida:

1. **Explorar con subagentes, implementar en el hilo principal.** Para entender un módulo, buscar dependencias o mapear un flujo, usa un subagente (`Explore` o `general-purpose`) y quédate con su conclusión. En el hilo principal lee solo los archivos que vas a editar. Si la tarea es una edición puntual y ya sabes dónde, no explores.
2. **Alcance acotado por defecto.** Interpreta cada petición en su mínima extensión razonable. Solo abarca un módulo o el proyecto completo si el usuario dice "todo el módulo" / "todo el proyecto". Si el alcance es ambiguo, **pregunta antes de leer o tocar archivos** — no explores "por si acaso".
3. **Avisa al ~60% de contexto** sugiriendo `/compact`. No esperes a que se llene.
4. **Sugiere `/clear`** cuando la sesión lleve muchos turnos o cuando se cambie de tema o de funcionalidad.
5. **Este archivo, lo más corto posible.** Solo lo que cambia tu comportamiento: convenciones, decisiones de arquitectura, errores que no se deben repetir. Si crece con información redundante u obsoleta, dilo.
6. **No arranques tareas complejas multiarchivo en el último 20% del contexto** (refactors grandes, depuración profunda, migraciones de datos). Avisa antes de llegar ahí para hacer `/compact` o partir la tarea.

## Tamaño de los PRs (obligatorio)

Preferir PRs pequeños y frecuentes sobre uno grande acumulado al final de una sesión larga. Cuando un bloque de trabajo quede completo y verificado (un bug corregido, una funcionalidad, un fix de seguridad), empujar la rama y abrir/fusionar ese PR antes de seguir con el siguiente bloque — no esperar hasta el final de la sesión para juntar todo en un solo PR. Un PR de un solo tema es más fácil de revisar y de revertir si algo sale mal que uno que mezcla varios cambios no relacionados.
