# Notas de versión — 8 de agosto de 2026

## Bitácora del Mentor

### "Seguir agregando" al crear mentees

Si vas a meter varios mentees de una sentada, ya no tienes que abrir el
formulario una y otra vez. Al crear uno nuevo verás una casilla **"Seguir
agregando"**: si la marcas, al guardar el formulario se vacía y se queda
abierto, listo para el siguiente, con la casilla todavía marcada.

Cuando termines, desmárcala y guarda —o cierra el formulario— y vuelve al
comportamiento de siempre. La casilla solo aparece al **crear**; al editar un
mentee no tendría sentido.

### Los grupos se pueden cerrar

Un grupo de mentoría que ya terminó ahora se puede **marcar como cerrado**, de
dos formas: con el botón *"marcar como cerrado"* en su ficha, o desde el campo
**Estado** al editarlo.

Al cerrarlo:
- Baja a un apartado **"Grupos pasados"** al final de la lista, para que arriba
  quede solo lo que está en marcha.
- **Deja de avisarte** de que hace mucho que no registras una sesión con él —
  algo que antes hacía aunque el grupo estuviera terminado.
- **Conserva todo su historial**: las sesiones siguen ahí y se siguen viendo.
- Sale en la exportación con su estado (Activo / Cerrado).

Si te equivocas, el mismo botón dice *"reabrir grupo"* y lo devuelve a la lista
normal.

### El buscador de mentees ahora busca de verdad

El buscador ya existía y filtraba mientras escribías, pero **solo miraba el
nombre**: buscar "diseño", un correo o un país no encontraba a nadie aunque
estuviera en su ficha.

Ahora busca además por **área, objetivo, "sobre el mentee", correo, país y
progresión**. El buscador de grupos también mira ahora la descripción, no solo
el nombre.

## Dónde quedó

Solo en la rama `claude/mentor-crear-otro-grupos-cerrados-y-busqueda`,
pendiente de fusionar a `master`.
