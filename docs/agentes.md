# Catálogo de agentes — LIPS-HUB

Referencia rápida de los 5 agentes de revisión del proyecto (definidos en [`.claude/agents/`](../.claude/agents)). Todos son invocados por el tech lead (la sesión principal de Claude) vía la herramienta `Agent` — no se disparan solos, pero **tampoco hay que pedirlo cada vez**: `CLAUDE.md` obliga a correrlos automáticamente antes de cada PR o merge (ver la tabla de la sección "Revisión obligatoria" ahí).

Los 5 comparten la misma columna vertebral, y vale tenerla presente al leer cualquiera de ellos:
- **Solo revisan, no arreglan.** Ninguno toca código de las apps; su única escritura es en sus propios archivos de seguimiento en `docs/`.
- **Postura adversarial, no de trámite.** Verifican contra la app/repo real (navegador, `git`, `grep`), no confían en la descripción que les da el tech lead.
- **Nunca adivinan.** Si algo no se pudo verificar, lo dicen explícitamente en vez de asumir que está bien.
- **Casos borde van a un lugar común.** Cualquiera de los 5 que encuentre un caso borde lo anota en `docs/{app-id}/requerimientos.md` → sección "Casos borde", no solo en su propio reporte.
- **Memoria de equipo.** Todos leen `docs/team-memory.md` al empezar y anotan ahí lo que los otros 4 deban saber (ver [[project_lips_hub]] para el porqué de este mecanismo).
- **Estándares compartidos.** Todos consultan (nunca editan) los repos hermanos `../quality-standards` y `../security-standards`, y proponen filas nuevas en el texto de su reporte para que el tech lead las consolide.
- **Veredicto estándar:** `APROBADO` / `APROBADO CON OBSERVACIONES` / `RECHAZADO`, en español, con evidencia concreta (no impresiones).

## Resumen

| Agente | Cuándo se dispara | Qué NO hace | Su archivo propio |
|---|---|---|---|
| [`qa-lead`](#qa-lead) | Siempre, antes de todo PR/merge | No implementa fixes | `docs/{app-id}/qa-checklist.md` |
| [`security-reviewer`](#security-reviewer) | Siempre, antes de todo PR/merge | No corrige código, no ve el dashboard real de Supabase/GitHub/Netlify | `docs/security-notes.md` |
| [`accessibility-reviewer`](#accessibility-reviewer) | Cambios con animación, controles nuevos o color/texto visible nuevo | No prueba con lector de pantalla real (no disponible en el entorno) | `docs/{app-id}/accessibility-notes.md` |
| [`release-manager`](#release-manager) | Antes de fusionar a `master`, y al menos 1×/sesión por riesgo de infra | No cambia configuración de Netlify/Supabase, solo reporta | `docs/release-log.md`, `docs/infra-watch.md` |
| [`business-analyst`](#business-analyst) | Después de estabilizar un cambio funcional en una app | No resuelve los casos borde que encuentra, solo los documenta | `docs/{app-id}/requerimientos.md`, `docs/{app-id}/entrenamiento.md` |

## Detalle por agente

### `qa-lead`
- **Propósito:** último filtro antes de producción. Confirma que lo implementado responde a lo pedido, que nada que ya funcionaba se rompió (propio de la app o de otra que comparta `auth-gate.js`/`supabase-client.js`), y da un go/no-go de calidad.
- **Cómo trabaja:** maneja el navegador de verdad (no lee código y asume) — carga la app, hace clic, revisa consola/red, prueba viewport móvil (~375×812), cuenta nodos DOM si hubo generación dinámica grande, y hace ida y vuelta de datos reales si hay credenciales de prueba.
- **Postura declarada:** activamente adversarial — trata cada afirmación del tech lead ("esto ya funciona", "esto quedó vacío") como no verificada hasta comprobarla ella misma. Cuando lo que encuentra contradice lo que se esperaba, esa discrepancia *es* el hallazgo principal (ver regla "Postura de QA" en `CLAUDE.md`).
- **Herramientas:** Read, Grep, Glob, Bash, Write, Edit + suite completa del navegador (incluye `javascript_tool` y `read_network_requests`, que ningún otro agente tiene).

### `security-reviewer`
- **Propósito:** revisa cada cambio que toque autenticación, RLS de Supabase, secretos, contenido generado por el usuario que se inserta en el DOM, o integraciones de terceros/CDN.
- **Checklist fija:** aislamiento de datos (RLS + filtro `user_id` del lado del cliente), higiene de secretos (grep de patrones tipo `service_role`, claves privadas), integridad del auth-gate (sin fail-open), XSS (todo texto de usuario debe pasar por el helper de escape de cada app), inyección/`eval`, reusabilidad de la lógica de seguridad compartida, higiene de CDN (HTTPS, versión fijada), y un escaneo del **historial** de git por secretos ya removidos del working tree.
- **Puntos ciegos que declara explícitamente:** no puede inspeccionar el dashboard real de RLS de Supabase ni la seguridad a nivel de cuenta (2FA de GitHub, exposición de env vars en logs de build de Netlify) — recomienda que el usuario los revise periódicamente.
- **Herramientas:** solo Read, Grep, Glob, Bash, Write, Edit — sin navegador (es una revisión de código, no de interacción en vivo).

### `accessibility-reviewer`
- **Por qué existe:** rol creado el 2026-07-21 después de que varias rondas de animaciones de login se lanzaran sin soporte de `prefers-reduced-motion` y sin ninguna revisión de accesibilidad.
- **Checklist fija:** reducción de movimiento en cada animación CSS no trivial, contraste de color (WCAG 4.5:1 texto normal / 3:1 texto grande o íconos), navegabilidad real por teclado (Tab/Shift+Tab/Enter/Space, sin mouse — presta atención especial al overlay de login en shadow-DOM), y marcado amigable para lector de pantalla (labels, alt, texto discernible en botones).
- **Herramientas:** suite del navegador (sin `javascript_tool` ni `read_network_requests`, que solo tiene `qa-lead`).

### `release-manager`
- **Propósito:** cubre la brecha entre "el código está correcto" (trabajo de `qa-lead`) y "el deploy en vivo realmente funciona y la infraestructura de la que depende está sana".
- **Checklist de pre-merge:** el preview de Netlify carga de verdad (no solo se asume por el código), la rama está al día con `master` sin archivos sueltos, existe la nota de versión correspondiente, y si el PR toca esquema/RLS de Supabase confirma que `security-reviewer` ya lo revisó.
- **Vigilancia de infraestructura:** es el único agente que monitorea el riesgo de auto-pausa de Supabase por inactividad (plan gratuito) y otros límites de free-tier (minutos de build de Netlify, cuotas de Supabase). Si detecta que se está cerca de un límite, debe reportarlo con el formato de alerta roja que usa este proyecto para todo lo que implique pago o urgencia — y, por la regla de créditos de Netlify (ver `CLAUDE.md`, "Tamaño de los PRs"), es quien confirma cuántos deploys de producción van en el ciclo antes de recomendar fusionar.
- **Herramientas:** navegador + Read/Grep/Glob/Bash/Write/Edit, sin `find`/`javascript_tool` (no necesita interactuar tan a fondo con la UI, solo confirmar que carga).

### `business-analyst`
- **Propósito:** dado un app específica, documenta cómo funciona de verdad de punta a punta — no a partir de suposiciones, sino leyendo el código y manejando la app en vivo.
- **Entregables por app** (bajo `docs/{app-id}/`):
  1. `requerimientos.md` — propósito, requerimientos funcionales numerados, un diagrama Mermaid del flujo real, y la sección compartida "Casos borde".
  2. `entrenamiento.md` — instrucciones paso a paso para el usuario final no técnico, con capturas de pantalla reales (no mockups) guardadas en `docs/{app-id}/capturas/`.
- **Cuándo se dispara:** después de que una funcionalidad ya está construida y estable (no a mitad de la implementación) — ver regla "Documentación de usuario" en `CLAUDE.md`.
- **Al terminar:** reporta al tech lead qué app documentó, dónde quedaron los archivos, la lista de casos borde encontrados (pendientes de decisión), y recuerda que la nota de versión la escribe el tech lead, no ella.
- **Herramientas:** navegador + Read/Grep/Glob/Write/Edit/Bash (sin `read_console_messages`, ya que no depurar errores es su función).

## Sobre portabilidad a otros proyectos

Estos 5 agentes están escritos a la medida de LIPS-HUB (nombran archivos, rutas de `docs/`, el repo y el sitio de Netlify puntuales). Convertirlos en un plugin reusable de Claude Code implicaría generalizar cada uno para que reciba el contexto específico del proyecto desde el `CLAUDE.md` de turno en vez de traerlo escrito adentro — es una reescritura, no un copiar-pegar. Vale la pena hacerlo el día que haya un segundo proyecto que necesite estos mismos roles; por ahora quedan como agentes de proyecto.

---
*Generado 2026-09-02. Si cambia el rol, herramientas o checklist de un agente, actualizar este archivo junto con el `.md` correspondiente en `.claude/agents/`.*
