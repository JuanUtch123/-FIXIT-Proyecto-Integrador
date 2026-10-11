# Fix IT! — Backend REST API

## 1. Descripción del proyecto

**Fix IT!** es un proyecto integrador orientado al aprendizaje del diagnóstico, mantenimiento y reparación de equipos de cómputo mediante una experiencia de videojuego cooperativo.

El backend proporciona los servicios necesarios para administrar usuarios, autenticar credenciales, registrar sesiones de juego, almacenar estadísticas y consultar el progreso de los jugadores.

Como parte de la propuesta de una **Aplicación Web Progresiva (PWA)**, el backend expone una API REST que permite recuperar información en formato JSON para su representación dinámica en una interfaz web.

La solución utiliza una arquitectura basada en tres microservicios desarrollados con **Node.js, Express y Mongoose**, utilizando MongoDB para la persistencia de datos.

## 2. Objetivo de la arquitectura

Diseñar y documentar una arquitectura de servicios REST que permita conectar una PWA con la información del videojuego Fix IT!, contemplando:

- Recuperación de datos mediante solicitudes HTTP.
- Intercambio de información en formato JSON.
- Consulta de perfiles, estadísticas, progreso y resultados.
- Obtención de listas dinámicas de jugadores y sesiones.
- Separación de responsabilidades entre microservicios.
- Persistencia de información mediante MongoDB.

Esta arquitectura permite que la PWA obtenga datos del backend y actualice su interfaz sin necesidad de recargar completamente la página.

## 3. Arquitectura del backend

El sistema se organiza en tres microservicios independientes, cada uno con responsabilidades específicas.

| Microservicio | Puerto predeterminado | Responsabilidad |
|---|---|---|
| User Service | `3001` | Registro, inicio de sesión, perfiles, estadísticas acumuladas y clasificación de jugadores. |
| Progress Service | `3002` | Consulta y actualización del progreso de los jugadores. |
| Session Service | `3003` | Registro histórico de sesiones, consulta de partidas y generación de resúmenes. |

### 3.1 Diagrama de arquitectura

```text
                       PWA / Videojuego
                              |
                         HTTP / JSON
                              |
               +--------------+--------------+
               |              |              |
               v              v              v
          User Service   Progress Service  Session Service
             :3001            :3002           :3003
               ^                                |
               |                                |
               +--------- HTTP / REST ----------+
                              |
                              v
                       MongoDB
```

Cada servicio administra sus operaciones mediante modelos Mongoose y conexiones MongoDB configurables.

Session Service también se comunica con User Service y Progress Service para actualizar información relacionada con las partidas registradas.

### 3.2 Arquitectura interna

Los microservicios utilizan una separación por capas:

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
 Mongoose Model
     |
     v
   MongoDB
```

**Responsabilidades de las capas:**

| Capa | Responsabilidad |
|---|---|
| Route | Define los endpoints y métodos HTTP. |
| Controller | Recibe solicitudes y devuelve respuestas HTTP. |
| Service | Aplica validaciones y reglas de negocio. |
| Repository | Ejecuta consultas y actualizaciones de datos. |
| Model | Define la estructura de los documentos MongoDB mediante Mongoose. |

Los servicios también utilizan validación de datos. Su ubicación concreta depende del microservicio: algunas comprobaciones se realizan en módulos `validators` y otras directamente en la capa Service.

## 4. Tecnologías utilizadas

| Tecnología | Propósito |
|---|---|
| Node.js | Ejecución del backend en JavaScript. |
| Express | Implementación de las APIs REST. |
| MongoDB | Almacenamiento documental. |
| Mongoose | Modelado y acceso a MongoDB. |
| JavaScript ES Modules | Organización del código mediante módulos. |
| `node:crypto` | Generación y verificación de hashes de contraseñas mediante `scrypt`. |
| dotenv | Administración de variables de entorno. |
| Fetch API | Comunicación HTTP entre microservicios. |
| Postman | Pruebas manuales de endpoints. |
| Git y GitHub | Control de versiones. |

## 5. Modelo de persistencia

La persistencia utiliza MongoDB y tres colecciones principales.

| Colección | Microservicio responsable | Información almacenada |
|---|---|---|
| `users` | User Service | Usuarios, credenciales protegidas y estadísticas. |
| `user_progress` | Progress Service | Progreso organizado por mundos y niveles. |
| `game_sessions` | Session Service | Historial y resultados de las partidas. |

La configuración del servidor y de la base de datos se establece mediante `MONGO_URI`. Por lo tanto, el backend puede utilizar una instancia MongoDB local o remota, siempre que las conexiones estén correctamente configuradas.

### 5.1 Usuarios

Cada usuario dispone de datos de identificación y estadísticas acumuladas.

Entre los campos de estadísticas se encuentran:

- `totalGamesPlayed`: partidas jugadas.
- `totalTicketsCompleted`: tickets completados.
- `totalTicketsFailed`: tickets fallidos.
- `totalPlayTimeSeconds`: tiempo acumulado de juego.
- `totalScore`: puntuación acumulada.
- `totalStars`: estrellas acumuladas.

Las contraseñas no se almacenan en texto plano. User Service utiliza `node:crypto.scrypt` con salt aleatorio para generar y verificar hashes.

### 5.2 Progreso

El progreso se organiza por identificadores de mundo y nivel.

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

Progress Service conserva de forma independiente la mejor puntuación y la mayor cantidad de estrellas alcanzadas por nivel.

### 5.3 Sesiones de juego

Session Service conserva registros históricos de las partidas.

Los datos incluyen identificadores de jugadores, mundo, nivel, puntuación, estrellas, tickets completados o fallidos y duración.

El modelo también contempla información relacionada con el equipo reparado, tipo de reparación, estado de finalización y fecha de juego.

Estos datos permiten elaborar consultas históricas y resúmenes para su presentación en la PWA.

## 6. Consumo de API REST

La comunicación entre la PWA y el backend se plantea mediante solicitudes HTTP a endpoints REST.

Cada solicitud sigue el flujo general:

```text
PWA
 |
 | Solicitud HTTP
 v
Endpoint REST
 |
 v
Controller / Service
 |
 v
Repository
 |
 v
MongoDB
 |
 | Datos consultados
 v
Respuesta JSON
 |
 v
PWA
 |
 v
Actualización dinámica de la interfaz
```

La aplicación cliente podrá utilizar los datos recibidos para mostrar perfiles, tablas, estadísticas y listas de resultados.

### 6.1 User Service

**URL local predeterminada:** `http://localhost:3001`

| Método | Endpoint | Función |
|---|---|---|
| GET | `/health` | Consultar el estado del servicio. |
| POST | `/users/register` | Registrar un nuevo usuario. |
| POST | `/users/login` | Verificar credenciales e iniciar sesión. |
| GET | `/users/:id` | Consultar el perfil de un jugador. |
| GET | `/users/:id/stats` | Recuperar estadísticas acumuladas. |
| PATCH | `/users/:id/stats` | Incrementar estadísticas del jugador. |
| GET | `/users/leaderboard` | Recuperar la clasificación de jugadores. |

El endpoint de leaderboard devuelve hasta 20 jugadores, ordenados principalmente por puntuación acumulada (`totalScore`) y posteriormente por tickets completados (`totalTicketsCompleted`), ambos en orden descendente.

El resultado permite construir una tabla o lista dinámica de clasificación.

### 6.2 Progress Service

**URL local predeterminada:** `http://localhost:3002`

| Método | Endpoint | Función |
|---|---|---|
| GET | `/health` | Consultar el estado del servicio. |
| GET | `/progress/:userId` | Recuperar el progreso de un jugador. |
| PATCH | `/progress/:userId` | Actualizar puntuación y estrellas máximas por nivel. |

El endpoint de consulta devuelve una estructura organizada por mundos y niveles.

La PWA podrá transformar esta información en listas o tarjetas que presenten los resultados obtenidos por el jugador.

### 6.3 Session Service

**URL local predeterminada:** `http://localhost:3003`

| Método | Endpoint | Función |
|---|---|---|
| GET | `/health` | Consultar el estado del servicio. |
| POST | `/sessions` | Registrar una partida. |
| GET | `/sessions/user/:userId` | Consultar las sesiones recientes de un jugador. |
| GET | `/sessions/user/:userId/summary` | Recuperar información resumida de sus sesiones. |

El historial por usuario devuelve hasta 20 sesiones ordenadas por fecha de juego descendente.

El endpoint de resumen proporciona información agrupada en:

| Propiedad | Descripción |
|---|---|
| `repairTypes` | Información agrupada por tipos de reparación. |
| `weekly` | Distribución de actividad por día de la semana. |
| `recent` | Lista de hasta cinco sesiones recientes. |

La información `weekly` agrupa las sesiones históricas por día de la semana; no representa exclusivamente la semana calendario actual.

Actualmente, el backend no implementa un endpoint general `GET /sessions` sin identificador de usuario.

## 7. Propuesta de recuperación y renderizado dinámico

Para cumplir el objetivo de consumo de API de la PWA, se propone utilizar los endpoints de consulta existentes y transformar sus respuestas JSON en elementos visuales.

### 7.1 Leaderboard

**Origen de datos:**

```http
GET http://localhost:3001/users/leaderboard
```

**Proceso propuesto:**

1. La PWA solicita la clasificación a User Service.
2. El servicio consulta MongoDB y recupera los jugadores ordenados.
3. El backend devuelve un arreglo JSON.
4. El frontend procesa los registros.
5. La interfaz genera dinámicamente las filas de clasificación.

**Información que podrá representarse:**

| Posición | Jugador | Puntuación | Tickets completados |
|---|---|---|---|
| 1 | Jugador A | 5000 | 25 |
| 2 | Jugador B | 4200 | 21 |
| 3 | Jugador C | 3500 | 18 |

*Los valores de esta tabla son ilustrativos y no representan registros reales de MongoDB.*

### 7.2 Historial de partidas

**Origen de datos:**

```http
GET http://localhost:3003/sessions/user/:userId
```

La PWA podrá recuperar las sesiones del jugador y presentar una lista con sus resultados, fechas, puntuaciones y duración.

La lista se actualizará al recuperar información nueva del servicio.

### 7.3 Progreso por niveles

**Origen de datos:**

```http
GET http://localhost:3002/progress/:userId
```

El frontend podrá recorrer los mundos y niveles recibidos para construir una lista dinámica de récords.

Cada elemento podrá mostrar el identificador del nivel, la mejor puntuación y el máximo de estrellas obtenidas.

### 7.4 Estados de la interfaz

La propuesta contempla cuatro estados durante el consumo de las APIs:

| Estado | Comportamiento esperado |
|---|---|
| Carga | Mostrar un indicador mientras se recupera información. |
| Éxito | Representar los datos devueltos por la API. |
| Sin resultados | Informar que todavía no existen registros disponibles. |
| Error | Mostrar un mensaje cuando falle la solicitud o el servicio. |

Esta separación permitirá comunicar al usuario el estado de recuperación de información sin depender de recargas completas de página.

## 8. Registro e inicio de sesión

User Service permite registrar usuarios y verificar sus credenciales.

### 8.1 Registro

```http
POST http://localhost:3001/users/register
Content-Type: application/json
```

**Ejemplo de solicitud:**

```json
{
  "username": "Jugador1",
  "email": "jugador@example.com",
  "password": "clave-de-demostracion"
}
```

El backend valida los campos, comprueba la disponibilidad del correo y registra las credenciales utilizando un hash generado con `scrypt`.

El registro exitoso responde con HTTP `201` y un objeto `user` con información pública.

La implementación actual contempla unicidad de correo y nombre de usuario en el modelo, aunque no todos los errores de duplicidad están normalizados al mismo código HTTP.

### 8.2 Inicio de sesión

```http
POST http://localhost:3001/users/login
Content-Type: application/json
```

**Ejemplo de solicitud:**

```json
{
  "email": "jugador@example.com",
  "password": "clave-de-demostracion"
}
```

Después de validar las credenciales, el servicio devuelve información pública del usuario.

**Estructura de respuesta:**

```json
{
  "user": {
    "_id": "ID_DEL_USUARIO",
    "username": "Jugador1",
    "email": "jugador@example.com"
  }
}
```

El documento puede contener otros campos públicos, como estadísticas y fecha de creación.

**Estado actual de seguridad:** el login no emite JWT y los endpoints no disponen de middleware de autorización basado en tokens. La incorporación de JWT y la protección de operaciones son mejoras futuras.

## 9. Actualización de estadísticas

User Service permite incrementar los valores acumulados del jugador mediante:

```http
PATCH http://localhost:3001/users/:id/stats
Content-Type: application/json
```

**Ejemplo de solicitud:**

```json
{
  "gamesPlayed": 1,
  "ticketsCompleted": 6,
  "ticketsFailed": 1,
  "playTimeSeconds": 180,
  "score": 1250,
  "stars": 3
}
```

La implementación actual requiere los seis campos numéricos, utilizando valores enteros no negativos.

Las operaciones incrementan los valores previamente almacenados mediante `$inc` de MongoDB, en lugar de sustituir las estadísticas acumuladas.

## 10. Registro de sesiones e integración entre servicios

Session Service permite registrar los resultados de una partida mediante:

```http
POST http://localhost:3003/sessions
Content-Type: application/json
```

**Ejemplo de solicitud:**

```json
{
  "levelId": "1-1",
  "worldId": "world_1",
  "players": [
    "ID_DEL_JUGADOR"
  ],
  "score": 1250,
  "starsEarned": 3,
  "ticketsCompleted": 6,
  "ticketsFailed": 1,
  "durationSeconds": 180
}
```

### Flujo de procesamiento

1. Session Service recibe los datos y realiza las validaciones disponibles.
2. Registra la sesión en MongoDB.
3. Envía solicitudes HTTP para actualizar los datos en User Service y Progress Service.
4. Espera los resultados mediante `Promise.allSettled`.
5. Devuelve una respuesta de creación de sesión.

La comunicación con los servicios se ejecuta de manera concurrente.

### Alcance de la sincronización

La implementación actual registra primero la sesión, pero no proporciona una transacción distribuida que garantice la actualización conjunta de todos los servicios.

El resultado HTTP `201` confirma la creación de la sesión, pero no garantiza que todas las actualizaciones de estadísticas y progreso hayan concluido exitosamente.

Tampoco existe una garantía completa de idempotencia. Enviar nuevamente una partida puede generar registros duplicados e incrementos adicionales.

Actualmente, la validación no garantiza la unicidad de los identificadores contenidos en `players`.

Estas limitaciones se consideran oportunidades de mejora para futuras versiones del backend.

## 11. Configuración del entorno

Los microservicios utilizan variables de entorno para configurar sus conexiones y ejecución.

### Variables utilizadas

| Variable | Servicios | Función |
|---|---|---|
| `MONGO_URI` | User, Progress, Session | Cadena de conexión a MongoDB. |
| `PORT` | User, Progress, Session | Puerto de ejecución. |
| `FRONTEND_URL` | User, Progress, Session | Origen permitido por la configuración CORS. |
| `USER_SERVICE_URL` | Session | Dirección HTTP de User Service. |
| `PROGRESS_SERVICE_URL` | Session | Dirección HTTP de Progress Service. |

Los tres servicios incluyen configuración CORS para permitir solicitudes desde el origen establecido mediante `FRONTEND_URL`.

Las direcciones utilizadas durante el desarrollo pueden apuntar a `localhost`. Para un despliegue remoto se deberán configurar direcciones accesibles y conexiones seguras.

Los archivos `.env` deben mantenerse fuera del control de versiones.

No se deben publicar contraseñas, secretos ni cadenas de conexión reales.

## 12. Instalación y ejecución

### 12.1 Requisitos

- Node.js compatible con las dependencias del proyecto (se recomienda Node.js 22 o posterior).
- npm.
- Instancia de MongoDB local o remota accesible.
- Variables de entorno configuradas.
- Postman u otro cliente HTTP para pruebas.

### 12.2 Instalación de dependencias

Desde la carpeta `backend/`, instalar las dependencias de cada servicio:

```powershell
cd user-service
npm install
```

Repetir el procedimiento para `progress-service` y `session-service`.

### 12.3 Ejecución

Cada microservicio se ejecuta en una terminal independiente, dentro de su carpeta:

```powershell
npm run dev
```

También se encuentra disponible:

```powershell
npm start
```

Los puertos predeterminados son:

| Servicio | Puerto |
|---|---|
| User Service | `3001` |
| Progress Service | `3002` |
| Session Service | `3003` |

### 12.4 Comprobación de servicios

La disponibilidad HTTP puede consultarse mediante:

```http
GET http://localhost:3001/health
GET http://localhost:3002/health
GET http://localhost:3003/health
```

Los endpoints de salud permiten comprobar que cada aplicación responde a solicitudes HTTP, aunque no necesariamente realizan una comprobación de conectividad a MongoDB en cada petición.

### 12.5 Datos de demostración

User Service dispone del comando:

```powershell
npm run seed
```

Este script crea datos de demostración para el proyecto.

**Advertencia:** el script elimina y vuelve a insertar determinados datos de demostración en las colecciones utilizadas por su conexión MongoDB.

No debe ejecutarse sobre información importante sin revisar previamente su comportamiento y el destino configurado.

Cuando los microservicios utilizan bases lógicas diferentes, el script no inicializa automáticamente todas las bases de los demás servicios.

## 13. Seguridad

La implementación actual contempla:

- Hash de contraseñas mediante `node:crypto.scrypt`.
- Uso de salt aleatorio.
- Comparación segura mediante `timingSafeEqual`.
- Exclusión de hashes en las respuestas públicas de autenticación.
- Validaciones de entrada en las operaciones REST.
- Configuración CORS mediante origen permitido.
- Configuración sensible mediante variables de entorno.

### Mejoras futuras

Se propone incorporar:

- Autenticación basada en JWT.
- Verificación de tokens en rutas protegidas.
- Autorización por usuario propietario de los recursos.
- Limitación de solicitudes de autenticación.
- Normalización integral de errores HTTP.
- HTTPS para despliegue en producción.
- Prevención de registros duplicados de sesiones.
- Recuperación automática ante fallos parciales.
- Mayor cobertura de pruebas automatizadas.

Estas mejoras no se consideran características implementadas del backend actual.

## 14. Integración con la PWA

El backend está diseñado para proporcionar información que puede ser consumida por una PWA mediante endpoints remotos.

La integración permitirá:

| Vista propuesta de la PWA | Endpoint de origen |
|---|---|
| Perfil | `GET /users/:id` |
| Estadísticas | `GET /users/:id/stats` |
| Leaderboard | `GET /users/leaderboard` |
| Progreso | `GET /progress/:userId` |
| Historial de partidas | `GET /sessions/user/:userId` |
| Resumen de reparaciones | `GET /sessions/user/:userId/summary` |

La responsabilidad del backend consiste en validar operaciones, aplicar reglas de negocio y proporcionar información estructurada mediante JSON.

La PWA será responsable de recuperar estos datos, procesarlos y representarlos mediante componentes visuales.

Para garantizar una experiencia adecuada, la interfaz deberá contemplar los estados de carga, error, información vacía y actualización de resultados.

Las funcionalidades de instalación, diseño responsivo, Web App Manifest, Service Worker y almacenamiento de recursos estáticos pertenecen a la arquitectura de la PWA y se documentan en el README general del proyecto.

## 15. Alcance y conclusión

El backend de Fix IT! proporciona una arquitectura de servicios REST destinada a administrar usuarios, progreso, estadísticas e información histórica de las partidas.

Los endpoints existentes permiten recuperar colecciones de datos estructurados y proporcionan las bases para construir listas dinámicas de jugadores, resultados y reparaciones dentro de la PWA.

La separación entre User Service, Progress Service y Session Service facilita la organización de responsabilidades y la evolución de las funciones del sistema.

La propuesta de integración satisface el objetivo académico de definir cómo una Aplicación Web Progresiva puede consumir APIs remotas para obtener y representar información de manera dinámica.

Las funcionalidades pendientes y las limitaciones de implementación se identifican para diferenciar el alcance actual del backend de posibles mejoras posteriores.
