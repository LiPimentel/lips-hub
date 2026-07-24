# Notas de seguridad — LIPS-HUB

Registro de hallazgos de seguridad por revisión, y "libro de riesgos aceptados" (observaciones reales que no bloquean el envío, para no re-marcarlas como nuevas en cada ciclo). Leer este archivo al empezar cada revisión, junto con `docs/team-memory.md`.

## Límites conocidos de esta revisión (no verificables desde el código)

- No es posible inspeccionar las políticas RLS realmente desplegadas en el dashboard de Supabase — solo lo que hay en el repo. **No se encontraron archivos de migración/esquema SQL en el repo** (`grep` de `create policy`/`row level security` sin resultados), así que la única evidencia de que RLS restringe filas por `auth.uid() = user_id` es indirecta: cada `select`/`upsert` en el código cliente ya filtra explícitamente por `user_id` (defensa en profundidad), pero la política real del lado servidor no se pudo leer. Se recomienda que el usuario confirme periódicamente en el dashboard de Supabase que la política sigue activa en la tabla `app_data`.
- No se puede revisar 2FA de GitHub ni exposición de variables de entorno en logs de build de Netlify (fuera del alcance de una revisión de código).

## Revisión 2026-07-23 — commits `e421ee8` y `65ad3e7` (`custom-login-scenes-per-app`)

**Alcance:** `e421ee8` (aislar caché local/carpeta por `user_id` en bitacora-mentor, StaffGate, LP-Bag, MyTravel) y `65ad3e7` (persistencia Supabase nueva en `generador_gantt_2.html`).

### 1. ¿El fix cierra la mezcla de cuentas o solo la traslada?

**Cierra la ruta de lectura, que era el riesgo original documentado por business-analyst.** En las 4 apps + Gantt, `load()`/`loadDB()` siempre asigna `cachedUserId = session.user.id` de forma síncrona en cuanto confirma la sesión (StaffGate.html:1028, lpbag.html:882, mytravel-pro-v4.html:1010, generador_gantt_2.html:277), y **cualquier** llamada posterior a `loadFromLocalStorage(userId)` dentro de esa misma función recibe ese `cachedUserId` ya no nulo — nunca hay una ruta donde `load()` consulte la caché local sin userId mientras hay sesión real. `bitacora-mentor.html` usa un patrón distinto y en realidad más robusto: `storageAdapter.get/set` (líneas 484-542) piden la sesión fresca en cada llamada en vez de cachear un `userId` global, así que no depende de una variable que pueda quedar desactualizada.

**Pero sí queda una ventana de carrera real y evidenciable, compartida por StaffGate, LP-Bag, MyTravel y ahora Gantt (no por Bitácora):** los controles que llaman a `save()`/`saveDB()` son HTML estático interactivo desde que la página pinta (ej. StaffGate.html:792 `<button class="new-btn" onclick="openNewModal()">`, lpbag.html:682 `<form id="expenseForm" onsubmit="addExpense(event)">`, mytravel-pro-v4.html:968 `onclick="guardarViaje()"`, generador_gantt_2.html:589 `addRow` listener) — **no** dependen de que `load()` haya terminado. `cachedUserId` solo se fija dentro de `load()`, que es asíncrono. Si el usuario dispara una acción de guardado en la ventana entre pintado y la asignación de `cachedUserId` (por ejemplo, si `getSupabaseSession()` tarda por una renovación de token en segundo plano), `save()` ejecuta `scopedKey(key, null)` → escribe en la clave vieja sin aislar (`staffgate_cands_v1`, `LPBag_db`, `mytravel_v4`, `gantt_v1`), no en la nueva clave `::userId`.

Impacto real, acotado pero no nulo:
- La escritura en la nube **no se ve afectada** — `syncToCloud()` en las 4 apps vuelve a pedir la sesión fresca y usa `session.user.id` directamente (nunca `cachedUserId`) para el `upsert`, así que el dato de la cuenta correcta sigue llegando a Supabase con el `user_id` correcto.
- El dato sí queda huérfano en `localStorage` bajo la clave vieja sin aislar. Como `isSyncKey()` (línea 11 en las 4 apps, y `SYNC_PREFIXES.some(...)` en StaffGate) reconoce esa clave vieja por el mismo prefijo, el puente de carpeta local (`collectLocalSnapshot()`) la incluye igual en el archivo de respaldo — por lo que ese dato queda expuesto en el archivo compartido a cualquier otra cuenta que conecte esa misma carpeta, aunque ninguna ruta de lectura actual (`load()`) vaya a consumirlo automáticamente para esa otra cuenta.
- Documentado como caso borde con evidencia línea por línea en `docs/staffgate/requerimientos.md` (#12), `docs/lpbag/requerimientos.md` (#9), `docs/mytravel/requerimientos.md` (#11), `docs/gantt/requerimientos.md` (#12).

**Severidad: media, no bloqueante.** Requiere una ventana de milisegundos y una sesión que necesite renovar token en el instante exacto en que el usuario interactúa — no es explotable por un tercero externo (proyecto de un solo usuario personal, sin registro público), pero sí es una brecha real en el diseño de la corrección. Recomendación para el tech lead: deshabilitar los controles de guardado (o mostrar un estado de carga) hasta que `cachedUserId` esté confirmado, igual que ya se hace con `cloudSyncReady` para la subida a la nube — aplicarlo a las 4 apps a la vez por ser un patrón compartido, no parchear una por una.

### 2. Escrituras nuevas de Gantt a Supabase

`generador_gantt_2.html` sigue el mismo patrón que las otras 4 apps:
- `syncToCloud()` (línea 251-266): `upsert({ user_id: session.user.id, app_id: 'gantt', data: {...}, updated_at }, { onConflict: 'user_id,app_id' })` — coincide exactamente con el patrón de StaffGate/LP-Bag/MyTravel/Bitácora.
- `load()` (línea 274-303): `select('data').eq('app_id', SUPA_APP_ID).eq('user_id', session.user.id).maybeSingle()` — filtra por `user_id` del lado cliente como defensa en profundidad, además de lo que haga RLS del lado servidor.
- No se encontró ninguna ruta de lectura/escritura nueva que omita el filtro por `user_id`.

### 3. `isSyncKey()` con coincidencia de prefijo (folder bridge)

Revisado en las 5 apps. La función exige el delimitador literal `'::'` inmediatamente después del prefijo (`k === p || k.indexOf(p + '::') === 0`), no una coincidencia de subcadena genérica — una clave como `staffgate_cands_v1_backup` **no** coincidiría, porque no tiene `'::'` justo después. Se verificó con `grep` de todos los `localStorage.setItem/getItem` en las 5 apps que ninguna otra usa un prefijo igual a `ledger-data`, `staffgate_cands_v1`, `staffgate_tpls_v1`, `mytravel_v4`, `LPBag_db` o `gantt_v1` para otro propósito — no hay colisión real. Único efecto secundario real del cambio de exacto a prefijo: la clave huérfana sin aislar del hallazgo #1 también se sincroniza al archivo de la carpeta local (ya cubierto arriba).

### 4. Checklist estándar

- **Secretos:** sin coincidencias de `service_role`, `BEGIN PRIVATE/RSA`, contraseñas embebidas ni claves de API de pago en ninguno de los dos diffs (`git show e421ee8`/`65ad3e7` + grep dirigido).
- **Historial de git (todo el historial, no solo el diff):** `git log -p --all` sobre los 5 archivos de app con el mismo patrón de grep — sin coincidencias. Sin secretos expuestos en historial para estos archivos.
- **XSS:** ninguno de los dos commits agrega una nueva interpolación de texto de usuario en `innerHTML`/plantillas HTML — `save()`/`load()` en Gantt solo mueven JSON a `localStorage`/Supabase, nunca a HTML. Los puntos de render existentes de Gantt (`renderTable()`, línea 553-557 y 745/760/788) ya usaban `escHtml()` antes de este cambio y lo siguen aplicando en `fase`/`ent`/`dur` — no revisado a fondo aquí porque no forma parte del diff, pero no se detectó ninguna regresión.
- **Inyección/eval:** sin `eval`/`new Function` nuevos en ninguno de los dos commits.
- **CDN/dependencias:** ningún `<script src>`/`<link>` nuevo en ninguno de los dos commits (`git show ... | grep "<script src\|<link"` sin resultados) — ambos solo modifican JS inline.
- **Reutilización:** el patrón `scopedKey`/`cachedUserId`/`isSyncKey` se copió consistentemente a las 4 apps + Gantt, pero **no vive en un archivo compartido** (`auth-gate.js`/`supabase-client-app.js`) — está duplicado línea por línea en cada HTML. Esto ya generó la inconsistencia detectada en el punto 1 (Bitácora no tiene la misma ventana de carrera porque usa un patrón distinto). Recomendación: si se corrige la ventana de carrera, hacerlo de forma que las 5 apps quede con el mismo patrón, idealmente extrayendo la lógica a `supabase-client-app.js` para que las apps futuras la hereden por defecto en vez de copiarla a mano.

### Actualización 2026-07-24 — commit `a4a2d10`

**Corregido:** la ventana de carrera del punto 1 (guardado antes de que `cachedUserId` se confirme). `save()`/`saveDB()` en StaffGate, LP-Bag, MyTravel y Gantt ahora resuelven la sesión de nuevo (`await getSupabaseSession()`) en cada llamada en vez de confiar en `cachedUserId`, cerrando la ventana por completo en vez de solo acortarla — mismo espíritu que el patrón ya usado en `bitacora-mentor.html`. Movido a histórico, ver abajo.

Pendiente (no bloqueante, no implementado hoy): el patrón `scopedKey`/`isSyncKey` sigue duplicado línea por línea en las 5 apps en vez de vivir en `supabase-client-app.js`. Sería la forma más robusta de que apps futuras hereden esta protección por defecto, pero es un refactor mayor fuera del alcance de este fix puntual — queda anotado para cuando se decida abordarlo.

### Libro de riesgos aceptados

- **2026-07-21 — globals `AIAPPS_APP_*` sin escapar:** siguen hardcodeados por el desarrollador, no alimentados por input externo. Riesgo sin cambios.

### Histórico

- **2026-07-23/24 — ventana de carrera en `save()` antes de `cachedUserId`:** ver "Actualización 2026-07-24" arriba. Corregido en `a4a2d10`.
