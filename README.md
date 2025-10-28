# TaskFlow API 📋

API REST para gestión de tareas con autenticación JWT, desarrollada con Node.js, Express y MongoDB.

## 🚀 Características

- ✅ **Autenticación JWT** - Sistema seguro de registro y login
- ✅ **CRUD de Tareas** - Crear, listar, actualizar y eliminar tareas
- ✅ **Validaciones** - Validación robusta de datos con Joi
- ✅ **Estados HTTP apropiados** - 200, 201, 400, 401, 404
- ✅ **Documentación Swagger** - Interfaz interactiva para probar endpoints
- ✅ **Colección Postman** - Archivo JSON exportable incluido
- ✅ **CORS configurado** - Listo para integración con frontend React
- ✅ **Tests unitarios** - Cobertura con Jest y Supertest

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (v4.4 o superior)
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-repositorio>
cd taskflow-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
```

Ejemplo de `.env`:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=tu_secreto_super_seguro_cambialo_en_produccion
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3001
```

4. **Iniciar MongoDB**
```bash
# Windows (con MongoDB instalado)
mongod

# macOS/Linux
sudo systemctl start mongod
```

5. **Iniciar el servidor**
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor estará corriendo en `http://localhost:3000`

## 📚 Documentación API

### Swagger UI
Visita `http://localhost:3000/api-docs` para acceder a la documentación interactiva.

### Endpoints Principales

#### Autenticación

**Registrar Usuario**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Obtener Usuario Actual**
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Tareas

**Crear Tarea**
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Completar informe",
  "description": "Redactar el informe mensual",
  "status": "pendiente",
  "priority": "alta",
  "dueDate": "2025-11-30T23:59:59.000Z"
}
```

**Listar Tareas**
```http
GET /api/tasks
Authorization: Bearer <token>

# Con filtros
GET /api/tasks?status=pendiente&priority=alta
```

**Obtener Tarea por ID**
```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

**Actualizar Tarea**
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Título actualizado",
  "status": "en_progreso"
}
```

**Eliminar Tarea**
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

## 🧪 Pruebas

### Ejecutar todos los tests
```bash
npm test
```

### Tests con cobertura
```bash
npm run test
```

### Tests en modo watch
```bash
npm run test:watch
```

Los tests incluyen:
- ✅ Autenticación (registro, login, obtener usuario)
- ✅ Operaciones CRUD de tareas
- ✅ Validaciones de datos
- ✅ Manejo de errores
- ✅ Autorizaciones

## 📮 Postman

### Importar Colección

1. Abre Postman
2. Click en **Import**
3. Selecciona el archivo `TaskFlow.postman_collection.json`
4. La colección incluye todos los endpoints con ejemplos

### Variables de Entorno en Postman

La colección utiliza estas variables:
- `base_url`: http://localhost:3000
- `auth_token`: Se genera automáticamente al hacer login

## 🔒 Validaciones

### Usuario
- **username**: 3-50 caracteres, requerido
- **email**: formato válido, requerido
- **password**: mínimo 6 caracteres, requerido

### Tarea
- **title**: 3-100 caracteres, requerido
- **description**: máximo 500 caracteres, opcional
- **status**: `pendiente`, `en_progreso`, `completada`
- **priority**: `baja`, `media`, `alta`
- **dueDate**: fecha futura válida, opcional

## 📊 Estructura del Proyecto

```
taskflow-api/
├── src/
│   ├── config/
│   │   ├── database.js      # Configuración MongoDB
│   │   └── swagger.js       # Configuración Swagger
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── task.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── User.model.js
│   │   └── Task.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── task.routes.js
│   ├── validators/
│   │   └── validators.js
│   └── server.js            # Punto de entrada
├── tests/
│   ├── auth.test.js
│   └── task.test.js
├── .env.example
├── .gitignore
├── package.json
├── TaskFlow.postman_collection.json
└── README.md
```

## 🌐 CORS

La API está configurada para aceptar peticiones desde el origen especificado en la variable `CORS_ORIGIN` del archivo `.env`.

Para desarrollo con React (puerto 3001):
```env
CORS_ORIGIN=http://localhost:3001
```

Para permitir todos los orígenes (solo desarrollo):
```env
CORS_ORIGIN=*
```

## 📝 Respuestas de la API

### Exitosas
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... }
}
```

### Errores
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": ["detalle1", "detalle2"]
}
```

### Códigos de Estado HTTP

- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Error de validación
- `401 Unauthorized` - No autenticado o token inválido
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

## 🔐 Seguridad

- Contraseñas hasheadas con bcryptjs (10 rounds)
- Tokens JWT con expiración configurable
- Validación de datos en cada endpoint
- Middleware de autenticación en rutas protegidas
- Headers CORS configurables

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens
- **Joi** - Validación de datos
- **bcryptjs** - Hash de contraseñas
- **Swagger** - Documentación de API
- **Jest** - Framework de testing
- **Supertest** - Testing de HTTP

## 📄 Licencia

MIT

## 👨‍💻 Autor

Desarrollado para el proyecto TaskFlow

---

**¡Listo para usar!** 🎉

Para más información, visita la documentación Swagger en `/api-docs`
