# Nutri Log — QA checklist

> Mantenido por el agente QA Lead. Ver también `docs/nutrilog/requerimientos.md` (Casos borde) y `docs/team-memory.md`.

## 2026-09-08 — Primera revisión: rama `claude/nutri-log-app` completa (8 commits sobre `master`, sin fusionar, sin PR abierto)

**Contexto:** app nueva completa, 7ma del hub. `git diff master...claude/nutri-log-app --stat`: `nutri-log.html` (+2075, nuevo), `index.html` (+9, tarjeta nueva del hub), `supabase-client-app.js` (+1/-1, agrega `"nutrilog"` a `VALID_APP_IDS`). Sin PRD propio en `docs/` todavía — se documentó lo verificable por ejecución, no el PRD completo (RF-01 a RF-43, en poder del tech lead).

**Método:** `bash build.sh` + `http-server dist -p 8091`. Navegador real (Chromium vía Playwright, `/opt/pw-browsers`), con los CDN externos (`unpkg.com`, `fonts.googleapis.com`) interceptados y `window.supabase` reemplazado por un mock de `createClient` (sesión falsa + `app_data` en memoria) inyectado con `addInitScript` **antes** de que cargue cualquier script de la página — así el candado de `auth-gate.js` deja pasar y la app carga sus datos reales. Todo lo marcado `[x]` abajo se verificó con clics/teclas reales sobre el DOM cargado, no por lectura de código; se anota explícitamente cuando algo NO se pudo verificar así.

### 1. Flujo completo (clic real)

- [x] Onboarding: 3 pasos con dots de progreso, "Omitir" siempre visible y funcional (probado con Omitir y también completando los 3 pasos eligiendo opciones).
- [x] Inicio: racha en 0 al onboarding recién terminado; botón "Ya lo tomé" sube la racha a 1 (`.nl-streak-num` confirmado con `textContent`), cambia su propio texto a "Registrado · ver detalle", y aparece un toast visible (`.nl-toast`, 1 elemento en el DOM justo después del clic).
- [x] Registro con detalle: selector de receta (probado abrir el panel, listar las 3 recetas + "Ninguna", elegir "Collagen Iced Mocha"), nota de texto, guardar — vuelve a Inicio y muestra el toast "Registro guardado.".
- [x] Recetas: las 3 recetas semilla se listan; buscador por texto probado contra un ingrediente ("plátano" → filtra correctamente a "Mood-Boost Smoothie", que es la única con ese ingrediente); favorito (corazón) alterna `class="nl-heart"` ↔ `"nl-heart on"` con clic real; filtro "Favoritas" muestra solo lo marcado.
- [x] Detalle de receta: abre desde la tarjeta, muestra perfil de efectos con barras (7 categorías para "Collagen Iced Mocha": Energía media, Resistencia al estrés/Enfoque/Salud digestiva/Inmunidad/Piel/Ánimo bajas — consistente con los compuestos del producto base + `cocoa` de la receta); calificar con estrellas probado (clic en estrella 4 de 5 → 4 estrellas quedan con clase `.on`).
- [x] Nutrición: abre desde el detalle de receta ("ver Nutrición"), selector de receta con buscador.
- [x] Análisis: KPIs (racha actual, registros del mes, cumplimiento de meta), heatmap de 56 celdas, gráfico por día de semana, dona por tipo de consumo, historial en tabla, exportar CSV — el evento `download` del navegador se disparó de verdad al clicar "Exportar CSV" (`nutri-log-historial.csv`), confirmando que `Blob`+`URL.createObjectURL` funciona en runtime real, no solo en el código.
- [x] Reto de 14 días: "Iniciar reto" crea el reto y muestra "Día 1" con el plan del día (receta + momento + hábito, tomados de la plantilla semilla); check-in de las 4 categorías (Enfoque/Digestión/Ánimo/Piel, escala 1-5), hábito complementario (check), 2 reflexiones de texto, "Guardar check-in del día 1" — toast "Check-in guardado." confirmado.
- [x] Persistencia del check-in confirmada con **recarga real de página** (`page.reload()`, no solo re-render en memoria): tras guardar, se recargó la página completa y el rating de "Enfoque=4" seguía marcado como `.on` — pasó por el `storageAdapter` (mock de Supabase) + `localStorage`, no solo por el estado en memoria del mismo documento.
- [x] Plantilla del reto: 14 filas confirmadas (`'.table tbody tr'.count() === 14`); renombrar columna probado (cambiar el encabezado "Receta"→"Receta QA" con `change`, confirmado que persiste al releer el encabezado en modo vista); duplicar plantilla probado (botón "Duplicar plantilla" → toast "Plantilla duplicada.", nueva plantilla agregada a `state.challengeTemplates`).
- [x] Perfil: 14 insignias listadas (`BADGE_DEFS.length === 14`, coincide con lo renderizado); "Primer registro" se desbloquea tras el primer log real; días libres — botón "Usar hoy" reduce `freezesAvailable` de 2 a 1 y el texto pasa a mostrar "1 de 2" correctamente.
- [x] Productos y metas: activar/desactivar métricas revela/oculta su campo de meta correspondiente (probado activar "Horario" → aparece el campo de hora objetivo; desactivar "Racha" → desaparece el campo de racha objetivo, usando clic real sobre el `.track` visible del switch, no sobre el `<input>` oculto — ver nota de método abajo); agregar un segundo producto probado (modal, nombre+marca, "Agregar" → aparece como nueva pestaña de producto).

### 2. Motor de cálculo (verificado con datos reales renderizados, no solo lectura de código)

- [x] **kcal por receta coinciden con los valores de referencia del PRD**, calculadas en pantalla real (no en aislamiento): Collagen Iced Mocha → **184 kcal** (esperado ≈184). Adaptogen Latte → **83 kcal** (esperado ≈83). Ambos leídos directamente del texto renderizado en la tarjeta de Nutrición tras navegar Detalle de receta → Nutrición.
- [x] Perfil de efectos cambia según los compuestos reales de cada receta: mocha (con `cocoa` extra) muestra "Ánimo" además de los 6 efectos base del producto; el nivel ("baja"/"media"/"alta") sigue la regla de conteo de compuestos por categoría descrita en el propio código (1=baja, 2=media, 3+=alta) — confirmado que "Energía" sale "media" para mocha (2 fuentes: `cordyceps` + `coffee` del producto base).
- [x] Acumulados de Nutrición (hoy/semana/mes) confirmados que se recalculan sobre registros reales: tras crear 1 registro real de hoy, la tarjeta "Hoy" pasó de "0 kcal · 0 registro(s)" a reflejar el registro creado (no se dejó como placeholder estático).

### 3. Racha — verificada con ejecución real, avanzando el reloj del sistema (no solo razonamiento sobre el código)

Método: se sobreescribió el constructor global `Date` (subclase que desplaza `Date.now()`/`new Date()` un offset fijo) vía `addInitScript`, **antes** de que cargara cualquier script de la página — así `nlToday()` (que usa `Intl.DateTimeFormat` sobre `new Date()` real del motor JS) queda engañado de forma consistente en toda la app, igual que si hubiera pasado el tiempo real. No es esperar días reales, pero **sí** es ejecución real del código de la app con la fecha del sistema alterada, no una simulación aislada de la función de racha.

- [x] Día 0: primer registro real → racha = 1.
- [x] Día +1 (reloj +25h, antes de registrar hoy): racha se mantiene en 1 (el día de ayer sigue contando). Tras registrar en el día +1: racha sube a **2**.
- [x] Día +3 (reloj +73h desde el día +1, es decir se saltó el día +2 por completo, sin registro ni día libre usado): racha real leída del estado = **0** — confirma que un día sin registro corta la racha, tal como describe el propio comentario del código (`recomputeStreak`, RF-21).

### 4. Responsive móvil (390×812, agregado al final)

- [x] `.nl-sidebar` con `display:none` computado; `.nl-tabbar` con `display:flex`, exactamente 5 pestañas (Inicio, Recetas, Reto, Análisis, Perfil) — coincide con lo pedido en el encargo.
- [x] "Producto y metas" alcanzable en móvil vía el ícono de engranaje en `.nl-mobile-top` (no está en la barra de 5 pestañas, como documenta el propio comentario del CSS) — clic real confirmado, navega a "Productos y metas".
- [x] Sin overflow horizontal: `document.documentElement.scrollWidth === window.innerWidth` (390 = 390) en Inicio y en Productos y metas.
- [x] Ningún elemento (`button`/`a`/`input`) de la propia app se solapa con el área de la tab bar inferior (chequeo automatizado de rectángulos, 0 coincidencias) en Inicio.
- [x] **Hallazgo, no bloqueante:** el widget flotante compartido "Cuenta" (`auth-gate.js`) se solapa ~6px con el borde superior del primer interruptor de métrica en Productos y metas — el clic real en el centro del control sigue funcionando (confirmado con `elementFromPoint` apuntando al `.knob` del switch, y con el switch cambiando de estado tras el clic). Ver caso borde 10 en `requerimientos.md`. Mismo patrón general (widget de cuenta compartido tapando controles) ya documentado antes en el hub para otras apps — aquí es parcial y no bloqueante.
- [x] Conteo de nodos DOM en Productos y metas (móvil): 136 — razonable, sin señales de explosión de nodos (la app no genera iconos/partículas en cantidad; el elemento más grande es el heatmap de Análisis con 56 celdas fijas).
- [x] 0 errores de consola en ningún punto de la sesión móvil (carga, onboarding, navegación por las 5 pestañas + Producto y metas).

### 5. Persistencia

- [x] Mismo patrón `storageAdapter` que las demás apps del hub (confirmado por lectura de código, comentario explícito "mismo patrón que bitacora-mentor.html" en el propio archivo): `get()`/`set()` con `scopedKey(key, userId)`, `migrateLegacyCache()`, `localStorage` como caché + `app_data` de Supabase (`app_id: 'nutri-log'`) como fuente de verdad cuando hay sesión.
- [x] Round-trip verificado con **recarga real de página completa** (no solo re-render): check-in del reto sobrevive a `page.reload()`; racha y estado de onboarding también sobreviven a recarga en pruebas separadas.
- [ ] **NO verificado con credenciales reales de Supabase** — no se proveyeron para esta app. Todo el round-trip de persistencia se probó contra un mock de `window.supabase` en memoria (inyectado en el navegador de prueba), que reproduce fielmente la forma de las llamadas reales (`select().eq().eq().maybeSingle()`, `upsert()` con `onConflict:'user_id,app_id'`) pero no confirma que el proyecto real de Supabase acepte esas llamadas tal cual (RLS, columnas, tipos). Esto debe probarse aparte con una cuenta real antes de considerar la persistencia en la nube 100% confirmada.

### 6. Otros hallazgos de ejecución real

- [x] Doble clic rápido (casi simultáneo, `Promise.all`) sobre "Ya lo tomé" **no** duplica el registro: `state.logs.length === 1` tras el doble clic — el botón cambia de texto tras el primer clic ("Registrado · ver detalle"), así que el segundo clic navega a Análisis en vez de crear un segundo registro.
- [x] Eliminar un registro/receta desde su diálogo de confirmación probado con ambos caminos: "Cancelar" (no borra nada, confirmado por botón de texto explícito, no por selector ambiguo — ver nota de método) y confirmar borrado real (`state.logs.length` baja de 1 a 0; receta creada para la prueba desaparece de `state.recipes`).
- [x] Archivar un producto (con 2+ productos existentes) confirmado: el producto archivado desaparece de las pestañas de Productos y metas y el activo cae de vuelta al que queda.
- [x] Payload tipo XSS (`Malvada" onmouseover="alert(1)`) en el nombre de una receta creada por el usuario: se renderiza como texto plano dentro de `<span class="card-title">`, sin romper el atributo ni ejecutar el `onmouseover` inyectado (confirmado con `page.on('dialog')` — cero alerts al pasar el mouse sobre la tarjeta). `esc()` de esta app sí escapa comillas (a diferencia del bug histórico de `bitacora-mentor.html` corregido el 2026-07-29) — relevante para `security-reviewer`, ver nota en `team-memory.md`.
- [x] **Hallazgo real, ver caso borde 9 en `requerimientos.md`:** elegir "Agregar mi propio producto" en el paso 1 del onboarding no tiene ningún efecto — confirmado con ejecución real completa del flujo (los 3 pasos), `state.activeProductId` se queda en `'urth'` y `state.products.length` en 1, sin ningún modal ni redirección a creación de producto.
- [x] Índice — no se completó el flujo de creación de receta propia hasta el final del reto de 14 días (RF-42, comparación antes/después); se verificó el guardado del check-in del día 1 y la lectura del resumen antes/después por lectura de código (`renderChallengeSummary`, toma `checkins.find(day===1)` vs el de mayor día), pero no se completaron los 14 días reales de check-in para ver el resumen renderizado en pantalla. Se documenta como no verificado end-to-end, no como fallo.

### 7. Impacto en apps compartidas (`auth-gate.js` no se tocó; `supabase-client-app.js` sí, un cambio de 1 línea)

- [x] `index.html` (el hub): la tarjeta nueva "Nutri Log" aparece, con el link correcto `./nutri-log.html`. No se completó una revisión visual/funcional completa del hub (fuera del alcance del diff, que solo agrega una tarjeta).
- [x] `bitacora-mentor.html` cargado con el mismo mock de sesión: título correcto, "0 mentees registrados", "Guardando en este navegador" — sin errores de consola atribuibles a la app (el único mensaje de consola fue un fallo de red hacia un CDN externo bloqueado por el entorno de prueba, no relacionado con el cambio). Confirma que agregar `"nutrilog"` a `VALID_APP_IDS` en `supabase-client-app.js` no rompió el candado ni la carga de otra app del hub.

## Veredicto: APROBADO CON OBSERVACIONES

Ver el mensaje de la revisión para el detalle de las 3 preguntas obligatorias (pide/rompe/calidad) y la lista completa de observaciones. Las 4 observaciones propias de esta revisión de QA (casos borde 9-12 de `requerimientos.md`) no son bloqueantes por sí solas con ejecución real; la más relevante para decisión de producto es el caso borde 9 (onboarding "Agregar mi propio producto" es un no-op silencioso). `requerimientos.md` acumula además 8 hallazgos de accesibilidad de `accessibility-reviewer` sobre esta misma rama, corridos en paralelo el mismo día — ver ese archivo completo para el detalle, no solo esta lista de QA.
