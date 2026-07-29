# Hourglass — resumen del PRD para implementación

Destilado de `PRD_TimeTracker_LipsHub_1.docx` (v1.0, 29/07/2026). Nombre y eslogan ya decididos por la usuaria (**Hourglass** / *your time slice*) — el PRD proponía "TimeTracker" y una lista de nombres alternativos; se descartan todos a favor de la decisión ya tomada. Este archivo sustituye al .docx: no hace falta volver a abrirlo.

## 1. Qué es y para quién

Hourglass es el módulo de seguimiento de tiempo personal de Lissette dentro de LIPS-HUB. Permite registrar en qué se le va el tiempo real entre 2 trabajos y medio, 5 actividades de voluntariado y proyectos personales, de forma manual o con un cronómetro en vivo, y muestra un panel que avisa en rojo cuando un día o semana se sobrecarga — considerando que dormir y comer también ocupan horas del día. Es de un solo usuario (Lissette), igual que el resto del hub.

## 2. Modelo de datos propuesto

Como las otras 5 apps, todo vive en **una sola fila** de `app_data` (`user_id` + `app_id='hourglass'` + `data jsonb`). El PRD describe un modelo relacional (User/Section/Project/TimeEntry/FixedBlock/Goal/OverloadFlag) que hay que aplanar a un único JSON:

```json
{
  "version": 1,
  "settings": {
    "timezone": "America/Santo_Domingo",
    "sleepHoursDefault": 7,
    "mealHoursDefault": 3,
    "staleTrackerAlertHours": 6
  },
  "projects": [
    { "id": "p1", "sectionId": "trabajo", "nombre": "Har-Per SRL", "color": "#4E8B8B",
      "estado": "activo", "metaHorasSemanales": 40 }
  ],
  "entries": [
    { "id": "e1", "projectId": "p1", "origen": "tracker",
      "inicio": "2026-07-29T13:00:00.000Z", "fin": "2026-07-29T15:00:00.000Z",
      "duracionMin": 120, "nota": "", "editado": false }
  ],
  "activeTrackers": [
    { "id": "t1", "projectId": "p2", "startedAt": "2026-07-29T18:00:00.000Z",
      "pausedIntervals": [ { "from": "...", "to": "..." } ], "nota": "" }
  ],
  "fixedBlockOverrides": [
    { "fecha": "2026-07-29", "tipo": "sueno", "horas": 6 }
  ]
}
```

Notas de diseño:
- `sectionId` es uno de 3 valores fijos (`trabajo` / `voluntariado` / `personal`); las secciones no son datos editables, viven como constante en el código, no en el JSON.
- Los "Bloques Fijos" (sueño/comida) no son proyectos ni entries — son los `settings.*Default` más `fixedBlockOverrides` puntuales.
- `activeTrackers` es la lista de cronómetros corriendo/pausados; al hacer stop, se convierte en un `entry` con `duracionMin` ya descontando las pausas. Permite varios trackers en paralelo (RF-06).
- `OverloadFlag` del PRD (sección 13) es **calculado, no editable** — se recomienda **no guardarlo**, calcularlo al vuelo desde `entries` cada vez que se abre el dashboard (igual patrón que las otras apps: todo el cálculo vive en el navegador, no hay backend).
- `logEdiciones` (trazabilidad de ediciones, PRD §10.5) es explícitamente Fase 2 — no está en el modelo de arriba a propósito.

## 3. Pantallas/vistas

1. **Login** — candado estándar del hub (`auth-gate.js`) con escena decorativa temática propia (relojes de arena, reloj de manecillas, Gato de Cheshire).
2. **Dashboard principal** — por sección (Trabajo/Voluntariado/Personal/Bloques Fijos), selector de rango (día/semana/mes/personalizado), indicador de sobrecarga (verde/amarillo/rojo), totales en 3 niveles (general, sección, proyecto).
3. **Detalle de sección** — desglose por proyecto/actividad dentro de una sección.
4. **Gestión de proyectos (CRUD)** — crear/editar/archivar/eliminar proyectos dentro de las 3 secciones fijas; color, meta de horas (opcional).
5. **Registro manual de tiempo** — formulario: proyecto, fecha, hora inicio/fin o duración directa, nota opcional.
6. **Panel de trackers en vivo** — start/pause/resume/stop, con varios trackers visibles y corriendo a la vez.
7. **Historial de registros** — lista editable/eliminable de entries pasados (sin log de auditoría en v1, ver §4).

Ninguna de estas pantallas existe todavía — no hay app corriendo que documentar por ahora; este resumen es la base para construirla, no una verificación de comportamiento real (a diferencia de los demás `docs/{app-id}/requerimientos.md` del hub, que si describen una app ya viva).

## 4. Funcionalidad

**Imprescindible para v1 (MVP, según PRD §4.1, §15 y criterios de aceptación §16):**
- Registro manual y en vivo (start/pause/resume/stop), varios trackers en paralelo.
- 3 secciones fijas + Bloques Fijos (sueño/comida) con valores por defecto configurables (7h/3h).
- CRUD de proyectos dentro de cada sección, con color y meta de horas semanales opcional (RF-02, ver caso de contradicción en §6).
- Editar/eliminar cualquier entry ya guardado (RF-08), sin necesidad de log de auditoría.
- Cálculo de tiempo disponible (24h − sueño − comida) y de sobrecarga usando **tiempo solapado real de reloj**, no la suma bruta por proyecto (PRD §8.2 — regla de negocio no negociable).
- Dashboard con vistas día/semana/mes y alerta roja de sobrecarga, señalando la sección que más contribuye.
- Alerta al abrir la app si hay un tracker activo de más de `staleTrackerAlertHours` (por defecto 6h).
- Login con escena animada temática (relojes de arena + reloj + gato), sin afectar tiempo de carga percibido.
- Acceso desde el panel de LIPS-HUB.

**Deseable (Fase 2 según PRD §10 y §15):**
- Metas por proyecto con comparación plan vs. real (si finalmente queda fuera de v1, ver §6).
- Alertas proactivas mientras aún se puede reaccionar (no solo mostrar después).
- Tiempo no contabilizado del día (visible como "libre real").
- Exportación de reportes (PDF/Excel).
- Log de ediciones con trazabilidad.
- Heatmap mensual de carga.
- Vista de balance/bienestar a mediano plazo.

**Explícitamente fuera de alcance (PRD §4.2, §15 Fase 3):**
- Multiusuario / colaboración entre personas.
- Integración automática con Google Calendar.
- Facturación o reportes para clientes.
- App móvil nativa (v1 es web responsive).

## 5. Encaje en LIPS-HUB

Basado en `CLAUDE.md` y en `generador_gantt_2.html` (la app más simple del hub):

- **Un solo archivo HTML** en la raíz del repo (ej. `hourglass.html`), sin build ni framework — igual que las 5 apps actuales.
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` es obligatorio: `bitacora-mentor.html` es la única app del hub que lo omite hoy y eso le rompe el layout responsive en móvil real (`window.innerWidth` reporta 981px en vez de 375px — hallazgo de `qa-lead` en `docs/team-memory.md`, 2026-07-24). Hourglass debe incluirlo desde el primer commit.
- Bloque `<script>` de configuración antes de cargar los JS compartidos, con estas variables reales (siguiendo el patrón de Gantt):
  `window.AIAPPS_APP_ID = 'hourglass'`, `AIAPPS_SHOW_ACCOUNT_WIDGET = true`, `AIAPPS_APP_NAME`, `AIAPPS_APP_EMOJI` (ej. ⏳), `AIAPPS_APP_TAGLINE = 'your time slice'`, `AIAPPS_APP_ACCENT`, `AIAPPS_APP_BG`, `AIAPPS_APP_GLOW`, `AIAPPS_LOGIN_SCENE` (nombre nuevo de escena, ej. `'hourglass-time'`), `AIAPPS_LOGIN_LAYOUT`.
- Luego `<script src="./supabase-client-app.js"></script>` y `<script src="./auth-gate.js"></script>`, en ese orden.
- **`supabase-client-app.js` valida `AIAPPS_APP_ID` contra una lista cerrada** (`VALID_APP_IDS`, hoy `["mentor","staffgate","lpbag","mytravel","gantt"]`, línea 12). Hay que agregar `"hourglass"` ahí — sin ese cambio la app no arranca (el script corta con `console.error` y no crea `window.supabaseClient`). Esto es un archivo **compartido por las 5 apps**, así que tocarlo hay que hacerlo con cuidado.
- `auth-gate.js` también es compartido: la escena de login nueva (relojes de arena + Gato de Cheshire) se agrega ahí como un bloque más, siguiendo el patrón de las escenas existentes (`gantt-build`, `coins-rain`, `travel-sky`, etc.), incluyendo su propio bloque `@media (prefers-reduced-motion: reduce)` — el equipo ya dejó anotado que una escena nueva sin ese bloque queda invisible con esa preferencia activada (`docs/team-memory.md`, 2026-07-25).
- Patrón de persistencia `loadData`/`saveData` con caché local aislada por usuario: clave `scopedKey('hourglass_v1', userId)` → literalmente `` `hourglass_v1::${userId}` ``, más `syncToCloud()` con `upsert` a `app_data` (`onConflict: 'user_id,app_id'`) y un flag `cloudSyncReady` para no pisar la nube con un estado vacío antes de que termine de cargar — copiar el mismo patrón de `generador_gantt_2.html` líneas 350-444.
- **Puente de carpeta local** (`aiapps-folder-bridge`, el badge "📁 Guardando en carpeta local"): mismo bloque `<script>` que las otras 5 apps, con `APP_ID = "hourglass"` y `SYNC_PREFIX = "hourglass_v1"` para que reconozca las claves aisladas por usuario.
- **`index.html`**: agregar una tarjeta nueva al array `APPS` (grupo, tag, título, descripción, `href: "./hourglass.html"`, color, ícono SVG).
- **`build.sh`**: revisando el archivo real, `cp ./*.html dist/` y `cp ./*.js dist/` ya son comodines — un `hourglass.html` nuevo en la raíz se copiaría solo a `dist/` sin tocar `build.sh`. La única edición manual real de "build" es el array `APPS` de `index.html`; no hace falta editar `build.sh` a menos que se agreguen assets propios fuera de `assets/`.
- Sin backend propio: todo el cálculo (incluida la lógica de solapamiento de §8.2 del PRD) tiene que vivir en JavaScript del navegador — ver riesgo en §7, porque el PRD (§14) pide esa lógica "en backend".

## 6. Decisiones que el PRD deja abiertas

1. **Meta de horas por proyecto, ¿MVP o Fase 2?** RF-02 (§7.1, sin marca de fase) la pide como campo del proyecto en v1; la tabla de fases (§15) la reclasifica como Fase 2. Recomendación: incluirla en v1 solo como campo simple (número, sin la comparación visual plan-vs-real, que sí sería Fase 2) — es barata de agregar al modelo y evita rehacerlo después.
2. **Corte de "día" cuando un tracker cruza medianoche.** El PRD fija la zona horaria pero no dice cómo repartir una sesión que empieza el día 1 y termina el día 2 entre los totales diarios. Recomendación: partir la entry en el cálculo de totales (no en el dato guardado) asignando cada minuto al día calendario al que pertenece según `settings.timezone`.
3. **Dos trackers del mismo proyecto a la vez.** RF-06 da un ejemplo con 2 proyectos distintos; no dice qué pasa si el usuario le da "Start" dos veces al mismo proyecto. Recomendación: permitirlo (no bloquear), tratándolo igual que cualquier otro solapamiento para el cálculo de tiempo de reloj, pero sumando ambas franjas al "tiempo bruto" de ese proyecto.
4. **¿Dónde vive el cálculo de solapamiento?** El PRD (§14) pide que el cálculo de sobrecarga y solapamiento sea "lógica de backend" para que reportes y pantalla coincidan siempre. LIPS-HUB no tiene backend propio (Supabase solo guarda el JSON). Recomendación: calcularlo en JavaScript del navegador a partir de `entries`, como el resto del hub — es consistente si un único cliente (el navegador de Lissette) es siempre quien calcula y muestra, pero se pierde la garantía de "un solo lugar de verdad" si algún día se exportan reportes desde otro sitio. Confirmar que este trade-off es aceptable.
5. **Alerta de tracker olvidado (>6h): ¿bloqueante o solo aviso?** El PRD dice que el sistema debe "alertar... para que el usuario confirme o corrija" pero no especifica si eso bloquea el dashboard hasta resolverse o es un banner descartable. Recomendación: banner no bloqueante con acción directa ("Detener ahora" / "Corregir hora"), no un modal que impida ver el resto de la app.
6. **Ilustración del Gato de Cheshire.** El PRD pide una silueta original (no el diseño de Disney) para evitar temas de derechos. Es una pieza de diseño nueva, no solo código — recomendación: definir si Lissette aporta un boceto/referencia visual concreta antes de que se implemente, para no iterar a ciegas sobre "cómo se ve un gato sonriente que se desvanece".
7. **Nombre de archivo y `app_id`.** Se asume `hourglass.html` y `AIAPPS_APP_ID = 'hourglass'` por consistencia con el nombre ya decidido; confirmar que no hay preferencia distinta antes de que el tech lead lo cree, porque cambiarlo después implica tocar `VALID_APP_IDS`, la clave de `storageKey` de sesión, y las claves de caché local ya escritas.
8. **Rango personalizado del selector de fechas (§9.1).** El PRD lo menciona junto con día/semana/mes sin detallar límites (¿máximo un año? ¿permite comparar dos periodos?). Recomendación: acotarlo a un rango dentro del mismo año para la v1 y revisar si hace falta más con uso real.

## 7. Riesgos

- **Chocan dos supuestos del PRD con la arquitectura real del hub:** (a) "cálculo en backend" (§14) cuando no existe backend — ver decisión 4 arriba; (b) el modelo de datos relacional de 7 entidades (§13) asume tablas separadas, pero aquí todo cabe en **una sola fila JSON** por usuario — un histórico de meses de entries en un único campo `jsonb` puede crecer bastante; sin backend que pagine, cada guardado reescribe el documento completo. Si el volumen de entries crece mucho (años de uso diario), vale la pena revisar el tamaño del JSON antes de que se vuelva lento de cargar/guardar — no es un riesgo del plan gratuito de Supabase en sí (el límite de tamaño de fila es generoso), sino de rendimiento del navegador al serializar/deserializar en cada guardado.
- **Guardado frecuente por trackers en vivo:** si el cronómetro dispara `syncToCloud()` en cada tick (como hacen otras apps del hub al cambiar cualquier dato), un tracker corriendo varias horas podría generar muchas escrituras a Supabase. Con el plan gratuito, esto no debería acercarse a límites de cuota por sí solo, pero conviene que el guardado de un tracker activo sea por evento (start/pause/resume/stop) y no por temporizador, para no escribir de más.
- **Auto-pausa de Supabase (plan gratuito):** si Hourglass fuera la única app que se usa activamente por un tiempo, no cambia el riesgo ya conocido de auto-pausa por inactividad — ver `docs/infra-watch.md`, es responsabilidad de `release-manager`, no algo nuevo que introduzca esta app.
- **Sin backend, "reportes exportados consistentes con la pantalla" (criterio implícito del PRD §14) depende de que todos los cálculos vivan en una sola función de JavaScript reutilizada por dashboard y exportación** (cuando se construya en Fase 2) — riesgo de que se dupliquen fórmulas y diverjan si no se comparte código desde el principio.
