# Generador de Gantt — QA checklist

> Mantenido por el agente QA Lead. Ver también `docs/gantt/requerimientos.md` (Casos borde) y `docs/team-memory.md`.

## 2026-07-24 — Revisión: persistencia nueva Supabase + caché local + folder-bridge (commit `65ad3e7`)

**Contexto:** primera vez que esta app persiste algo — antes todo vivía solo en la variable `rows`. Verificación más profunda que el resto por ser funcionalidad nueva, no solo un fix.

Verificado:
- [x] El archivo carga sin errores de consola (`file://generador_gantt_2.html`, tab-1). Confirmado con `read_console_messages` → "No console logs."
- [x] Pantalla de login renderiza correctamente por captura de pantalla real, en desktop y en mobile (375x812) — escena decorativa de barras de Gantt de fondo, campos correo/contraseña completos.
- [x] Sin sesión, `rows` en memoria es `[]` y `localStorage.getItem('gantt_v1')` es `null` — no hay datos reales cargados ni cacheados de antes detrás del candado (a diferencia de bitacora-mentor, aquí no se encontró ningún dato huérfano de pruebas previas).
- [x] `cloudSyncReady` es `true` tras el arranque `(async () => { await load(); cloudSyncReady = true; renderTable(); })()` — confirmado en consola, la secuencia de boot corrió completa sin colgarse ni lanzar error, incluso sin sesión.
- [x] `scopedKey('somekey','user-123')` → `'somekey::user-123'` y `scopedKey('somekey', null)` → `'somekey'`, probado en consola real.
- [x] **Round-trip `serializeRows`/`deserializeRows` probado en consola con datos reales:** un arreglo con un `Date` real de inicio/fin y una fila con `ini`/`fin` en `null` pasado por `serializeRows` → `deserializeRows` devuelve objetos `Date` reales (`instanceof Date` true, `getTime()` idéntico al original, fecha válida) para la fila con fechas, y `null` exacto (no `undefined`, no `0`, no string vacío) para la fila sin fechas.
- [x] **Caso borde adicional probado (no pedido explícitamente, iniciativa propia):** `deserializeRows` sobre un valor `ini` malformado (`"not-a-date"`) no lanza error ni lo descarta — produce silenciosamente un objeto `Date` inválido (`instanceof Date` true, pero `getTime()` es `NaN`). Si algún dato corrupto llegara a Supabase/localStorage por otra vía, esa fila renderizaría con una fecha inválida sin ningún aviso. No se confirmó si esto rompe visualmente el dibujo de la barra (no se pudo generar un Gantt real con esa fila sin sesión), pero es una ruta sin validar. Documentado como parte del caso borde 12 existente en `docs/gantt/requerimientos.md` — se recomienda que quede anotado explícitamente si no lo está ya.
- [x] **Los 5 puntos de mutación esperados llaman a `save()`, confirmado por grep + lectura de código:** `mergeRows()` (línea 545, cubre merge/pegar/subir archivo — verificado que las 5 rutas que llaman a `mergeRows` lo hacen: `loadSample`, pegar texto, y 3 rutas de carga de archivo), el handler de clic en `.del` (línea 562), el handler de `blur` en celdas editables (línea 573), `addRow` (línea 592) y `clearAll` (línea 599). Ningún punto de mutación esperado quedó sin `save()`.
- [x] `isSyncKey()` del folder-bridge (prefijo `gantt_v1`) probado directamente en consola reconstruyendo la lógica exacta del archivo: coincide con `gantt_v1` y `gantt_v1::user-123`, **no** coincide falsamente con `gantt_v1_backup`, `gantt_v1x::abc`, `other_gantt_v1::abc` ni `mytravel_v4` — el delimitador `'::'` exigido evita falsos positivos.
- [x] Badge del folder-bridge visible y en estado correcto sin conexión ("📁 Conectar carpeta de datos").
- [x] Ventana de carrera de `save()`/`cachedUserId` ya documentada por security-reviewer (`docs/gantt/requerimientos.md` caso borde 12) — coincide con lo leído en el código.
- [ ] **NO verificado end-to-end:** no hay credenciales de prueba; no se pudo confirmar en vivo un guardado real en Supabase ni recargar la página tras editar una fila real.
- [ ] **NO verificado:** comportamiento visual real de `renderTable()`/dibujo de barras (requiere datos cargados, que requieren sesión o carga manual de archivo — no se intentó cargar un archivo de muestra en esta revisión por estar detrás del candado).

## Histórico
_(sin entradas previas — primera revisión de este agente para esta app)_
