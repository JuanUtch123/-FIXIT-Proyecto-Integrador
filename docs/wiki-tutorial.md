# Wiki y tutorial

La ruta protegida `/wiki` reúne la información de los personajes y las guías visuales del juego. Se accede desde **Wiki y tutorial** en el menú de Inicio, Estadísticas, Leaderboard y Perfil.

## Contenido y fuentes

- `frontend/src/data/wiki.js` contiene las fichas de Alan, Steve, Mark y Bill, adaptadas del documento proporcionado **Fix It — Personajes (Wiki).pdf**. El documento menciona personajes no jugables, pero no desarrolla sus fichas; por eso no se añadieron personajes sin información.
- Las ilustraciones del tutorial provienen de `tutorial.zip` (cuatro láminas) y `pere_new.zip` (un esquema general). Los PNG se convirtieron a WebP para disminuir su peso, conservando las ilustraciones completas. Los originales PSD no se publican en la PWA.
- Los cuatro personajes utilizan los retratos JPEG proporcionados por el usuario, conservados sin alterar en frontend/public/wiki. Se muestran en la tarjeta de selección y en la ficha del personaje.

## Interacción

- Las fichas se seleccionan mediante botones y muestran personalidad e historia.
- Las cinco guías se eligen desde un índice o mediante Anterior/Siguiente.
- Cada lámina se puede ampliar en un diálogo nativo, cerrar con el botón o Escape y desplazar horizontalmente en móvil para consultar sus detalles.
- La selección de personaje es informativa: no modifica el personaje del jugador ni escribe datos en el backend.

## Comprobaciones

La compilación del frontend y el lint se ejecutan con `npm run build` y `npm run lint` desde `frontend`. También se comprobó con navegador automatizado la selección de las cuatro fichas, la carga de las cinco imágenes, el carrusel, el diálogo y Escape, los enlaces desde las cuatro vistas existentes y la ausencia de desbordamiento horizontal a 390 y 768 px. Las pruebas de navegación utilizaron respuestas API simuladas, sin modificar usuarios ni partidas.
