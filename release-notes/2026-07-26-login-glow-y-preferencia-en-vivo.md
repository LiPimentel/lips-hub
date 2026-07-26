# Notas de versión — 26 de julio de 2026

**Estado:** en la rama `claude/login-glow-y-preferencia-en-vivo`, aún no publicado a producción.

## Las 5 apps + el hub — dos retoques a "reducir movimiento" en la pantalla de inicio de sesión

Hace unos días se hizo que la pantalla de login respetara la opción del sistema *"reducir movimiento"* (esa que usan quienes sienten mareo o dolor de cabeza con las animaciones). Funcionó bien, pero al revisarlo aparecieron dos detalles pequeños que se corrigen aquí. **No cambia nada para quien tiene esa opción desactivada**, que es el caso normal.

### 1. Volvió el resplandor que sigue al mouse

La tarjeta blanca del login se inclina un poco siguiendo el mouse, y el fondo tiene además un resplandor de color que acompaña al cursor como una linterna.

Al apagar la inclinación se apagó también el resplandor, sin querer: las dos cosas se hacían en el mismo sitio del código, así que se fueron juntas. El resultado era que, con "reducir movimiento" activado, la luz del fondo se quedaba clavada en el centro de la pantalla.

Ahora **la inclinación sigue apagada, pero el resplandor vuelve a acompañar al cursor**. Es una luz pegada al puntero, no algo que se mueva solo, así que no molesta a quien pidió menos movimiento — y sin ella la pantalla se veía bastante más apagada.

### 2. Ahora responde al momento, no solo al abrir

Antes, la pantalla miraba una sola vez —justo al abrirse— si la opción del sistema estaba activada. Si alguien la activaba con el login ya abierto, la tarjeta seguía inclinándose hasta recargar la página.

Ahora **el cambio surte efecto en el momento**: al activar la opción, la tarjeta vuelve sola a su posición plana sin tocar nada; al desactivarla, vuelve a inclinarse. Probado en los dos sentidos.

De paso se cubrió un caso más chico: si la opción se activaba justo con la tarjeta inclinada, esta volvía a plano con una pequeña animación de medio segundo — es decir, con movimiento, justo en el instante en que se acababa de pedir lo contrario. Ahora vuelve a plano de golpe.

## Nada más cambió

No se tocó cómo se inicia sesión, ni la recuperación de contraseña, ni el fondo decorativo de ninguna app, ni ninguna de las 5 apps por dentro. Tampoco se tocó el zoom automático de los iconos de StaffGate, que se verificó que sigue funcionando igual (se detiene con la opción activada y vuelve al desactivarla).
