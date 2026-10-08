# Trabajo Práctico Integrador I - API Blog

API RESTful desarrollada en Node.js y Express para la gestión de un blog personal. Incluye autenticación con JWT en cookies, control de roles (User/Admin), validaciones y relaciones con Sequelize.

## Tecnologías

<!--

asdkjasjdhaskjhdkjasd

-->


Node.js, Express 5, Sequelize, MySQL, JWT (cookies httpOnly), bcrypt y express-validator.

## Requisitos e Instalación

1. Clonar el repositorio e instalar dependencias:

```bash
git clone https://github.com/MatutiCode/trabajo-practico-integrador-1.git
cd trabajo-practico-integrador-1
npm install
```

2. Crear una base de datos vacía en MySQL (las tablas las crea Sequelize al iniciar).

3. Copiar `.env.example` a `.env` y completar las variables:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=nombre_de_la_base
DB_PORT=3306

JWT_SECRET=una_clave_secreta
JWT_EXPIRES_IN=24h

PORT=3000
```

4. Iniciar el servidor:

```bash
npm run dev     # con recarga automática
npm start       # modo normal
```

Si todo está bien, la consola muestra "Conexión a la base de datos establecida correctamente".

## Estructura

```
src/
├── config/        conexión a la base de datos
├── controllers/   lógica de cada endpoint
├── helpers/       bcrypt y JWT
├── middlewares/   autenticación, roles y validaciones
├── models/        modelos y relaciones de Sequelize
├── routes/        definición de rutas
├── app.js         configuración de Express
└── server.js      arranque del servidor
```

## Modelo de datos

- **User** 1:1 **Profile**
- **User** 1:N **Article**
- **Article** N:M **Tag** (tabla intermedia `article_tags`)
- User y Article usan borrado lógico (`deleted_at`).

## Roles

| Rol | Permisos |
| --- | --- |
| Público (sin login) | Ver artículos |
| `user` | Crear artículos, editar/eliminar los propios, ver y editar su usuario |
| `admin` | Todo lo anterior sobre cualquier recurso, además de gestionar etiquetas y usuarios |

Todos los usuarios se registran con rol `user`. Para volver admin a un usuario, cambiarlo en la base de datos y **volver a iniciar sesión** (el rol viaja dentro del token):

```sql
UPDATE users SET role = 'admin' WHERE email = 'tu@email.com';
```

## Endpoints

Base URL: `http://localhost:3000/api`

### Auth

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| POST | `/auth/register` | Público | Registrar usuario |
| POST | `/auth/login` | Público | Iniciar sesión (guarda el token en una cookie) |
| GET | `/auth/profile` | Logueado | Ver el usuario logueado |
| POST | `/auth/logout` | Público | Cerrar sesión (borra la cookie) |

### Artículos

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| POST | `/articles` | Logueado | Crear artículo |
| GET | `/articles` | Público | Listar artículos |
| GET | `/articles/:id` | Público | Ver un artículo |
| PUT | `/articles/:id` | Autor o admin | Editar artículo |
| DELETE | `/articles/:id` | Autor o admin | Eliminar artículo |

### Etiquetas

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| POST | `/tags` | Admin | Crear etiqueta |
| GET | `/tags` | Logueado | Listar etiquetas |
| PUT | `/tags/:id` | Admin | Editar etiqueta |
| DELETE | `/tags/:id` | Admin | Eliminar etiqueta |

### Usuarios

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| GET | `/users` | Admin | Listar usuarios |
| GET | `/users/:id` | Logueado | Ver un usuario con su perfil y artículos |
| PUT | `/users/:id` | El mismo usuario o admin | Editar usuario |
| DELETE | `/users/:id` | Admin | Eliminar usuario |

### Health check

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/health` | Verifica que la API esté funcionando |

## Cómo probar la API con Postman

### Antes de empezar

- El servidor tiene que estar corriendo.
- En las requests con body: pestaña **Body** → **raw** → cambiar "Text" por **JSON**.
- Después de iniciar sesión, Postman guarda la cookie `token` y la envía sola en las siguientes requests. Se puede ver en el botón **Cookies** debajo de "Send".
- Si la cookie no se guarda, copiar el token y enviarlo en **Authorization → Bearer Token**.

### 1. Verificar que el servidor funciona

`GET http://localhost:3000/api/health` → **200** `"API funcionando correctamente"`.

### 2. Registrar un usuario

`POST http://localhost:3000/api/auth/register`

```json
{
  "username": "matias",
  "email": "matias@test.com",
  "password": "Hola1234"
}
```

Respuesta esperada: **201** `"usuario registrado"`.

Reglas: el username tiene entre 3 y 20 caracteres, solo letras y números. La contraseña tiene mínimo 8 caracteres con al menos una mayúscula, una minúscula y un número.

### 3. Iniciar sesión

`POST http://localhost:3000/api/auth/login`

```json
{
  "email": "matias@test.com",
  "password": "Hola1234"
}
```

Respuesta esperada: **200** `"Login exitoso"` con id, username y rol. En la pestaña **Cookies** de la respuesta debe aparecer `token`.

### 4. Ver el usuario logueado

`GET http://localhost:3000/api/auth/profile` (sin body) → **200** con los datos del usuario. Si da **401**, la sesión no se guardó.

### 5. Crear un artículo

`POST http://localhost:3000/api/articles`

```json
{
  "title": "Mi primer post",
  "content": "Hola mundo, este es mi primer artículo",
  "tags": []
}
```

Respuesta esperada: **201** `"Artículo creado con éxito"`.

- `title`: obligatorio, entre 3 y 100 caracteres.
- `content`: obligatorio.
- `tags`: opcional, arreglo de ids de etiquetas que ya existan (por ejemplo `[1, 2]`).

### 6. Listar y ver artículos

- `GET http://localhost:3000/api/articles` → lista todos (no requiere login).
- `GET http://localhost:3000/api/articles/1` → un artículo por id. Si no existe da **404**.

### 7. Editar un artículo

`PUT http://localhost:3000/api/articles/1`

```json
{
  "title": "Título editado",
  "content": "Contenido nuevo",
  "tags": [1]
}
```

Respuesta esperada: **200** `"Artículo actualizado con éxito"`. `title` y `content` son obligatorios. Si el artículo es de otro usuario y no sos admin, da **403**.

### 8. Eliminar un artículo

`DELETE http://localhost:3000/api/articles/1` (sin body) → **200** `"Artículo eliminado con éxito"`. Es borrado lógico: deja de aparecer en el listado, pero el registro queda en la base con `deleted_at`.

### 9. Probar como admin (etiquetas y usuarios)

Convertir el usuario en admin con el `UPDATE` de la sección **Roles**, volver a hacer login y probar:

- **Crear etiqueta:** `POST /api/tags` con `{ "name": "nodejs" }` (sin espacios, de 2 a 30 caracteres) → **201**.
- **Editar etiqueta:** `PUT /api/tags/1` con `{ "name": "express" }` → **200**.
- **Listar usuarios:** `GET /api/users` → **200** con todos los usuarios y su perfil (sin contraseña).
- **Ver un usuario:** `GET /api/users/1` → usuario con su perfil y artículos.
- **Editar un usuario:** `PUT /api/users/1` con `{ "username": "matias2", "email": "nuevo@test.com" }`. Ambos campos son opcionales.

### 10. Probar los permisos

Para comprobar que los roles funcionan:

1. Registrar y loguear un segundo usuario (sin ser admin).
2. Intentar `GET /api/users` → debe dar **403**.
3. Intentar `PUT /api/articles/1` sobre un artículo del primer usuario → debe dar **403**.
4. Cerrar sesión (`POST /api/auth/logout`) e intentar `GET /api/auth/profile` → debe dar **401**.

## Códigos de respuesta

| Código | Significado |
| --- | --- |
| 200 | OK |
| 201 | Recurso creado |
| 400 | Error de validación o datos duplicados (el mensaje indica cuál) |
| 401 | No autenticado, token faltante, inválido o vencido |
| 403 | Autenticado pero sin permisos |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

## Observaciones conocidas

Al probar las etiquetas se detectaron estos puntos del código pendientes de corregir:

- `GET /api/tags` falla por un error de tipeo en `tag.controller.js` (`res.status(200) - json(...)`).
- `DELETE /api/tags/:id` responde 400 porque la ruta usa `validateTag`, que exige `name` en el body.
- `GET /api/tags/:id` no está disponible: la ruta está declarada con `/` en lugar de `/:id`.
- `DELETE /api/users/:id` responde 200 pero no modifica el registro (usa un campo `is_active` que no existe en el modelo).
