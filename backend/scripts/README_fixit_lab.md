# Laboratorio Fix IT! con MongoDB Atlas

## Objetivo

Esta guía explica cómo configurar MongoDB Atlas y ejecutar desde PowerShell el script `data_init.js` para preparar la base de datos de laboratorio del backend de Fix IT!.

El aprovisionador crea información relacionada para comprobar:

- Usuarios y autenticación.
- Estadísticas y clasificación general.
- Sesiones individuales y cooperativas.
- Progreso por mundos y niveles.
- Noticias y novedades.

Se recomienda utilizar una base exclusiva llamada `fixit_lab` y no una base con información real o de producción.

## Requisitos

- Node.js 22 o posterior.
- npm.
- Un clúster activo en MongoDB Atlas.
- Un usuario de base de datos de Atlas con permisos de lectura y escritura.
- La dirección IP del equipo autorizada en Atlas.
- Opcionalmente, `mongosh` para consultar la base desde la terminal.

## 1. Autorizar el equipo en Atlas

MongoDB Atlas solamente acepta conexiones procedentes de direcciones autorizadas.

Desde el proyecto de Atlas:

1. Abra **Database & Network Access**.
2. Entre en **IP Access List** o **Network Access**.
3. Seleccione **Add IP Address**.
4. Agregue la dirección IP pública del equipo desde el cual ejecutará el script.
5. Guarde los cambios y espere a que Atlas aplique la configuración.

Evite autorizar `0.0.0.0/0`, porque permite intentos de conexión desde cualquier dirección. Para un laboratorio, es preferible autorizar únicamente la IP actual y eliminarla cuando deje de utilizarse.

Documentación oficial: [Conectar con un clúster de Atlas](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/).

## 2. Crear un usuario de base de datos

El usuario de MongoDB es diferente del usuario utilizado para entrar al sitio web de Atlas.

Desde **Database Access**:

1. Seleccione **Add New Database User**.
2. Defina un nombre de usuario y una contraseña segura.
3. Asigne permisos de lectura y escritura sobre la base que utilizará el laboratorio.
4. Guarde las credenciales en un lugar seguro.

Para limitar el alcance del usuario, puede asignar el rol `readWrite` únicamente sobre `fixit_lab`.

## 3. Obtener la cadena de conexión

Desde la vista del clúster:

1. Seleccione **Connect**.
2. Elija **Drivers**.
3. Seleccione Node.js como controlador.
4. Copie la cadena de conexión proporcionada por Atlas.

La URI tendrá una estructura similar a esta:

```text
mongodb+srv://<DB_USER>:<DB_PASSWORD>@<CLUSTER_HOST>/<DATABASE>
```

Debe sustituir:

- `USUARIO` por el usuario de base de datos.
- `CONTRASEÑA` por su contraseña.
- `cluster0.xxxxx.mongodb.net` por el hostname real del clúster.

El segmento `/fixit_lab` es importante porque determina la base donde se insertarán los documentos. Si Atlas entrega una URI sin nombre de base, agréguelo antes del signo `?`.

Si la contraseña contiene caracteres como `@`, `:`, `/`, `#`, `%` o espacios, estos deben codificarse para una URL. No deje los caracteres `<` y `>` de los ejemplos en la cadena final.

## 4. Crear el archivo `.env`

Abra PowerShell y entre en la carpeta `backend` del repositorio:

```powershell
cd C:\Users\Oscar\Desktop\juan-repo\-FIXIT-Proyecto-Integrador\backend
```

Copie el archivo de ejemplo:

```powershell
Copy-Item .env.example .env
```

Abra el archivo desde la consola:

```powershell
notepad .env
```

Reemplace su contenido con la URI de Atlas:

```env
MONGO_URI=mongodb+srv://<DB_USER>:<DB_PASSWORD>@<CLUSTER_HOST>/<DATABASE>
```

Guarde y cierre el editor.

El archivo `.env` está ignorado por Git y no debe compartirse ni incluirse en commits. Nunca publique una URI que contenga credenciales reales.

## 5. Instalar las dependencias

Desde la carpeta `backend/` ejecute:

```powershell
npm install
```

Este comando instala las dependencias declaradas en `backend/package.json` para ejecutar las herramientas de aprovisionamiento.

La instalación de estas herramientas no reemplaza la instalación independiente de las dependencias de cada microservicio.

## 6. Cargar el laboratorio

Ejecute:

```powershell
npm run data:init
```

El comando realiza las siguientes operaciones:

1. Se conecta a la base indicada por `MONGO_URI`.
2. Busca los usuarios e identificadores reservados para el laboratorio.
3. Elimina las sesiones y progresos asociados con esos usuarios.
4. Elimina las noticias reservadas por el aprovisionador.
5. Inserta nuevamente todos los documentos del laboratorio.
6. Muestra un resumen de los registros eliminados e insertados.

La salida esperada será similar a:

```text
MongoDB conectado para aprovisionamiento: fixit_lab

Datos de laboratorio eliminados:
users       0
sessions    0
progress    0
news        0

Datos de laboratorio insertados:
users       5
sessions    8
progress    5
news        3

Credenciales de prueba: jugador1@fixit.com / Fixit123
Aprovisionamiento finalizado correctamente.
```

Los conteos eliminados pueden cambiar si el script ya se había ejecutado anteriormente.

## 7. Datos creados

| Colección | Cantidad | Información |
|---|---:|---|
| `users` | 5 | Usuarios, hashes de contraseña y estadísticas. |
| `game_sessions` | 8 | Partidas individuales y cooperativas. |
| `user_progress` | 5 | Mejores puntuaciones y estrellas por jugador. |
| `news` | 3 | Noticias iniciales del videojuego. |

Las estadísticas y el progreso se calculan desde las sesiones generadas. De esta forma, los datos consultados en los distintos microservicios son coherentes entre sí.

## 8. Credenciales de prueba

Todas las cuentas utilizan la contraseña:

```text
Fixit123
```

| Usuario | Correo |
|---|---|
| `Jugador1` | `jugador1@fixit.com` |
| `Player2` | `player2@fixit.com` |
| `Player3` | `player3@fixit.com` |
| `TecnicoNova` | `tecnico.nova@fixit.com` |
| `ByteMaster` | `byte.master@fixit.com` |

El script utiliza `scrypt` para almacenar las contraseñas con hash y salt. La contraseña en texto plano no se guarda en MongoDB.

## 9. Verificar los datos con `mongosh`

Compruebe primero si `mongosh` está instalado:

```powershell
mongosh --version
```

Para conectarse sin escribir la contraseña directamente en el comando:

```powershell
mongosh "mongodb+srv://<DB_USER>:<DB_PASSWORD>@<CLUSTER_HOST>/<DATABASE>" --username USUARIO
```

`mongosh` solicitará la contraseña de manera interactiva.

Documentación oficial: [Conectar con Atlas mediante mongosh](https://www.mongodb.com/docs/atlas/mongo-shell-connection/).

Una vez conectado, ejecute:

```javascript
db.getName()
show collections

db.users.countDocuments()
db.game_sessions.countDocuments()
db.user_progress.countDocuments()
db.news.countDocuments()
```

En una base exclusiva y recién preparada, los resultados serán:

```text
users: 5
game_sessions: 8
user_progress: 5
news: 3
```

También puede consultar un usuario específico:

```javascript
db.users.findOne(
  { email: "jugador1@fixit.com" },
  { passwordHash: 0 },
)
```

## 10. Configurar los microservicios

El archivo `backend/.env` solamente configura el aprovisionador. Para que cada microservicio consulte la misma base de Atlas, configure también su propio archivo `.env`.

Desde `backend/`:

```powershell
Copy-Item user-service/.env.example user-service/.env
Copy-Item progress-service/.env.example progress-service/.env
Copy-Item session-service/.env.example session-service/.env
Copy-Item news-service/.env.example news-service/.env
```

Abra cada archivo y reemplace únicamente `MONGO_URI` con la misma URI de `fixit_lab`. Conserve los puertos, la URL del frontend y las URLs de comunicación entre servicios.

Por ejemplo, `user-service/.env` debe conservar una estructura similar a:

```env
MONGO_URI=mongodb+srv://<DB_USER>:<DB_PASSWORD>@<CLUSTER_HOST>/<DATABASE>
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## 11. Iniciar los servicios

Cada microservicio debe instalarse e iniciarse en una terminal diferente.

### User Service

```powershell
cd backend/user-service
npm install
npm run dev
```

### Progress Service

```powershell
cd backend/progress-service
npm install
npm run dev
```

### Session Service

```powershell
cd backend/session-service
npm install
npm run dev
```

### News Service

```powershell
cd backend/news-service
npm install
npm run dev
```

## 12. Comprobar los endpoints

Desde otra terminal PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:3001/users" -Method Get
Invoke-RestMethod -Uri "http://localhost:3001/users/leaderboard" -Method Get
Invoke-RestMethod -Uri "http://localhost:3002/progress/660000000000000000000001" -Method Get
Invoke-RestMethod -Uri "http://localhost:3003/sessions/user/660000000000000000000001" -Method Get
Invoke-RestMethod -Uri "http://localhost:3003/sessions/user/660000000000000000000001/summary" -Method Get
Invoke-RestMethod -Uri "http://localhost:3004/news" -Method Get
```

Para comprobar el inicio de sesión:

```powershell
$body = @{
  email = "jugador1@fixit.com"
  password = "Fixit123"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3001/users/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

## 13. Ejecutar nuevamente la carga

El aprovisionador puede ejecutarse repetidamente:

```powershell
cd backend
npm run data:init
```

Antes de insertar, elimina únicamente los datos reconocidos como parte del laboratorio. Esto evita duplicar usuarios, sesiones, progresos y noticias reservadas.

## 14. Limpiar el laboratorio

Para eliminar los datos del laboratorio sin volver a crearlos:

```powershell
cd backend
npm run data:clean
```

La limpieza conserva documentos que no correspondan a los usuarios e identificadores reservados por el script. Aun así, siempre debe comprobarse la URI antes de ejecutar el comando.

## 15. Solución de problemas

### Error de selección de servidor

Ejemplos habituales:

```text
MongoServerSelectionError
ECONNREFUSED
ETIMEDOUT
```

Revise:

1. Que el clúster esté activo.
2. Que la IP pública esté incluida en Atlas.
3. Que la red permita conexiones salientes hacia Atlas.
4. Que el hostname de la URI sea correcto.

### Error de autenticación

Si aparece `Authentication failed`:

1. Compruebe el usuario y contraseña de base de datos.
2. Verifique que no esté usando las credenciales de acceso al sitio web de Atlas.
3. Codifique los caracteres especiales de la contraseña.
4. Confirme que el usuario tenga permisos sobre `fixit_lab`.

### Los datos aparecen en `test`

La URI no contiene el nombre de la base. Debe tener `/fixit_lab` antes de los parámetros:

```text
mongodb+srv://<DB_USER>:<DB_PASSWORD>@<CLUSTER_HOST>/<DATABASE>
```

### Los servicios no encuentran los datos

Confirme que los cuatro microservicios utilizan exactamente el mismo nombre de base y clúster que `backend/.env`.

### El comando `mongosh` no existe

Instale MongoDB Shell o verifique los documentos desde la vista **Browse Collections** de Atlas.

## 16. Seguridad

- No suba archivos `.env` al repositorio.
- No comparta capturas que muestren la URI completa.
- Use una base separada para el laboratorio.
- Limite el usuario de Atlas a los permisos necesarios.
- Autorice únicamente las IP requeridas.
- Cambie inmediatamente una contraseña que se haya publicado accidentalmente.
- No ejecute el aprovisionador contra producción.

## Archivos relacionados

- `backend/scripts/data_init.js`: script de carga y limpieza.
- `backend/scripts/README.md`: documentación general del aprovisionador.
- `backend/package.json`: comandos `data:init` y `data:clean`.
- `backend/.env.example`: ejemplo de configuración.
- `backend/README.md`: documentación general de los microservicios.
