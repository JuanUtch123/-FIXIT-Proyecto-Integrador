# Fix-It_Int
Un juego multijugador local cooperativo, donde el jugador asume el rol de Pasante de TI para diagnosticar, reparar y ensamblar computadoras bajo presion de tiempo.
# Fix-It API conectada a MongoDB

El backend utiliza tres microservicios y una sola base local llamada `fixit`.

## Configuración

1. En cada carpeta (`user-service`, `progress-service` y `session-service`) copia `.env.example` como `.env`.
2. Ejecuta `npm install` dentro de cada carpeta.
3. Con MongoDB Server iniciado, crea datos de demostración desde `user-service` con `npm run seed`.
4. Inicia cada servicio en una terminal distinta con `npm run dev`.

Puertos: usuarios `3001`, progreso `3002` y partidas `3003`.

Usuario de prueba: `jugador1@fixit.com` / `Fixit123`.

Al registrar una partida con `POST /sessions`, el servicio actualiza automáticamente las estadísticas del usuario y su mejor progreso.
