# Aprovisionamiento de datos de prueba

## Objetivo

El archivo `data_init.js` prepara un estado inicial reproducible para comprobar el funcionamiento de los microservicios del backend de Fix IT!.

El script realiza dos tareas:

1. Elimina los registros reservados para el laboratorio de pruebas.
2. Inserta nuevamente usuarios, estadísticas, sesiones, progreso y noticias relacionados entre sí.

Puede ejecutarse repetidas veces. Cada carga comienza limpiando los datos de laboratorio anteriores para evitar registros duplicados y resultados acumulados entre pruebas.

## Requisitos

- Node.js 22 o posterior.
- npm.
- Una instancia de MongoDB accesible.
- Permisos de lectura y escritura sobre la base configurada.

Los microservicios no necesitan estar ejecutándose para cargar o limpiar la información. MongoDB sí debe estar disponible.

## Configuración

Los comandos de aprovisionamiento se ejecutan desde la carpeta `backend/`.

Crear el archivo local de variables de entorno:

```powershell
cd backend
Copy-Item .env.example .env
```

El archivo contiene la variable:

```env
MONGO_URI=mongodb://127.0.0.1:27017/fixit
```

Modifique `MONGO_URI` cuando se utilice otro servidor, puerto, base de datos o mecanismo de autenticación.

Si no existe la variable, el script utiliza como valor predeterminado `mongodb://127.0.0.1:27017/fixit`.

> Antes de ejecutar el script contra una base remota, confirme cuidadosamente el valor de `MONGO_URI`.

## Instalación

Instalar las dependencias de las herramientas del backend:

```powershell
cd backend
npm install
```

Esta instalación utiliza `backend/package.json` y no sustituye la instalación independiente de cada microservicio.

## Carga inicial

Para limpiar los datos de laboratorio anteriores y cargar un estado nuevo:

```powershell
cd backend
npm run data:init
```

Este comando ejecuta:

```powershell
node scripts/data_init.js
```

Al finalizar se muestra una tabla con las cantidades eliminadas e insertadas, además de las credenciales principales de prueba.

## Limpieza sin recarga

Para eliminar los datos de laboratorio sin insertar registros nuevos:

```powershell
cd backend
npm run data:clean
```

Este comando ejecuta el script con la opción `--clean-only`:

```powershell
node scripts/data_init.js --clean-only
```

## Datos generados

La carga crea los siguientes registros:

| Colección | Cantidad | Contenido |
|---|---:|---|
| `users` | 5 | Usuarios con credenciales protegidas y estadísticas acumuladas. |
| `game_sessions` | 8 | Sesiones individuales y cooperativas distribuidas en dos mundos. |
| `user_progress` | 5 | Mejores puntuaciones y estrellas por mundo y nivel. |
| `news` | 3 | Noticias iniciales para comprobar la API de novedades. |

Las estadísticas de cada usuario y su progreso se calculan a partir de las sesiones generadas. Esto mantiene consistencia entre los resultados devueltos por User Service, Session Service y Progress Service.

## Usuarios de prueba

Todas las cuentas utilizan la contraseña `Fixit123`.

| Usuario | Correo |
|---|---|
| `Jugador1` | `jugador1@fixit.com` |
| `Player2` | `player2@fixit.com` |
| `Player3` | `player3@fixit.com` |
| `TecnicoNova` | `tecnico.nova@fixit.com` |
| `ByteMaster` | `byte.master@fixit.com` |

Las contraseñas no se guardan en texto plano. El script genera un hash mediante `scrypt`, siguiendo el formato utilizado por User Service.

## Alcance de la limpieza

La limpieza no vacía completamente las colecciones.

El script elimina:

- Los usuarios cuyos identificadores, nombres o correos están reservados para este laboratorio.
- Las sesiones asociadas con esos usuarios.
- Los documentos de progreso asociados con esos usuarios.
- Las noticias con identificadores reservados por el script.

Los registros que no correspondan al dataset de laboratorio se conservan. Aun así, se recomienda utilizar una base exclusiva para pruebas y revisar la conexión antes de ejecutar cualquier limpieza.

## Comprobación del backend

Después de cargar la información, inicie cada microservicio desde su propia carpeta y consulte sus endpoints.

### Usuarios y clasificación

```http
GET http://localhost:3001/users
GET http://localhost:3001/users/leaderboard
```

### Inicio de sesión

```http
POST http://localhost:3001/users/login
Content-Type: application/json

{
  "email": "jugador1@fixit.com",
  "password": "Fixit123"
}
```

### Progreso

El identificador reservado de `Jugador1` es `660000000000000000000001`.

```http
GET http://localhost:3002/progress/660000000000000000000001
```

### Sesiones

```http
GET http://localhost:3003/sessions/user/660000000000000000000001
GET http://localhost:3003/sessions/user/660000000000000000000001/summary
```

### Noticias

```http
GET http://localhost:3004/news
```

## Ejemplo con PowerShell

```powershell
Invoke-RestMethod -Uri "http://localhost:3001/users" -Method Get
Invoke-RestMethod -Uri "http://localhost:3004/news" -Method Get
```

## Funcionamiento interno

`data_init.js` organiza el proceso en tres operaciones principales:

| Función | Responsabilidad |
|---|---|
| `buildLabDocuments` | Construye los documentos y calcula estadísticas y progreso. |
| `cleanLabData` | Elimina únicamente los registros reservados para el laboratorio. |
| `loadLabData` | Inserta los documentos en las cuatro colecciones. |

Los identificadores de los documentos son fijos para facilitar pruebas repetibles y permitir consultas directas durante el laboratorio. Las fechas de sesiones y noticias se calculan con relación al momento de ejecución para mantener datos recientes.

## Solución de problemas

### MongoDB no está disponible

Si aparece un error de selección de servidor o conexión rechazada:

1. Confirme que MongoDB esté iniciado.
2. Verifique el host y puerto de `MONGO_URI`.
3. Compruebe que el firewall permita la conexión.

### Error de autenticación

Verifique que el usuario incluido en `MONGO_URI` tenga permisos de lectura y escritura sobre la base de pruebas.

### Índices o datos duplicados

Ejecute nuevamente:

```powershell
npm run data:clean
npm run data:init
```

Si el error continúa, revise si existen registros ajenos al laboratorio que estén utilizando los mismos correos o nombres de usuario.

### Los endpoints no responden

El aprovisionador solamente prepara MongoDB. Cada microservicio debe instalarse y ejecutarse por separado en los puertos documentados en `backend/README.md`.

## Archivos relacionados

- `backend/scripts/data_init.js`: implementación de carga y limpieza.
- `backend/package.json`: comandos `data:init` y `data:clean`.
- `backend/.env.example`: conexión MongoDB de ejemplo.
- `backend/README.md`: documentación general de todos los microservicios.
