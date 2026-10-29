# Despliegue del backend Fix IT!

Este documento describe la configuración detectada y el despliegue independiente de los cuatro microservicios. No se ha creado ningún recurso externo ni se afirma que haya una API pública activa.

## Arquitectura y comandos

| Servicio | Directorio | Puerto local | Colección principal | Render root directory | Build / start |
|---|---|---:|---|---|---|
| User Service | `backend/user-service` | 3001 | `users` | `backend/user-service` | `npm ci --omit=dev` / `npm start` |
| Progress Service | `backend/progress-service` | 3002 | `user_progress` | `backend/progress-service` | `npm ci --omit=dev` / `npm start` |
| Session Service | `backend/session-service` | 3003 | `game_sessions` | `backend/session-service` | `npm ci --omit=dev` / `npm start` |
| News Service | `backend/news-service` | 3004 | `news` | `backend/news-service` | `npm ci --omit=dev` / `npm start` |

Cada servicio tiene su `server.js`, `package.json`, `package-lock.json`, `.env.example`, conexión Mongoose y ruta `GET /health`. Node `>=20.19.0` es necesario por Mongoose 9. El código conserva las colecciones actuales; la separación está en los servicios y colecciones, no en bases Mongo distintas por defecto. Los ejemplos locales apuntan a la base `fixit`.

El frontend configura llamadas directas a User, Progress y Session. No encontré un cliente de News en `frontend/src`; News queda disponible para consumo externo, pero no está integrado en la PWA. Session guarda primero la sesión y luego intenta actualizar User y Progress mediante HTTP. Esas actualizaciones son de mejor esfuerzo, con timeout de cinco segundos; el `201` de Session confirma el guardado de su sesión, no la sincronización distribuida.

## Variables de entorno

| Variable | Servicio | Propósito | Render |
|---|---|---|---|
| `PORT` | Todos | Puerto HTTP; se usa `3001`–`3004` localmente y Render lo asigna en el servicio web. | Automática en Render |
| `MONGO_URI` | Todos | Conexión a MongoDB y selección de base de datos en la ruta de la URI. | Configurar como secreto en cada servicio |
| `FRONTEND_URL` | Todos | Origen permitido por CORS. | Configurar con el origen HTTPS real de la PWA |
| `USER_SERVICE_URL` | Session | Host de User para sincronizar estadísticas. | Blueprint lo referencia en la red privada |
| `PROGRESS_SERVICE_URL` | Session | Host de Progress para sincronizar progreso. | Blueprint lo referencia en la red privada |

Los `.env.example` contienen valores locales ficticios. Copia el ejemplo del servicio a `.env` para desarrollo y reemplaza `MONGO_URI` por una instancia local. No uses los archivos `.env` ignorados para configurar Render. `FRONTEND_URL` debe ser solo el origen (esquema y host), sin ruta.

## Preparación local

Desde cada directorio de servicio:

```powershell
Copy-Item .env.example .env
npm ci
npm test
npm run dev
```

Repite en cuatro terminales. La base debe estar accesible antes del arranque. Para comprobar procesos HTTP, solicita `GET http://localhost:3001/health` hasta `:3004/health`. `/health` prueba el proceso HTTP, no consulta MongoDB ni valida los flujos de negocio.

Los scripts `data:init`, `data:clean` y `seed` modifican datos. No los ejecutes contra Atlas de producción; el inicializador de laboratorio elimina registros reservados antes de cargarlos.

## MongoDB Atlas

1. Crea o selecciona un clúster y una base para cada servicio si quieres aislamiento operativo. Como mínimo, asigna a cada servicio solo los permisos de lectura/escritura que necesita en su base; evita usuarios administradores.
2. Crea un usuario de base de datos con una contraseña única.
3. En Network Access, permite solo las direcciones de salida necesarias. Obtén los rangos de salida del servicio en Render Dashboard → servicio → Connect → Outbound y agrégalos a Atlas; son rangos compartidos por región. No habilites `0.0.0.0/0` como valor predeterminado. Render ofrece IPs de salida dedicadas como opción de pago en planes compatibles; puedes evaluar esa alternativa si no aceptas allowlisting de rangos compartidos.
4. Copia la URI del driver Node.js y selecciona la base correspondiente en su ruta. No pegues credenciales en terminales compartidas, commits ni documentos.
5. Configura una URI distinta por servicio en Render, con permisos mínimos sobre su propia base. El repositorio local contiene configuración Atlas ignorada para algunos servicios; el proceso de despliegue no usa ni revela esos valores.
6. Después del deploy, verifica el estado de conexión en logs de Render y llama a un endpoint de lectura conocido. No uses datos reales para pruebas destructivas.

El backend actual comparte colecciones y no exige bases distintas por contrato. Si la instancia existente almacena datos compartidos, conserva esa base durante la primera puesta en marcha; separar bases requiere planear una migración y no forma parte de este cambio.

## Blueprint de Render

El archivo [`../render.yaml`](../render.yaml) declara cuatro servicios Node independientes. En el Dashboard, crea un Blueprint desde la rama que se quiera desplegar (actualmente el checkout está en `jesus-work`) y revisa el plan y costo antes de confirmar la creación. No se ha sincronizado ni desplegado el Blueprint.

Render solicita los valores `sync: false` al crear inicialmente el Blueprint. Configura para cada servicio `MONGO_URI` y `FRONTEND_URL`; agrega o actualiza manualmente secretos después de la creación inicial si Render no vuelve a solicitarlos. La referencia `fromService` entrega a Session el hostname y puerto privados de User y Progress; el cliente añade HTTP cuando la variable no incluye esquema. Mantén los servicios en la misma región para su red privada.

Cada servicio usa `npm ci --omit=dev` y `npm start`, ejecuta con Node `24.22.1` y declara `/health` como comprobación. No se necesita Docker. Las llamadas de negocio a Atlas salen desde cada servicio desplegado.

## Orden de despliegue y verificación remota

1. Confirma que la rama a desplegar contiene `render.yaml` y revisa el costo de los cuatro web services.
2. Configura las cuatro URIs de Atlas (o la base compartida existente) y el origen HTTPS final de la PWA para `FRONTEND_URL`.
3. Despliega User y Progress. Comprueba sus URLs `https://...onrender.com/health` y las lecturas apropiadas.
4. Despliega Session; verifica en Render que `USER_SERVICE_URL` y `PROGRESS_SERVICE_URL` tienen los hosts privados referenciados. Prueba el registro de una sesión con una cuenta y datos de prueba; confirma por separado las estadísticas y el progreso.
5. Despliega News y comprueba su health y lectura de noticias.
6. Configura las tres URLs HTTPS en el entorno de build del frontend (`VITE_USER_API_URL`, `VITE_PROGRESS_API_URL` y `VITE_SESSION_API_URL`) y vuelve a publicar la PWA. News no tiene variable ni cliente frontend implementado en este checkout.
7. Prueba desde una red externa las rutas de salud y los flujos principales. Revisa CORS desde el origen de la PWA y verifica los errores de red/HTTP de Session en logs sin exponer credenciales.

`/health` de cada servicio informa solo que el proceso HTTP responde. Una ruta `201` de sesión tampoco prueba el éxito de los dos servicios dependientes: revisa sus datos por separado.

## Seguridad y limitaciones conocidas

- Las rutas de escritura carecen de autenticación/autorización: `PATCH /users/:id/stats`, `PATCH /progress/:userId`, `POST /sessions` y `POST /news` son públicas. Registro y login también son públicos por diseño. CORS no protege estas rutas. No publiques datos reales hasta definir e implementar autenticación y permisos; eso cambia el comportamiento público y requiere una decisión de producto.
- News permite a cualquier cliente publicar noticias. User y Progress permiten mutar estadísticas/progreso de cualquier ID. Session acepta registros que disparan incrementos en los demás servicios. Estas son exposiciones de datos, fraude y abuso de recursos.
- `GET /users` y leaderboard exponen nombres y estadísticas públicas. Confirma que esto corresponde al producto antes de abrir el servicio a internet.
- Session no es transaccional ni idempotente entre servicios. Errores HTTP, de red o timeout quedan registrados de forma resumida, pero la sesión principal sigue respondiendo `201` después de persistirse. No se añadieron reintentos para evitar duplicar incrementos.
- Los endpoints de salud existentes no chequean Atlas. La app no empieza a escuchar hasta que Mongoose conecta; un problema de Atlas impide el arranque.
- Los paquetes tienen lockfiles independientes; las pruebas existentes estaban vacías (`test` era un marcador) y ahora hay una prueba HTTP local por servicio. No hay pruebas de integración de Mongo/Atlas.
- Los archivos `.env` locales están ignorados por Git y no están en el índice actual. No se revisó ni reescribió el historial remoto; si esas credenciales se compartieron por otro canal, rótalas desde Atlas.

## Dominios, HTTPS y CORS

Render proporciona HTTPS para los dominios `onrender.com`. Si se usa dominio propio, vincúlalo en el servicio web correspondiente y sigue la verificación DNS/TLS de Render. Establece `FRONTEND_URL` al origen HTTPS exacto del frontend; una aplicación con varios orígenes necesita ampliar la política CORS mediante un cambio revisado.

## Resolución rápida de problemas

- **El servicio no arranca:** confirma `MONGO_URI`, usuario/contraseña codificados correctamente en la URI, permisos de Atlas y Network Access. Los logs ocultan el mensaje de driver para no filtrar la URI.
- **Render no detecta el puerto:** conserva `PORT` de Render; no fijes puertos locales en el Dashboard.
- **El navegador bloquea la API:** revisa que `FRONTEND_URL` coincida exactamente con el origen (incluido HTTPS) y que el preflight OPTIONS responda 204.
- **Session crea partida sin progreso actualizado:** verifica conectividad privada y status de User/Progress; la escritura de sesión no revierte por fallos remotos.
- **`npm ci` falla:** confirma que el servicio usa su propio `rootDir` y que se comitearon juntos el `package.json` y el lockfile correspondiente.
