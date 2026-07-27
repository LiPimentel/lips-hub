# Notas de versión — 26 de julio de 2026

**Estado:** en la rama `claude/notas-de-version-por-rama`, aún no fusionado. No cambia ninguna app.

## Cambio interno de organización — cómo se nombran estas mismas notas

Este cambio no toca ninguna de las 5 apps ni el hub. Es una regla de trabajo interna, pero vale la pena explicarla porque estaba causando bloqueos reales.

### El problema

Hasta ahora, cada nota de versión se llamaba por su fecha: `2026-07-26.md`. Si ese día había más de un cambio, la siguiente era `2026-07-26-2.md`, luego `-3`, y así.

Eso funciona con una sola persona (o un solo asistente) trabajando. Pero en este proyecto es normal que haya **varios hilos de trabajo en paralelo**, y cada uno solo ve sus propios archivos: no puede ver la nota que otro acaba de escribir y todavía no ha publicado. Así que dos hilos eligen el mismo número sin enterarse.

Cuando eso pasa, GitHub encuentra dos archivos distintos con el mismo nombre y **no sabe cuál conservar**. Bloquea la publicación del cambio entero — aunque el código no tenga ningún problema. Ocurrió tres veces en tres días; una de ellas dejó un cambio de LPBag parado sin motivo real.

### La solución

A partir de ahora cada nota lleva el nombre de la rama en la que se hizo, no un número:

- Antes: `2026-07-26-3.md`
- Ahora: `2026-07-26-login-glow-y-preferencia-en-vivo.md`

Dos hilos nunca trabajan en la misma rama, así que el nombre nunca puede repetirse. El choque desaparece de raíz en vez de tener que resolverse cada vez.

De paso, el nombre dice de qué trata la nota con solo verla en la lista, sin abrirla.

### Qué NO cambia

Las notas ya existentes se quedan como están — no se renombra nada hacia atrás. El contenido y el estilo de las notas tampoco cambian: siguen en español, para alguien no técnico, y siguen diciendo qué cambió y si llegó a producción.
