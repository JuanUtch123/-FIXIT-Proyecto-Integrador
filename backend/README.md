# Fix IT! — Backend REST API

Backend del proyecto integrador **Fix IT!**, un videojuego cooperativo multijugador local en el que los jugadores asumen el rol de pasantes de Tecnologías de la Información (TI), encargados de diagnosticar, reparar y ensamblar computadoras bajo presión de tiempo.

El backend gestiona la información de los jugadores, la autenticación, las estadísticas acumuladas, el progreso y el registro histórico de partidas mediante una arquitectura basada en microservicios REST.

## 1. Arquitectura del backend

La solución se encuentra organizada en tres microservicios desarrollados con **Node.js, Express y Mongoose**.

| Microservicio | Puerto predeterminado | Responsabilidad |
|---|---|---|
| User Service | `3001` | Registro, autenticación, perfiles y estadísticas acumuladas. |
| Progress Service | `3002` | Consulta y actualización del progreso y mejores resultados de los jugadores. |
| Session Service | `3003` | Registro de partidas y coordinación de estadísticas y progreso. |

### Comunicación entre servicios

```text
                     CLIENTE
                 (Videojuego/PWA)
                        |
                    HTTP/JSON
                        |
           +------------+------------+
           |            |            |
           v            v            v
      User Service  Session Service  Progress Service
         :3001          :3003            :3002
           ^              |                ^
           |              |                |
           +--------------+----------------+
                  HTTP REST interno

               Persistencia MongoDB
```

Session Service actúa como coordinador cuando se registra una partida. Después de guardar sus datos, solicita las actualizaciones correspondientes a User Service y Progress Service.

Los servicios utilizan solicitudes HTTP y respuestas JSON para intercambiar información.

### Arquitectura interna

Los microservicios siguen una organización por capas:

```text
HTTP Request
     |
     v
   Route
     |
     v
 Controller
     |
     v
  Service
     |
     v
 Repository
     |
     v
 MongoDB
```

- **Route:** define los endpoints y métodos HTTP.
- **Controller:** administra las solicitudes y respuestas HTTP.
- **Service:** implementa las reglas de negocio.
- **Repository:** realiza operaciones sobre la base de datos.
- **Model:** define los esquemas de Mongoose.
- **Validator:** valida los datos recibidos.

## 2. Estructura del backend

```text
backend/
├── user-service/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       └── validators/
│
├── progress-service/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       └── validators/
│
├── session-service/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── clients/
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       └── validators/
│
└── README.md
```

Esta estructura corresponde al diseño de nuestra implementación de referencia. Las carpetas adicionales del repositorio unificado deberán documentarse según su función real.

## 3. Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| Node.js | Entorno de ejecución JavaScript. |
| Express | Implementación de servicios REST. |
| MongoDB | Persistencia documental. |
| Mongoose | Modelado y acceso a MongoDB. |
| Argon2id | Hash seguro de contraseñas. |
| JSON Web Token (JWT) | Emisión de tokens de autenticación. |
| dotenv | Configuración mediante variables de entorno. |
| Postman | Pruebas y validación de endpoints. |
| Git/GitHub | Control de versiones. |

## 4. Persistencia y modelos de datos

La persistencia se implementa mediante MongoDB y modelos Mongoose.

En la configuración original del backend se utilizaron bases lógicas separadas dentro de MongoDB Atlas. La integración del proyecto podrá utilizar otra configuración de bases de datos, siempre que mantenga correctamente la propiedad de los datos de cada servicio.

| Microservicio | Colección | Información |
|---|---|---|
| User Service | `users` | Identidad, credenciales protegidas y estadísticas acumuladas. |
| Progress Service | `user_progress` | Progreso por mundos, niveles, puntuación máxima y estrellas. |
| Session Service | `game_sessions` | Registro histórico de partidas y resultados. |

### User

Un documento de usuario contiene información de identificación y estadísticas:

```json
{
  "username": "Jugador1",
  "email": "jugador@example.com",
  "stats": {
    "totalGamesPlayed": 0,
    "totalTicketsCompleted": 0,
    "totalTicketsFailed": 0,
    "totalPlayTimeSeconds": 0
  }
}
```

Las cuentas registradas mediante la API almacenan un campo `passwordHash` generado con Argon2id. Las contraseñas originales nunca deben almacenarse en texto plano ni devolverse en respuestas HTTP.

### Progress

El progreso se organiza por identificadores de mundo y nivel:

```json
{
  "worlds": {
    "world_1": {
      "levels": {
        "1-1": {
          "bestScore": 1500,
          "bestStars": 3
        }
      }
    }
  }
}
```

`bestScore` y `bestStars` conservan sus valores máximos de manera independiente.

### Session

Cada sesión registra información de la partida:

```json
{
  "levelId": "1-1",
  "worldId": "world_1",
  "players": ["6aab11e2e164cb11eb8b7a25"],
  "score": 1250,
  "starsEarned": 3,
  "ticketsCompleted": 6,
  "ticketsFailed": 1,
  "durationSeconds": 180
}
```

El campo `players` permite registrar los identificadores de los participantes de una partida cooperativa.

## 5. Endpoints REST

### User Service — Puerto 3001

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/health` | Consultar el estado del servicio. |
| POST | `/users/register` | Registrar un usuario. |
| POST | `/users/login` | Iniciar sesión y obtener un JWT. |
| GET | `/users/:id` | Consultar perfil. |
| GET | `/users/:id/stats` | Consultar estadísticas acumuladas. |
| PATCH | `/users/:id/stats` | Incrementar estadísticas. |

### Progress Service — Puerto 3002

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/health` | Consultar el estado del servicio. |
| GET | `/progress/:userId` | Consultar progreso de un jugador. |
| PATCH | `/progress/:userId` | Actualizar mejores resultados. |

### Session Service — Puerto 3003

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/health` | Consultar el estado del servicio. |
| POST | `/sessions` | Registrar partida y ejecutar la sincronización correspondiente. |

**Alcance:** la implementación de referencia no incluye `GET /sessions` para recuperar una lista general del historial ni un endpoint de leaderboard. Estas funcionalidades pueden incorporarse posteriormente o estar presentes en versiones modificadas por el equipo.

## 6. Registro y autenticación

El sistema dispone de Authentication V1 mediante Argon2id y JWT.

### Registro de usuario

```http
POST http://localhost:3001/users/register
Content-Type: application/json
```

```json
{
  "username": "Jugador1",
  "email": "jugador@example.com",
  "password": "Clave de ejemplo 123"
}
```

**Respuesta esperada:** HTTP `201 Created`.

El servicio valida los datos, normaliza el email, verifica duplicados, genera el hash de contraseña y crea un usuario con estadísticas iniciales en cero.

### Inicio de sesión

```http
POST http://localhost:3001/users/login
Content-Type: application/json
```

```json
{
  "email": "jugador@example.com",
  "password": "Clave de ejemplo 123"
}
```

**Respuesta esperada:** HTTP `200 OK`.

```json
{
  "message": "Login successful",
  "accessToken": "[JWT_GENERADO]",
  "tokenType": "Bearer",
  "expiresIn": "1h",
  "user": {
    "id": "ID_DEL_USUARIO",
    "username": "Jugador1",
    "email": "jugador@example.com"
  }
}
```

El JWT utiliza HS256 y contiene el identificador del usuario en `sub`, además de los campos estándar de emisión y expiración.

La emisión del JWT está implementada. **La validación de tokens para autorizar el acceso a endpoints protegidos constituye una etapa posterior**, según el alcance de Authentication V1.

### Respuestas de autenticación

| Situación | Estado HTTP |
|---|---|
| Registro exitoso | `201` |
| Login exitoso | `200` |
| Datos inválidos | `400` |
| Credenciales incorrectas | `401` |
| Email registrado previamente | `409` |

Las respuestas de login incorrecto no deben revelar si el correo existe o si la contraseña es errónea.

## 7. Estadísticas y progreso

### Consultar estadísticas

```http
GET http://localhost:3001/users/ID_DEL_USUARIO/stats
```

La respuesta proporciona información acumulada del usuario:

```json
{
  "_id": "ID_DEL_USUARIO",
  "stats": {
    "totalGamesPlayed": 10,
    "totalTicketsCompleted": 45,
    "totalTicketsFailed": 5,
    "totalPlayTimeSeconds": 3600
  }
}
```

El frontend puede utilizar estos valores para representar métricas y listas dinámicas.

### Actualizar estadísticas

```http
PATCH http://localhost:3001/users/ID_DEL_USUARIO/stats
Content-Type: application/json
```

```json
{
  "gamesPlayed": 1,
  "ticketsCompleted": 6,
  "ticketsFailed": 1,
  "playTimeSeconds": 180
}
```

Los valores representan **incrementos**, no sustituciones de los totales almacenados.

### Consultar progreso

```http
GET http://localhost:3002/progress/ID_DEL_USUARIO
```

### Actualizar progreso

```http
PATCH http://localhost:3002/progress/ID_DEL_USUARIO
Content-Type: application/json
```

```json
{
  "worldId": "world_1",
  "levelId": "1-1",
  "score": 1500,
  "starsEarned": 3
}
```

El servicio conserva el máximo histórico de puntuación y estrellas correspondiente a cada nivel.

## 8. Registro de partidas y sincronización

El videojuego o PWA puede enviar resultados al finalizar una partida:

```http
POST http://localhost:3003/sessions
Content-Type: application/json
```

```json
{
  "levelId": "1-1",
  "worldId": "world_1",
  "players": ["6aab11e2e164cb11eb8b7a25"],
  "score": 1250,
  "starsEarned": 3,
  "ticketsCompleted": 6,
  "ticketsFailed": 1,
  "durationSeconds": 180
}
```

### Flujo de sincronización

1. Session Service valida los datos de la partida.
2. Verifica que no se repitan identificadores dentro de `players`.
3. Registra la sesión en MongoDB.
4. Actualiza las estadísticas del usuario mediante User Service.
5. Actualiza los mejores resultados mediante Progress Service.
6. Devuelve el resultado de la sincronización.

En la integración original se verificó el registro exitoso de sesiones con respuesta `201`.

### Manejo de errores parciales

El sistema no implementa transacciones distribuidas entre los tres servicios.

Si ocurre un fallo después de persistir la sesión, esta puede conservarse aunque parte de las estadísticas o del progreso no se haya actualizado.

La implementación de referencia comunica estas situaciones mediante una respuesta HTTP `502`, indicando que la sesión fue creada, pero la sincronización quedó incompleta.

**Limitación conocida:** no se dispone todavía de un mecanismo completo de idempotencia o recuperación automática de sincronizaciones parciales. Reenviar una sesión puede generar registros y actualizaciones duplicados.

## 9. Configuración del entorno

Cada microservicio debe contar con sus propias variables de entorno.

### Variables generales

```dotenv
PORT=3001
MONGO_URI=CADENA_DE_CONEXION
```

Los puertos varían según el servicio:

| Servicio | Puerto |
|---|---|
| User | `3001` |
| Progress | `3002` |
| Session | `3003` |

### User Service

Además de la configuración de MongoDB:

```dotenv
JWT_SECRET=SECRETO_ALEATORIO_SEGURO
JWT_EXPIRES_IN=1h
```

`JWT_SECRET` debe generarse mediante un mecanismo criptográficamente seguro y mantenerse fuera del repositorio.

### Session Service

```dotenv
USER_SERVICE_URL=http://localhost:3001
PROGRESS_SERVICE_URL=http://localhost:3002
DOWNSTREAM_REQUEST_TIMEOUT_MS=5000
```

Estas variables corresponden a la integración HTTP de referencia.

**Importante:** antes de ejecutar el repositorio unificado, se deben contrastar los nombres de las variables con el código actual, especialmente si se añadieron CORS, una base MongoDB local o nuevos scripts de inicialización.

## 10. Instalación y ejecución local

### Requisitos

- Node.js y npm, en versiones compatibles con los `package.json`.
- Acceso a MongoDB local o remoto, según la configuración utilizada.
- Credenciales de conexión válidas.
- Postman u otro cliente HTTP para realizar pruebas.

### Instalación de dependencias

Desde la carpeta `backend/`:

```powershell
cd user-service
npm install
```

Repetir la instalación en `progress-service` y `session-service`.

### Ejecución

Abrir una terminal independiente para cada servicio y ejecutar:

```powershell
npm run dev
```

dentro de la carpeta correspondiente.

Los servicios deben iniciarse en sus puertos configurados y establecer correctamente la conexión con MongoDB.

### Verificación de disponibilidad

```http
GET http://localhost:3001/health
GET http://localhost:3002/health
GET http://localhost:3003/health
```

Posteriormente pueden verificarse los contratos REST con Postman.

### Datos de demostración

Si la versión integrada incorpora un script `seed`, debe ejecutarse únicamente después de revisar su definición en `package.json`, las colecciones que modifica y sus efectos sobre los datos existentes.

No se recomienda ejecutar scripts de inicialización o reinicio de datos sin comprobar previamente su comportamiento.

## 11. Seguridad

Se contemplan las siguientes medidas:

- Contraseñas protegidas mediante hash Argon2id.
- Emisión de JWT con expiración.
- Hashes y secretos excluidos de respuestas públicas.
- Validaciones de datos de entrada.
- Manejo de errores HTTP.
- Credenciales almacenadas en variables de entorno.
- Exclusión de `.env` y dependencias del control de versiones.

### Mejoras futuras

- Verificación de JWT en endpoints protegidos.
- Autorización por propietario del recurso.
- Rate limiting para registro e inicio de sesión.
- HTTPS en producción.
- Configuración CORS restringida a los orígenes autorizados.
- Recuperación de contraseñas.
- Idempotencia y recuperación de sincronizaciones parciales.
- Pruebas automatizadas de integración.

## 12. Pruebas realizadas en la implementación de referencia

Durante el desarrollo del backend original se realizaron pruebas funcionales con Postman y MongoDB Atlas.

Se verificaron:

- Registro de usuarios y almacenamiento del hash Argon2id.
- Inicio de sesión y emisión de JWT.
- Normalización de correos electrónicos.
- Rechazo de emails duplicados con HTTP `409`.
- Rechazo de credenciales incorrectas con HTTP `401`.
- Compatibilidad con usuarios anteriores a la implementación de autenticación.
- Registro de partidas mediante Session Service.
- Incremento acumulativo de estadísticas.
- Conservación independiente de récords.
- Rechazo de jugadores duplicados en una sesión.
- Respuesta ante fallos parciales de sincronización.

Estos resultados corresponden a la implementación original probada. La versión integrada del repositorio debe validarse nuevamente si su configuración o lógica fue modificada.

## 13. Alcance y estado del proyecto

El backend proporciona los servicios necesarios para gestionar la identidad, las estadísticas, el progreso y las sesiones de Fix IT!.

Su arquitectura permite que una PWA consuma datos remotos mediante solicitudes HTTP y los represente dinámicamente en sus interfaces.

El uso de JWT para proteger las operaciones, la consulta general del historial, el leaderboard y la recuperación automática ante fallos forman parte de funcionalidades pendientes o sujetas a verificación en la versión integrada.

Esta documentación describe la arquitectura de referencia del backend y sus contratos conocidos. Cualquier funcionalidad incorporada posteriormente deberá contrastarse con el código fuente antes de considerarse parte de la implementación actual.